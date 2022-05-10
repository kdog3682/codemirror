
function dictation() {
        //webLoader('prosemirror.js, prosemirror.css', 'prosemirror-setup.js' ).then((x) => {
        speak('starting dictation')
        app.vtc.lang = 'chinese'
        app.vtc.override = proseVoice
        console.log(app.vtc.annyang.recognition.lang)
        //e.buffers.open('notes.txt')
        //app.editor.saveState()
        //app.codemirror = false
        //console.log('um')
    //})
}
function proseVoice(s, enter) {
    console.log([s, enter])
    let cm = e.cm
    let ref = voiceToCommandLibrary
    if (s in ref) {
        return ref[s]()
    }
    if (enter) s += '\n'
    cmInsert(cm, s)
}
var visualActions = {
    'c': cmDittoBlock,
    'wd': cmDittoBlock,
    'v': cmVisualReplace,
    'cp': cmCopyBlock,
    'sub': cmSubstitute,
    'db': cmDittoBlock,
}
const visualRef = {
         'tg': [
             '<transition-group name="fade" mode="out-in">',
             '</transition-group>',
        ],
         'transition': [
             '<transition name="fade" mode="out-in">',
             '</transition>',
        ],
         'else': [ 'else {', '}'],
         'elif': [ 'else if{', '}'],
         'if': [ 'if {', '}'],
         'tc': [ 'try {', '} catch(e) {\n\t$c\n}'],
         's': [ 's = `', '`'],
         'd': [ '<div class="$c">', '</div>'],
    }
const voiceToCommandLibrary = {
    dictation,
    finished() {
        if (app.vtc.override = proseVoice) {
            app.vtc.toggle()
            //app.codemirror = true
            //app.editor.restoreState()
            download('notes.txt' + datestamp(), e.text)
            cmClear(e.cm)
            //e.js()

        }
        // pop it
        const block = popFunctionBlock()
        e.buffers.append('finished', block)
    },
    pageUp() {
        cursorDocStart(e)
    },
    pageDown() {
        cursorDocEnd()
    },
    saveAsWindowFunction() {
        app.wm.defineVariable(...getFunctionNameAndValue(e))
    },
    saveAsVoiceFunction() {
        const fn = bringToLife(getFunctionValue(e))
        app.vtc.indexTree.registerFunction(fn)
    },
    save() {
        app.config.save.location = 'voice'
            ? this.saveAsVoiceFunction()
            : this.saveAsWindowFunction()
    },
    select() {
 CodeMirrorCommands.selectParentSyntax(e.cm)
    },
    stop: (x) => (app.vtc.running = false),
    undo: () => CM['@codemirror/history']['undo'](e),
    redo: () => CM['@codemirror/history']['redo'](e),
    postJson() {
        jsonbin(e.text).then((x) => speak('posted to jsonbin'))
    },
    getJson() {
        e.download()
    },
    newPage() {
        e.buffers.open('scratch.js')
    },
    mainPage() {
        const key = getLongest(e.buffers.store)
        e.buffers.open(key)
    },
    help() {
        const self = this
        // the self inside the object is a different self
        // a massive modal
        console.log('hi from help')
        return
        app.modal({
            cssClass: 'help-modal',
            transformer: (x) => x + 'hi',
            html: true,
            component: {
                /* a one use item */
                template: `
                    names click=show 
                    for k,v in libraries
                        title(k, class=lib-title)
                        for a,b in v
                            title(a) | button(click=display)
                            paragraph(b, :style=compute(b))
                            /* the parens shows how it goes */
                `,
                data() {
                    return {
                        libraries: { self, imapdict },
                    }
                },
                methods: {
                    showNames() {
                        const currentEditorNames =
                            e.library.names
                        this.names = currentEditorNames
                    },
                },
            },
        })
        /* the ability to click the help ref */
    },
}

const jsMethodSnippets = {
   map: 'map(($child) => {\n\t$c\n})',
  'mab': "map(([a,b], i) => {\n\t$c\n})", 
   filter: 'filter(($child) => {\n\t$c\n})',
  'rab': "reduce((acc, [a,b], i) => {\n\t$c\n}, {})", 
  'rkv': "reduce((acc, [k,v], i) => {\n\t$c\n}, {})", 
  'red': "reduce((acc, item, i) => {\n\t$c\n}, {})", 
   iac: 'chicken', // doesnt work
   ts: 'toString()',
   slice: 'slice($c)',
   animate: 'animate(keyframes, options)',
   redab: 'reduce((acc, [a,b]) => {\n\t$c\n}, $ref)',
}
const jsImap = {
    '--': '_________________________',
    ret: 'return',
    oa: 'Object.assign()',
    oe: 'Object.entries()',
    ov: 'Object.values()',
    li: 'line',
    r1: 'return 1',
    foo: 'foobar',
    cl: 'console.log()',
    rt: 'return true',
}

const ExtendedCommands = {
    jsonbin() {
        jsonbin(this.buffers.toObject).then(console.log)
    },
    bigCleanup() {
        cmPretty(this.cm)
    },

    smallCleanup() {
        cmCleanupBlock(this.cm)
    },

    updateSnippets() {
        const newWords = this.buffers.sm.update()
        console.log(newWords)
        /* should be updated in the displayer */

        speak('updating snippets')
        /* the sm is stored in an obje */
    },
    /* [this] refers to app.editor */
    append(s) {
        this.appendBelow(s)
    },
    goToFunction() {
        const pos = this.pos
        console.log(pos)
    },

    copyFunction() {
        const pos = this.pos
        console.log(pos)
    },

    defineBlock() {
        const { name, text } = this.block
        app.wm.defineVariable(name, text)
    },
}


const BufferCommands = {

    loadBufferGroup(obj) {
        let lastKey
        for (let [k, v] of Object.entries(obj)) {
            lastKey = k
            if (this.has(k)) continue
            const state = this.create(name, text)
            this.set(k, state)
        }

        if (lastKey) {
            this.editor.setState(this.get(lastKey))
            this.nameIt(key)
        }
    },

    append(name, text) {
        if (this.create(name, text)) return
        const { Text } = CM['@codemirror/text']
        this.state.text.append(Text.of(text.split('\n')))
    },
    css(val) {
        this.open('styles.css', val)
    },
    js(val) {
        this.open('index.js', val)
        toggleReadOnly(-1)
    },
    html(val) {
        this.open('index.html', val)
    },
    toggle() {
        this.open(this.lastBuffer)
    },
    next() {
        console.log('nexting')
        const next = this.increment(1)
        console.log(next)
        this.open(next)
    },
    prev() {
        this.open(this.increment(-1))
    },
    mainPage() {
        const key = getLongest(this.store, (x) => {
            return x.state.doc.length
        })
        this.open(key)
    },
}

//var snippetCache = new Cache(WeakMap)
var SnippetLibrary = {
    html: {
        html: 'function ${name}(x) {\n\t${}\n}',
    },

    css: {
        css: 'function ${name}(x) {\n\t${}\n}',
    },

    js: {
        f: 'function ${name}(x) {\n\t${}\n}',
        g: 'functggggion ${name}(x) {\n\t${}\n}',
        z: 'function ${name}(x) {\n\t${}\n}',
        box: 'const box = document.querySelector("box")\n${}',
        boxes: 'const boxes = document.querySelectorAll("boxes")\n${c}',
    },
}


const firstWords = {
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
    ifew: 'if ($1.endsWith($2)) $c',
    eff: 'else if (isFunction($1)) {\n    $c\n}',
    efo: 'else if (isObject($1)) {\n    $c\n}',
    efs: 'else if (isString($1)) {\n    $c\n}',
    eft: 'else if (test($2, $1)) {\n    $c\n}',
    ifodd: 'if (isOdd($1)) {\n    $c\n}',
    for: 'for (let ${getForIterationVariable($1)} of $1) {\n    $c\n}',
    ifewn: 'if (endsWithNumber($1)) {\n    $c\n}',
    ifswn: 'if (startsWithNumber($1)) {\n    $c\n}',
    ifa1: 'if (args.length == 1) {\n    $c\n}',
    ifa2: 'if (args.length == 2) {\n    $c\n}',
    ifa3: 'if (args.length == 3) {\n    $c\n}',
    ifa4: 'if (args.length == 4) {\n    $c\n}',

    ifal1: 'if (arguments.length == 1) {\n    $c\n}',
    ifal2: 'if (arguments.length == 2) {\n    $c\n}',
    ifal3: 'if (arguments.length == 3) {\n    $c\n}',
    ifal4: 'if (arguments.length == 4) {\n    $c\n}',
    forii: 'for (;;) {\n    $c\n}',
    forij: 'for (let i = 1; i < $1; i++) {\n    for (let j = 1; j < placeholder; j++) {\n        $c\n    }\n}',
    forir: 'for (let i = $1; i >= 1; i--) {\n    $c\n}',
    fore: 'for (let i = 1; i < $1.length; i++) {\n    let ${$1[:-2]} = $1[i]\n    $c\n    if (i == $1.length - 1) {\n        \n    }\n}',
    fe: 'for (let i = 1; i < $1.length; i++) {\n    let ${$1[:-2]} = $1[i]\n    $c\n    if (i == $1.length - 1) {\n        \n    }\n}',
    fori: 'for (let i = 0; i < ${forToNumber($1)}; i++) {\n    $c\n}',
    fi: 'for (let i = 0; i < ${forToNumber($1)}; i++) {\n    $c\n}',
    forj: 'for (let j = 0; j < $1; j++) {\n    $c\n}',
    fork: 'for (let key of Object.keys($1)) {\n    $c\n}',
    forv: 'for (let key of Object.keys($1)) {\n    $c\n}',
    ifnest: 'if (isNestedArray($1)) $c',
    forab: 'for (let [a, b] of $1) {\n    $c\n}',
    forkv: 'for (let [k, v] of Object.entries($1)) {\n    $c\n}',
    efa: 'else if (isArray($1)) {\n    $c\n}',
    efn: 'else if ($1 == null) {\n    $c\n}',
    try: 'try {\n\t$c\n}\ncatch(e) {\nconsole.log(e)\n}',
}


const cssPropertyNames = [
    'align-content',
    'align-items',
    'align-self',
    'all',
    'animation-delay',
    'animation-direction',
    'animation-duration',
    'animation-iteration-count',
    'animation-name',
    'background-clip',
    'background-origin',
    'background-size',
    'background',
    'box-shadow',
    'box-sizing',
    'column-count',
    'column-fill',
    'column-gap',
    'columns',
    'flex-basis',
    'flex-direction',
    'flex-flow',
    'flex-grow',
    'flex-shrink',
    'flex-wrap',
    'flex',
    'opacity',
    'order',
    'outline-offset',
    'overflow-x',
    'overflow-y',
    'perspective',
    'pointer-events',
    'resize',
    'row-gap',
    'tab-size',
    'text-align-last',
    'text-decoration-color',
    'text-decoration-line',
    'text-decoration-style',
    'text-overflow',
    'text-shadow',
    'transition',
    'word-break',
    'word-wrap',
    'background-attachment',
    'background-blend-mode',
    'background-color',
    'background-image',
    'background-position',
    'background-repeat',
    'clear',
    'cursor',
    'display',
    'float',
    'position',
    'visibility',
    'content',
    'counter-increment',
    'counter-reset',
    'quotes',
    'list-style-image',
    'list-style-position',
    'list-style-type',
    'mix-blend-mode',
    'outline-color',
    'outline-style',
    'outline-width',
    'outline',
    'clip',
    'overflow',
    'page-break-after',
    'page-break-before',
    'page-break-inside',
    'color',
    'direction',
    'letter-spacing',
    'text-align',
    'text-indent',
    'text-transform',
    'unicode-bidi',
    'white-space',
    'word-spacing',
]

const cssPropertyValueRef = {
    'align-content': [
        'space-between',
        'space-around',
        'stretch',
        'center',
        'flex-start',
        'flex-end',
    ],
    'align-items': [
        'flex-start',
        'center',
        'stretch',
        'flex-end',
        'baseline',
    ],
    'align-self': [
        'stretch',
        'center',
        'flex-start',
        'flex-end',
        'baseline',
    ],
    'all': [
        'unset',
    ],
    'animation-delay': [
        'time',
    ],
    'animation-direction': [
        'alternate',
        'reverse',
        'normal',
        'alternate-reverse',
    ],
    'animation-duration': [
        'time',
    ],
    'animation-iteration-count': [
        'number',
        'infinite',
    ],
    'animation-name': [
        'none',
        'keyframename',
    ],
    'animation-play-state': [
        'paused',
        'running',
    ],
    'animation-timing-function': [
        'ease-in',
        'ease-in-out',
        'step-start',
        'step-end',
        'start',
        'end',
        'linear',
        'int',
        'ease',
        'cubic-bezier',
        'ease-out',
        'steps',
    ],
    'background-clip': [
        'padding-box',
        'border-box',
        'content-box',
    ],
    'background-origin': [
        'padding-box',
        'border-box',
        'content-box',
    ],
    'background-size': [
        'contain',
        'length',
        'cover',
    ],
    'background': [
    ],
    'box-decoration-break': [
        'clone',
        'slice',
        'unset',
    ],
    'box-shadow': [
        'inset',
        'spread',
        'h-offset',
        'blur',
        'none',
        'v-offset',
        'color',
    ],
    'box-sizing': [
        'border-box',
        'content-box',
    ],
    'column-count': [
        'number',
    ],
    'column-fill': [
        'balance',
    ],
    'column-gap': [
        'length',
        'normal',
    ],
    'column-rule-color': [
        'color',
    ],
    'column-rule-style': [
        'outset',
        'ridge',
        'solid',
        'inset',
        'hidden',
        'dotted',
        'none',
        'dashed',
        'groove',
        'double',
    ],
    'column-rule-width': [
        'medium',
        'thin',
        'length',
        'thick',
    ],
    'column-rule': [
        'column-rule-style',
        'column-rule-width',
        'column-rule-color',
    ],
    'column-span': [
        'none',
        'all',
    ],
    'column-width': [
        'length',
    ],
    'columns': [
        'column-count',
        'column-width',
    ],
    'flex-basis': [
        'number',
    ],
    'flex-direction': [
        'row',
        'row-reverse',
        'column',
        'column-reverse',
    ],
    'flex-flow': [
        'flex-wrap',
        'flex-direction',
    ],
    'flex-grow': [
        'number',
    ],
    'flex-shrink': [
        'number',
    ],
    'flex-wrap': [
        'wrap-reverse',
        'nowrap',
        'wrap',
    ],
    'flex': [
        'flex-grow',
        'flex-shrink',
        'flex-basis',
    ],
    'font-variant-caps': [
        'small-caps',
        'all-petite-caps',
        'normal',
        'petite-caps',
        'unset',
        'unicase',
        'titling-caps',
        'all-small-caps',
    ],
    'opacity': [
        'number',
    ],
    'order': [
        'number',
    ],
    'outline-offset': [
        'length',
    ],
    'overflow-x': [
        'visible',
        'scroll',
        'hidden',
    ],
    'overflow-y': [
        'visible',
        'scroll',
        'hidden',
    ],
    'perspective-origin': [
        'x-axis',
        'y-axis',
    ],
    'perspective': [
        'none',
        'length',
    ],
    'pointer-events': [
        'none',
    ],
    'resize': [
        'vertical',
        'horizontal',
        'none',
        'both',
    ],
    'row-gap': [
        'length',
        'normal',
    ],
    'tab-size': [
        'number',
        'length',
    ],
    'text-align-last': [
        'justify',
        'left',
        'start',
        'end',
        'right',
        'center',
    ],
    'text-decoration-color': [
        'color',
    ],
    'text-decoration-line': [
        'none',
        'overline',
        'line-through',
        'underline',
    ],
    'text-decoration-style': [
        'wavy',
        'double',
        'solid',
        'dashed',
        'dotted',
    ],
    'text-overflow': [
        'ellipsis',
        'string',
        'clip',
    ],
    'text-shadow': [
        'none',
        'color',
        'h-shadow',
        'v-shadow',
        'blur-radius',
    ],
    'transform-origin': [
        'x-axis',
        'z-axis',
        'y-axis',
    ],
    'transform-style': [
        'preserve-3d',
        'flat',
    ],
    'transition-delay': [
        'time',
    ],
    'transition-property': [
        'none',
        'property',
        'all',
    ],
    'transition-timing-function': [
        'ease-in',
        'ease-in-out',
        'step-start',
        'step-end',
        'start',
        'end',
        'linear',
        'int',
        'ease',
        'cubic-bezier',
        'ease-out',
        'steps',
    ],
    'word-break': [
        'keep-all',
        'break-all',
        'break-word',
        'normal',
    ],
    'word-wrap': [
        'break-word',
        'normal',
    ],
    'writing-mode': [
        'vertical-rl',
        'vertical-lr',
        'horizontal-tb',
    ],
    'background-attachment': [
        'local',
        'scroll',
        'fixed',
    ],
    'background-blend-mode': [
        'color-dodge',
        'darken',
        'screen',
        'multiply',
        'normal',
        'lighten',
        'overlay',
        'luminosity',
        'color',
        'saturation',
    ],
    'background-color': [
        'color',
        'transparent',
    ],
    'background-image': [
        'none',
        'url',
    ],
    'background-position': [
        'value',
    ],
    'background-repeat': [
        'repeat-x',
        'repeat',
        'no-repeat',
        'repeat-y',
    ],
    'border-bottom': [
        'border-style',
        'border-color',
        'border-width',
    ],
    'border-bottom-color': [
        'color',
        'transparent',
    ],
    'border-bottom-style': [
        'outset',
        'ridge',
        'solid',
        'inset',
        'hidden',
        'dotted',
        'none',
        'dashed',
        'groove',
        'double',
    ],
    'border-bottom-width': [
        'medium',
        'thin',
        'length',
        'thick',
    ],
    'border-collapse': [
        'separate',
        'collapse',
    ],
    'border-color': [
        'color',
        'transparent',
    ],
    'border-left': [
        'border-style',
        'border-color',
        'border-width',
    ],
    'border-left-color': [
        'color',
        'transparent',
    ],
    'border-left-style': [
        'outset',
        'ridge',
        'solid',
        'inset',
        'hidden',
        'dotted',
        'none',
        'dashed',
        'groove',
        'double',
    ],
    'border-left-width': [
        'medium',
        'thin',
        'length',
        'thick',
    ],
    'border-right': [
        'border-style',
        'border-color',
        'border-width',
    ],
    'border-right-color': [
        'color',
        'transparent',
    ],
    'border-right-style': [
        'outset',
        'ridge',
        'solid',
        'inset',
        'hidden',
        'dotted',
        'none',
        'dashed',
        'groove',
        'double',
    ],
    'border-right-width': [
        'medium',
        'thin',
        'length',
        'thick',
    ],
    'border-spacing': [
        'length',
    ],
    'border-style': [
        'outset',
        'ridge',
        'solid',
        'inset',
        'hidden',
        'dotted',
        'none',
        'dashed',
        'groove',
        'double',
    ],
    'border-top': [
        'border-style',
        'border-color',
        'border-width',
    ],
    'border-top-color': [
        'color',
        'transparent',
    ],
    'border-top-style': [
        'outset',
        'ridge',
        'solid',
        'inset',
        'hidden',
        'dotted',
        'none',
        'dashed',
        'groove',
        'double',
    ],
    'border-top-width': [
        'medium',
        'thin',
        'length',
        'thick',
    ],
    'border-width': [
        'medium',
        'thin',
        'length',
        'thick',
    ],
    'border': [
        'border-style',
        'border-color',
        'border-width',
    ],
    'clear': [
        'none',
        'right',
        'left',
        'both',
    ],
    'cursor': [
        'value',
    ],
    'display': [
        'value',
    ],
    'float': [
        'none',
        'right',
        'left',
    ],
    'position': [
        'sticky',
        'absolute',
        'relative',
        'static',
        'fixed',
    ],
    'visibility': [
        'visible',
        'collapse',
        'hidden',
    ],
    'height': [
        'length',
    ],
    'line-height': [
        'number',
        'length',
        'normal',
    ],
    'max-height': [
        'none',
        'length',
    ],
    'max-width': [
        'none',
        'length',
    ],
    'min-height': [
        'length',
    ],
    'min-width': [
        'length',
    ],
    'width': [
        'value',
    ],
    'font-family': [
        'family-name',
        'generic-family',
    ],
    'font-size': [
        'large',
        'medium',
        'larger',
        'length',
        'smaller',
        'small',
    ],
    'font-style': [
        'oblique',
        'italic',
        'normal',
    ],
    'font-variant': [
        'small-caps',
        'normal',
    ],
    'font': [
        'small-caption',
        'icon',
        'font-style',
        'font-family',
        'font-weight',
        'caption',
        'line-height',
        'message-box',
        'font-size',
        'status-bar',
        'font-variant',
        'menu',
    ],
    'font-weight': [
        'lighter',
        'bolder',
        'bold',
        'normal',
        'number',
    ],
    'content': [
        'string',
        'normal',
        'none',
        'attr',
        'close-quote',
        'url',
        'counter',
        'no-open-quote',
        'no-close-quote',
        'open-quote',
    ],
    'counter-increment': [
        'none',
    ],
    'counter-reset': [
        'none',
        'number',
        'name',
    ],
    'quotes': [
        'none',
        'string',
    ],
    'list-style-image': [
        'none',
        'url',
    ],
    'list-style-position': [
        'outside',
        'inside',
    ],
    'list-style-type': [
        'value',
    ],
    'margin-bottom': [
        'length',
    ],
    'margin-left': [
        'length',
    ],
    'margin-right': [
        'length',
    ],
    'margin-top': [
        'length',
    ],
    'mix-blend-mode': [
        'color-dodge',
        'darken',
        'screen',
        'multiply',
        'normal',
        'lighten',
        'overlay',
        'luminosity',
        'color-burn',
        'color',
        'difference',
        'hue',
        'saturation',
        'exclusion',
    ],
    'outline-color': [
        'invert',
        'color',
    ],
    'outline-style': [
        'outset',
        'ridge',
        'solid',
        'inset',
        'hidden',
        'dotted',
        'none',
        'dashed',
        'groove',
        'double',
    ],
    'outline-width': [
        'medium',
        'thin',
        'length',
        'thick',
    ],
    'outline': [
        'outline-style',
        'outline-width',
        'outline-color',
    ],
    'padding-bottom': [
        'length',
    ],
    'padding-left': [
        'length',
    ],
    'padding-right': [
        'length',
    ],
    'padding-top': [
        'length',
    ],
    'clip': [
        'shape',
    ],
    'overflow': [
        'visible',
        'scroll',
        'hidden',
        'clip',
    ],
    'z-index': [
        'number',
    ],
    'page-break-after': [
        'right',
        'left',
        'avoid',
        'always',
    ],
    'page-break-before': [
        'right',
        'left',
        'avoid',
        'always',
    ],
    'page-break-inside': [
        'avoid',
    ],
    'caption-side': [
        'bottom',
        'top',
    ],
    'table-layout': [
        'fixed',
    ],
    'color': [
        'color',
    ],
    'direction': [
        'ltr',
        'rtl',
    ],
    'letter-spacing': [
        'length',
        'normal',
    ],
    'text-align': [
        'justify',
        'right',
        'left',
        'center',
    ],
    'text-indent': [
        'length',
    ],
    'text-transform': [
        'capitalize',
        'none',
        'lowercase',
        'uppercase',
    ],
    'unicode-bidi': [
        'embed',
        'bidi-override',
        'normal',
    ],
    'white-space': [
        'pre',
        'nowrap',
        'pre-line',
        'pre-wrap',
        'normal',
    ],
    'word-spacing': [
        'length',
        'normal',
    ],
}



const VimKeyBindingRef = {

    dc() {
        console.log('a vim key binding activation')
        const text = e.buffers.getString('styles.css')
        download('styles.css', text)
        return 2
    },
    os() {
        console.log('override snippet')
        const sm = e.buffers.sm
        sm.history = sm.snippets
        sm.override = 1
        const keys = filterObject(window, (k,v) => {
          return typeof v == 'function' && 
            v.toString().length < 250
        }, 'keys')
        sm.snippets = SnippetManager.toSnippets(keys)
        return 2
    },
    rs() {
        const sm = e.buffers.sm
        if (sm.history) sm.snippets = sm.history
        sm.override = 0
            return 2
    },

    [':css']() {
        e.buffers.update()
        const text = e.buffers.getString('styles.css')
        e.stylesheet.set(text)
    },

    ['=']() {
        e.buffers.next()
    },
    Ctrlo() {
        const data = e._store
        e.loadBufferGroup(data)
    },

    Ctrls() {
        /* saveBufferGroup */
        e.upload()
    },

    CtrlS() {
        console.log('tojson')
        e.jsonbin()
    },

    fs() {
        console.log('hi from fs')
        toggleFullScreen()
    },
    h() {
        console.log('going to html')
        e.html()
    },
    c() {
        e.css()
    },
    //d() {
        //cmDeleteLine(e.cm)
        //CodeMirrorCommands.deleteLine(e.cm)
    //},

    j() {
        e.js()
    },

    d0() {
        app.config.delay = null
        speak('setting config delay to null')
    },
    d5() {
        app.config.delay = 5
        speak('setting config delay to 5')
    },
}


const baseTreeCommands = {
    wk(cm) {
        cmCreateKeyFrames(cm)
    },

    wd(cm) {
        cmCreateDitto(cm)
    },
}

const _normalRef = {
    voice() {
        app.vtc.toggle()
    },
    deleteToStart(cm, f) {
        return cmReplace(cm, cmLine, getTabs)
    },
    quotifyTheLine(cm, f) {
        
    },
    clearAllBuffers() {
        e.buffers.store = {}
        e.editor.setState(e.buffers.currentBuffer, e.buffers.create(''))
    },
    mode(_, __, s) {
        e.editor.mode = s
        speak('setting mode ' + s)
    },

    xx() {
        //console.log('hi')
        //console.log(getConstructorName(e.cm))
        cmClear(e.cm)
    },
}
const globalNormalRefs = abbreviateObject(_normalRef)
const normalRef = {
    global: globalNormalRefs,
    css: {},
    js: {
        wa(cm) {
            cmCreateArray(e.cm)
        },
        wo(cm) {
            cmCreateObject(e.cm)
        },
    },
    html: {},
}

//what scares me
//driving at night
//making mistakes
//dark alleyways at night
//losing iphone
//asking for things




const jsTreeCommands = {
    /* iab function  call */
    zu(cm, f, line, spaces) {
        cmCommonDispatch(cm, line.from - 1, ' '.repeat(spaces))
    },
    zd(cm, f, line, spaces) {
        CodeMirrorCommands.insertBlankLine(cm)
    },

    wv(cm) {
        cmCreateVue(cm)
    },
    wc(cm) {
        cmCreateClass(cm)
    },
    wf(cm) {
        cmCreateFunction(cm)
    },
}

function cmTemplaterFactory(obj) {
    return reduceObject(obj, (k, template) => {
        return function lambda(cm, f) {
            const line = cmLine(cm, f)
            const args = {'c': '$c'}
            if (template.includes('$line')) {
                args.line = line.text
            }

            template = spicyTemplater(template, args)
            cmDollar(cm, line, template)
            return 1

        }
    })
}
const cssTreeCommands = {
    ...cmTemplaterFactory({
        wf: '${fixSelector($line)} {\n\t$c\n}\n'
    }),
}

