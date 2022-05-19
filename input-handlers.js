const GlobalReferences = {
    js: {
        imapRef: jsImap,
        useLeader: true,
        magicLeader: true,
        leaderCommands: {},
        iabCommands: {},
    },
    html: {
        //useLeader: true,
    },
    css: {
        //useLeader: false,
    },
}

function htmlEnter(cm) {
    let f = cmPos(cm)
    const line = cm.state.doc.lineAt(f)
    const wif = f < line.to
    if (wif) {
        cmCursorBelow(cm, line)
        return 1
    }
    const [spaces, text] = getIndentAndLine(line.text)
    //console.log([text, hasHtml(text)]); throw ''
    if (!text || hasHtml(text)) return

    const value = htmlLineParser(text)
    const output = indent(value, spaces, 'tabs')
    const [insert, cursor] = getCursorFromText(output)
    const anchor = line.from + cursor
    cmDispatchText(cm, line.from, line.to, insert, anchor)
    return 1
}

function cssEnter(cm, k) {
    let f = cmPos(cm)
    const line = cm.state.doc.lineAt(f)
    const [spaces, text] = getIndentAndLine(line.text)
    if (text.length < 3 || /[:;{}]/.test(text)) return
    if (spaces) {
        const dict = cssEvaluator(text)
        const cssValue = cssReduce(dict).trim()
        const value = indent(cssValue, spaces) + '\n\t'
        const anchor = line.from + value.length
        cmDispatchText(cm, line.from, line.to, value, anchor)
        return 1
    } else {
        const [a, b] = /  /.test(text.trim())
            ? splitonce(text, '  ')
            : splitonce(text)

        const cssValue = cssParser(a, b)
        const value = cssValue + '\n'
        const anchor = line.from + value.length
        cmDispatchText(cm, line.from, line.to, value, anchor)
        return 1
    }
}

function htmlShiftEnter(cm) {
    cmReplace(cm, cmLine, htmlLineFix)
}

function normalHandler(s, enter) {
    if (!enter) {
        let ref = NormalRef.global[s] || NormalRef[e.lang][s]
        if (ref) {
            ref()
            return true
        }
        return
    }
    let [key, arg] = splitonce(s)
    let ref = NormalRef.global[key]
    if (!ref) {
        ref = NormalRef[app.editor.lang][key]
    }
    if (ref) {
        let message = arg ? ref(arg) : ref()
        if (message) {
            console.log(message)
            speak(message)
        }
    } else {
        speak('no key')
    }
    return 1
}
function visualHandler(s, enter) {
    let cm = e.cm
    const cursor = cmCursor(cm)
    const [a, b] = splitonce(s)
    if (a in VisualCommands) {
        VisualCommands[a](cm, cursor, b)
    } else if (a in visualRef) {
        cmWrap(cm, a, b)
    } else if (enter && LangRef[e.lang]?.visualHandler) {
        LangRef[e.lang].visualHandler(cm, cursor, s)
    } else {
        return 0
    }
    return 1
}

class CommandTree {
    constructor(commands) {
        this.store = {}
        this.commands = {}
        this.display = ''
        this.load(commands)
        this.currentRef = this.store
    }

    load(commands) {
        if (!exists(commands)) return
        for (let [k, v] of Object.entries(commands)) {
            this.add(k, v)
        }
    }
    has(k) {
        const value = k in this.currentRef
        if (!value) {
            this.currentRef = this.store
        }
        return value
    }
    run(k, ...args) {
        this.display += k
        this.currentRef = this.currentRef[k]
        if (isFunction(this.currentRef)) {
            this.currentRef(...args)
            this.currentRef = this.store
            this.display = ''
        }
    }

    add(s, fn) {
        let ref = this.store
        let keys = split(s, '')

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]

            if (i == keys.length - 1) {
                ref[key] = fn
                return
            }

            if (!ref[key]) {
                ref[key] = {}
            }
            ref = ref[key]
        }
    }
}
function commandTreeInputFactory(commands) {
    const commandTree = new CommandTree(commands)

    return function inputHandler(cm, f, t, k) {
        if (commandTree.has(k)) {
            const line = cmLine(cm, f)
            const spaces = getIndent(line.text)
            try {
                //console.log('doing commandtree ' + k)
                commandTree.run(k, cm, f, line, spaces)
            } catch (e) {
                console.log(e)
            }
            return 1
        } else if (commandTree.display) {
            console.log(commandTree.display, 'HI')
            cmInsert(cm, commandTree.display + k)
            commandTree.display = ''
            return 1
        }
    }
}

function inputFactory(lang) {
    const {
        imapRef,
        magicLeader,
    } = GlobalReferences[lang]

    const treeCommands = {
        ...TreeCommands.global,
        ...TreeCommands[lang]
    }
    const treeHandler = commandTreeInputFactory(treeCommands)

    return function lambdaInputHandler(cm, f, t, k) {
        let [line, text, match] = inputHandlerInfo(cm, f)
        const display = match + k
        const wif = f < line.to
        if (app.pasteBuffer) {
            if (k == 1) {
                cmAppendBelow(cm, app.pasteBuffer)
                app.pasteBuffer = ''
                return 1
            }
        }

        if (k == LEADER_KEY) {
            const cursor = cmCursor(cm)
            if (wif || cmSomethingSelected(cm)) {
                app.visualMode = true
                return 1
            }
            if (magicLeader) return cmVeryMagicHandler(cm, line)
        }

        if (imapRef && display in imapRef) {
            return completeOnImap(
                cm,
                f,
                line,
                display,
                wif,
                imapRef
            )
        }

        if (treeHandler(cm, f, t, k)) {
            return 1
        }
    }
}

function tabFactory(lang) {
    const {
        snippets,
        iabs,
        commands,
        /* command wf for example */
    } = GlobalReferences[lang]

    return function tabHandler(cm) {
        const [pos, match, line, wif] = cmLineInfo(cm)
        if (
            match &&
            !wif &&
            cmWordSpiral(cm, pos, line.number, match)
        ) {
            return 1
        }

        cm.dispatch(cm.state.replaceSelection('\t'))
        return 1

        if (snippets.includes(match)) {
            return cmSnippetCompletion(
                cm,
                pos,
                match.length,
                snippets[match]
            )
        }

        if (match in iabs) {
            return cmTextCompletion(cm, pos, match, iabs[match])
        }
        if (match in commands) {
            const value = commands[match](cm)
            if (value) return value
            return cmTextCompletion(cm, pos, match, '')
        }
        return 1
    }
}

function createLanguageRef() {

    const javascriptInputHandler = inputFactory('js')
    const htmlInputHandler = inputFactory('html')
    const cssInputHandler = inputFactory('css')

    const cssKeyBindings = [
        //{ key: 'Tab', run: cssTab },
        { key: 'Enter', run: cssEnter },
        //{ key: 'Escape', run: cssEscape },
    ]

    const htmlKeyBindings = [
        //{ key: 'Tab', run: htmlTab },
        { key: 'Enter', run: htmlEnter, shift: htmlShiftEnter },
    ]

    function htmlTab(cm) {
        console.log('hi tab html')
    }

    const jsTab = tabFactory('js')
    //const javascriptInputHandler = commandTreeInputFactory('js')

    const javascriptKeyBindings = [
        //{ key: 'Tab', run: jsTab },
        //{ key: 'Ctrl-Enter', run: jsEnter },
        //{ key: 'Enter', run: jsEnter },
    ]

    const languageRef = {
        css: {
            keyBindings: cssKeyBindings,
            inputHandler: cssInputHandler,
        },
        html: {
            keyBindings: htmlKeyBindings,
            inputHandler: htmlInputHandler,
            //baseTheme: oneDark,
        },
        js: {
            keyBindings: javascriptKeyBindings,
            inputHandler: javascriptInputHandler,
        },
    }
    return languageRef
}

function completeOnLeaderKey(cm, f, line) {
    let m
    if ((m = search(/(if|for|w|m) (\w.*)/, text.trim()))) {
        return vmLogicHandler(m)
    } else if (match in cmdlib) {
        dispatchText(f - match.length, f)
    }
}

function inputHandlerInfo(cm, f) {
    let line = cm.state.doc.lineAt(f)
    let start = Math.max(line.from, f - 250)
    let text = line.text.slice(start - line.from, f - line.from)
    let match = search(/\w*$/, text)
    return [line, text, match]
}

function completeOnSpace(cm, f, key) {
    const word = completeOnSpaceRef[key]
    return cmTextCompletion(cm, f, key, word)
}

function completeOnImap(cm, f, line, display, wif, ref) {
    const offset = display.length - 1
    const word = ref[display]
    let spaces = getIndent(line.text)
    if (!word) return

    if (wif) {
        //console.log('wif')
        front = line.text.slice(f - line.from)
        if (word.endsWith('()')) {
            //console.log('still completing')
            cm.dispatch({
                changes: {
                    from: f - 1,
                    to: line.to,
                    insert: word.slice(0, -1) + front + ')',
                },
                selection: {
                    anchor: -1 + line.to + word.length,
                },
            })
            return 1
        }
        return
    }

    if (isFunction(word)) {
        cm.dispatch({
            changes: {
                from: f - (display.length - 1),
                to: f,
            },
        })
        word(cm)
        return 1
    }

    if (word.includes('$')) {
        return cmDollar(
            cm,
            line,
            word,
            spaces,
            f - display.length + 1,
            'spicy!'
        )
    }

    const parenOffset = getParenOffset(word)
    return cmDispatchText(
        cm,
        f - offset,
        f,
        word,
        f - offset - parenOffset + word.length
    )
}

function baseInputHandler(cm, f, t, k) {
    if (app.normalMode || app.visualMode) {
        app.modeString += k
        if (app.modeString.includes(' ')) return 1
        let result = app.visualMode
            ? visualHandler(app.modeString)
            : normalHandler(app.modeString)

        if (result) {
            app.modeString = ''
            app.visualMode = false
            app.normalMode = false
        }
        return 1
    }
}

function globalEscape() {
    if (app.visualMode) {
        app.visualMode = false
    } else {
        console.log({o:opposite(app.normalMode)})
        app.normalMode = opposite(app.normalMode)
    }
    app.modeString = ''
    return 1
}

function globalBackspace() {
    if (app.visualMode || app.normalMode) {
        app.modeString = backspaced(app.modeString)
        return 1
    }
}

function globalEnter(cm) {
    if (app.normalMode || app.visualMode) {
        if (app.normalMode) {
            normalHandler(app.modeString, true)
        } else if (app.visualMode) {
            visualHandler(app.modeString, true)
        }

        app.modeString = ''
        if (app.normalMode) app.normalMode = false
        else if (app.visualMode) app.visualMode = false
        return 1
    }
    if (e.lang == 'js') return 
    return CodeMirrorCommands.insertBlankLine(cm)
}

function cmVeryMagicHandler(cm, line) {

    if (/[^\s\w]/.test(line.text)) return 
    let [spaces, text] = getIndentAndLine(line.text)
    const [tag, rest] = splitonce(text)

    let template = firstWords[tag]
    if (!template) {
        return 
    }

    let n = getLongestDollar(template)
    let args =
        n == 2
            ? splitOnceReverse(rest, ' ')
            : rest
            ? [rest]
            : []

    if (args.length < n) {
        let lastBinding = cmGetLastBinding(cm, line)
        args.push(lastBinding)
    }

    template = indent(template, spaces)
    let chunk = spicyTemplater(template, args)
    const [insert, cursor] = getCursorFromText(chunk)
    return cmDispatchText(
        cm,
        line.from,
        line.to,
        insert,
        cursor + line.from, 
    )
}

/* the magic handler is indeed an input handler */
/* changing things around without stable saves is dangerous */


function visualHandlerHTML(cm, cursor, s) {
    const node = cmNode(cm)

    if (node.name == 'Text') {
        cmReplace(cm, node, s)
    }
    else if (node.name == 'TagName') {
        let div = cm.state.sliceDoc(node.from, node.to)
        cmReplace(cm, cmLine, boundary(div), s)
    }
}

/* that is who he is ... we choose people who make us feel good */
/*  */

function globalTab(cm, f, t, k) {

    const [pos, match, line, wif] = cmLineInfo(cm)
    if (match && cmWordSpiral(cm, pos, line.number, match)) {
        return 1
    }

    cm.dispatch(cm.state.replaceSelection('\t'))
    return 1
}
