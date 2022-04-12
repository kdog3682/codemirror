function downloadLocalStorage(key) {
    const value = key ? getStorage(key) : runner()
    download('local-storage.json', value)
    function runner() {
        return JSON.stringify(localStorage)
    }
}
function download(file, content) {
    if (!exists(content)) return

    if (isJson(file)) {
        content = stringify(content)
    } else {
        switch (type(content)) {
            case 'Object':
            case 'Storage':
                content = joined(Object.values(content))
                break
            case 'Array':
                content = joined(content)
                break
        }
    }

    const element = createElement('a', {
        href: 'data:text/plain;charset=utf-8,' + encodeURIComponent(content),
        download: file,
    })

    element.click()
    element.remove()
}

function setStorage(key, value = '') {
    if (!exists(value)) return
    localStorage.setItem(key, stringify(value))
}

function getStorage(key, fallback = {}) {
    let item = localStorage.getItem(key)
    return item ? parseJSON(item) : getFallback(fallback)

    function getFallback(x) {
        if (x == null) {
            return ''
        }

        if (x == Array) {
            return []
        }

        if (x == Object) {
            return {}
        }

        if (x == String) {
            return ''
        }

        if (x == Number) {
            return 0
        }
        return x
    }
}

function getBoundingClientRect(element) {
    const { height, width, top, left } = element.getBoundingClientRect()
    return {
        height: height + 'px',
        width: width + 'px',
        left: left + 'px',
        top: top + 'px',
    }
}

function isTypable(e) {
    if (e.altKey || e.ctrlKey) return
    let s = e.key || e
    return s.length == 1 || s == ''
}

function clearStorage(key) {
    key ? delete localStorage[key] : localStorage.clear()
}

function getClipboard(s) {
    return navigator.clipboard.readText()
}

function setClipboard(s) {
    if (!exists(s)) {
        return 
    }
    console.log('setting clipboard')
    return navigator.clipboard.writeText(stringify(s))
}

function scrollToTop(element) {

    if (!element) {
        window.scrollTo(0, 0);
        return 
    }
    element.scrollTop = 0
}

function scrollToBottom(element) {
    if (!element) {
        //window.scrollTo(0, document.body.scrollHeight);
        window.scrollTo({bottom:0, behavior: 'smooth'})
        return 
    }
    //setTimeout(() => (element.scrollTop = element.scrollHeight), 100)
    element.scrollIntoView({ behavior: "smooth", block: "end" })
}

function getStylesheets() {
    function runner(sheet) {
        try {
            if (sheet.rules.length > 100) return 
            return Array.from(sheet.cssRules).map((x) => x.cssText)
        }

        catch(e) {
        return null
        }
    }
    return Array.from(document.styleSheets).map(runner).filter(exists)
}

function removeStylesheets() {
    Array.from(document.styleSheets).forEach((sheet) => {
        sheet.disabled = true
        sheet.parentNode.removeChild(sheet)
    })
}

function speak(input, rate = 1) {
    if (!exists(input)) {
        console.log('noinout')
        return
    }
    console.log(input)
    if (rate < 0.1 || rate > 1 || !isNumber(rate)) rate = 1
    isArray(input) ? (input = input.join(' ')) : input
    const utter = new SpeechSynthesisUtterance()
    utter.rate = rate
    utter.pitch = 0.9
    utter.text = input.trimStart() || 'empty'
    utter.onsuccess = function () {
        console.log('@onsuccess successful speak')
    }
    utter.onerror = function (e) {
        console.log(e.error)
        console.log('@onerror error at sp = k')
    }
    window.speechSynthesis.speak(utter)
}

function pretty(s, lang = 'js') {
    const prettierRef = {
        js: {
            parser: 'babel',
            plugins: prettierPlugins,
            arrowParens: 'always',
            bracketSpacing: true,
            printWidth: 70,
            tabWidth: 4,
            semi: false,
            singleQuote: true,
        },
        html: {
            parser: 'html',
            plugins: prettierPlugins,
        },
    }

    return prettier.format(s, prettierRef[lang || inferlang(s)])
}


function getFirstClassName(s) {
    return search(/[\w-]+/, s)
}
function getClassNames(x, mode) {
    const fn = mode == 'all' ? split : getFirstClassName

    function getter(s) {
        return findall(/class="(.+?)"/g, s)
    }
    function runner(html) {
        return unique(flat(getter(html).map((x) => fn(x))))
    }

    if (x && isElement(x)) {
        return unique(split(x.className))
    } else {
        return runner(htmlgetter(x))
    }
}

function autoScroll(e) {
    e.scrollTop = e.scrollHeight
}

function elementgetter(el) {
    console.log(el)
    if (!el) {
        return
    }
    if (isVueNode(el)) {
        return el.$el
    }

    if (isElement(el)) {
        return el
    }

    if (isString(el)) {
        const value =  document.querySelector(fixSelector(el))
        return value
    }
}

function assignStyle(el, style) {
    if (isString(style)) {
        style = cssEvaluator(style)
    }
    Object.assign(el.style, style)
}

class StorageSystem {
    constructor(key) {
        this.key = key
        const data = getStorage(key)
        this.storage = new Storage(toStorageSchema(data), { unique: true })
    }

    start(load, unload) {
        if (load) {
            load(this.storage)
        }

        const unloadFn = unload
            ? () => {
                const value = fparse(unload)
                if (value) setStorage(this.key, value)
            }
            : () => {
                if (this.key && exists(this.storage.value)) {
                    setStorage(this.key, this.storage.value)
                }
            }

        window.addEventListener('beforeunload', unloadFn)
    }

    reset() {
        this.storage.reset()
        clearStorage(this.key)
    }

    download() {
        download(this.key + '.lss.json', this.storage.value)
    }
}

function scroll(y) {
    window.scrollTo(0, y)
}

function scrollDown() {
    scroll(1000)
}

function scrollUp() {
    scroll(0)
}

function fullScreenFactory() {
    let count = 0
    let element = document.documentElement

    function openFullscreen() {
        if (element.requestFullscreen) {
            element.requestFullscreen()
        } else if (element.webkitRequestFullscreen) {
            /* Safari */
            element.webkitRequestFullscreen()
        } else if (element.msRequestFullscreen) {
            /* IE11 */
            element.msRequestFullscreen()
        }
    }

    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            /* Safari */
            document.webkitExitFullscreen()
        } else if (document.msExitFullscreen) {
            /* IE11 */
            document.msExitFullscreen()
        }
    }

    return function toggleFullScreen() {
        isEven(count++) ? openFullscreen() : closeFullscreen()
    }
}

function htmlgetter(s) {
    if (!s) {
        return document.body.innerHTML
    }
    if (isElement(s)) {
        return s.innerHTML
    }
    if (isHtml(s)) {
        return s.trim()
    }

    return elementgetter(s).innerHTML
}




function stylegetter(element, ...args) {
    const ref =window.getComputedStyle(element)
    return reduce(args, (x) => {
        const key = toDashCase(x)
        return [key, ref.getPropertyValue(key)]
    })
}
function findElementByText(query, tag = 'div') {
    var xpath = `//${tag}[text()='${query}']` 
    var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    return element
}


function initWindowErrorListener() {
    function onError(error, url, lineNumber) {
        console.log(stringify({ error: error.toString(), url, lineNumber }))
    }
    window.onerror = onError
}


function scrollIntoView(el) {
    
        if (!elementInWindow(el)) {
            el.scrollIntoView({
                block: 'center',
                behavior: 'smooth',
            })
        }
}
function elementInWindow(el) {
    if (el.getBoundingClientRect().bottom > window.innerHeight) {
        return false
    }

    if (el.getBoundingClientRect().top < 0) {
        return true
    }
}
function getElementName(el) {
    return el.className || el.tagName
}

function isHtmlElement(x) {
    return x && x.constructor && test(/^HTML.*?Element$/, x.constructor.name)
}

function animationFactory(key, start, end) {
    return function animationRunner(el, options = {}) {
        el = toElement(el)
        const delay = pop(options, 'delay')
        if (pop(options, 'invisible')) toInvisibleElement(el)
        if (!options.duration) options.duration = 1000

        if (delay) {
            return setTimeout(() => {
                return animationRunner(el, options)
            }, delay)
        }

        const frames = [{[key]: start}, {[key]: end}]
        //console.log('appearing an element', el)

        if (el.style.display == 'none') {
            el.style.display = 'block'
        }

        if (el.style.visibility == 'hidden') {
            el.style.visibility = 'visible'
        }

        el.style[key] = start
        scrollIntoView(el)

        const animation = el.animate(frames, options)
        //console.log(animation)
        //console.log(frames)
        return animation.finished.then(() => {
            el.style[key] = end
            return true
        })
    }
}



function createElement(tag = 'div', options = null, parent = document.body) {
    if (tag == 'style' || tag == 'link' || tag == 'script') {
        parent = document.head
    } 
    else if (isHtmlElement(tag)) {
        parent = tag
        tag = 'div'
        options = null
    }

    const element = document.createElement(tag)
    setAttributes(element, options)
    parent.appendChild(element)
    return element
}

function setAttributes(element, options) {
    if (options) {
        for (let [k, v] of Object.entries(options)) {
            if (v) element.setAttribute(k, v)
        }
    }
}

function cssLoader(s, el) {
    if (!exists(s)) {
        return
    }
    if (!el) {
        el = createElement('style')
    }

    const css = cssParseFromString(s)
    //console.log(css)
    el.innerHTML ?
        el.innerHTML += css :
        el.innerHTML = css

    return el
}

function addKeyListenerFactory(keypress, gn) {
    return function listener(fn) {
        return window.addEventListener(keypress, (e) => {
            if (gn) gn(e)
            fn(e.key)
        })
    }
}

const toggleFullScreen = fullScreenFactory()
const appear = animationFactory('opacity', 0, 1, 1000)
const disappear = animationFactory('opacity', 1, 0, 1000)


function isMac() {
    return typeof navigator != 'undefined'
        ? /Mac/.test(navigator.platform)
        : false
}
function toElement(el) {
    const name = el.constructor.name
    if (name == 'VNode') {
        return el.elm
    }

    if (name == 'HtmlElement') {
        return el
    }
    if (el.$el) return el.$el
    return el
}

function toInvisibleElement(el) {
    el = toElement(el)
    if (el.dataset.invisible) return 
    el.style.display = 'none'
    el.style.opacity = 0
    el.dataset.invisible = '1'
}

function checkExistingScripts() {
    return Array.from(document.getElementsByTagName('script'), (x) => tail(x.src)).filter(exists)
}

function checkExistingCss() {
    return Array.from(document.getElementsByTagName('link'), (x) => tail(x.href)).filter(exists)
}

function fileLoader(dependencies, vueComponentKey) {
    const [scriptDependencies, cssDependencies] = partitioned(dependencies, isJavascriptFile)
    const existingCss = checkExistingCss()
    //console.log(existingCss)
    const existingJs = checkExistingScripts()
    //console.log(existingJs)
    //console.log(); throw ''

    const css = unique(cssDependencies, existingCss)
    css.forEach(cssFileLoader)

    const scripts = unique(scriptDependencies, existingJs)
    //console.log(scripts); throw "";

    scripts.forEach((item, i, arr) => {
        setTimeout(() => {
            scriptFileLoader2(item)
        }, 500 * i)
        if (i == arr.length - 1) {
            setTimeout(() => {
                loadVue(vueComponentKey)
            }, 500 * i * 2)
        }
    })

    //return waterfall(scripts.map(scriptFileLoader)).then(() => {
        //loadVue(vueComponentKey)
    //})
}

function scriptFileLoader(url, i) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        const delay = globalJavascriptLibraries.includes(url) ? 
            0 : 1000 + (i * 250)
        script.src = url;
        script.defer = true
        script.async = false 
        script.charset = 'utf8'
        script.addEventListener('load', () => {
            console.log('loading file', url)
            setTimeout(resolve, delay, true)
        })
        document.head.appendChild(script);
    });
};

function loadVue(component, parent) {
    if (!component) return
    console.log('loading the vue')

    let name = 'app2'
            //let key = 'app1'
            //while (variableExists(key)) {
                //key = incrementName(key)
            //}

    const options = { id: name }
    if (!parent) parent = document.body
    else parent = elementgetter(parent)
    const div = createElement('div', options, parent)
    setTimeout(() => {
        let code = `new Vue(${component}Component).$mount('#${name}')`
        console.log(code)
        eval(`${name} = ${code}\nconsole.log(${name})`)
    }, 500)
}
function cssFileLoader(file) {
    return createElement('link', {
        rel: 'stylesheet',
        href: file,
    }, document.head)
}
function scriptLoader(scripts) {
    return waterfall(scripts.map(scriptFileLoader))
}

function loadEc(key = 'element-controller.js') {
    const componentKey = toPascal(removeExtension(key))
    let dependencies
    scriptFileLoader2('filebins.js')

    setTimeout(() => {
         dependencies = find(filebins, (bins) => bins.includes(key))
    }, 100)

    setTimeout(() => {
        fileLoader(dependencies, componentKey)
    }, 200)
}
// add this to removeCallables

function scriptFileLoader2(url) {
    console.log('loading script', url)
    return createElement('script', {
        defer: true,
        charset: 'utf8',
        src: url,
    })
};



function toggleAnimationFactory(key, value, duration = 1000) {
    return function animationRunner(el, options = {
        duration,
    }) {
        el = el ? toElement(el) : document.body

        const start = el.style[key]
        const frames = [
            {[key]: start}, {[key]: value}, {[key]: start}
        ]

        el.animate(frames, options)
        console.log('animating element', getElementName(el))
    }
}
const flash = toggleAnimationFactory('background', 'yellow', 2000)
const appearDisappear = toggleAnimationFactory('opacity', 1)
function flashWrite(...args) {

    if (typeof __el__ == 'undefined') {
        __el__ = createElement()
        
        const style = {
            zIndex: '999',
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            background: 'yellow',
            'fontSize': '24px',
            border: '2px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px',
            opacity: 0,
        }

         __caller__ = createElement(__el__)
         __value__ = createElement(__el__)

        assignStyle(__el__, style)
        assignStyle(__caller__, 'fw600 cmb7')
        assignStyle(__value__, 'fw600 cmb7')
    }

    const caller = getCaller(2)
    let value = ''
    switch (args.length) {
        case 1:
            value = `Writing: ${args[0] || 'novalue'}`
        default:
            value = args.join('  |  ')
    }
    console.log(value)

    __caller__.textContent = caller
    __value__.textContent = value
    appearDisappear(__el__)
}
const $f = debounce(flashWrite, 2000)

