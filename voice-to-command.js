class VoiceToCommand extends EventEmitter {
    activate() {
        this.running = true
    }
    deactivate() {
        this.running = false
        this.override = null
    }

    createCallback(options = {}) {
        if (!this.callbacks) this.callbacks = {}
        this.lul.touched = false

        if (this.callbacks[options.key]) {
            return this.callbacks[options.key]
        }

        const indexTree = new IndexTree(options.commands)
        const argParse = options.argParse || this.argParse
        const defaultCallback =
            options.defaultCallback || this.defaultCallback

        const callback = (s, enter, timeDelta) => {
            return this.runCallback(
                s,
                enter,
                timeDelta,
                indexTree,
                argParse,
                defaultCallback,
                false
            )
        }

        if (options.key) {
            this.callbacks[options.key] = callback
        }
        return callback
    }

    get override() {
        /* returns the initial */
        return this.__override
    }
    set override(fn) {
        if (fn == null) {
            this._override = null
            return
        }
        if (isString(fn)) {
            fn = this.callbacks[fn]
        } else if (isObject(fn)) {
            fn = this.createCallback(fn)
        } else if (isFunction(fn)) {
            this.__override = fn
            if (
                this.config.useChatBot ||
                isDynamicVoiceFunction(fn)
            ) {
                this._dynamicFn = fn
                this._dynamicIndex = 0
                this._dynamicArgs = []
                fn = (s, enter, timeDelta) => {
                    const r = this.runDynamic(
                        s,
                        enter,
                        timeDelta
                    )
                    return r
                }
            } else if (this.config.useBasicCommands) {
                //this.__override = fn
                fn = surpassFunction(fn, (x) => {
                    if (x in BasicVoiceCommands) {
                        BasicVoiceCommands[x]()
                        return true
                    }
                })
            } else {
                //this.__override = fn
            }
        }

        this._override = (...args) => {
            if (fn(...args) === true) {
                this._override = null
            }
        }
    }

    toggle() {
        this.running = !this._running
    }
    start() {
        this.running = true
        speak('starting vtc')
    }
    stop() {
        this.running = false
        speak('manual termination of vtc')
    }
    set running(value) {
        if (value) {
            this.annyang.start()
            this._running = true
        } else {
            this.annyang.stop()
            this.override = null
            this._running = false
            this.config.saveLogs = false
            this.payload = this.createPayload()
        }
    }
    createPayload() {
        const payload = () => {
            const logs = exists(this.logs) ? this.logs : null
            this.logs = []
            this.payload = null
            return logs
        }
        return payload
    }

    get running() {
        return this._running
    }

    constructor(options = {}, config) {
        super()

        this.lul = new LoadUnload(Array)

        this.logs = []
        this.config = {
            //useChatBot: true,
            emitArgs: false,
            emitCaller: false,
            useBasicCommands: true,
            saveLogs: false,
            coerceToString: true,
        }

        this.indexTree = new IndexTree(options.commands)
        this.argParse = options.argParse || spaceToCamel
        this.defaultCallback = options.defaultCallback

        this.callback = (s, enter, timeDelta) => {
            return this.runCallback(
                s,
                enter,
                timeDelta,
                this.indexTree,
                this.argParse,
                this.defaultCallback,
                true
            )
        }
        if (this.config.useChatBot) {
            this.override = chatbot
        }

        assignAliases(this, this.indexTree, 'register')
        try {
            this.annyang = new Annyang(this)
        } catch (e) {}
        if (options.autoStart) this.running = true
    }
    setArgParse(argParse) {
        this.argParse = argParse
        /* the reference persists even when u change it */
        /* you can just change it in vivo */
        /* u dont have to do anything super silly */
    }

    call(fn, args) {
        const value = fn(...args)
        if (this.config.emitCaller) {
            this.emit('caller', fn.name)
        }
        if (value == 253) speak(fn.name)
        return value
    }
    runDynamic(...args) {
        let argStyle = this.config.dynamicArgStyle || 'string'
        let manyArgs = this.config.manyDynamicArgs
        let timeDelta = null
        let enter = null
        let text

        if (args.length == 3) {
            text = coerceTo(args[0], argStyle)
            enter = args[1]
            timeDelta = args[2] || null
            if (manyArgs) {
                this._dynamicArgs.push({
                    text,
                    timeDelta,
                })
            } else {
                this._dynamicArgs = text
            }
        } else if (args.length == 4) {
            this._dynamicIndex = 0
            text = coerceTo(args[1], argStyle)
            enter = args[2]
            timeDelta = null
            this._dynamicFn = args[0].fn
            if (manyArgs) {
                this._dynamicArgs = [{ text, timeDelta }]
            } else {
                this._dynamicArgs = text
            }
        }

        let res = this.config.useApp
            ? this._dynamicFn(
                  app,
                  this._dynamicArgs,
                  enter,
                  this._dynamicIndex++
              )
            : this._dynamicFn(
                  this._dynamicArgs,
                  enter,
                  this._dynamicIndex++
              )

        if (res === false) {
            /* nothing happens */
            /* we stay on the current handler */
            return
        }

        if (res === true) {
            this._dynamicArgs = null
        } else if (
            isString(res) &&
            this.indexTree.commands.hasOwnProperty(res)
        ) {
            this._dynamicFn = this.indexTree.commands[res].fn
            this._dynamicArgs = []
        } else if (isFunction(res)) {
            this._dynamicFn = res
            this._dynamicArgs = []
        } else if (isObject(res)) {
            if (res.next) {
                if (isString(res.next)) {
                    this._dynamicFn =
                        this.indexTree.commands[res.next].fn
                } else if (isFunction(res.next)) {
                    this._dynamicFn = res.next
                }
            }
            if (res.speak) {
                console.log({ speaking: res.speak })
            }
        }
    }

    runCallback(
        s,
        enter,
        timeDelta,
        indexTree,
        argParse,
        defaultCallback,
        isSelf
    ) {
        if (!isString(s)) {
            if (this.config.coerceToString) {
                s = s.toString()
            } else {
                warn({
                    args: { s },
                    severity: 'warn',
                    message: '"$s" is not a string.',
                    helpTopic: 'string coercion',
                })
            }
        }
        if (s == 'enter') {
            s = ''
            enter = true
        }

        if (this.config.saveLogs) {
            this.logs.push([s, enter, timeDelta])
        }

        if (isSelf && this._override) {
            return this._override(s, enter, timeDelta)
        }

        if (isNumber(s)) {
            /* maybe a specific numericCallback */
            return defaultCallback(Number(s))
        }

        if (this._dynamicArgs) {
            return this.runDynamic(s, enter, timeDelta)
        }

        if (this.lul.touched) {
            const args = argParse(s)
            this.lul.load(args)
            if (enter || this.lul.size == this.waitArgLength) {
                return this.call(this.lastFn, this.lul.unload())
            } else if (this.config.emitArgs) {
                this.emit('args', args)
            }
            return
        }

        // ------------------------------------------
        let [ref, args] = indexTree.get(s)
        if (!ref) return defaultCallback(argParse(args))
        if (ref.dynamic) {
            return this.runDynamic(ref, args, enter, timeDelta)
        }
        args = argParse(args)
        // ------------------------------------------

        let { fn, paramCount } = ref
        let wait = true
        if (enter) wait = false
        else if (paramCount == 0 && args)
            return defaultCallback(args)
        else if (paramCount == 0) wait = false
        else if (paramCount > 10) wait = true
        else if (!args) wait = false

        if (wait) {
            this.lul.load(args, true)
            this.lastFn = fn
            this.waitArgLength = wait
        } else {
            return this.call(fn, toArray(args))
        }
    }
}

class IndexTree {
    constructor(commands) {
        this.store = {}
        this.commands = {}
        this.load(commands)
    }

    load(commands) {
        if (!exists(commands)) return
        for (let [k, v] of Object.entries(commands)) {
            this.registerFunction(k, v)
        }
    }

    register(key, fn, paramCount, dynamic) {
        if (!fn) return
        this.add(key)
        this.commands[key] = { fn, paramCount, dynamic }
    }

    registerFunction(fn) {
        if (!fn) return
        let [k, v] = argumentGetter(arguments) || [fn.name, fn]
        let { params, length } = getParamInfo(v)
        let dynamic = isDynamicVoiceFunction(fn)
        this.register(k, v, length, dynamic)
    }

    add(s) {
        let ref = this.store
        let keys = splitCamelCase(s)

        for (let key of keys) {
            if (!ref[key]) {
                ref[key] = {}
            }
            ref = ref[key]
        }
    }
    get(s) {
        let ref = this.store
        let keys = xsplit(s)
        let command = ''
        let args = []

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            if (key in ref) {
                ref = ref[key]
                command += i == 0 ? key : capitalize(key)
            } else {
                args = keys.slice(i)
                break
            }
        }
        return [this.commands[command], args]
    }
}

function warn(obj) {
    const message = templater(obj.message, obj.args)
    console.log(message)
    throw ''
}

class LoadUnload {
    get size() {
        return this.store.length
    }
    constructor(mode) {
        this.mode = mode
        this.touched = false
    }
    loadOnce(value) {
        if (this.touched) return this.store
        this.touched = true
        this.store = value
        return this.store
    }
    load(x) {
        if (this.touched) {
            if (exists(x)) this.store.push(x)
        } else {
            this.touched = true
            this.store = isArray(x) ? x : x ? [x] : []
        }
    }
    unload() {
        this.touched = false
        return this.mode == String
            ? this.store.join('')
            : this.store
    }
    toString() {
        return this.store ? this.store.join('') : ''
    }
}

function isDynamicVoiceFunction(fn) {
    let firstParam = getParameters(fn)[0]
    return firstParam == 'app' || firstParam == 'data'
    /* if it has app, it should add that in maybe */
}

function fxoo() {}
//---------------------------

//let x = new LoadUnload()
//x.load(['a'])
//x.load(['a', 'b'])
// y is the last function  not defined

//const xxx = new VoiceToCommand({
//commands: {
//sayhi,

//runHard() {
//},
//theCakesToday() {
//},
//register(key) {
//xxx.indexTree.registerFunction(hix)
//},
//if: logicHandler('if'),
//for: logicHandler('for'),
//forKV: logicHandler('forkv'),
//while: logicHandler('while'),
//},
//defaultCallback(s) {
//},
//})

//xxx.callback('hix') //nth happens
//xxx.callback('hix') //nth hapepns
//xxx.callback('register')  //register
//xxx.callback('hix') //registered as bb
//xxx.callback('hix') // running hix but it has a wait of 1
//xxx.callback('hixx')
//xxx.callback('hix')
//xxx.callback('hix')
//xxx.callback('hix')
//xxx.callback('hix')
//xxx.override = {
//key: 'sam',
//commands: {
//foo(x) {
//return true
//},
//}
//}
//xxx.callback('hix')
//xxx.callback('hix')
//xxx.callback('foo')
//xxx.callback('foo')
//xxx.callback('foo')
//xxx.callback('foo')
//xxx.override = 'samn'
//xxx.callback('foo')
//xxx.callback('foo')

//function hix(xxx, y) {
//}

//xxx.setArgParse(identity)
//xxx.callback('foo boo goo boo') // runs the default
//xxx.override = proseVoice
//xxx.callback('foo boo goo boo') // runs the default
//xxx.callback('foo boo goo boo') // runs the default

function runtest() {
    const v = new VoiceToCommand({
        commands: {
            sayhi,
            foo() {},
        },
        argParse: identity,
        defaultCallback(c) {
            console.log(c, 'default clalback')
        },
    })
    //v.indexTree.registerFunction(zoop)
    //v.indexTree.registerFunction(boop)
    //v.callback('zoop hi', true, 5)
    //v.callback('zoop hi', true, 10)
    s = `
hi there how can i help u
im looking for a wrench
A wrench you say? Well that's wonderful. I have many delicious wrenches.
`
    linegetter(s).map((x, i) => v.callback(x, true, i))
}

