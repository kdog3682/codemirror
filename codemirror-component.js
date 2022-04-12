const { Compartment } = CM['@codemirror/state']
const { completeAnyWord } = CM['@codemirror/autocomplete']
const { javascript, javascriptLanguage } = CM['@codemirror/lang-javascript']
const { EditorState, EditorView, basicSetup } =
    CM['@codemirror/basic-setup']


const {syntaxTree} = CM["@codemirror/language"]

const completePropertyAfter = ["PropertyName", ".", "?."]
const dontCompleteIn = ["TemplateString", "LineComment", "BlockComment", "VariableDefinition", "PropertyDefinition"]

function completeFromGlob(context) {
  let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)

  if (completePropertyAfter.includes(nodeBefore.name) &&
      nodeBefore.parent?.name == "MemberExpression") {
    let object = nodeBefore.parent.getChild("Expression")
    if (object?.name == "VariableName") {
      let from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from
      let variableName = context.state.sliceDoc(object.from, object.to)
      if (typeof window[variableName] == "object")
        return completeProperties(from, window[variableName])
    }
  } else if (nodeBefore.name == "VariableName") {
    return completeProperties(nodeBefore.from, window)
  } else if (context.explicit && !dontCompleteIn.includes(nodeBefore.name)) {
    return completeProperties(context.pos, window)
  }
  return null
}

const globalJavaScriptCompletions = javascriptLanguage.data.of({
  autocomplete: completeAnyWord
})

function autoFocus(editor, delay = 750) {
    setTimeout(() => editor.focus(), delay)
}

function CreateEditorView(selector, state) {
    if (!selector) selector = 'codemirror-component'
    if (!state) state = CreateEditorState()

    const editor = new EditorView({
        state: state,
        parent: document.querySelector(fixSelector(selector)),
    })

    for (let [k, v] of Object.entries(EditorCommands)) {
        console.log(k, hasReturnValue(v))
        defineFunctionProperty(editor, k, v)
    }

    autoFocus(editor)
    return editor
}

function CreateEditorState({
    minHeight = '100%',
    maxHeight = '100%',
    overflow = 'auto',
    extensions = [],
    doc = '',
} = {}) {
    let height = '100%'
    const BaseTheme = EditorView.theme({
        '&': {
            fontSize: '24px',
            'border-bottom': '3px solid blue',
            'min-height': '100vh',
        },
        '.cm-content': {
            fontFamily:
                'Menlo, Monaco, Lucida Console, monospace',
            height: height,
        },
        '.cm-gutters': {
            height: height,
        },
        '.cm-scroller': {
            overflow: 'auto',
        },
    })

    const handler = EditorView.inputHandler.of(cmInputHandler)
    const BaseExtensions = [
        //BaseTheme,
        handler,
        basicSetup,
        javascript(),
        globalJavaScriptCompletions,
    ]

    return EditorState.create({
        doc,
        extensions: BaseExtensions,
    })
}

function cmCursor(cm) {
    return cm.state.selection.main.head
}

function cmText(cm) {
    return cm.state.doc.toString().trim()
}

function cmInsert(cm, text) {
    let c = cmCursor(cm)
    cm.dispatch({
        changes: {
            from: c,
            insert: text.toString(),
        },
        selection: {
            anchor: c + text.length,
        },
    })
}

function cmSet(cm, s) {
    cm.dispatch({
        changes: {
            from: 0,
            to: cm.state.doc.length,
            insert: s,
        },
    })
}

function cmClear(cm) {
    cmSet(cm, '')
}
function cmReplace(cm, s) {
    cm.dispatch(cm.state.replaceSelection(s))
}

function cmLine(cm) {
    return cm.state.doc.lineAt(cmCursor(cm)).text
}

function cmDispatch(cm, fn) {
    cm.dispatch({ effects: fn })
}

function cmLength(cm) {
    return cm.state.doc.lines
}
function cmLastLine(cm) {
    return cm.state.doc.lineAt(cmLength(cm)).text
}

function cmFirstLine(cm) {
    return cm.state.doc.lineAt(1).text
}

const EditorCommands = {

    set: cmSet,
    pretty: cmPretty,
    cursor: cmCursor,
    line: cmLine,
    text: cmText,
    indent: cmIndent,
    lineNumber: cmLineNumber,
    context: cmContext,
    empty: cmEmpty,
}

function cmEmpty(cm) {
    return cm.line.trim().length == 0
}
function cmContext(cm) {
    if (cm.indent == 0) return
    const cursor = cm.doc.iterLines(n - 1, 0)
    while (cursor.next()) {
        let i = getIndent(cursor.value)
        if (i == 0) {
            return getFirstWord(cursor.value)
        }
    }
}

function cmBlock(cm) {
    if (cm.indent == 0) return
    let n = cm.lineNumber
    const cursor = cm.doc.iterLines(n - 1, 0)
    while (cursor.next()) {
        let i = getIndent(cursor.value)
        if (i == 0) {
            return
        }
    }
}
function cmLineNumber(cm) {
    return cm.state.doc.lineAt(cmCursor(cm)).number
}

function cmIndent(cm) {
    return getIndent(cmLine(cm))
}

const EmptyDictionary = {
    '-': '-------------------------\n',
    'r': 'return ',
}
// can do some pretty radical things...

function cmWordSpiral(cm) {
    return 
        const word = cmWordUnderCursor(cm)
        while (true) {
            break
        }
}
function cmInputHandler(cm, from, to, key) {
    if (cm.empty && EmptyDictionary.hasOwnProperty(key)) {
        cmReplace(cm, EmptyDictionary[key])
        return 1
    }
    if (key == 'Tab') {
        console.log(from, to, key)
        if (cmWordSpiral(cm)) {
            return 1
        }
    }
}

function cmInfo(cm) {
    return reduce(EditorCommands, (k, v) => {
        return [k, v(cm)]
    })
}
function cmStartOfLine(cm) {
    //return cmLine()
}

const CodeMirrorComponent = {

    data() {
        return {
            displays: {
                codemirror: true,
                html: false,
            },
            html: '<div class="jsxgraph" id="jsxgraph"></div>',
            js: '',
        }
    },
    template: `
        <div class="app">
            <div class="codemirror-component" 
                v-show="displays.codemirror">
            </div>

            <div class="html-component"
                v-html="html"
                v-show="displays.html">
            </div>
        </div>
    `,
    mounted() {
        this.editor = CreateEditorView()
        this.displayManager = new VueDisplayManager(
            this,
            VueDisplayCallbacks
        )
        this.keylistener = new KeyListener(
            this,
            VueCodemirrorCallbacks
        )

        this.editor.set('console.log(   foo)')
        this.editor.pretty()
        console.log(this.editor.text)
    },
}
const VueDisplayCallbacks = {
    html: {
        onEnter() {},
        onExit() {},
    },
    codemirror: {
        onEnter() {
            setTimeout(
                this.editor.requestMeasure.bind(this.editor),
                50
            )
            autoFocus(this.editor)
        },
        onExit() {
            this.editor.contentDOM.blur()
        },
    },
}
const VueCodemirrorCallbacks = {
    async ['F1']() {
        this.html = this.editor.text
        this.displayManager.enter('html')
        await sleep(3000)
        this.displayManager.enter('codemirror')
    },

    ['Ctrl-0']() {
        console.log('hi')
        this.editor.pretty()
    },

    async ['Ctrl-K']() {
        this.js = this.editor.text
        flashWrite('evaling js')
        console.log(this.js)
        console.log(eval(this.js))
    },

    async ['Ctrl-Enter']() {
        this.js = this.editor.text
        flashWrite('evaling js')
        console.log(this.js)
        this.displayManager.enter('html')
        await sleep(100)
        try {
            eval(this.js)
        }
        catch(e) {
            console.log(e)
        }
        await sleep(7000)
        this.displayManager.enter('codemirror')
    },
}


function cmGetSet(cm, fn) {
    const text = cmText(cm)
    setTimeout(() => cmSet(cm, fn(text)) , 250)
}

function cmPretty(cm) {
    cmGetSet(cm, pretty)
}

class VueDisplayManager {
    constructor(vue, callbacks, onEnter, onExit) {
        this.vue = vue
        this.callbacks = bindObjectToState(callbacks, vue)
        this.keys = Object.keys(this.vue.displays)
        this.activeKey = findKey(
            this.vue.displays,
            null,
            isTrue
        )
        if (onEnter) {
            this.onEnter = onEnter.bind(this)
        }
        if (onExit) {
            this.onExit = onExit.bind(this)
        }
    }

    _enter(key) {
        this.activeKey = key
        this.vue.displays[key] = true
        this.doAfter(key, 'onEnter', true)
    }

    _exit(key) {
        if (this.activeKey == key) this.activeKey = null
        this.vue.displays[key] = false
        this.doAfter(key, 'onExit', false)
    }

    toggle(key) {
        if (this.activeKey == key) {
            this.activeKey = null
            this.exit(key)
        } else {
            this.enter(key)
        }
    }
    enter(key) {
        this.keys.forEach((item, i) => {
            if (item == key) {
                this._enter(item)
            } else {
                this._exit(item)
            }
        })
    }
    exit(key) {
        this._exit(key)
    }

    doAfter(key, mode, message = true) {
        const callback =
            this.callbacks[key] && this.callbacks[key][mode]
        if (!callback) return
        setTimeout(() => {
            callback(this.vue)
            if (this[mode] && message) {
                this[mode](key)
            }
        }, 100)
    }
    get active() {
        return findKeys(this.vue.displays, null, isTrue)
    }
}

app = new Vue(CodeMirrorComponent).$mount('#app')
