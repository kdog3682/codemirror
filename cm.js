//const hic = 'const Hic = {template,}'
const ModalComponent = {
    name: 'ModalComponent',
    props: ['value'],
    render(h) {
        /* basically a dynamic component */
        /* every time the modal can change */
        if (isString(this.value)) {
            return renderModal(h, this.value)
        }
        const { component, html, json } = this.value
        if (component) {
            return h(component)
        }
        if (json) {
            return renderJson(h, json)
        }
        if (html) {
            return renderHtml(h, html)
        }
    },
}

const ConsoleComponent = {
    name: 'ConsoleComponent',
    props: ['value'],
    render(h) {
        const c = this.value.map((item) => {
            return renderPre(h, item)
        })
        return renderWrapper(h, 'console', c)
    },
}










class ExtendedEditor extends StorageSystem {
    restoreState() {
        setTimeout(() => {
            autoFocus(this.editor)
        const {buffer, cursor} = this._savedState
        this._savedState = null
        this.nameIt(buffer)
        cmSetCursor(this.editor, cursor)
        }, 50)
    }
    saveState() {
    const buffers = e.buffers.toJSON()
      const cursor = this.buffers.currentState.selection.toJSON()
      const buffer = this.buffers.currentBuffer
      this._savedState = {cursor, buffer}
    }
    constructor() {
        super()
        const preExisting = super.get()
        //console.log({preExisting})
        this.buffers = new Buffers(preExisting)
        this.editor = this.buffers.init('index.js')
        this.cm = this.editor
        this.jumplist = new JumpList()
        this.stylesheet = new Stylesheet()

        this.defineProperties()
        this.assignAliases()
        this.defineBufferCommands()
        this.defineExtendedCommands()
        autoFocus(this.cm, 100)
    }
    get lang() {
        return this.buffers.lang
    }

    defineExtendedCommands() {
        for (let [k, v] of Object.entries(ExtendedCommands)) {
            this[k] = v.bind(this)
        }
    }

    defineBufferCommands() {
        for (let [k, v] of Object.entries(BufferCommands)) {
            this[k] = v.bind(this.buffers)
        }
    }

    assignAliases() {
        const keys = ['dispatch']
        assignAliases(this, this.cm, keys)
    }

    defineProperties() {
        for (let [k, v] of Object.entries(EditorCommands)) {
            let name = uncapitalize(k.slice(2))
            if (hasReturnValue(v) && countParameters(v) <= 2) {
                const get = () => v(this.cm)
                Object.defineProperty(this, name, { get })
            } else {
                this[name] = (...args) =>
                    v(this.cm, ...args)
            }
        }
    }
    _upload() {
        return uploadCompleteState()
        //return this.buffers.toObject()
    }
}


class Buffers {

    append(buffer, value) {
        if (!exists(value)) {
            return 
        }
        value = '\n' + value

        const isCurrent = this.currentBuffer == buffer
        const state = isCurrent ? 
            this.state : this.get(buffer)
        const from = state.doc.length

        const newState = state.update({
            changes: {
                from: from,
                to: from,
                insert: value
            },
            selection: {anchor: 0},
            scrolIntoView: true,
        }).state

        this.set(buffer, newState)
        if (isCurrent) this.editor.setState(newState)
    }

    edit(buffer, fn) {
        const state = this.get(buffer)
        if (!state) return console.log('cant do it @ edit')
        const value = fn(state)
        this.patch(buffer, value, false, true)
                                /* force | setState */
    }
    getActiveBuffers(length = 10) {
        const buffers = this.toJSON()
        return Object.entries(buffers).reduce((acc, [k,v]) => {
            if (v.length > length) {
                acc.push(k)
            }
            return acc
        }, [])
    }
    restoreState({buffers, metaInfo}) {
        this.store = reduceObject(buffers, (name, s) => {
            if (name == 'js') name = 'index.js'
            else if (name == 'css') name = 'styles.css'
            else if (name == 'html') name = 'index.html'
            return [name, this.create(name, s)]
        })

        const state = this.get(metaInfo.buffer)
        this.editor.setState(state)
        this.nameIt(metaInfo.buffer)
        cmSetCursor(this.editor, metaInfo.cursor)
    }
    patch(key, value, force, setState) {
        if (!value) {
            console.log('nnoremap value retunrning @patch')
            return 
        }
        let _setState = setState && key == this.currentBuffer
        if (!this.store.hasOwnProperty(key)) {
            if (force) {
                this.set(key, this.create(key, value))
                if (_setState) this.editor.setState(newState)
            }
            return 
        }
        const state = this.get(key)
        const newState = state.update({
            changes: {
                from: 0,
                to: state.doc.toString().length,
                insert: value
            }
        }).state
        this.set(key, newState)
        if (_setState) this.editor.setState(newState)
    }
    update() {
        /* sets the store */
        this.set(this.currentBuffer, this.state)
    }
    updateState(file) {
        if (this.currentBuffer == file) {
            this.update()
        }
    }
    getString(file) {
        this.updateState(file)
        const state = this.get(file)
        const text = state && state.doc.toString() 
            || TextTemplates[file] || ''

        return text
    }
    reset(file) {
        this.names = []
        this.store = {}
        this.currentBuffer = ''
        this.open(file)
    }
    constructor(store) {
        this.names = []
        mixin(this, StorageMixin, 'reduce', 'get', 'set', 'has')
        this.store = reduceObject(store, this.create.bind(this))
        this.helpers = {}
        //this.extensions = basicSetup.concat(this.man.extensions)
        this.extensions = basicSetup
    }
    init(key = 'index.js') {
        if (this.has(key)) return

        const parent = document.querySelector(
            fixSelector('app-codemirror')
        )

        const state = this.create(key, '')
        this.editor = new EditorView({ state, parent })
        this.nameIt(key)
        return this.editor
    }

    onOpen(from, to) {
        const A = from && getExtension(from)
        const B = to && getExtension(to)
        if (!A) return 
        if (A == 'html' && B == 'css') {
            const state = this.get(A)
            if (!state) return 
            this.sm.updateCache(state.doc.toString())
            console.log('updating snippets')
            /* update css snippets */
        }
    }
    open(name, text, append) {
        if (isNumber(name)) { name = this.names[name] }
        if (name == this.currentBuffer) {
            if (append && text) {
                cmAppendBottom(this.editor, text, true)
            }
            console.log('name already open', name)
            return
        }
        this.set(this.currentBuffer, this.currentState)

        if (this.has(name)) {
            let state = this.get(name)
            if (append && text) {
                let from = state.doc.length
                let insert = '\n\n' + text
                 state = state.update({
                    changes: {
                        from: from,
                        insert: insert,
                    },
                    selection: {anchor: from + insert.length}
                }).state
            }
            this.editor.setState(state)
        } else {
            const state = this.create(name, text)
            this.set(name, state)
            this.editor.setState(state)
        }
        this.nameIt(name)
    }

    nameIt(name) {
        this.lastBuffer = this.currentBuffer
        this.currentBuffer = name
        this.nameIndex = this.names.indexOf(name)
        this.lang = getExtension(name)
        this.onOpen(this.lastBuffer, this.currentBuffer)
    }

    increment(n) {
        return modularIncrement(
            this.names,
            this.currentBuffer,
            n
        )
    }

    get currentState() {
        return this.editor.state
    }

    create(name, doc) {
        this.names.push(name)
        this.lang = getExtension(name)

        const baseLanguage = langExtensions(this.lang)
        //console.log('hi')
        const langRef = languageRef[this.lang] || {}
        const sm = new SnippetManager(this.lang)
        const autocomplete = sm.factory()
        //console.log('vv')
        //console.log(autocomplete)

        const man = new Man({
            autocomplete,
            //baseTheme: langRef.baseTheme,
            readOnly: false,
            baseInputHandler: baseInputHandler,
            tabSize: 4,
            indentUnit: '\t',
            inputHandler: langRef.inputHandler,
            keymap: langRef.keyBindings,
            vimkeys: [],
        })

        const extensions = basicSetup
            .concat(man.extensions)
            .concat(baseLanguage)
            .concat(Prec.high(keymap.of(EditorKeyBindings)))

        const selection = exists(doc) ?
            {anchor: doc.length} :
            //EditorSelection.create([{anchor: doc.length}]) :
            EditorSelection.single(0)

        const state = EditorState.create({
            doc: doc || '',
            extensions,
            selection, 
        })

        this.helpers[this.lang] = [sm, man]
        return state
    }
    resetAll(x, y) {
        for (let [k, v] of Object.entries(this.helpers)) {
            v[1].set(x, this.base[x])
        }
    }

    setAll(x, y) {
        for (let [k, v] of Object.entries(this.helpers)) {
            console.log(getConstructorName(v[1]))
            console.log(getConstructorName(y))
            console.log(x)
            v[1].set(x, y)
        }
    }

    get sm() { return this.helpers[this.lang][0] }
    get man() { return this.helpers[this.lang][1] }
    get state() { return this.editor.state }

    toJSON() {
        return this.toObject()
    }
    toObject() {
        this.update()
        return reduceObject(this.store, (k, state) => {
            if (k.includes('.')) k = getExtension(k)
            const value = state.doc.toString()
            const output = value.trim().length > 5 ? value : null
            if (output) return [k, output]
        })
    }
}




class Man {
    valueOf(key) {
        return this.values[key]
    }
    constructor(extensions) {
        this.base = {}
        this.initials = {}
        this.values = {}
        this.store = {}
        this.handlers = {
            //baseTheme: identity,
            autocomplete: autocompletion,
            inputHandler: EditorView.inputHandler,
            baseInputHandler: EditorView.inputHandler,
            readOnly: EditorState.readOnly,
            tabSize: EditorState.tabSize,
            indentUnit: indentUnit,
            keymap: keymap,
            vimkeys: keymap,
        }

        this.defaults = {
            inputHandler: cmTest('sup from ih', 'see-args'),
        }

        this.extensions = 
              Object.entries(extensions || {}).map(([a, b]) => {
                  return this.init(a, b)
              })
    }
    init(key, value) {
        if (!this.store.hasOwnProperty(key)) {
            const handler = this.handlers[key]
            this.store[key] = [new Compartment(), handler]
        }
        return this.create(key, value, 'of', true)
    }

    create(key, value, mode = 'of', initial = false) {
        //console.log('creating', key, value)
        const [compartment, handler] = this.store[key]
        const extension = this.getExtension(key, handler, value)
        if (!extension) {
            console.log('returning empty extenison')
            return []
        }
        if (mode == 'reconfigure' && !this.base[key]) {
            this.base[key] = extension
        }

        if (!isString(value)) this.values[key] = value
        return compartment[mode](extension)
    }

    getExtension(key, handler, value, mode = 'of', initial = false) {
        if (value == null) {
            if (this.defaults[key]) {
                value = this.defaults[key]
            } else {
                value = []
            }
        } else if (value == 'initial') {
            value = this.initials[key] 
            assert(value)
        }

        if (initial && exists(value)) {
            this.initials[key] = value
        }

        if (handler == identity) return value
        if (key == 'autocomplete') return handler(value)
        if (key == 'keymap') return Prec.high(handler.of(value))
        if (key == 'vimkeys') return Prec.highest(handler.of(value))
        return handler.of(value)
    }

    reset(key) {
        this.set(key)
    }
    set(key, value) {
        //console.log('setting ', key, value)
        const effects = this.create(key, value, 'reconfigure')
        e.cm.dispatch({ effects })
    }
}


function cmCurrentFunction(cm) {
    try {
        return bringToLife(cmBlock(cm).text)
    }
    catch(e) {
        console.log(e.stack)
    }
}

const ExternalEditorCommands = {
    runTestHandler,
    /* in progress */
}

function runTestHandler() {
    const fn = cmCurrentFunction(app.editor.cm)
    app.editor.buffers.man.set('inputHandler', fn)
    app.revertTestHandler = (x) => {
        app.revertTestHandler = null
        app.editor.buffers.man.set('inputHandler', 'initial')
    }
}


function runAbc() {
    console.log('hi')
}
function runAbcdocument() {
    console.log('hd')
}

function runAbcdocumente() {
    console.log('hde')
}
function runabc() {
    console.log('abc')
}
function runTab() {
    console.log('hitab')
}

function dlcss() {
    const text = e.buffers.getString('styles.css')
    download('styles.css', text)
}

function toggleReadOnly2() {
    const man = e.buffers.man
    console.log('toglging read only')
    if (e.readOnly) {
        console.log('hiiiii')
        e.readOnly = false
        man.resetAll('inputHandler')
    } else {
        e.readOnly = true
        console.log('setting vim')
        e.buffers.setAll('inputHandler', vimInputHandler)
    }
}


function toggleReadOnly(n) {
    return 
    const man = e.buffers.man
    const readOnly = man.valueOf('readOnly')
    if (n == -1) {
        if (readOnly == true) {
            man.set('readOnly', !readOnly)
        }
        return
    }

    man.set('readOnly', !readOnly)
    toggleKeyBinding(man, readOnly)
    return readOnly
}

function toggleKeyBinding(man, readOnly) {
    man.set('vimkeys', readOnly ? VimKeyBindings : null)
}

// the update cycle ...
function eRunner() {
        vuecmCodeRunner()
}

function eDownloader() {
    let buffers = e.buffers
    buffers.update()
    const store = buffers.toObject()
    editObject(store, 'css', aggregateCSS)
    const htmlString = htmlBuilder(store, {
        legos: false,
        useCache: false,
    })
    popOpen(htmlString)
    download('buffers.html', htmlString)
}
const {
    cursorCharRight,
    cursorLineBoundaryForward,
    cursorCharLeft,
    cursorLineBoundaryBackward,
    cursorLineStart,
    cursorLineEnd,
    cursorGroupLeft,
cursorGroupRight,
} = CodeMirrorCommands
const EditorKeyBindings = [
    { key: 'Tab', run: runTab },
    { key: 'Escape', run: globalEscape },
    { key: 'Alt-f', shift: unfoldCode, run: cmFold, preventDefault: true },
    { key: 'Enter', run: globalEnter },
    { key: 'Ctrl-ArrowLeft', run: cursorLineBoundaryBackward },
    { key: 'Ctrl-ArrowRight', run: cursorLineBoundaryForward },
    //{ key: 'ArrowLeft', shift: cursorCharLeft, run: cursorGroupLeft },
    //{ key: 'ArrowRight', shift: cursorCharRight, run: cursorGroupRight },
    { key: 'Ctrl-z', shift: undo, run: redo, preventDefault: true, },
    { key: 'Ctrl-d', run: eDownloader, preventDefault: true},
    { key: 'Ctrl-=', run: () => e.next() },
    //{ key: '`', run: eRunner },
    { key: 'K', run: vuecmCodeRunner, preventDefault: true },
    { key: 'Backspace', run: globalBackspace, preventDefault: true },
    { key: 'ctrl-k', run: vuecmCodeRunner, preventDefault: true },
    { key: 'Ctrl-0', run: cmPretty },
    { key: 'Ctrl-h', run: () => e.html(), preventDefault: true},
    { key: 'Ctrl-j', run: () => e.js(), preventDefault: true},
    { key: 'Alt-c', run: () => e.css(), preventDefault: true},
    //{ key: 'Ctrl-c', run: () => e.css(), preventDefault: true},
    { key: 'Ctrl-s', run: cmSaveToStorage, shift: uploadCompleteState, preventDefault: true},
    //{ key: 'Alt-s', run: cmSaveToStorage, shift: uploadCompleteState, preventDefault: true},
    { key: 'Ctrl-l', shift: loadCompleteState, run: cmLoadFromStorage, preventDefault: true},
    //{ key: 'Ctrl-v', run: toggleVtc },
]
function uploadCompleteState() {
    const buffers = e.buffers.toJSON()
    const cursor = app.editor.buffers.currentState.selection.toJSON()
    const metaInfo = {
        cursor: cursor,
        buffer: e.buffers.currentBuffer,
    }
    setStorage('cm-state', {buffers, metaInfo})
    speak('saving complete state')
}
function loadCompleteState() {
    e.buffers.restoreState(getStorage('cm-state'))

}




function toggleVtc() {
    toggle(e.vtc, 'running')
    speak('toggle runnning at vtc')
}



function langExtensions(lang) {
    if (lang == 'txt') return []
    if (lang == 'js') lang = 'javascript'
    const baseLanguage = CM['@codemirror/lang-' + lang][lang]
    return baseLanguage()
}


class JumpList {
    constructor() {
        this.jumps = []
        this.reset()
        this.lul = new LoadUnload()
    }
    go() {
        this.lul.loadOnce(this.pos)
        return this.back()
    }
    done() {
        return this.lul.unload()
    }
    save(pos) {
        console.log('hi', pos)
    }
    reset() {
        this.index = this.jumps.length
        this.backCount = 0
        this.forwardCount = 0
        this.threshold = 5
        this.difference = 2
    }
    add(value) {
        if (this.jumps.length >= this.threshold) {
            this.jumps = this.jumps.slice(
                this.threshold - this.difference
            )
            this.reset()
        }
        this.jumps.push(value)
        this.index += 1
    }
    back() {
        this.backCount++
        return this.relativeIndex
    }
    get relativeIndex() {
        const index =
            this.index + this.forwardCount - this.backCount - 1
        return this.jumps[index]
    }
    forward() {
        this.forwardCount++
        return this.relativeIndex
    }
}




function simulateState(...args) {
    let text = '\n'.repeat(0) + join(args.map(String))
    let cursor = text.length - 5
    return [text, cursor]
}
const VimModes = {
    name: 'VimModes',
    props: ['mode', 'modeString'],
    template: `
        <div class="vim-modes">
            <span :class="mode">{{mode}}</span>
            <span>{{modeString}}</span>
        </div>
    `,
    mounted() {
        console.log('hi from VimModes')
        cssLoader(cssParser('vim-modes', 'p5 aic flex jcs a b0 r0 cmb7 fs18 h60px w240px fw600 sans'))
        cssLoader(cssParser('visual', 'fcb7 mr6'))
        cssLoader(cssParser('normal', 'fcg7 mr6'))
    }
}
const CodeMirrorComponent = {
    components: {
        VimModes,
        ModalComponent,
        ConsoleComponent,
        IframeComponent,
    },
    methods: {
        flash(s) {
            this.clock.createClock({
                duration: 2,
                onStart() {
                    app.modalValue = s 
                },
                onEnd() {
                    app.modalValue = ''
                },
            })
        },
        modal(message, duration, copy) {
            if (copy) {
                e.buffers.set('clipboard', message)
                /* sets the clipboard buffer */
                setClipboard(message)
            }
            this.clock.createClock({
                duration,
                onStart() {
                    app.modalValue = message
                },
                onTick(count, timeLeft) {
                    app.tick = timeLeft
                    if (!app.modalValue) {
                        return 'DONE'
                    }
                },
                onEnd() {
                    app.modalValue = ''
                },
            })
        },
        onCss(s) {
            this.css = s
        },
        async onJs(s) {
            try {
                eval(s)
            } catch (e) {
                flashWrite('ERROR')
                console.log(e)
            }
        },
    },
    watch: {
        mode(current, old) {
            console.log('watching old && changing it.')
            return
            if (current != old) {
                const s = this.editor.text
            }
        },
    },
    data() {
        return {
            iframeKey: 0,
            codemirror: true,
            frameKey: 0,
            normalMode: '',
            visualMode: '',
            modeString: '',
            console: [],
            mode: 'js',
            modalValue: '',
            sleepTime: 7000,
            displays: {
                codemirror: true,
                html: false,
                iframe: false,
                console: false,
            },
            activeElement: '',
            display: '',
            showPanel: false,
            //showPanel: true,
            html: '<div class="jsxgraph" id="jsxgraph"></div>',
            computedHtml: '',
            js: '',
            css: '',
        }
    },
            //<div v-show="!codemirror"  class="app-prosemirror"></div>
    template: `
        <div class="app">
          <div class="editor-container" v-show="displays.codemirror">
            <div v-show="codemirror" class="app-codemirror"></div>
          </div>

            <VimModes 
                      v-show="normalMode || visualMode"
                      :mode="normalMode ? 'normal' : 'visual'"
                      :modeString="modeString"/>
            <iframe-component 
                ref="iframe"
                v-show="displays.iframe"
                :key="frameKey"
                :value="computedHtml"/>
            <console-component 
                v-show="displays.console"
                :value="console"/>
            <div class="html-component"
                v-html="html"
                v-show="displays.html">
            </div>
            <transition name="fade" mode="out-in">
                <modal-component 
                    v-show="modalValue"
                    :value="modalValue"/>
            </transition>
            <div v-show="showPanel" class="twocol console-panel">
                <div class="active-element">{{activeElement}}</div>
                <div class="display">{{display}}</div>
            </div>
        </div>
    `,
    async mounted() {
        this.visualMode = false
        this.normalMode = false
        this.modeString = '' 
        this.fnMode = false
        this.LEADER_KEY = ';'
        //iframeParentListener((x) => {
           //console.log('hi listening from aprent', x)
        //})

        this.config = {
            delay: 0,
        }

        //this.config = new InfiniteStorage()
        //this.config.set('save', 'location', 'voice')
        this.wm = new WindowManager()
        //this.clock = new Clock()
        this.vtc = new VoiceToCommand({
            autoStart: false,
            defaultCallback: cmVoiceCallback,
            commands: voiceToCommandLibrary,
        })

        this.editor = new ExtendedEditor()
        e = this.editor

        this.displayManager = new VueDisplayManager({
            state: this,
            callbacks: VueDisplayCallbacks,
        })
        await zmounted3(this)
    },
}

const EditorCommands = {
    cmTemplater,
    cmSelect,
    cmSetCursor,
    cmDispatch,
    cmType,
    cmFind,
    cmUp,
    cmDown,
    cmSelectionText,
    cmSelectParameter,
    cmAppendBottom,
    cmAppendBelow,
    cmAppendAbove,
    cmAppendTop,
    cmInsert,
    cmLook,
    cmNode,
    cmCurrentNode,
    cmDownload,
    cmSave,
    cmUpload,
    cmGo,
    cmInsert,
    cmLine,
    cmEmpty,
    cmFirstLine,
    cmLastLine,
    cmStatus,
    cmLint,
    cmPos,
    cmSet,
    cmClear,
    cmPretty,
    cmText,
    cmContext,
    cmName,
    cmBlock,
    cmReplaceBlock,
    cmReplaceLine,
}

function fixKey(s) {
    //let [m1, ctrl] = mreplace(/^Ctrl/, s)
    //let [m2, shift] = mreplace(/^Shift/, m1)
    //let match = search(/Ctrl(\w)/, s)
    //m2=m2.replace(/(?=\w)/, ' ')
    //let output = ''
    //if (ctrl) output += 'Ctrl-'
    //if (shift) output += 'Shift-'

    const keep = ['Enter', 'Tab', 'Escape', 'Ctrl', 'Shift']
    if (keep.includes(s)) {
        return s
    }
    let match = search(/Ctrl(\w)/, s)
    if (match) return 'Ctrl-' + match
    return split(s, '').join(' ')
}
//console.log = display
const VimKeyBindings = Object.entries(VimKeyBindingRef).map(([key, run]) => ({key: fixKey(key), run: () => {
    console.log('hi from vimbinding', key)
    let message = run()
    if (message == 2) {
        app.flash(key)
    }
    return true
}}))
const languageRef = createLanguageRef()
launch(CodeMirrorComponent)

async function zmounted3() {
    //app.mode = 'js'
    await sleep(200)
    //if (isBrowser()) loadCompleteState()
    //await testcsspretty()
    //await sleep(300)
    //setupStuff()
    //vuecmCodeRunner()
    //await sleep(200)
    //eDownloader()
    //await testCompletion('it#', 'js')
    //await testCodeRunner()
    //ecmInfo(1)
}

async function testCompletion(s, lang = 'js') {
    e.templater(s)
    startCompletion(e.cm)
    await sleep(200)
    acceptCompletion(e.cm)
}

function setupStuff() {
    let html = '<p class="sugar">hii</p>'
    let css = '.sugar {\ncolor: red\n}'
    e.html(html)
    e.css(css)
}

async function testcsspretty() {

s = `
.adbc > p:focus {
    background: red; 
}

.abc .voo > .nn p {
    background:blue;
    background:  yel   ;
}
`
    e.css()
    e.templater(s)
    //cmPretty(e.cm)
    //console.log(getConstructorName(e.cm.state))
    //throw ''
    cmRemoverFactory(['abc'], 'css')(e.cm)
    
}


async function testCodeRunner() {
s = `
//console.log(getStylesheets())
const box = document.querySelector(".box")
//box.style.background = 'red'
//box.style.width = '50px'
//box.style.height = '50px'
//console.log(box)
//f g g#
`
//s="console.log('hi')"
    //e.buffers.open('notes.js')
    //e.templater(s)
    //await sleep(300)
    //dictation()
    //visualHandler('wd g h')
    //handleNormalMode('wo')
    //vuecmCodeRunner()
    //app.vtc.toggle()
}
