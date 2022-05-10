class VoiceToCommand extends EventEmitter {

    set lang(lang) {
        if (lang == 'chinese') lang = 'zh-CN'
        else if (lang == 'french') lang = 'zh-CN'
        else if (lang == 'spanish') lang = 'zh-CN'
        else if (lang == 'english') lang = 'us-EN'
        this.annyang.recognition.lang = lang
    }
    get lang() {
        return this.annyang.recognition.lang
    }
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

        const callback = (s, enter) => {
            return this.runCallback(
                s,
                enter,
                indexTree,
                argParse,
                defaultCallback,
                false,
            )
        }

        if (options.key) {
            this.callbacks[options.key] = callback
        }
        return callback
    }

    set override(fn) {
        if (fn == null)  {
            this._override = null
            return 
        }
        if (isString(fn)) {
            fn = this.callbacks[fn]
        } else if (isObject(fn)) {
            fn = this.createCallback(fn)
        }

        this._override = (s, enter) => {
            if (fn(s, enter) === true) {
                this._override = null
            }
        }
    }


    toggle() {
        this.running = !this._running
        speak('toggle vtc')
    }
    set running(value) {
        if (value) {
            this.annyang.start()
            this._running = true
        } else {
            this.annyang.stop()
            this._running = false
        }
    }

    get running() {
        return this._running
    }
    constructor(options = {}) {
        super()

        this.lul = new LoadUnload(Array)

        this.indexTree = new IndexTree(options.commands)
        this.argParse = options.argParse || spaceToCamel
        this.defaultCallback = options.defaultCallback

        this.callback = (s, enter) => {
            return this.runCallback(
                s,
                enter,
                this.indexTree,
                this.argParse,
                this.defaultCallback,
                true,
            )
        }

        assignAliases(this, this.indexTree, 'register')

        this.annyang = new Annyang(this)
        this.annyang.debug = options.debug
        if (options.autoStart) this.running = true
    }

    call(fn, args) {
        this.emit('calling', fn.name, ...args)
        return fn(...args)
    }

    runCallback(
        s,
        enter,
        indexTree,
        argParse,
        defaultCallback,
        isSelf,
    ) {
        if (s == 'enter') {
            s = ''
            enter = true
        }

        if (isSelf && this._override) {
            return this._override(s, enter)
        }

        if (this.lul.touched) {
            const args = argParse(s)
            this.lul.load(args)
            if (enter || this.lul.size == this.waitArgLength) {
                return this.call(this.lastFn, this.lul.unload())
            } else {
                this.emit('loading', args)
            }
            return
        }

        // ------------------------------------------
        let [ref, args] = indexTree.get(s)
        args = argParse(args)
        if (!ref) return defaultCallback(args)
        // ------------------------------------------

        let { fn, paramCount } = ref
        let wait = true
        if (enter) wait = false
        else if (paramCount == 0 && args) return defaultCallback(args)
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

    register(key, fn, paramCount) {
        if (!fn) return 
        this.add(key)
        this.commands[key] = { fn, paramCount }
    }

    registerFunction(fn) {
        if (!fn) return 
        let [k, v] = argumentGetter(arguments) || [fn.name, fn]
        let paramCount = countParameters(v)
        this.register(k, v, paramCount)
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
        return command
            ? [this.commands[command], args]
            : [null, args]
    }
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
        console.log({mode: this.mode})
        return this.mode == String ? this.store.join('') : this.store
    }
    toString() {
        return this.store ? this.store.join('') : ''
    }
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
            //console.log('hi')
        //},
        //theCakesToday() {
            //console.log('cake time')
        //},
        //register(key) {
            //console.log(arguments)
            //console.log('registering fu')
            //xxx.indexTree.registerFunction(hix)
        //},
        //if: logicHandler('if'),
        //for: logicHandler('for'),
        //forKV: logicHandler('forkv'),
        //while: logicHandler('while'),
    //},
    //defaultCallback(s) {
        //console.log({default: s})
    //},
//})

//xxx.callback('hix') //nth happens
//xxx.on('loading', (x) => console.log('loading', x))
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
            //console.log('foooooooooooo', x)
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
    //console.log('cccccccccc', xxx, y)
//}


//const xxx = new VoiceToCommand({
    //commands: {
        //sayhi,
        //foo() {
            //console.log('ccc')
        //},
    //},
    //defaultCallback(c) {
        //console.log(c, 'd')
    //},
//})
//xxx.callback('foo boo goo boo') // runs the default
//xxx.override = proseVoice
//xxx.callback('foo boo goo boo') // runs the default
//xxx.callback('foo boo goo boo') // runs the default

