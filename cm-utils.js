//const t = CM['@codemirror/highlight']['tags']
//const {HighlightStyle} = CM['@codemirror/highlight']
//const {Extension} = CM['@codemirror/state']
/* highlighting */

const {redo, undo} = CM['@codemirror/history']
const CodeMirrorCommands = CM['@codemirror/commands']
//console.log(CodeMirrorCommands)
const {
    startCompletion,
    closeCompletion,
    acceptCompletion,
    moveCompletionSelection,
} = CM['@codemirror/autocomplete']
const { foldEffect, unfoldCode } = CM['@codemirror/fold']
const { keymap, EditorView } = CM['@codemirror/view']
const {
    EditorSelection,
    StateField,
    EditorState,
    StateEffect,
    Facet,
    Prec,
    Compartment,
} = CM['@codemirror/state']
const { completeAnyWord, snippetCompletion, autocompletion } =
    CM['@codemirror/autocomplete']
const { css, cssLanguage } = CM['@codemirror/lang-css']
const { html, htmlLanguage } = CM['@codemirror/lang-html']
const { javascript, javascriptLanguage } =
    CM['@codemirror/lang-javascript']
const { basicSetup } = CM['@codemirror/basic-setup']
const { syntaxTree, LanguageSupport, getIndentation, indentUnit } = CM['@codemirror/language']
const { RegExpCursor } = CM['@codemirror/search']
const { countColumn } = CM['@codemirror/text']

function cmVoiceCallback(s) {
    console.log('hi from voice callback')
    let cm = e.cm
    if (isNumber(s)) {
        cmGo(cm, Number(s))
    } else {
        cmInsert(cm, s)
    }
}

function cmGo(cm, n) {
    cmSetCursor(cm, cm.state.doc.line(n).from)
}

function cmSomethingSelected(cm) {
    return cm.state.selection.ranges.some((r) => !r.empty)
}

function cmPosToOffset(cm, a, b) {
    return cm.state.doc.line(a).from + b
}

function cmSetCursor(cm, anchor, y) {
    if (isNumber(anchor)) {
        if (y != null) anchor = cmPosToOffset(cm, anchor, y)
        cm.dispatch({
            selection: { anchor },
            scrollIntoView: true,
            userEvent: 'select',
        })
    }
    else {
        const selection = isObjectLiteral(anchor) ? EditorSelection.fromJSON(anchor) : anchor
        console.log(selection)
        cm.dispatch({
            selection,
            scrollIntoView: true,
            userEvent: 'select',
        })
    }
    return true
}

function cmPos(cm) {
    return cm.state.selection.main.head
}

function cmDispatchText(cm, from, to, insert, anchor, scroll) {
    cm.dispatch({
        changes: { from, to, insert },
        addToHistory: true,
        selection: { anchor },
        scrollIntoView: scroll,
    })
    return 1    
}
function cmDispatch(cm, effects) {
    cm.dispatch({ effects })
}
function cmType(cm, s) {
    let f = cmPos(cm)
    cm.dispatch({
        changes: { from: f, to: f, insert: s },
        selection: { anchor: f + s.length },
        userEvent: 'input.type',
    })
}


function cmInsert(cm, s) {
    cm.dispatch(cm.state.replaceSelection(s))
}

function cmTest(s, useArgs) {
    return function lambda(...args) {
        doglog(s)
        if (useArgs) console.log(args)
    }
}

function cmPretty(cm) {
    console.log('hi cm pretty')
    const lang = e.lang
    const dict = {
        'js': pretty,
        'css': aggregateCSS,
        'html': pretty,
    }
    const fn = dict[e.lang]
    cmReplace(cm, cmPage, fn)
    return 1

}

function cmPage(cm) {
    const length = cm.state.doc.length
    return {
        from: 0,
        to: length,
    }
}

function cmText(cm) {
    return cm.state.doc.toString()
}

function cmTemplater(cm, s) {
    const value = spicyTemplater(s, {
        10: '\n'.repeat(10),
        20: '\n'.repeat(20),
        50: '\n'.repeat(50),
    })
    const [text, anchor] = getAnchor(value)
    //console.log({text, anchor}); throw ''
    cmSet(cm, text, anchor)
}

function getAnchor(s) {
    const regex = /#|\$c/
    const value = s.search(regex)
    s = s.replace(regex, '')
    let value2 = s.search(regex)
    if (value2 > -1)  {
        s = s.replace(regex, '')
        console.log([value, value2])
        return [s, [value, value2]]
    }
    return value > -1 ? [s, value] : [s, s.length]
}
function cmSet(cm, s = '', anchor) {
    const selection = 
        isArray(anchor) ? EditorSelection.range(...anchor) :
        anchor == null ? {anchor:s.length} : {anchor}
    cm.dispatch({
        changes: {
            from: 0,
            to: cm.state.doc.length,
            insert: s,
        },
        selection
    })
}

function cmUpload(cm) {
    jsonbin(cmText(cm))
}

function cmLoadFromJsonbin(cm) {
    e.buffers.open('index.js')
    jsonbin().then((x) => cmSet(cm, x))
}
function cmDownload(cm) {
    jsonbin().then((x) => cmSet(cm, x))
}
function cmSave(cm) {
    download('cm.txt', cmText(cm))
}

function cmLine(cm, pos) {
    return cm.state.doc.lineAt(pos || cmPos(cm))
}

function cmEmpty(cm) {
    return cmLine(cm).text.trim() == ''
}

function cmFirstLine(cm) {
    return cm.state.doc.lineAt(1).text
}

function cmLastLine(cm) {
    return cm.state.doc.lineAt(cmLength(cm)).text
}

function cmLineCount(cm) {
    return cm.state.doc.lines
}

function cmLength(cm) {
    return cm.state.doc.length
}

function cmStatus(cm) {
    return {
        readOnly: cm.state.readOnly,
        tabSize: cm.state.tabSize,
    }
}

function cmLint(cm) {
    console.log('hiii lint from lint')
    z = cm
}

function cmGetSet(cm, fn, from, to) {
    const text = cmText(cm)
    const anchor = cmPos(cm)
    if (to) {
        const insert = fn(text.slice(from, to))
        cm.dispatch({
            changes: { from, to, insert },
            selection: { anchor },
        })
    } else {
        const insert = fn(text)
        cm.dispatch({
            changes: { from: 0, to: text.length, insert },
            selection: { anchor: insert.length },
        })
    }
}

function cmClear(cm) {
    cmDispatchText(cm, 0, cmLength(cm), '', 0)
}

function cmAppendBottom(cm, s, scrollIntoView) {
    const f = cmLength(cm)
    //console.log({s})
    const lastChar = cm.state.sliceDoc(f - 1, f)
    const insert = lastChar == '\n' ? '\n' + s : '\n\n' + s
    return cmDispatchText(cm, f, f, insert, f + insert.length, scrollIntoView)
}

function cmAppendTop(cm, s) {
    const insert = s + '\n'
    cm.dispatch({
        changes: {
            from: 0,
            to: 0,
            insert,
        },
    })
}
function cmAppendAbove(cm, s) {
    let line = cmGetLine(cm)

    let insert = '\n' + indent(s, getIndent(line.text))
    cm.dispatch({
        changes: {
            from: line.from - 1,
            to: line.from - 1,
            insert,
        },
        selection: {
            anchor: line.from + insert.length - 1,
        },
    })
}

function cmAppendBelow(cm, s) {
    let line = cmGetLine(cm)

    let before = cmText(cm).charAt(line.to)
    let pad = before == '\n' ? '' : '\n'
    let insert = pad + indent(s, getIndent(line.text)) + '\n'
    let f = line.to + (pad ? 0 : 1)

    cm.dispatch({
        changes: {
            from: f,
            to: f,
            insert,
        },
        selection: {
            anchor: line.to + insert.length - 1,
        },
    })
}

function cmDownLine(cm) {
    const current = cm.state.doc.lineAt(cmPos(cm))
    return cm.state.doc.line(current.number + 1)
}

function cmUpline(cm) {
    return cmIter(cm, (x) => exists(x.text))
}

function cmGetLine(cm, n) {
    if (isNull(n)) n = cm.state.doc.lineAt(cmPos(cm)).number
    return cm.state.doc.line(n)
}

function cmCursor(cm) {
    return cm.state.selection.main
}

// 04-24-2022 lezer-stuff

function cmNode(cm, pos) {
    if (!pos) pos = cm.state.selection.main.head
    const tree = syntaxTree(cm.state)
    const node = tree.resolve(pos)
    //const node = tree.resolveInner(pos + 1)
    ///* what it use to be */
    if (node.to == node.from && node.from == 0) return
    return node
}
function cmCurrentNode(cm, pos) {
    if (!pos) pos = cm.state.selection.main.head
    const tree = syntaxTree(cm.state)
    const node = tree.resolveInner(pos)
    if (node.to == node.from && node.from == 0) return
    if (node.name == 'Script') {
        return getNearbyTopNode(node, cmText(cm), pos)
    }
    return node
}
function cmLook(cm, node) {
    const value = lookNode(node, cmText(cm))
    console.log(value)
}

function cmDispatchInPlace(cm, f, value) {
    cmDispatchText(cm, f, f, value, f + value.length)
}

function getStringValue(node, s) {
    return s.slice(node.from, node.to)
}

function cmCursorBelow(cm, line) {
    if (!line) line = cmLine(cm)
    const spaces = '\n' + getTabs(line.text)
    cmDispatchText(
        cm,
        line.to,
        line.to,
        spaces,
        line.to + spaces.length
    )
}

function extendCursor(cm, cursor) {
    const [A,B] = cmSelectionLines(cm, cursor)
    return {
        from:A.from, to: B.to,
    }
}

function cmRemoverFactory(keys, lang) {
    function css(cm) {
        const state = cm.state
        const text = state.doc.toString()
        function parser(s, x) {
            const matches = x.match(/[\w-]+/g)
            if (intersection(keys, matches).length) {
                return jspy(lang, 'comment', s)
            }
            return s
        }
        return replace(/^(.*?){[^]+?\n}/gm, parser, text)
        //const cursor = syntaxTree(state).cursor()
        //const nodes = collectNodes(cm)
        //throw ''
    }
    function js() {
        
    }
    function html() {
        
    }
    const dict = {js, css, html}
    const fn = dict[lang]
    return function lambda(cm) {
        const text = fn(cm)
        cmSet(cm, text)
    }
}

const snipref = {
    ifs: 'if (isString($1)) {\n    $c\n}',
    iffile: 'if (isfile($1)) $c',
    ifnum: 'if (isNumber($1)) {\n    $c\n}',
    ef: 'else if ($1) {\n    $c\n}',
    ifswn: 'if (startsWithNumber($1)) {\n    $c\n}',
    efnum: 'else if (isNumber($1)) {\n    $c\n}',
    ifa: 'if (isArray($1)) {\n    $c\n}',
    ife: 'if (exists($1)) {\n    $c\n}',
    iff: 'if (isFunction($1)) {\n    $c\n}',
    ifn: 'if ($1 == null) {\n    $c\n}',
    if: 'if ($1) {\n    $c\n}',
    ifo: 'if (isObject($1)) {\n    $c\n}',
    ifr: 'if (isRegExp($1)) $c',
    ift: 'if (test($1, $2)) {\n    $c\n}',
    ifu: 'if (isUndefined($1)) $c',
    ifew: 'if ($1.endsWith($2)) $c',
    eff: 'else if (isFunction($1)) {\n    $c\n}',
    efo: 'else if (isObject($1)) {\n    $c\n}',
    efs: 'else if (isString($1)) {\n    $c\n}',
    eft: 'else if (test($2, $1)) {\n    $c\n}',
    ifodd: 'if (isOdd($1)) {\n    $c\n}',
    for: 'for (let ${getForIterationVariable($1)} of $1) {\n    $c\n}',
    ifewn: 'if (endsWithNumber($1)) {\n    $c\n}',
    ifal1: 'if (arguments.length == 1) {\n    $c\n}',
    ifal2: 'if (arguments.length == 2) {\n    $c\n}',
    ifal3: 'if (arguments.length == 3) {\n    $c\n}',
    ifal4: 'if (arguments.length == 4) {\n    $c\n}',
    forii: 'for (;;) {\n    $c\n}',
    forij: 'for (let i = 1; i < $1; i++) {\n    for (let j = 1; j < placeholder; j++) {\n        $c\n    }\n}',
    forir: 'for (let i = $1; i >= 1; i--) {\n    $c\n}',
    fore: 'for (let i = 1; i < $1.length; i++) {\n    let ${$1[:-2]} = $1[i]\n    $c\n    if (i == $1.length - 1) {\n        \n    }\n}',
    fori: 'for (let i = 1; i < $1; i++) {\n    $c\n}',
    forj: 'for (let j = 1; j < $1; j++) {\n    $c\n}',
    fork: 'for (let key of Object.keys($1)) {\n    $c\n}',
    forv: 'for (let key of Object.keys($1)) {\n    $c\n}',
    ifnest: 'if (isNestedArray($1)) $c',
    forab: 'for (let [a, b] of $1) {\n    $c\n}',
    forkv: 'for (let [k, v] of Object.entries($1)) {\n    $c\n}',
    efa: 'else if (isArray($1)) {\n    $c\n}',
    efn: 'else if (!($1) {\n    $c\n}',
    try: 'try {\n\t$c\n}\ncatch(e) {\nconsole.log(e)\n}',
}

function cmName(cm, s) {
    if (!s) s = cmText(cm)
    const currentNode = cmNode(cm)
    if (!currentNode) return
    return getStringValue(
        getNameNode(topNode(currentNode, s)),
        s
    )
}
function cmBlock(cm) {
    const pos = cmPos(cm)
    const current = cmNode(cm, pos)
    if (!current) return
    const node = topNode(current, s, pos)
    const name = cmNodeValue(cm, getNameNode(node))
    const text = cmNodeValue(cm, node)
    return { name, text, to: node.to, from: node.from }
}


function cmInnerBlock(cm) {
    const pos = cmPos(cm)
    const current = cmNode(cm, pos)
    if (!current) return
    const node = topNode(current, s, pos)
    return node
}

function cmFold(cm) {
    const {from, to} = moveCursor(topNode(cmNode(cm)), 'Block')
    //console.log(from, to)
    cm.dispatch({
        effects: foldEffect.of({from: from + 1, to: to - 1}),
        selection: {anchor: to},
    })
}
function cmDeleteBlock(cm) {
    const block = cmBlock(cm)
    const {from, to, text, name} = block
    cmDispatchText(cm, from, to, '', from)
    return block
}
function cmFinish(cm) {
    const block = cmDeleteBlock(cm)
    //e.buffers.savedCode[]
}


function topTwoNodes(node, s, pos) {
    if (!s || s.length < 3) {
        return
    }
    if (node.name == 'Script') {
        console.log('the top is script')
        node = getNearbyTopNode(node, s, pos)
        if (node == 'Script') return [null, null]
            console.log('hohohohoho')
        return topTwoNodes(node, s, pos)
    }

    let innerNode = null
    while (true) {
        let parent = node.parent
        if (parent.name == 'Script') return [node, innerNode]
        innerNode = getInterestingChild(node, s) || innerNode
        node = parent
    }
}

function cmInvivoSnippetCompletion(
    cm,
    line,
    template,
    options
) {
    const {
        startCompletion,
        closeCompletion,
        acceptCompletion,
        moveCompletionSelection,
    } = CM['@codemirror/autocomplete']

    const prev = e.buffers.sm.snippets
    e.buffers.sm.snippets = options.map((item, i) => {
        function apply(cm, cmp, f) {
            if (i == options.length - 1) {
                console.log('done with snippets')
                e.buffers.sm.snippets = prev
            }
            cmDispatchText(
                cm,
                f,
                f,
                item,
                item.length + cursors.shift()
            )
        }
        return { label: item, apply }
    })

    let cursors = []
    template = template.replace(/\$\w+/g, (x, offset) => {
        cursors.push(offset + line.from)
        return ''
    })
    console.log(cursors)

    cmDispatchText(
        cm,
        line.from,
        line.to,
        template,
        cursors.shift()
    )
    setTimeout(() => {
        startCompletion(cm)
    }, 100)
}

function cmFunctionFromLine(cm, lang = 'js') {
    /* utility */
    const names =  collectFrom(cm, startName, ...terms)
        .map(unquote)
    const s = toStringFunction(names[0], names.slice(1), '\t')
    cmAppendBottom(cm, s, true)
    /* moveTheCursor */
}



// shiftEnter

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
function cmIndentHelper(text, spaces) {
    if (isString(spaces)) {
        return text.replace(/\n/g, '\n' + spaces)
    }
    return text.replace(/\n/g, '\n' + '\t'.repeat(fixSpaceLength(spaces) / 4))
}
function cmDollar(cm, line, text, spaces, f, spicy) {
    if (spaces) {
        //throw 'nospicespaces'
        text = cmIndentHelper(text, spaces)
    }
    if (spicy) {
        text = spicyTemplater(
            text,
            cmSpicyRef,
            cm,
            f,
            line.text
        )
    }
    let [insert, cursor] = getCursorFromText(text)
    if (cursor == 0) cursor = insert.length
        //console.log(cursor)

    const anchor = (f || line.from) + cursor
    return cmDispatchText(
        cm,
        f || line.from,
        line.to,
        insert,
        anchor
    )
}



function cmIter(cm, fn, dir = -1) {
    let f = cmPos(cm)
    let start = cm.state.doc.lineAt(f)
    let n = start.number
    let count = 0
    while (count++ < 20) {
        let index = n + count * dir
        let value = fn(cm.state.doc.line(index))
        if (value) return value
    }
}

function cmGetLastBinding(cm, line) {
    function fn(line) {
        const cursor = syntaxTree(cm.state).cursor()
        cursor.moveTo(line.from)
        while (cursor.prev()) {
            if (cursor.name == 'VariableDefinition') {
                return cmNodeValue(cm, cursor)
            }
        }

        console.log('not done yet'); throw ''
        const targets = [
            'ArrayPattern',
            'ObjectPattern',
            'VariableDefinition',
            'ParamList',
        ]
        const target = moveNode(lineNode, targets)
        cmLook(cm, target)
        throw ''
        if (target.name == 'VariableDefinition') {
            return cmNodeValue(cm, target)
        }
        return smallify(
            target
                .getChildren('VariableDefinition')
                .map((x) => cmNodeValue(cm, x))
        )
    }
    return cmIter(cm, fn)
}

function distanceToLetters(
    s,
    start,
    regex = /[a-zA-Z]/,
    direction = null
) {
    let count = 0
    let A = 0
    let B = 0
    function runner(i) {
        if (count > 100) {
            return -1
        }
        let pos = i + start
        let ch = s.charAt(pos)
        if (test(regex, ch)) {
            return i
        }
        if (direction == 1) {
            count++
            return runner(A++)
        }

        if (direction == -1) {
            count++
            return runner(--B)
        }
        return runner(count++ % 2 == 0 ? ++A : --B)
    }
    return runner(0)
}

function getInterestingChild(node, s) {
    const el =
        node.name == 'MethodDeclaration'
            ? node.firstChild
            : node.name == 'FunctionDeclaration'
            ? node.nextSibling
            : node
    const value = getStringValue(el, s)
    const yes =
        /(Declaration|Property)$/.test(node.name) &&
        value &&
        value.value &&
        /\w/.test(value.value)
    return yes ? el : null
}

function getValue(cursor) {
    if (!cursor) return {}
    const name = cursor.name
    const from = cursor.from
    const to = cursor.to
    let value = s.slice(from, to)
    return { name, from, to, value }
}

function getNameValue(node) {
    return getValue(node).value
}

function cmWrapperContext(cm) {
    const node = syntaxTree(cm.state).resolveInner(cmPos(cm))
    return node.parent.name
}

function getNameNode(node) {
    const ref = NameTable[node.name]
    if (isObject(ref)) {
        return nodeSprawl(node, ref)
    } else if (isString(ref)) {
        return node.getChild(ref)
    } else if (ref) {
        return node
    } else {
        console.log(node)
        console.log('couldnt find')
    }
}

const NameTable = {
    String: true,
    TemplateString: true,
    PropertyDefinition: true,
    //'BinaryExpression'
    VariableName: true,
    VariableDefinition: true /* returns itself */,
    VariableDeclaration: 'VariableDefinition',
    ClassDeclaration: 'VariableDefinition',
    //'ObjectExpression': 'PropertyDefinition',
    Property: 'PropertyDefinition',
    PropertyName: {
        stopBefore: (x) => x.name != 'MemberExpression',
        runner: (x) => x.parent,
    },

    MemberExpression: {
        stopBefore: (x) => x.name != 'MemberExpression',
        runner: (x) => x.parent,
    },
    MethodDeclaration: 'PropertyDefinition',
    FunctionDeclaration: 'VariableDefinition',
}

function nodeSprawl(node, key) {
    if (isObject(key)) {
        return nodeObjectSprawl(node, key)
    }
    let cursor = node.cursor

    let targetName =
        cursor.name in table && table[cursor.name][key]
    if (!targetName) return false

    do {
        look(cursor)

        if (
            cursor.name == targetName &&
            validate(cursor.node)
        ) {
            return cursor.node
        }
    } while (cursor.next())
}

function cmNodeValue(cm, node) {
    return (cm.state || cm).sliceDoc(node.from, node.to)
}

function cmCleanupBlock(cm) {
    return cmReplace(cm, cmBlock, smCleanup)
}

function boopa(cm, line, nextLine, extraSpaces = '') {
    extraSpaces = extraSpaces ? '    ' : ''
    const insert = getSpaces(line.text) + extraSpaces

    if (isWhiteSpace(nextLine.text)) {
        cm.dispatch({
            changes: {
                from: line.to,
                to: line.to,
                insert,
            },
            selection: { anchor: line.to + insert.length },
        })
    } else {
        cm.dispatch({
            changes: {
                from: nextLine.from,
                to: nextLine.from,
                insert: insert + '\n',
            },
            selection: {
                anchor: nextLine.from + insert.length,
            },
        })
    }
}


function boopa2(cm, line, nextLine, extraSpaces = '') {
    const insert = getTabs(line.text)
    //console.log({insert})

    if (isWhiteSpace(nextLine.text)) {
        cm.dispatch({
            changes: {
                from: line.to,
                to: line.to,
                insert,
            },
            selection: { anchor: line.to + insert.length },
        })
    } else {
        cm.dispatch({
            changes: {
                from: nextLine.from,
                to: nextLine.from,
                insert: insert + '\n',
            },
            selection: {
                anchor: nextLine.from + insert.length,
            },
        })
    }
}

function isWhiteSpace(s) {
    return s.trim() == ''
}

function cmFindTextPosition(cm, regex) {
    const pos = cmPos(cm)
    //console.log([cmText(cm)])
    const text = cm.state.sliceDoc(pos)
    const match = text.match(regex)
    if (match) {
        return {
            pos: pos + match.index,
            match: match[0],
        }
    }
    return {}
}

function nodeObjectSprawl(node, o) {
    let count = 0
    while (count++ < 10) {
        let next = o.runner(node)
        if (o.stopBefore(next)) return node
        node = next
    }
    console.log(node)
    throw ''
}

function cmReplace(cm, area, a, b, flags = 'g') {
    let { from, to, text } = area(cm)
    //console.log({from, to, text})
    if (!text) text = cm.state.sliceDoc(from, to)
    if (!text) {
        console.log('nnoremap text @cmreplcae early return')
        return 
    }
    const anchor = cmPos(cm)
    const insert = isFunction(a)
        ? a(text)
        : replace(a, b, text, flags || 'g')

    cm.dispatch({
        changes: { from, to, insert },
        selection: {
            //anchor: Math.max(to, from + insert.length),
            anchor: from + insert.length,
        },
    })
}

function cmTopNode(cm, pos) {
    if (!pos) pos = cm.state.selection.main.head
    const tree = syntaxTree(cm.state)
    const node = tree.resolveInner(pos)
    if (node.to == node.from && node.from == 0) return
    if (node.name == 'Script') {
        return getNearbyTopNode(node, cmText(cm), pos)
    }
    while (true) {
        let parent = node.parent
        if (parent.name == 'Script') {
            return node
        }
        node = parent
    }
}

const table = {
    aggregateImports: {},
    getFunctionInfo: {
        //collect: {
        //parameters
        //}
        queries: {},
        // a unified tree ... so much easier to work with
    },
    renameDictionary: {
        target: 'VariableDefinition',
        precededBy: 'const',
        changes: {
            insert: '$1',
            from: '$from',
            to: '$to',
        },
    },

    asyncifyFunction: {
        target: 'function',
        mustNotTouch: 'async',
        changes: {
            insert: 'async ',
            from: '$from',
            to: '$from',
        },
    },

    getParameters: {
        target: 'paramsmth',
        mustTouch: 'function',
        get: {
            insert: '$1',
            from: '$from',
            to: '$to',
        },
        /* visit the node before or after */
        /*  */
    },

    changeParameters: {
        target: 'paramsmth',
        mustTouch: 'function',
        changes: {
            insert: '$1',
            from: '$from',
            to: '$to',
        },
    },

    renameFunction: {
        target: 'VariableDefinition',
        mustTouch: 'function',
        changes: {
            insert: '$1',
            from: '$from',
            to: '$to',
        },
    },
}

function look(x) {
    if (!x) return
    const value = shortValue(s.slice(x.from, x.to))
    const o = {
        name: x.name,
        from: x.from,
        to: x.to,
        value: value,
        //long: s.slice(x.from, x.to)
    }
    return o
}

function shortValue(s) {
    if (s.includes('\n')) {
        return (
            s.match(/.+/)[0] +
            ' ... ' +
            opposite(search(/[\[\{]/, s))
        )
    }
    return s
}

function collectParameters(inner, s) {
    const node = moveNode(inner, (x) => x.name == 'ParamList')
    return node
        .getChildren('VariableDefinition')
        .map((x) => getStringValue(x, s))
}

function getObjectProperties(node, s) {
    if (!node.name == 'VariableDeclaration') return
    const object = node.lastChild
    if (object.name != 'ObjectExpression') return
    return object.getChildren('Property').map((item, i) => {
        return getStringValue(getNameNode(item), s)
    })
}
function moveNode(node, checkpoint, direction = 1) {
    if (isString(checkpoint)) {
        let name = checkpoint
        checkpoint = (x) => x.name == name
    } else if (isArray(checkpoint)) {
        let names = checkpoint
        checkpoint = (x) => names.includes(x.name)
    }

    if (direction == 1) {
        while (node && !checkpoint(node)) {
            if (node.firstChild) {
                node = node.firstChild
            } else {
                node = node.nextSibling
            }
        }
    } else {
        while (node && !checkpoint(node)) {
            node = node.parent
        }
    }
    return node
}

const vuekeys = [
    'name',
    'components',
    'props',
    'data',
    'computed',
    'watch',
    'created',
    'mounted',
    'methods',
    'template',
    'render',
]

function cmWord(cm, mode = 'node') {
    let startingPos = cmPos(cm)
    let node = cmNode(cm, startingPos)
    let [pos, around] = positionSprawl(
        cmText(cm),
        startingPos,
        /[\w\.]/
    )
    if (around != null)
        node = node.resolveInner(pos + around, 1)
    node = skipNode(node)
    let childNode

    if (node.name in NameTable) {
        childNode = getNameNode(node)
    } else if (node.name in WordAtTable) {
        const ref = WordAtTable[node.name]
        if (ref.findInner) {
            childNode = getFirstChild(node, ref.findInner)
        } else if (ref.gotoParent) {
            childNode = node.parent
        } else {
            childNode = node
        }
    }
    return mode == 'node' ? childNode : getNameValue(childNode)
}

function positionSprawl(s, start, regex) {
    let count = 0
    let A = 0
    let B = 0
    function runner(i) {
        let pos = i + start
        let ch = s.charAt(pos)
        //console.log({ch, pos, i, start})
        if (ch == null) {
            return null
        }
        if (test(regex, ch)) {
            //console.log(s.charAt(pos))
            if (i == 0) return [start, null]

            const delta = i > 0 ? 1 : -1
            const around = s.charAt(pos + delta).trim()
            const aroundValue = test(/[\W]/, around) ? delta : 0
            //console.log({around, ch, aroundValue})
            return [pos, aroundValue]
        }
        return runner(count++ % 2 == 0 ? ++A : --B)
    }
    return runner(0)

    //let right = sprawl(s, -1, start, regex)
    //let left = sprawl(s, 1, start, regex)
    //let deltaA = right && Math.abs(start - right) || Infinity
    //let deltaB = left && Math.abs(start - left) || Infinity
    //return deltaA < deltaB ? right : left
}

function skipNode(node) {
    const ignore = [
        'function',
        'let',
        'async',
        'const',
        'var',
        'while',
        'if',
        'do',
        'break',
        'return',
    ]
    while (ignore.includes(node.name)) {
        node = node.nextSibling
    }
    return node
}

const WordAtTable = {
    PropertyDefinition: {},

    PropertyName: {
        gotoParent: true,
    },
    ArgList: {
        findInner: 'VariableName|MemberExpression',
    },
    BinaryExpression: {
        findInner: 'VariableName|MemberExpression',
    },

    ArrayExpression: {
        findInner: 'VariableName|MemberExpression',
    },
    CallExpression: {
        findInner: 'VariableName|MemberExpression',
    },
}

function getFirstChild(node, key) {
    return viewChildren(node, (x) => {
        return test(key, x.name)
    })
}

function nodeMoveTo(node, checkpoint) {
    if (isString(checkpoint)) {
        let name = checkpoint
        checkpoint = (x) => x.name == name
    }
    while (node && !checkpoint(node)) {
        if (node.firstChild) {
            node = node.firstChild
        } else {
            node = node.nextSibling
        }
    }
    return node
}
function cmGetCursor(x) {
    //console.log(x.constructor.name)
    return x.constructor.name.startsWith('BufferNode')
        ? x.cursor
        : x.constructor.name == 'TreeCursor'
        ? x
        : x.cursor()
}
function moveCursor(c, checkpoint) {
    if (isString(checkpoint)) {
        let name = checkpoint
        checkpoint = (x) => x.name == name 
    }
    const cursor = cmGetCursor(c)
    while (!checkpoint(cursor)) {
        cursor.next()
    }
    return cursor.node
}
function topNode(node) {
    if (node.name == 'Script') {
        return
    }
    while (true) {
        let parent = node.parent
        if (parent.name == 'Script') {
            return node
        }
        node = parent
    }
}

function viewChildren(node, callback = console.log) {
    let cursor = node.cursor
    do {
        if (cursor.to > node.to) return
        const value = callback(cursor)
        if (value) return cursor
    } while (cursor.next())
}
function getNearbyTopNode(node, s, pos) {
    const distance = distanceToLetters(s, pos)
    const next =
        distance >= 0
            ? node.childAfter(0)
            : node.childBefore(pos)

    return next
}

function cmContext(cm) {
    try {
        return _cmContext(cm)
    }
    catch {
        return {
            context: 'javascript'
        }
    }
}
function _cmContext(cm) {
    const text = cmText(cm)
    const pos = cmPos(cm)
    const current = cmCurrentNode(cm)
    const [top, inner] = topTwoNodes(current, text, pos)
    if (top.name == 'ExpressionStatement') {
        return {
            context: 'javascript'
        }
    }
    //console.log(top.name)
    const name = cmNodeValue(cm, getNameNode(top))
    //console.log(name, "HI")
    //return
    if (name == 'Script') {
        return {
            context: 'javascript',
        }
    }
    let innerName = null
    let context = getStringValue(top?.firstChild, text)
    let parameters = null
    let constructorParameters = null

    if (context == 'function' || context == 'async') {
        context = 'function'
        parameters = collectParameters(top, text)
    } else if (context == 'class') {
        context = 'class'
        constructorParameters = collectParameters(top)
        parameters = collectParameters(inner, text)
        innerName = getStringValue(getNameNode(inner), text)
    } else if (context == 'const') {
        if (inner) {
            innerName = getStringValue(getNameNode(inner), text)
            parameters = collectParameters(inner, text)
            if (vuekeys.includes(innerName)) {
                context = 'vue'
            }
        } else {
            context = 'vue'
            //const keys = getObjectProperties(top, text)
            //if (keys && hasOverlap(keys, vuekeys)) {
                //context = 'vue'
            //} else {
                //context = 'dictionary'
            //}
        }
    }

    return {
        name,
        context,
        innerName,
        parameters,
        constructorParameters,
    }
}

function cmSelectionLines(cm, cursor) {
    const { anchor, head } = cursor || cmCursor(cm)
    return shortLong(anchor, head).map((x) => {
        return cm.state.doc.lineAt(x)
    })
}

function tabIndent(s, value = '\t') {
    return s.replace(/^/gm, value)
}
function cmWrap(cm, key) {

    if (!visualRef.hasOwnProperty(key)) {
        console.log('errror nnoremap dict key')
    }

    const [A, B] = cmSelectionLines(cm)
    const from = A.from
    const to = B.to
    const text = cm.state.sliceDoc(from, to)
    const tabs = getTabs(A.text)
    const [above, below] = visualRef[key] || ['', '']
    const output = tabIndent(above, tabs) + '\n' + tabIndent(text) + '\n' + tabIndent(below, tabs)
    const [insert, cursor] = getCursorFromText(output)
    const anchor = from + cursor
    cmDispatchText(cm, from, to, insert, anchor)
}

function cmSelectionText(cm, cursor) {
    const { anchor, head } = cursor || cmCursor(cm)
    return cm.state.sliceDoc(...shortLong(anchor, head))
}
function cmSelsdffddfdectionText(cm) {
    const text = cmText(cm)
    const a = cm.state.doc.lineAt(anchor)
    let nA = a.number
    const b = cm.state.doc.lineAt(head)
    let nB = b.number
    const store = [a]
    for (let i = a.number + 1; i < b.number; i++) {
        store.push(cm.state.doc.lineAt(i))
    }
    store.push(b)
    // nnoremap.....
}
function cmSelectParameter(cm) {
    const node = cmTopNode(cm)
    const paramNode = nodeMoveTo(node, 'ParamList')
    if (paramNode) {
        const { from, to } = paramNode
        const text = cmText(cm)
        if (to - from == 2) {
            cmSetCursor(cm, from + 1)
        } else {
            cmSelect(cm, from + 1, to - 1)
        }
    }
}
function toPos(x) {
    return [x.from, x.to]
}
function cmSelect(cm, x, y) {
    let [anchor, head] =
            isString(x)
            ? toPos(cmFind(cm, x))
            : x == null
            ? [null, null]
            : y != null
            ? [x, y]
            : isLezerNode(x)
            ? [x.from, x.to]
            : isArray(x)
            ? x
            : isObject(x)
            ? [x.from, x.to]
            : x

    if (anchor == null) {
        console.log('the anchor is null')
        console.log('early return')
        return
    }

    const selection =
        y == 'head'
            ? { anchor: anchor }
            : EditorSelection.single(anchor, head)
    //console.log(JSON.stringify(selection))

    cm.dispatch({
        selection,
        scrollIntoView: true,
        userEvent: 'select',
    })
}

function cmReplaceBlock(cm, a, b, flags) {
    cmReplace(cm, cmBlock, a, b, flags)
}

function cmReplaceLine(cm, a, b, flags) {
    cmReplace(cm, cmLine, a, b, flags)
}

function cmFind(cm, regex, { ignoreCase = true, from = 0, to = 1000 } = {}) {
    const cursor = new RegExpCursor(
        cm.state.doc,
        regex,
        { ignoreCase: ignoreCase },
        from,
        to
    )
    //console.log(e.text)
    //console.log(regex, 'rrr')
    cursor.next()
    const value = cursor.value
    //console.log(JSON.stringify(cursor, null, 2))
    //console.log(value, 'vvvv')
    if (value.from >= 0) {
        return {
            from: value.from,
            to: value.to,
            text: value.match[0],
        }
    }
    return null
}
function cmNodeAt(cm, pos) {
    const tree = syntaxTree(cm.state)
    let node = tree.resolve(pos)
    if (!node) {
        console.log('nonode@resolve')
        node = tree.resolveInner(pos)
    }

    if (!node) {
        console.log('nonode@resolveInner')
        node = tree.childAfter(pos)
    }

    if (!node) {
        console.log('nonode@chidlafter')
        throw ''
    }
    console.log(cmLook(cm, node))
    console.log(node.parent.name)
    throw ''
    return node
}

//

function cmParentNode(cm) {
    return cmCurrentNode(cm).parent
}

function isLezerNode(x) {
    const name = x && x.constructor && x.constructor.name
    return (
        name == 'BufferNode' ||
        name == 'TreeCursor' ||
        name == 'Tree' ||
        name == 'TreeNode'
    )
}

function cmgogo(cm) {
    const { from, to } = cmTopNode(cm)
    let i = cm.state.sliceDoc(from, to).search(RegExp(key))
    if (i > -1) {
        let j = from + i + key.length
        cmSetCursor(cm, j)
    }
}

function hoho(a, b, c, d) {
    const s = `
        console.log(byxe)
    `
    if (foo) {
        return foo
    }
}

function cmTabCompletion(cm) {
    const words = getWordsFromScreen(cm)
    if (matches.length == 1) {
        return matches[0]
    } else {
        cmActivateSnippet(cm)
    }
}

function cmUp(cm) {}
function cmDown(cm) {
    const { pos, match } = cmFindTextPosition(cm, /[{}><]/)
    const line = cm.state.doc.lineAt(pos)
    const nextLine = cm.state.doc.line(line.number + 1)

    if (match == '<') {
        boopa2(cm, line, nextLine, 1)
    } else if (match == '>') {
        boopa2(cm, line, nextLine, 0)
    }

    else if (match == '{') {
        boopa(cm, line, nextLine, 1)
    } else if (match == '}') {
        boopa(cm, line, nextLine, 0)
    }
}

function stuffthatworks() {
    //console.log(cmPos(cm))
    //cmAppendBottom(cm, 'hi2\nhi3')
    //console.log(cmPos(cm))
    //cmAppendTop(cm, 'hi2\nhi3333top')
    //cmInsert(cm, 'hi')
    //cmAppendBelow(cm, 'hi2\nhi3')
    //console.log(cmText(cm))
}

const completePropertyAfter = ['PropertyName', '.', '?.']
const dontCompleteIn = [
    'TemplateString',
    'LineComment',
    'BlockComment',
    'VariableDefinition',
    'PropertyDefinition',
]

function cmNodeBefore(cm, pos) {
    const state = cm.state || cm
    return syntaxTree(state).resolveInner(pos, -1)
}

function cmAppendBelowSyntax(cm, s, ref) {
    let node = syntaxTree(cm).childAfter(pos)
    let lineStart = cmGetLine(cm, node.from)
    let lineEnd = cmGetLine(cm, node.to + 1)
    let spaces = getSpaces(lineStart.text)
    console.log(lineStart)
    console.log(lineEnd)
    console.log(node)

    const insertion = '\n' + indent(s, spaces)
    let before = cmText(cm).charAt(line.to)
    let pad = before == '\n' ? '' : '\n'
    let insert = pad + insertion + '\n'
    let f = line.to + (pad ? 0 : 1)

    cm.dispatch({
        changes: {
            from: f,
            to: f,
            insert,
        },
        selection: {
            anchor: line.to + insert.length - 1,
        },
    })
}

function cmWordSpiral(cm, pos, start, key) {
    if (!key) return 
    if (cmLineCount(cm) < 2) return
    let count = 0
    let text
    let A = 0
    let B = 0
    let index
    //console.log([start, key, pos])
    //console.log(JSON.stringify(cm.visibleRanges, null, 2))
    let max = cmLength(cm)
    while (count++ < 16) {
        if (count % 2 == 1 && A + start > 0) {
            A--
            index = A + start
        } else {
            B++
            index = B + start
        }
        if (index < 0 || index >= max) {
            return
        }

        //console.log('line', index)
        let line
        try {
            line = cm.state.doc.line(index)
            }
            catch(e) {
                console.log('got an error')
                return 
            }
        let text = line.text
        if (!text) continue
        const words = codeWords(text)
        const match = fuzzyMatch(key, words)
        if (match) {
            cmTextCompletion(cm, pos, key, match)
            return 1
        }
    }
}

function cmLineInfo(cm) {
    let f = cmPos(cm)
    let line = cm.state.doc.lineAt(f)
    let start = Math.max(line.from, f - 250)
    let text = line.text.slice(start - line.from, f - line.from)
    let match = search(/\w*$/, text)
    const wordInfront = f < line.to
    return [f, match, line, wordInfront]
}

function relevantChildBefore(node, f) {
    const ignore = ['LineComment', '{']
    node = node.childBefore(f)
    let cursor = node.cursor
    const yes = ['VariableDefinition', 'VariableName']
    while (cursor.prev()) {
        if (yes.includes(cursor.name)) {
            return cursor.node
        }
    }
    console.log('err')
}

function cmSpicyTemplater(cm, f, template, originalLine) {
    if (template.includes('\n')) {
        template = indent(template, getIndent(originalLine.text))
    }
    return spicyTemplater(
        template,
        cmSpicyRef,
        cm,
        f,
        originalLine
    )
}
function cmTree(cm) {
    return syntaxTree(cm.state)
}
function viewTree(cm) {
    console.log(cmText(cm))
    let cursor = cmTree(cm).cursor()
    while (cursor.next()) {
        console.log(cmLook(cm, cursor))
    }
    console.log('done')
    throw ''
}
const cmSpicyRef = {
    last(cm, f) {
        console.log(exciting())
        let currentNode = cmCurrentNode(cm)
        const node = relevantChildBefore(currentNode, f)
        console.log(exciting())
        console.log(node)
        cmLook(cm, node)
        return 'gg'
        return getStringValue(node, cmText(cm))
    },
    child(cm, f, originalLine) {
        const name = search(/\w+s\b|\w*children|arr/i, originalLine)
        return forIterationArg(name)
    },
    ref(cm, f, originalLine) {
        return '{}'
    },
}
function getCursorFromText(s) {
    let cursor = 0
    let text = s.replace(/\$c\b/, (_, offset) => {
        cursor = offset
        return ''
    })
    //console.log([text, cursor])
    return [text, cursor]
}
function cmInsertDollar(cm, text) {
    const [insert, cursor] = getCursorFromText(text)
    const anchor = f + cursor

    cm.dispatch({
        changes: {
            from: f - (display.length - 1),
            to: f,
            insert,
        },
        selection: { anchor: anchor - (display.length - 1) },
        userEvent: 'input.type',
    })
}
function xxxdollarHandler(cm, f, display, template, lineText) {
    /* not in use */
    const raw = cmSpicyTemplater(cm, f, template, lineText)
    const [insert, cursor] = getCursorFromText(raw)
    const anchor = f + cursor

    cm.dispatch({
        changes: {
            from: f - (display.length - 1),
            to: f,
            insert,
        },
        selection: { anchor: anchor - (display.length - 1) },
    })
    return 1
}

function cmSnippetCompletion(cm, f, keyLength, template) {
    /* dollarHandler */
    const raw = cmSpicyTemplater(cm, f, template)
    const [insert, cursor] = getCursorFromText(raw)
    const anchor = f + cursor

    cm.dispatch({
        changes: {
            from: f - keyLength,
            to: f,
            insert,
        },
        selection: { anchor: anchor - keyLength },
    })
    return 1
}

function cmVisibleText(cm) {
    const text = cm.state.sliceDoc(...cm.visibleRanges[0][0])
    return text
}

// differences ... impossibilities ... 

function cmCollectWords(cm) {
    const text = cmVisibleText(cm)
    const words = bigWords(text)
    return words
}


function cmTextCompletion(cm, f, key, insert) {
    /* abc --> "" */
    /* abc --> foo */

    //console.log([from, to, insert, anchor]); throw '';
    let keyLength = typeof key == 'number' ? key : key.length
    if (insert == null) return
    let anchor = f + insert.length - keyLength
    cm.dispatch({
        changes: {
            from: f - keyLength,
            to: f,
            insert,
        },
        selection: { anchor: anchor },
    })
    return 1
}

function cmLineStartPos(cm) {
    const line = cmLine(cm)
    return line.from
}
function collectVariableNamesOfLine(cm) {
    const pos = cmLineStartPos(cm)
    const tree = syntaxTree(cm.state)
    const start = tree.childAfter(cm)
    const names = [
        'ObjectPattern',
        'VariableDefinition',
        'ArrayPattern',
        'MemberExpression',
    ]
    const node = moveNode(start, names)
    const text = cmNodeValue(node)
}

function cmLogger(cm) {
    const names = collectVariableNamesOfLine(cm)
    const payload = log(names)
    cmAppendBelowSyntax(cm, payload)
}

class FooTest {
    static start() {
        return new FooTest()
    }
    constructor() {
        this.foo = 'hi'
    }
    update(x) {
        this.foo = x
        return x + 'HI'
    }
}

function fieldTest() {
    /* later .... */
    const field = StateField.define({
        create(state) {
            console.log('initialized footest')
            return FooTest.start()
        },
        update(value, tr) {
            console.log('updated')
            return value.update(tr)
        },
    })
}

const MagicCommands = {
    abc(s) {
        
    },
}
function cmCreateKeyFrames(cm) {
    const line = cmLine(cm)
    const [name, trait, value] = split(line.text)
    const payload = `@keyframes ${name} {\n\tfrom { ${trait}: ${value} }\n\tfrom { ${trait}: ${value} }\n}\n\n.fooooo {\n\tanimation-name: ${name};\nanimation-duration: 100s;\n\tanimation-iteration-count:  infinite;\n\tanimation-timing-function: linear;\n}`
    return cmDispatchChunk(cm, payload)

}

function cmCreateFunction(cm, offset) {
    const line = cmLine(cm)
    let [spaces, text] = getIndentAndLine(line.text)
    if (offset) text = text.slice(0, -1 * offset)

    const words = split(text)
    const type = spaces == 0 ? 'function' : cmWrapperContext(cm)
    let [name, params] = splitonce(words)
    let body = ''
    let payload
    let anchor
    let async = ''

    if (type == 'ClassBody') {
        payload = `${async}${name}(${params.join(
            ', '
        )}) {\n\t\n}`
    } else if (type == 'ObjectExpression') {
        payload = `${async}${name}(${params.join(
            ', '
        )}) {\n\t\n},`
    } else if (spaces == 0) {
        payload = `${async}function ${name}(${params.join(
            ', '
        )}) {\n\t\n}`
    } else {
        payload = `const ${name} = ${async}(${params.join(
            ', '
        )}) => {\n\t\n}`
    }

    return cmDispatchChunk(cm, payload)
    //payload = indent(payload, spaces)
    //console.log(payload)
    //anchor = payload.search(/\t/) + line.from + 1
    //cmDispatchText(cm, line.from, line.to, payload, anchor)
    //return 1
}

function selectSomethingIfInterest(cm) {
    const dict = {
        a: 'hi',
    }
}
function cmReplaceWith(cm) {
    cmSelect(cm, cmWord(cm))
}

function cmSaveToStorage(cm) {
    const pos = cmPos(cm)
    const text = cmText(cm)
    setStorage('cm', { pos, text })
    speak('saved state to storage')
}


function cmLoadFromStorage(cm) {
    const { pos, text } = getStorage('cm')
    if (!text) return
    cmDispatchText(cm, 0, cmLength(cm), text, pos)
}


function ecmInfo(mode) {
    if (mode == String) {
        console.log(e.text)
        return 
    }
    console.log({pos: e.pos, text: e.text})
}

function viewNode(cm, node) {
    const cursor = node.cursor
    while (cursor.next()) {
        cmLook(cm, cursor)
    }
    throw ''
}
function collectNodes(cm) {
    const node = syntaxTree(cm.state).topNode
    let child = node.firstChild
    if (!child) {
        console.log('error')
        return 
    }
    const store = []
    while (true) {
        store.push(child)
        let next = child.nextSibling
        viewNode(cm, next)
        if (next) {
            child = next
        }
        else {
            console.log(store.map((x) => cmLook(cm, x)))
            console.log(store.length); throw ''
            return store
        }
    }
    const children = node.getChildren('RuleSet')
    console.log(children); throw ''
    throw ''
        while (cursor.next()) {
            if (cursor.name == 'RuleSet') {
                
            }
            cmLook(cm, cursor)
            //console.log(cursor.name)
            //const slice = text.slice(cursor.from, cursor.to)
            //console.log({slice})
        }
}
function collectFrom(cm, startName, ...terms) {
    const pos = cmPos(cm)
    const node = syntaxTree(cm.state).resolve(pos)
    const s = cmText(cm)
    const cursor = node.cursor
    const store = [] 
    while (cursor.next()) {
        if (cursor.name != startName) continue
        const to = cursor.to
        while (cursor.next()) {
            if (terms.includes(cursor.name)) {
                store.push(nodeValue(node, s))
            }
            if (cursor.to > to) {
                return store
            }
        }
        return store
    }
}


function cmDeleteLine(cm) {
  let {state} = view, changes = state.changes(selectedLineBlocks(state).map(({from, to}) => {
    if (from > 0) from--
    else if (to < state.doc.length) to++
    return {from, to}
  }))
  let selection = updateSel(state.selection, range => view.moveVertically(range, true)).map(changes)
  view.dispatch({changes, selection, scrollIntoView: true, userEvent: "delete.line"})
  return true
}

function selectedLineBlocks(state) {
  let blocks = [], upto = -1
  for (let range of state.selection.ranges) {
    let startLine = state.doc.lineAt(range.from), endLine = state.doc.lineAt(range.to)
    if (!range.empty && range.to == endLine.from) endLine = state.doc.lineAt(range.to - 1)
    if (upto >= startLine.number) {
      let prev = blocks[blocks.length - 1]
      prev.to = endLine.to
      prev.ranges.push(range)
    } else {
      blocks.push({from: startLine.from, to: endLine.to, ranges: [range]})
    }
    upto = endLine.number + 1
  }
  return blocks
}

function updateSel(sel, by) {
  return EditorSelection.create(sel.ranges.map(by), sel.mainIndex)
}

function cmDispatchChunk(cm, chunk, from, to, scroll) {
    const l = cmLine(cm)
    if (from == null) {
        from = l.from
        to = l.to
    }
    const dent = getIndent(l.text)
    if (chunk.includes('$c')) {
         cmDollar(cm, l, chunk, dent)
    } else if (chunk.includes('\t')) {
        const payload = indent(chunk, dent)
        cmDispatchText(cm, from, to, payload, from + payload.search(/\t/) + 1, scroll)
    } else {
        const payload = indent(chunk, dent) + '\n' + ' '.repeat(dent)
        cmDispatchText(cm, from, to, payload, from + payload.length, scroll)
    }
}



function insideObject(node) {
    return node.parent?.getChild('Expression')?.name == 'ObjectExpression'
}

function cmCreateObject(cm) {
    const args = cmLineArgs(cm)
    const value = assetObject(args, insideObject(cmNode(cm)))
    cmDispatchChunk(cm, value)
}
function cmLineArgs(cm) {
    const line = cmLine(cm)
    if (/[^\s\w]/.test(line.text)) return 
    return split(line.text)
}
function cmCreateArray(cm) {
    const args = cmLineArgs(cm)
    const value = assetArray(args)
    cmDispatchChunk(cm, value)
}

function cmCreateClass(cm) {
    const args = cmLineArgs(cm)
    const template = 'class $1 (?:extends )'
    cmDispatchChunk(cm, value)
}

function cmCreateVue(cm) {
    const args = cmLineArgs(cm)
    args[0] = capitalize(args[0])
    const value = templater(assets.templates.vue.vue, args)
    cmDispatchChunk(cm, value)
}

function selectionLines(cm) {
    const {from, to} = range
    let start = cm.state.doc.lineAt(from)
    let spaces = getIndent(start.text)
    let end = cm.state.doc.lineAt(to)
    cm.state.sliceDoc(start.from, end.to)
}


function cmCreateDitto(cm) {
    const upline = cmUpline(cm).text
    if (!exists(upline)) {
        return 
    }
    const args = cmLineArgs(cm)
    const value = lineDitto(upline, args)
    cmDispatchChunk(cm, value)
}

function cmCommonDispatch(cm, from, value) {
    cmDispatchText(cm, from , from, value, value.length + from)
    
}

function cmTypist(cm, s, lang = 'base') {
    const dict = {
        'css': cssInputHandler,
        'js': javascriptInputHandler,
        'html': htmlInputHandler,
        'base': baseInputHandler,
    }
    let pos = cmPos(cm)
    let i = 0
    let handler = dict[lang]
    for (let k of split(s, '')) {
        console.log(k)
        handler(cm, pos + i++, null, k)
    }
}

/* nothing to say to each other */
/* they are on a different planet */
/* playing inside established realms */
/* read to grow your brain */
/* i never seem to rise to challenges */
/* i always seem to diminish */
/* im not excited by it */


function cmVisualReplace(cm, cursor, s) {
    cursor = extendCursor(cm, cursor)
    const text = dreplace(cm.state.sliceDoc(cursor.from, cursor.to), createConfig(s))
    console.log({text, s, j:createConfig(s)})
    cmDispatchText(cm, cursor.from, cursor.to, text, cursor.from + text.length)
}
function cmCopyBlock(cm, cursor) {
    const [A,B] = cmSelectionLines(cm, cursor)
    let text = '\n' + cm.state.sliceDoc(A.from, B.to)
    console.log('hi text', text)
    app.pasteBuffer = text
}

function cmDittoBlock(cm, cursor, s) {
    console.log(cursor)
    const [A,B] = cmSelectionLines(cm, cursor)
    console.log(A, B)
    let text = '\n' + cm.state.sliceDoc(A.from, B.to)
    //console.log({text})
    if (s) {
        text = dreplace(text, createConfig(s))
    }
    cmDispatchText(cm, B.to, B.to, text, B.to + text.length)
}

/* stable &&sort */


function cmSubstitute(cm, s, flags = '') {
    let word = cmWordUnderCursor(cm)
    if (flags.includes('b')) word = boundary(word)
    if (flags.includes('g')) {
        flags = 'g'
    }
    else {
         flags = ''
    }
    word = rescape(word)
    cmReplaceLine(cm, word, s, flags)
}

function cmSpicyTemplater(cm, f, template, originalLine) {
    console.log('hmm not in use')
    speak('not in use')
    //const value =
    //return cmDispatchChunk(cm, value)
}

function somethingSelected(cursor) {
    return !cursor.empty
    return cursor.from != cursor.to
}

