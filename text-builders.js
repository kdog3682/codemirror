
// should wrap the item ...
// give things away ... 
// but im not ... 
// collecting data ... allows future intuition

const legoScripts = ['utils.js', 'browser.js', 'assets.js', 'stylesheet.js', 'color-utils.js', 'css-utils.js', 'ec.js', 'lego.js']
const apple = "apple-touch-icon.png"
const thirtytwo = "favicon-16x16.png"
const sixteen = "favicon-32x32.png"
const googleFontLinks = `
<!-- Google web fonts for "The Astronomer" -->
<link href='https://fonts.googleapis.com/css?family=Megrim|Roboto+Slab:300' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The River" -->
<link href='https://fonts.googleapis.com/css?family=Open+Sans:800|Gentium+Basic:400,400italic' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Crow and the Pitcher" -->
<link href='https://fonts.googleapis.com/css?family=Questrial|Old+Standard+TT:400,400italic,700' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Fox and the Grapes" -->
<link href='https://fonts.googleapis.com/css?family=Ovo|Muli:300' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Moon and Her Mother: Anon03" -->
<link href='https://fonts.googleapis.com/css?family=Playfair+Display:400,700,900,400italic,700italic,900italic|Vast+Shadow|Oswald:300|Playfair+Display+SC' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Prophet" -->
<link href='https://fonts.googleapis.com/css?family=Neuton:300' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The wolves, the sheep, and the ram" -->
<link href='https://fonts.googleapis.com/css?family=Quattrocento|Fanwood+Text' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "Hercules and the Waggoner" -->
<link href="https://fonts.googleapis.com/css?family=Exo+2:100,400|Inknut+Antiqua:900" rel="stylesheet">

<!-- Google web fonts for "The Boy Bathing" -->
<link href='https://fonts.googleapis.com/css?family=Quando|Judson|Montserrat:700' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Serpent and The Eagle  " -->
<link href='https://fonts.googleapis.com/css?family=Vollkorn:700italic,700|Exo:400,400italic' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Fir-Tree" -->
<link href='https://fonts.googleapis.com/css?family=Stint+Ultra+Expanded|Slabo+13px|Ultra' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The fox and the lion" -->
<link href='https://fonts.googleapis.com/css?family=Open+Sans+Condensed:700|Lora:400italic' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Horse and the Groom" -->
<link href='https://fonts.googleapis.com/css?family=Alfa+Slab+One|Gentium+Book+Basic:400,400italic' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Crow and The Raven" -->
<link href='https://fonts.googleapis.com/css?family=Nixie+One|Libre+Baskerville' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The North Wind and The Sun" -->
<link href='https://fonts.googleapis.com/css?family=Julius+Sans+One|Crimson+Text:400,400italic' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Old Hound" -->
<link href='https://fonts.googleapis.com/css?family=Almendra+Display|Cardo' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "Jupiter And The Tortoise" -->
<link href='https://fonts.googleapis.com/css?family=Philosopher' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "Grief and His Due" -->
<link href='https://fonts.googleapis.com/css?family=Cinzel+Decorative:400,700|Amiri' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Trees And The Axe" -->
<link href='https://fonts.googleapis.com/css?family=Oswald:400' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Bee and Jupiter" -->
<link href='https://fonts.googleapis.com/css?family=Yeseva+One|Merriweather+Sans:300|Merriweather:400italic' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "The Pomegranate, the Apple-Tree, and the Bramble" -->
<link href='https://fonts.googleapis.com/css?family=Mr+De+Haviland|Neuton:200,700,400italic' rel='stylesheet' type='text/css'>

<!-- Google web fonts for "Wolf in Sheep's Clothing" -->
<link href="https://fonts.googleapis.com/css?family=Scope+One|Shrikhand|Sansita+One" rel="stylesheet">

<!-- Google web fonts for The Butcher and his Customers -->
<link href="https://fonts.googleapis.com/css?family=Chonburi|Fjord+One|BioRhyme|Lemon" rel="stylesheet">

<!-- Google web fonts for The Eagle and The Cocks -->
<link href="https://fonts.googleapis.com/css?family=Poppins:400,700|Halant:300" rel="stylesheet">

`

const favicons = `<link rel="apple-touch-icon" sizes="180x180" href="${apple}">\n<link rel="icon" type="image/png" sizes="32x32" href="${thirtytwo}">\n<link rel="icon" type="image/png" sizes="16x16" href="${sixteen}">`
const metaStatements = `<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="$description">
<meta name="author" content="$author">
<meta name="viewport" content="width=device-width, initial-scale=1">`
//<link rel="manifest" href="/site.webmanifest">


const globalBaseDependencies = [
    'utils.js',
    'browser.js',
    'normalize.css',
    'new.css',
]
const vueScripts = [
    'vue.js',
    'vue-utils.js',
]

const globalJavascriptLibraries = [
    'vue.js',
    'vuex.min.js',
    'socket.io.js',
    'codemirror.js',
    'katex.min.js',
    'nerdamer.js',
    'jquery.min.js',
    'mathquill.min.js',
]


function textBuilderFactory(template, config, options) {
    function reducer(k, v) {
        if (!v) return null
        if (HTMLDefaultBuilderConfig[k]) {
            return [k, HTMLDefaultBuilderConfig[k](v)]
        }
        return config[k] ? [k, config[k](v)] : [k, v]
    }

    let lastRef
    let base = smartDedent(template || config.template)

    return function builder(obj, config, injectObject) {
        //return obj
        //console.log(obj)
        //console.log('before')
        if (config) {
            options = Object.assign({}, options, config)
        }

        if (obj.hasOwnProperty('legos')) {
            options.legos = obj.legos
            options.writeMetaInfo = false
            options.useGoogleFonts = false
            options.useFavicons = false
        }
       

        if (obj['index.js']) obj.js = obj['index.js']
        if (obj['styles.css']) obj.css = obj['styles.css']
        if (obj['index.html']) obj.html = obj['index.html']

        if (injectObject && lastRef && options.useCache) {
            mergeOnTop(lastRef, reduce(injectObject, reducer))
            return builderTemplater(base, lastRef)
        }

        if (
            obj.js && 
            options.useCache &&
            lastRef &&
            isSimilar(obj.js, lastRef.js)
        ) {
            lastRef.js = obj.js
            console.log('returning cache value')
            const value =  builderTemplater(base, lastRef)
            return value
        }

        if (options.saveLastElement && obj.lastElementName) {
            obj.lastElementName = 'let lastElementName = ' + singlequote(obj.lastElementName)
        }

        if (options.baseDependencies) {
            const baseDependencies = (obj.vuejs || obj.js) ? options.baseDependencies : options.baseDependencies.filter(isCssFile)
            addProperty(
                obj,
                'baseDependencies',
                baseDependencies
            )
            //console.log(obj); throw ''
        }

        if (options.inferScripts && (obj.vuejs || obj.js)) {
            obj.js ? 
                mergeOnTop(obj, inferScripts(obj.js)) :
                mergeOnTop(obj, inferScripts(obj.vuejs))
        }

        if (options.windowErrorListener) {
            obj.windowErrorListener = true
        }

        /* most times it will be triggered */
        else if (obj.vuejs || (obj.js && test(/^\s*app/m, obj.js) || options.implicitVue && !obj.html && !obj.body)) {
            obj.baseDependencies.push(...vueScripts)
            obj.vueBody = true
        }

        if (options.useFonts) {
            obj.fonts = ''
            /*  */
            /* in progress */
        }

        if (options.writeMetaInfo) {
            obj.meta = metaStatements
        }

        if (options.useGoogleFonts) {
            obj.googleFonts = googleFontLinks
        }

        if (options.useFavicons) {
            obj.favicons = favicons
        }

        if (options.legos) {
            console.log('yes legos')
            mergeOnTop(obj, {
                scripts: legoScripts.filter(notIn(obj.baseDependencies)),
                baseDependencies: ['ec2.css']
            })
            //throw JSON.stringify(obj, null, 2)
        }

        if (!(obj.vuejs || obj.js) && obj.dependencies) {
            obj.dependencies = []
        }
        const ref = reduce(obj, reducer)
        
        for (let dep of ref.dependencies || []) {
            if (ref.baseDependencies.includes(dep)) {
                pop(ref.dependencies, dep)
            }
        }

        lastRef = ref
        let value = builderTemplater(base, ref)
        value = cleanupHtml(value)

        if (options.htmlTimestamp) {
            value = jspy('html', 'comment', timestamp())
            + '\n' + value
        }

        if (options.popup) {
            popupPre(value)
        }

        if (options.logger) {
            console.log(value)
        }

        if (options.debugger) {
            console.log({value})
            throw ''
        }
        return value 
    }
}

function builderTemplater(s, ref) {
    const regex = '\\n( *)\\$(\\w+)'
    const parser = (_, spaces, key) => {
        let value = ref[key]
        if (exists(value)) {
            if (isArray(value)) {
                value = join(value)
            }
            return '\n' + indent(value, spaces)
        }
        return ''
    }
    return s.replace(RegExp(regex, 'g'), parser)
}

const HTMLBuilderTemplate = `
    <!DOCTYPE html><html lang="en">
        <head>
            $favicons
            $fonts
            $googleFonts
            $baseDependencies
            $dependencies
            <style>
                $styles
                $css
            </style>
        </head>

        <body>
            $html
            $body
            $vueBody
        </body>

        $scripts

        <script>
            $windowErrorListener
            $vueDirectives
            $lastElementName
            $script
            $js
            $vuejs
        </script>
    <html>
`

const HTMLDefaultBuilderConfig = {
    scripts: dependencyLoader,
    dependencies: dependencyLoader,
    baseDependencies: dependencyLoader,
}

function htmlDependencyLoader(s) {
    let e = getExtension(s)
    if (e == 'js') {
        return `<script charset="utf8" src="${s}"></script>`
    }
    if (e == 'css') {
        return `<link rel="stylesheet" href="${s}"/>`
    }
}

function browserCssParser(s) {
    return addCssImports(s)
    //return cssParseFromString(s)
}
function browserHtmlParser(s) {
    return toVueHtml(s)
}

const globalInferenceTable = [
    /mathquill/i,
    ['jquery.min.js', 'mathquill.min.js'],
    null,

    /app\d* =/i,
    ['vue.js'],
    null,

    /vuex/i,
    ['vuex.min.js', 'store.js'],
    null,

    /\b(?:cm|view)\b|codemirror/i,
    ['codemirror.js'],
    null,

    /nerd/i,
    ['nerdamer.js'],
    null,

    /pretty/i,
    [
        'standalone.min.js',
        'parser-html.min.js',
        'parser-babel.js',
    ],
    null,

    /file-?reader/i,
    ['vue-file-reader.js'],
    null,

    /keylistener/i,
    ['key-listener.js'],
    null,

    /jspdf|pdfgen/i,
    ['jspdf.min.js'],
    null,

    /jsx|jxg?/i,
    [
        'math-utils.js',
        'jsxgraph-utils.js',
        'jsxgraphcore.js',
        'jsxgraph.css',
    ],
    null,

    /katex/,
    ['katex.min.js', 'katex.min.css'],
    'VueKatexDirective',
]
function dependencyLoader(items) {
    items = toArray(items)
    const sort = (x) => {
        if (isLink(x)) {
            return true
        }
        return getExtension(x) == 'js' ? 2 : 3
    }
    sorted(items, sort)
    return unique(items).map(htmlDependencyLoader)
}

function inferScripts(s) {
    const inferences = partition(globalInferenceTable, 3)
    const baseDependencies = []
    const vueDirectives = []

    for (let [a, b, c] of inferences) {
        if (a.test(s)) {
            if (b) push(baseDependencies, b)
            if (c) push(vueDirectives, c)
           
        }
    }
    return {
        baseDependencies,
        vueDirectives,
    }
}

const vuecmIframeConfig = {
    html: browserHtmlParser,
    css: browserCssParser,
    //vuejs(s) {
        //let name = getBindingName(s)
        //return s + '\n\n' + callVue(name)
    //},
    vueBody() {
        return '<div id="app100"></div>'
    },
    js(s) {
        if (test(/^await/m, s)) {
            return lambdaAsyncify(s)
        }
        return s
    },
    windowErrorListener(bool) {
        return 
        if (!bool) return 
        let s = 'window.onerror = windowErrorListener'
        s += '\n'
        s += 'Vue.config.errorHandler = vueErrorListener'
        s += '\n'
        return s
    },
    vueDirectives(directives) {
        return directives.map((x) => `vuetify(${x})`)
    },
}

const htmlBuilderExtraOptions = {
    inferScripts: true,
    baseDependencies: globalBaseDependencies,
    useCache: true,
    windowErrorListener: true,
    implicitVue: true,
    turnOffVueConfig: true,
    saveLastElement: true,
    preview: true,
    legos: true,
    useFavicons: true,
    useFonts: false,
    htmlTimestamp: true,
    //useFavicons: true,
    //writeMetaInfo: true,
    //useGoogleFonts: true,
    //debugger: true,
    //popup: true,
    ///* doesnt work */
    logger: true,
}
const htmlBuilder = new textBuilderFactory(
    HTMLBuilderTemplate,
    vuecmIframeConfig,
    htmlBuilderExtraOptions
)


//console.log(htmlBuilder({vue:  'zoo', js: '', dependencies: ['v.js', 'vue.js', 'z.js', 'c.js', 's.css', 'v.js', 'https://f.js']}))
