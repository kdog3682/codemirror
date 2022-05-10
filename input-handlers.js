const GlobalReferences = {
    js: {

        imapRef: jsImap,
        useLeader: true,
        magicLeader: true,
        leaderCommands: {
        },
        iabCommands: {
        },
        iabSnippets: { // lastWordSnippets ... from the pos
           map: 'map(($child) => {\n\t$c\n})',
          'mab': "map(([a,b], i) => {\n\t$c\n})", 
           filter: 'filter(($child) => {\n\t$c\n})',
          'rab': ".reduce((acc, [a,b], i) => {\n\t$c\n}, {})", 
          'red': ".reduce((acc, item, i) => {\n\t$c\n}, {})", 
           iac: 'chicken',
        },
        treeCommands: {...baseTreeCommands, ...jsTreeCommands},
    },
    html: {treeCommands: baseTreeCommands,
    
        useLeader: true,
    },
    css: {treeCommands: {...baseTreeCommands, ...cssTreeCommands},
    
        useLeader: false,
    },
}

const tabCommandRef = {
    foo() {
        console.log('hiiiiiiiiya')
    },
}

const snippetOnTabRef = {
    abc: 'HIII($last)',
    ifs: 'if (isString($last)) {\n    $c\n}',
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
    if (!text || hasHtml(text)) return

    const value = htmlLineParser(text)
    const output = indent(value, spaces, 'tabs')
    const [insert, cursor] = getCursorFromText(output)
    const anchor = line.from + cursor
    //console.log({output, value, spaces, anchor})
    cmDispatchText(cm, line.from, line.to, insert, anchor)
    return 1
}

function cssEnter(cm, k) {
    let f = cmPos(cm)
    const line = cm.state.doc.lineAt(f)
    const [spaces, text] = getIndentAndLine(line.text)
    if (/[:;{}]/.test(text)) return
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

function cssTab(cm) {
    console.log('csstab')
    return 1
}


function visualHandler(s) {
    let cm = e.cm
    const cursor = cmCursor(cm)
    const [a, b] = splitonce(s)

    //console.log([a, b])
    if (a in visualActions) {
        visualActions[a](cm, cursor, b)
    }
    else if (a in visualRef) {
        cmWrap(cm, a, b)
    }
}

function jsEnter(cm) {
    return 
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
        const value =  k in this.currentRef
        if (!value) {
            this.currentRef = this.store
        }
        return value
    }
    run(k, ...args) {
        this.display += k
        console.log('run @ k', k)
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
                commandTree.run(k, cm, f, line, spaces)
            }
            catch(e) {
                console.log(e)
            }
            return 1
        } else if (commandTree.display) {
            //console.log(commandTree.display, 'HI')
            cmInsert(cm, commandTree.display + k)
            commandTree.display = ''
            return 1
        }
    }
}
const javascriptInputHandler = inputFactory('js')
const htmlInputHandler = inputFactory('html')
const cssInputHandler = inputFactory('css')
let fnModeString = ''
let fnModeLib = {
    
}

function runFnModeFunction(cm, s) {
    const createParser = (x) => {
        let [a,b] = split(s, '  ')
        return (s) => {
            return replace(a, b, s, 'gm')
        }
    }
    const parser = fnModeLib[s] || createParser(s)
    cmReplace(cm, cmPage, a, parser)
    //<(div)[]>$
}

function globalEnter(cm) {
    if (app.normalMode || app.visualMode) {
        speak('running normal mode')
        let [key, arg] = splitonce(app.modeString)
        let ref

        if (app.normalMode) {
            ref = globalNormalRefs[key]
            if (!ref) {
                ref = normalRef[app.editor.lang][key]
            }
        if (ref) {
            ref()
        } else {
            speak('nox key')
        }
        }

        else if (app.visualMode) {
            //ref = globalVisualRefs[key]
            //if (!ref) {
                //ref = visualRef[app.editor.lang][key]
            //}
            visualHandler(app.modeString)
        }

        app.modeString = ''
        if (app.normalMode) app.normalMode = false
        else if (app.visualMode) app.visualMode = false
        return 1
    }
    return CodeMirrorCommands.insertBlankLine(cm)
}

function inputFactory(lang) {
    const { iabSnippets, imapRef, magicLeader, treeCommands, useLeader } = GlobalReferences[lang]
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
            return completeOnImap(cm, f, line, display, wif, imapRef)
        }

        if (treeHandler(cm, f, t, k)) {
             return 1
        }
    }
}


function maybedepreleaderHandler(
    cm,
    line,
    f,
    match,
    text,
    leaderCommands
) {
    if (match in leaderCommands) {
        //console.log('LC')
        return (
            leaderCommands[match](cm) ||
            cmTextCompletion(cm, f, match, '')
        )
    }
    if (match in lastWords) {
        return cmSnippetCompletion(
            cm,
            f,
            match.length,
            lastWords[match]
        )
    }

    if (getFirstWord(text) in firstWords) {
        cmVeryMagicHandler(cm, line, text)
        //cmInsert(cm, 'sup')
        return 1
    }

    match = match.slice(-1)
    if (match in leaderCommands) {
        return (
            leaderCommands[match](cm, match.length) ||
            cmTextCompletion(cm, f, match, '')
        )
    }
}

function iijavascriptInputHandler(cm, f, t, k) {
    let [line, text, match] = inputHandlerInfo(cm, f)
    const display = match + k
    const wif = f < line.to

    if (wif) {
        return console.log('wif')
        if (k == '[') {
            return handleBraces(cm, f)
        }
        if (k == '{') {
            return handleBrackets(cm, f)
        }
    }
    if (k == ' ') {
        return completeOnSpace(cm, f, match)
    }
    if (k == LEADER_KEY && match in tabCommandRef) {
        tabCommandRef[match](cm)
        return cmTextCompletion(cm, f, match, '')
    }

    if (display in completeOnImapRef) {
        return completeOnImap(cm, f, line, display, wif)
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
        if (match && !wif && cmWordSpiral(cm, pos, line.number, match)) {
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


function cssEscape(cm) {
    app.cssNormalMode = true
    app.cssNormalString = ''
}

function createLanguageRef() {
    const cssKeyBindings = [
        { key: 'Tab', run: cssTab },
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
        { key: 'Tab', run: jsTab },
        { key: 'Ctrl-Enter', run: jsEnter },
        { key: 'Enter', run: jsEnter },
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
        return cmDollar(cm, line, word, spaces, f - display.length + 1, 'spicy!')
    }

    const parenOffset = getParenOffset(word)
    return cmDispatchText(cm,
        f - offset,
        f,
        word,
        f - offset - parenOffset + word.length
    )
}


function handleBrackets(cm, f) {
    let tree = syntaxTree(cm.state)
    let next = tree.resolveInner(f, 1)
    cm.dispatch({
        changes: [
            { from: f, to: f, insert: '[' },
            { from: next.to, to: next.to, insert: ']' },
        ],
        selection: {
            anchor: next.to + next.to - next.from,
        },
    })
    return 1
}


const vimCommandTree = new CommandTree(VimKeyBindingRef)

function vimInputHandler(cm, f, t, k) {
    console.log(vimCommandTree.display, 'display')
    //console.log('hi from vim input handler', k)
    if (vimCommandTree.has(k)) {
        //console.log('has it', k)
        const line = cmLine(cm, f)
        const spaces = getIndent(line.text)
        vimCommandTree.run(k, cm, f, line, spaces)
    } else {
        vimCommandTree.display = ''
    }
    return 1
}
function handleNormalMode(s) {
    let ref = globalNormalRefs[s] || normalRef[e.lang][s]
    //console.log(Object.keys(normalRef[e.lang]))
    //console.log(s, ref)
    if (ref) {
        ref()
        app.normalMode = false
        app.modeString = ''
    }
}
function baseInputHandler(cm, f, t, k) {
    if (app.normalMode || app.visualMode) {
        app.modeString += k
        if (app.modeString.includes(' ')) return 1
        if (app.visualMode) {
            visualHandler(app.modeString)
        } else {
            handleNormalMode(app.modeString)
        }
        return 1
    }
}

function globalEscape() {
    if (app.visualMode) {
        app.visualMode = false
        app.modeString = ''
        return 1
    }
    
    app.normalMode = opposite(app.normalMode)
    app.modeString = ''
    return 1
}

function globalBackspace() {
    if (app.visualMode || app.normalMode) {
    app.modeString = backspaced(app.modeString)
    return 1
    }
}
