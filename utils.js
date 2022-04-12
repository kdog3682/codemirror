
const globalJavascriptLibraries = [
    "vue.js",
    "socket.io.js",
    "codemirror.js",
    "katex.min.js",
    "vuex.min.js",
    "nerdamer.js",
    "jquery.min.js",
    "mathquill.min.js",
]

const highFrequencyJavascriptUtilities = [
    "vue.js",

    "vuex.min.js",
    "vuestore.js",

    "utils.js",
    "browser.js",
    "vue-utils.js",
    "normalize.css",
]


original = console.log
const doglog = dogLogFactory()
function pairlog(a, b) {
    //const [name, lineNumber] = getStackInfo()
    //const info = name + ': ' + lineNumber
    const Reset = '\x1b[0m'
    const Bright = '\x1b[1m'
    const Green = '\x1b[32m'
    const Blue ='\x1b[34m'
    const Red = '\x1b[31m'
    original(Bright + Red + a + Reset, b)
}
function dogLogFactory() {

    const Reset = '\x1b[0m'
    const Bright = '\x1b[1m'
    const Red = '\x1b[31m'
    const Green = '\x1b[32m'
    const Blue ='\x1b[34m'

    function info() {
        const [name, lineNumber] = getStackInfo()
        return name + ': ' + lineNumber
    }

    let count = 1

    return function lambdaDisplay(...args) {
        let message = `   [count ${count++}]`
        original(Bright + Red + info() + Blue + message + Reset, ...args)
    }
}

const WordToNumberDictionary = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
    hundred: 100,
    thousand: 1000,
    oneThousand: 1000,
    nineThousand: 9000,
    million: 1000000,
    billion: 1000000000,
    trillion: 1000000000000,
}
//const getFunctionInfo = trace(getFunctionInfo2)
function trace(fn) {
    return function lambda(...args) {
        try {
            return fn(...args)
        }
        catch(e) {
            console.log({e, args})
            throw 'trace error'
        }
    }
}
function getFunctionInfo(s) {
    s = s.toString().trim()
    let type = getFirstWord(s)
    let parameters
    let methods
    let returnValues

    let name = getFunctionName(s)
    if (!name) return
    if (test(/^[A-Z]\w*?Component$/, name)) type = 'component'

    switch (type) {
        case 'component':
        case 'function':
        case 'class':
            break
        case 'var':
        case 'const':
            type = 'variable'
            break
        case 'async':
            type = 'function'
            break
        case 'if':
        case 'for':
        case 'while':
        case 'let':
            return
        default:
            return
    }

    if (type == 'function') {
        parameters = getParameters(s)
        returnValues = findall(/return (\w+) *$/gm, s)
    }

    if (type == 'class') {
        methods = getClassMethods(s)
    }

    return {
        body: s,
        name,
        type,
        methods,
        parameters,
        returnValues,
    }
}
var dog = display

function display(s, b) {

const Reset = '\x1b[0m'
const Bright = '\x1b[1m'
const Red = '\x1b[31m'
const Green = '\x1b[32m'
const Yellow= '\x1b[33m'
const Blue ='\x1b[34m'
const Magenta = '\x1b[35m'

    function info() {
        const [name, lineNumber] = getStackInfo()
        return name + ': ' + lineNumber
    }

    if (b) {
        original(Bright + Red + info(), Blue, s, Reset, b)
        return 
    }
    if (isString(s)) {
        
    if (test(/^\//, s)) {
        s = s.slice(1)
        const name = `[${s}]`
        original(Bright + Red + info() + Blue + name + Reset + puppetStringify(eval(s)))
    }
        else if (hasNewline(s)) {
        original(Bright + Red + info() + Reset, s, '------------------')
        }
        else {
        original(Bright + Red + info() + Reset, s)
        }
    }
    else if (s) {
        if (isVue(s)) {
            return JSON.stringify(getClassProperties(s))
        }

        else if (isClass(s)) {
            return JSON.stringify(getClassProperties(s))
        }
        else {
        original(Bright + Red + info() + Reset, s)
        }
    }

    else {
        original(Bright + Red + info() + Reset)
    }
}

if (typeof window !== 'undefined') {
    module = {}
    module.exports = {}
    require = () => ({})
} else {
    //window={
    //addEventListener: () => ({}),
    //addEventListener: () => ({}),
    //}
    localStorage = {
        setItem: (a, b) => {
            this.store = {}
        },
        getItem: (a) => ({}),
        store: {},
    }
}

function noop() {
    return
}
function isUrl(s) {
    return s.startsWith('http')
}

const seasons = ['autumn', 'winter', 'spring', 'summer']

class StandardObject {
    constructor(store = {}) {
        this.store = store
    }
    get length() {
        return Object.keys(this.store).length
    }
    get keys() {
        return Object.keys(this.store)
    }
    get values() {
        return Object.values(this.store)
    }
    get entries() {
        return Object.entries(this.store)
    }
    has(key) {
        return this.store.hasOwnProperty(key)
    }
    get(key) {
        return this.store[key]
    }
}

function isError(x) {
    return x.constructor.name.includes('Error')
}

function isSet(x) {
    return x.constructor.name == 'Set'
}

function stringify(s) {
    if (isFunction(s)) {
        return s.toString()
    }
    if (!exists(s)) {
        return ''
    }
    return isPrimitive(s) ? s : JSON.stringify(s, null, 2)
}

function puppetStringify(x) {
    if (isFunction(x)) {
        return `[function]: ${x.name}`
    }
    if (isUndefined(x)) {
        return `[empty]: undefined`
    }

    if (isNull(x)) {
        return `[empty]: null`
    }
    if (x == '') {
        return `[empty]: ''`
    }
    if (isString(x)) {
        return '[String]: ' + x
    }

    if (isBoolean(x)) {
        return '[boolean]: ' + x
    }

    if (isNumber(x)) {
        return '[Number]: ' + x
    }
    if (isError(x)) {
        return JSON.stringify(getVueErrorInfo(x))
    }

    if (isClass(x)) {
        return JSON.stringify(getClassProperties(x))
    }

    if (isArray(x)) {
        return JSON.stringify(x)
    }
    if (isObject(x)) {
        return JSON.stringify(x)
    }
    return x.toString()


}

function datestamp(date) {
    const [month, day, year] = getMDY(date)
    return (
        month.toString().padStart(2, 0) +
        '-' +
        day.toString().padStart(2, 0) +
        '-' +
        year
    )
}

function getHMSM(date) {
    if (!date) date = new Date()
    else if (isString(date)) {
        date = new Date(date)
    }
    const hours = date.getHours()
    const minutes = date.getMinutes() 
    const seconds = date.getSeconds()
    const ms = date.getMilliseconds()
    return [hours, minutes, seconds, ms]
}

function getMDY(date) {
    if (!date) date = new Date()
    else if (isString(date)) {
        date = new Date(date)
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [month, day, year]
}

function isString(s) {
    return typeof s === 'string'
}

function isArray(a) {
    return Array.isArray(a)
}

function reduce(items, fn = (k, v) => [k, v]) {
    if (!exists(items)) return {}
    items = prepareIterable(items, 'entries')

    const store = {}
    const doublet = isDoubleIterable(items)

    for (let i = 0; i < items.length; i++) {
        const item = items[i]

        const value = doublet ? fn(...item, i) : fn(item, i)
        if (!exists(value)) continue
        if (isArray(value) && value.length == 2) {
            store[value[0]] = value[1]
        } else {
            if (doublet) store[item[0]] = value
            else {
                store[item] = value
            }
        }
    }
    return store
}

function exists(input) {
    if (input == null) return false
    if (isString(input)) return input.trim().length > 0
    if (isArray(input)) return input.filter(exists).length > 0
    if (isObject(input)) return Object.keys(input).length > 0
    return true
}



function isPureObject(x) {
    return x && x.constructor.name == 'Object'
}

function isThisFunction(s) {
    s = s.toString()
    return s.startsWith('function') && test(/\bthis\b/, s)
}

function rainbow(n) {
    switch (n) {
        default:
            return rainbowStop(Math.random())
    }

    function rainbowStop(h) {
      let f = (n, k = (n + h * 12) % 12) => {
          return 0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      }
      let rgb2hex = (r, g, b) =>
        "#" +
        [r, g, b]
          .map(x =>
            Math.round(x * 255)
              .toString(16)
              .padStart(2, 0)
          )
          .join("");
      return rgb2hex(f(0), f(8), f(4));
    }

    function rainbowStops(stops) {
       return range(stops).map((item, i) => {
            return rainbowStop(item / stops, 1, 0.5)
        })
    }
}

function average(a, b) {
    return (a + b) / 2
}
// u need a grammar & u need visitors



class Indexed extends StandardObject {
    constructor(store = {}, modulus = false) {
        super(store)
        this.tracker = exists(store) ? 
            reduce(store, (k, v) => [k, {index: 0, done: false}]) : {}
        this.key = this.keys[0]
        this.modulus = modulus
    }


    get(index) {
        return this.store[this.key][index]
    }

    get index() {
        return this.tracker[this.key].index
    }

    set index(val) {
        if (this.get(val)) {
            this.tracker[this.key].index = val
        }
        else {
            this.tracker[this.key].done = true
            const done = this._incrementKey(this.key)
            if (done) {
                this.finished = true
            }
        }
    }

    get value() {
        return this.store[this.key][this.index]
    }
    get length() {
        return this.store[this.key].length
    }

    _incrementKey(key) {
        let count = 0
        while (count++ < this.keys.length) {
             key = modularIncrement(this.keys, key)
             if (this.tracker[key].done === false) {
                 this.key = key
                 return false
             }
        }
        return true
    }

    set(key) {
        this.key = key
    }

    isDone(key) {
        const done = this.index == this.length
        if (done) {
            this.tracker[this.key].done = true
        }
        return done
    }
}

function isObject(x) {
    return type(x) == 'Object'
}

function type(x) {
    return search(/object (\w+)/, Object.prototype.toString.call(x))
}

function breaker(limit = 5) {
    if (typeof __once__ == 'undefined') {
            __once__ = 0
    }
    if (++__once__ == limit) {
        console.log(); throw 'limit reached'
    }
}


function isNumber(s) {
    return typeof s == 'number' || test('^-?\\d+(?:\\.\\d+)?$', s)
}

function test(regex, s, flags = '') {
    return (isString(regex) ? RegExp(regex, flags) : regex).test(s)
}

function range(...args) {
    let a
    let b
    let c
    if (!isPrimitive(getLast(args))) {
        c = args.pop()
    }
    if (args.length == 1) {
        if (isStringNumberRange(args[0])) {
            ;[a,b] = split(args[0], '-').map(Number)
            console.log(a, b)
        }
        else {
            b = args[0]
            a = 1
        }
    } else {
        ;[a, b] = args
    }

    if (isArray(b)) {
        b = b.length - 1
        a = 0
    }

    const store = []
    for (let i = a; i <= b; i++) {
        if (c) {
            if (c.toString() == [].toString()) store.push([])
            else if (c.toString() == {}.toString()) store.push({})
        } else {
            store.push(i)
        }
    }
    return store
}

function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}



function textTable(items) {
    const matrix = new Matrix(items, {width: 4})
    let t = ''
    matrix.iterate((value, k, v, i, linebreak) => {
        t += i + '. ' + value + '   '
        if (linebreak) t += '\n'
    })
    return t
}

function isDoubleIterable(items) {
    return isObject(items) || isNestedArray(items)
}


function isQuote(s) {
    return test(/^['"]/, s)
}

function isStringNumberRange(s) {
    return /^\d+-\d+$/.test(s)
}

class Tally {
    constructor(items) {
        this.storage = tally(items || [], null)
    }
    lowest() {
        const lowest = getShortest(this.storage.values)
        const store = mapfilter(this.storage.entries, (x) => {
            return x[1] == lowest && x[0]
        })
        return coerceToNullIf(store.length > 1, store[0])
    }
}
function coerceToNullIf(condition, value) {
    if (condition) return null
    return value
}
function tally(arr, mode = Object) {
    const storage = new Storage({_mode: Number})
    for (let item of arr) {
        storage.add(item)
    }
    return mode == Object ? storage.value : storage
}

function spellcheckFactory(dict) {
        let regex = `\\b(?:${Object.keys(dict).join('|')})\\b`
        regex = RegExp(regex, 'g')
    return function spellcheck(s) {
        return simpleSpellcheck(s, dict, regex)
    }
}
class Spellcheck {
    constructor(dict) {
        const regex = `\\b(?:${Object.keys(dict).join('|')})\\b`
        this.regex = RegExp(regex, 'g')
        this.dict = dict
    }
    spellcheck(s) {
        return simpleSpellcheck(s, this.dict, this.regex)
    }
}
function simpleSpellcheck(s, dict, dictRegex) {
        const regex = /[.\'\"]/
    if (!dictRegex) dictRegex = RegExp(`\\b(?:${Object.keys(dict).join('|')})(?![.\'\"\\w])`, 'g')
        return s.replace(dictRegex, (x, offset, original) => {
            if (regex.test(original.charAt(offset - 1))) return x
            return dict[x] || x
        })
}

function typist(s, mode) {
    function typist2(s) {
        return split(s).map((item, i) => {
            let [a,b] = split(item, '')
            if (b) {
                return {key: b, ctrlKey: a}
            }
            return {key: a}
        })
    }
    if (mode == 'simple') return typist2(s)
    const dict = {
        cr: 'Enter',
        esc: 'Escape',
        esc: 'Escape',
        left: 'ArrowLeft',
        l: 'ArrowLeft',
        bs: 'Backspace',
        right: 'ArrowRight',
        down: 'ArrowDown',
        up: 'ArrowUp',
        u: 'ArrowUp',
        r: 'ArrowRight',
        d: 'ArrowDown',
        space: 'Space',
        f1: 'F1',
        tab: 'Tab',
        stab: 'Shift-Tab',
    }

    function reducer(acc, item, key) {
                if (!test(/^</, key)) {
                    acc.key = key
                    return acc
                }
                if (item == 'c') acc['ctrlKey'] = true
                else if (item == 'a') acc['altKey'] = true
                else acc.key = dict[item] || item
                return acc
    }
    function reducern(acc, item, key) {
                acc.isFakeKeyboardEvent = true
                if (!test(/^</, key)) {
                    acc.key = key
                    return acc
                }
                acc.preventDefault = identity
                if (isNumber(item)) {
                    acc.sleep = Number(item)
                    return acc
                }
                if (item == 'c') acc['ctrlKey'] = true
                else if (item == 'a') acc['altKey'] = true
                else acc.key = dict[item] || item
                return acc
    }
    function transformer(key) {
        return key
            .slice(1, -1)
            .toLowerCase()
            .split('-')
            .reduce((acc, item) => {
                return (reducerFn || reducer)(acc, item, key)
            }, {})
    }
    function filter(x) {
        return x != null && x != ''
    }

    function run(s) {
        return split(s, /(<.*?>)|/).map(transformer)
    }

    return run(s)
}

function isNestedArray(x) {
    return isArray(x) && isArray(x[0])
}



function removeEs6(s) {
    return s.replace(/^import.+\n*|^export /gm, '')
}


function isLink(s) {
    return getExtension(s) == 'css'
}

function regexElongation(s) {
    return `(?:${s})+`
}

function getFunctionName(s) {
    if (isFunction(s)) return s.name
    return search(/^(?:def|class|const|var|(?:async )?function) (\w+)/, s)
}

function isFunction(x) {
    return typeof x === 'function'
}

function isPlural(s) {
    return test(/s$/, s)
}

function toSpaces(n = 4) {
    if (!n) {
        return ''
    }
    return isNumber(n) ? ' '.repeat(n) : n
}

function replace(regex, replacement, s, flags = 'gm') {
    return s.replace(prepareRegex(regex, flags), replacement)
}



class Watcher {
    constructor(fn) {
        this.fn = fn || identity
        this.seen = new Set()
    }
    isFresh(key) {
        let value = this.fn(key)
        if (this.seen.has(value)) return false
        this.seen.add(value)
        return true
    }
    has(key) {
        return this.seen.has(key)
    }
}


function isHtmlFile(s) {
    return /\.html$/.test(s)
}

function isCssFile(s) {
    return /\.css$/.test(s)
}

function isJavascriptFile(s) {
    return /\.js$/.test(s)
}

function getQuotes(s) {
    return findallStrings(s)
    // 
}

function findKeyFactory(mode, index = 0) {
    const method = mode == 'single' ? 'find' : 'filter'
    return function findKeyRunner(x, kt, vt) {
        const value =  Object.entries(x)[method]((x) => {
            if (kt) return kt(x[0])
            if (vt) return vt(x[1])
        })

        if (mode == 'single') {
            return value && value[index]
        }

        if (mode == 'multiple') {
            return value.map((x) => x[index])
        }
    }
}

const findKey = findKeyFactory('single')
const findKeys = findKeyFactory('multiple')

function getShortestLongest(mode) {
    const compare = mode == 'longest' ? (a,b) => a > b : (a,b) => a < b
    const mathFn = mode == 'longest' ? Math.max : Math.min
    const defaultMode = null
    //const defaultMode = mode == 'longest' ? Number : null

    return function getter(arr, measure = len, mode = defaultMode) {
        const value = arr.reduce(
            (acc, item, i) => {
                if (!item) return acc
                const itemLength = measure(item, i)
                if (mode == Number) return mathFn(itemLength, acc)
                const accLength = isNumber(acc) ? acc : measure(acc, i)
                return compare(accLength, itemLength) ? acc : item
            },
            mode == Number ? 0 : arr[0]
        )
        return value
    }
}

const getShortest = getShortestLongest('shortest')
const getLongest = getShortestLongest('longest')

function findCaller(target, offset = 0) {
    const stack = getStackTrace()
    console.log(stack, target)
    console.log(); throw ''
    const index = stack.findIndex((x) => test(target, x[0])) + offset
    const [name, line] = index
    return {name, line}
}

function hasSymbol(s) {
    return test(/[^\sa-zA-Z]/, s)
}

function toArray(val) {
    return isArray(val) ? val : [val]
}
function looksLikeRegex(s) {
    return test(/^\//, s)
    return test(/^\/.*?\/\w*$/, s)
}

function prepareRegex(regex, flags) {
    if (isString(regex)) {
        if (looksLikeRegex(regex)) {
            ;[regex, flags] = search(/^\/(.*?)\/(\w*)$/, regex)
        }
        regex = RegExp(regex, flags || '')
    }
    return regex
}

function wordToNumber(s) {
    return numberWords.indexOf(s.toLowerCase())
}

function toStringDictionaryEntry(k, v) {
    return singlequote(k) + ': ' + singlequote(v) + ','
}

function comment(s) {
    return '// ' + s
}

function hasSelector(s) {
    return test(/^[.#]/, s)
}

function isUndefined(x) {
    return x == undefined
}

function isSelector(s) {
    return test(/^[.#][\w-]{1,30}$/, s)
}

function boundary(s) {
    return wrap(s, '\\b')
}

function getVueErrorInfo(e) {
    return e.stack.replace(/file.*?(?=\w+\.js)|at invo[^]+/g, '').trim()
    let s = e.stack.replace(/vue.js.+/s)

    let [name, message] = search(/(\w+): *(.*)/, s)
    let regex = /^ *at (\S+) \((.*?):(\d+):(\d+)/gm
    let stack = findall(regex, s)
    let result = stack.map(([caller, file, line, ch], i) => {
        line = Number(line)
        ch = Number(ch)
        if (caller.includes('.')) {
            let [className, method] = caller.split('.')
            return { class: className, method, file, line: Number(), ch }
        }
        return { caller, file, line }
        return { caller, file, line, ch }
    })
    result[0].message = message
    return result
    return result[0]
}

function hasSpaces(s) {
    return s.includes(' ')
}

function isNull(x) {
    return x == null
}

function toStringCallable(a, b) {
    return a + parens(b)
}

function uncapitalize(s) {
    return s.replace(/\w/, (x) => x.toLowerCase())
}

function insertBelow(s, key, payload) {
    const regex = '^.*?' + key + '.*'
    return replace(
        regex,
        (x) => {
            const indentation = getIndent(x) + 4
            return x + '\n' + indent(payload, indentation)
        },
        s,
        'm'
    )
}

//console.log('hix')

function linebreak(s) {
    return wrap('-'.repeat(20))
}

function hasNewline(s) {
    return s.trim().includes('\n')
}

function toNumber(val) {
    return isNumber(val) ? Number(val) : val
    if (isString(val) && test(/[\/ ]/, val)) return val
    var n = parseFloat(val)
    return isStringMathExpression(val) || isNaN(n) ? val : n
}

function removeQuotes(s) {
    if (test(/^[\'\"]/, s)) {
        return s.slice(1, -1)
    }
    return s
}

function blockComment(s) {
    return `/* ${s} */`
}

function modularIncrementNumber(current, increment, min, max) {
    console.log(min)
    if (current + increment > max) {
        if (current == max) return min
        return max
    }
    if (current + increment < min) {
        console.log('hiiii')
        console.log(current, increment, min, max)
        if (current == min) return max
        return min
    }

    return current + increment
}

function unique(a, b) {
    if (isNestedArray(a)) {
        const seen = []
        const store = a.filter((x) => {
            if (seen.includes(x[0])) return false
            seen.push(x[0])
            return true
        })
        return store
    }

    if (b) return a.filter((item) => !Array.from(b).includes(item))
    return isArray(a) && a.length > 1 ? Array.from(new Set(a)) : a
}

function numbered(text) {
    if (!text) return ''
    let count = 0

    if (isArray(text)) {
        return text.map((item, i) => 1 + i + '  ' + item).join('\n')
    }

    function parser(s) {
        return ++count + '  ' + s
    }

    return replace('^', parser, text, 'gm')
}

function getLast(arr, n = -1) {
    return arr[arr.length + n]
}

function find(items, fn, reverse) {
    if (reverse) {
        for (let i = items.length - 1; i >= 0; i--) {
            if (ftest(fn, items[i])) {
                return items[i]
            }
        }
    } else {
        return items.find(fn)
    }
}
function matchall(regex, s) {
    regex = addGFlag(regex)
    let match
    let store = []
    while (exists((match = regex.exec(s)))) {
        store.push(match)
    }
    return store
}
function toggleFunction(a, b, duration) {
    a()
    setTimeout(() => {
        b()
    }, duration)
}

class ErrorWatcher {
    constructor() {
        this.threshold = 20
        this.count = 0
    }
    watch() {
        if (this.count++ > this.threshold) {
            throw new Error('surpasses threshold')
        }
    }
}

function getClassString(x) {
    if (!x) {
        return ''
    }
    let s = x.toString()
    if (s == '[object Object]') {
        return x.constructor.toString()
    }
    return s
}

function getClassMethods(s) {
    return findall(/^    (?:async |def )?(\w+)\(/gm, s.toString())
}
function hasSharedKeys(a, b) {
    return intersection(Object.keys(a), Object.keys(b)).length > 0
}
function isPublic(s) {
    return test(/^\w+$/, s)
}
function getClassProperties(obj) {
    const props = reduce(Object.getOwnPropertyNames(obj).filter(isPublic), (x) => [x, obj[x]])
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
    pop(methods, 'constructor')
    return { name: obj.constructor.name,  methods, ...props }

    return Object.getOwnPropertyNames(s)
    console.log(s)
    let match
    let regex = /^ *(?:this\.(\w+) *= *(\w+)?|(?:async )?(\w+)\(|get (\w+))/gm
    //let s = vars()
    const storage = new Storage({ unique: 1 })
    while ((match = regex.exec(s))) {
        if (match[3]) {
            storage.add('methods', match[3])
        } else if (match[1]) {
            storage.add('properties', match[1])
        } else if (match[4]) {
            storage.add('properties', match[4])
        }
    }
    storage.pop('methods', 'constructor')
    //console.log(storage.value); throw ''
    return storage.value
}

function findall(regex, s, flags = 'g', filtered = false) {
    if (isString(regex)) regex = RegExp(regex, flags)

    let store = []
    let match
    s = s.trim()

    while (exists((match = regex.exec(s)))) {
        if (match.length == 1) {
            store.push(match[0])
        } else if (filtered) {
            store.push(smallify(match.slice(1).filter(exists)))
        } else if (match.length == 2) {
            store.push(match[1])
        } else {
            store.push(match.slice(1))
        }
    }
    return store
}

function smallify(x) {
    return x.length == 0 ? null : x.length == 1 ? x[0] : x
}

function deletef(r) {
    return (s) => {
        return s.replace(r, '')
    }
}
function functiongetter(x) {
    if (isFunction(x)) {
        return x
    }
    if (window.hasOwnProperty(x)) {
        return window[x]
    }
    return eval(parens(x))
}

function removeAllComments(s) {
    return s.replace(/^ *\/\/.+\n*/gm, '')
    return s.replace(/^ *([#]|<!--[^]*?-->|\/\/|\/\*[^]*?\*\/).*\n*/gm, '')
}

function getLastWord(x) {
    return search('\\w+$', x)
}

function getFirstWord(x) {
    return search('\\w+', x)
}

function getFirst(x, mode = '') {
    if (isObject(x)) {
        return Object[mode || 'keys'](x)[0]
    }
    if (mode == String) {
        return search(/^\S+/, x)
    }
    if (isString(x)) {
        return search('\\w+', x)
    }

    if (isArray(x)) {
        return x[0]
    }
}

function xsplit(s) {
    if (isArray(s)) {
        return s
    }
    return split(s, / +|([,\.])/)
}

function removeComments(s, mode) {
    return s.replace(/^ *(\/\/|\/\*[^]*?\*\/).*\n*/gm, '')
    if (mode == 'js') return s.replace(/^ *\/\/|\/\*[^]*?\*\/.*\n*/gm, '')
    return s.replace(/^ *([#]|<!--[^]*?-->|\/\/|\/\*[^]*?\*\/).*\n*/gm, '')
}

function search(regex, s, flags = '') {
    if (isString(regex)) regex = RegExp(regex, flags)

    const match = s.match(regex)
    return matchgetter(match)
}

function matchgetter(match) {
    return !match
        ? null
        : match.length == 1
        ? match[0]
        : match.length == 2
        ? match[1] || match[0]
        : match.slice(1)
}

function prepareIterable(data, mode) {
    if (!data) {
        return []
    }
    if (isStorage(data)) {
        return data.store
    }

    if (isNumber(data)) {
        return range(1, data)
    }
    if (isString(data)) {
        return [data]
    }
    if (isClass(data)) {
        return Array.from(data)
    }

    if (isObject(data)) {
        if (mode == Array) mode == 'values'
        else if (mode == Object) mode == 'entries'
        else if (!mode) {
            mode = 'values'
        }
        return Object[mode](data)
    }

    return data

    //if (data.constructor.name == 'IndexedMap')
}

function indent(s, n = 4) {
    if (!s) return ''
    if (!n) return s
    if (!s.includes('\n')) return toSpaces(n) + s
    if (isArray(s)) return s.map((x) => indent(x, n))
    return replace('^', toSpaces(n), s, 'gm')
}

function joined(arr) {
    if (arguments.length > 1) {
        arr = Array.from(arguments).filter(exists).map(String)
        if (test(/^[, .] *$/, getLast(arr))) {
            delimiter = arr.pop()
            return arr.join(delimiter)
        }
    }

    let s = '\n'
    for (let item of arr) {
        s += item
        s += item.includes('\n') ? '\n\n' : '\n'
    }
    return s
}

function getYear() {
    const date = new Date()
    const year = date.getFullYear()
    return year
}

function difference(a, b) {
    a = prepareIterable(a, 'keys')
    b = prepareIterable(b, 'keys')
    return a.filter((x) => !b.includes(x))
}

function errorWrap(fn) {
    return (...args) => {
        try {
            let value = fn(args[0])
            return { value }
        } catch (e) {
            return {
                error: e.stack,
                input: smallify(args),
            }
        }
    }
}

function insertText(s, payload, regex) {
    regex = '^( *)' + '.*' + regex
    return replace(
        regex,
        (original, spaces) => {
            const value = indent(payload, spaces)
            return original + '\n' + value
        },
        s,
        'm'
    )
}


function isIterable(x) {
    return isArray(x) || isObject(x)
}

function linegetter(x, regex = /\n+/) {
    return isArray(x) ? x : split(x, regex)
}

function isDefined(x) {
    return x != null
}

function isBoolean(x) {
    return x === true || x === false
}

function addGFlag(regex) {
    if (isString(regex)) {
        return new RegExp(regex, 'g')
    }
    if (!regex.flags.includes('g')) {
        regex = new RegExp(regex, regex.flags + 'g')
    }
    return regex
}

function isFirst(key, state = $$) {
    if (!state[key]) {
        state[key] = true
        return true
    }
    return false
}

function isWord(s) {
    return test(/^[a-zA-Z]+$/, s)
}

function isPromise(x) {
    return x.constructor.name == 'Promise'
}

function isJsonParsable(s) {
    return /^[{\[]/.test(s)
}

function isRegExp(x) {
    return x.constructor.name == 'RegExp'
}

function isFalse(x) {
    return x === false
}

function isTrue(x) {
    return x === true
}

function isClassObject(x) {
    const runner = (x)=> x && x.toString().startsWith('class')
    return runner(x) || runner(x.constructor )
}

function isClass(x) {
    const natives = [
        'String',
        'Function',
        'Number',
        'Object',
        'Array',
        'Set',
        'Promise',
    ]
    return x && !natives.includes(x.constructor.name)
}

function isNode() {
    return typeof window === 'undefined' || window.isNodeWindow
}

function isJson(x) {
    return x.endsWith('.json')
}

function isElement(s) {
    return s.constructor.name.startsWith('HTML')
}

function isInteger(n) {
    return Number.isInteger(Number(n))
}

function isPositive(n) {
    return n >= 0
}

function isCapitalized(s) {
    return /^[A-Z]/.test(s)
}

function isYesterday(date) {
    return changeDate(datestamp(), -1) == date
}

function isToday(date) {
    return datestamp() == date
}

function zeroPad(x) {
    return String(x).length == 1 ? '0' + x : x
}

function backspaced(s) {
    return s ? s.slice(0, -1) : ''
}

function indexgetter(arr, index) {
    if (!index) return 0
    if (!isNumber(index)) index = arr.indexOf(index)
    return index
}

function insert(arr, item, index) {
    index = indexgetter(arr, index)
    arr.splice(index, 0, item)
    return arr
}

function getSpaces(s) {
    return search(/^ */, s) || ''
}

function rescape(s, delimiters) {
    const rescapeRE = delimiters ? 
        RegExp(`[${delimiters.replace(/[\[\]]/g, '\\$&')}]`, 'g') :
        /[.\\[*+?()|^${}\[\]]/g
        //console.log(rescapeRE)
    return s.replace(rescapeRE, '\\$&')
}

function replaceTemplaterHelper(s, ref) {
    if (!s.includes('$')) return s
    let regex = /\$(\d)/g
    return s.replace(regex, (_, x) => {
        return ref[Number(x)]
    })
}

function spicyReplace(regex, rep, s) {
    const parser = (...args) => {
        return spicyTemplater(rep, args.slice(1, -2))
    }
    console.log(prepareRegex(regex))
    return s.replace(prepareRegex(regex), parser)
}
function spicyTemplater(s, ref) {
    if (!s.includes('$')) return s
    let regex = /\$(\w+|\{.*?\})/g
    return runner(s)

    function runner(s, fn) {
    return s.replace(regex, (_, x) => {
        if (x == 0) return s
        if (test(/^{/, x)) {
            x = x.slice(1, -1)
            x = runner(x, quotify)
            x = eval(x)
            return x
        }
        let val = isArray(ref) ? ref[Number(x) - 1] : ref[x]
        if (val == null) val = ''
        if (isFunction(val)) {
            val = val(x)
        }
        return fn ? fn(val) : val
    })
    }

}


function templater(s, ref) {
    if (!s.includes('$')) return s

    if (!ref) return s.replace(/\$\{(.*?)\}/g, (_, x) => eval(x))
    let regex = /\$(\w)/g
    if (isPrimitive(ref)) {
        ref = [ref]
    } else {
        regex = /\$(\w+)/g
    }

    let functionals = []
    let offset = s.includes('$0') ? 0 : 1
    let value = s.replace(regex, (_, x) => {
        if (x == 'c') return '$c'
        let val = isArray(ref) ? ref[Number(x) - offset] : ref[x]
        if (val == null) val = ''
        if (isFunction(val)) {
            functionals.push(val)
            return '###'
        }
        return val
    })

    if (exists(functionals)) {
        let parts = value.split(/###(?:\(.*?\))?/)
        return (a, b, c) => {
            let s = ''
            for (let i = 0; i < parts.length; i++) {
                let part = parts[i]
                s += part
                if (i < parts.length - 1) {
                    s += functionals[i](a)
                }
            }
            return s
        }
    }
    return value
}

function hasCaptureGroup(s) {
    return test(/[^\\]\((?!\?)/, s)
}

function getIndent(s) {
    if (isNumber(s)) return s
    return getSpaces(s).length
}

function identity(...args) {
    return args.length == 1 ? args[0] : args
}

function trimmed(s) {
    return s.trim()
    if (s.trim().length == '') return s
}
class AssertionErrorHandler {
    constructor(fn) {
        try {
            fn()
        }
        catch (e) {
            console.log([e.name, e.line])
        }
    }
}
class AssertionError extends Error { 
    constructor(x) {
        super()
        const {name, line} = getCaller('assert')
        this.name = name
        this.line = line
    }
}
function assert(condition) {
    if (!condition || !exists(condition)) {
        throw new AssertionError()
    }
    return condition
    return
    if (!condition || !exists(condition)) {
        const stack = getStackTrace()
        //console.log(stack)
        const name = stack[stack.findIndex((x) => x[0] == 'assert') + 1][0]
        const error = assert.caller
            .toString()
            .match(/assert\((.*?)\) *(?=\n|$)/)[1]
        const message = `[assertion error] @${name}: undefined ${error}`
        console.log(message)
        throw ''
    }
}

function parens(s) {
    return '(' + s + ')'
}

function len(x) {
    if (isNumber(x)) return x.toString().length
    return x.length || Object.keys(x).length || 0
}

function hasNumber(x) {
    return (isString(x) && test(/\d/, x)) || typeof x == 'number'
}

function sum(items, fn) {
    return items.reduce((acc, item, i) => (acc += fn ? fn(item, i) : item), 0)
}

function recursiveFlat(...args) {
    const store = []
    function runner(args) {
        for (let arg of args) {
            if (isArray(arg)) {
                runner(arg)
            } else {
                store.push(arg)
            }
        }
    }
    runner(args)
    return store
}
function flat(arr) {
    const store = []
    for (let item of arr) {
        if (isArray(item)) store.push(...item)
        else store.push(item)
    }
    return store
}

function doublequote(s) {
    return '"' + s + '"'
}

function delta(a, b) {
    return Math.abs(a - b)
}

function toVariable(name, value, lang, prefix = 'var ') {
    if (arguments.length == 1) {
        value = name
        lang = 'js'
        switch (type(value)) {
            case 'String':
                name = 's'
                break

            case 'Array':
                name = 'arr'
                break

            case 'Object':
                name = 'obj'
                break

            case 'Number':
                name = 'n'
                break
        }
    }
    //console.log(value)
    const payload = isString(value)
        ? isJsonParsable(value)
            ? value
            : quotify(value.replace(/\`/g, '\\`').replace(/\$\{/g, '\\$\\{'))
        : toStringArgument(value)

    return prefix + name + ' = ' + payload
}

function quotify(s, mode = '`') {
    if (mode == '`') return '`' + s + '`'
    if (mode == "'") return "'" + s + "'"
    if (mode == '"') return '"' + s + '"'
    return '"' + s + '"'
}

function tail(s) {
    return getLast(s.split('/')).replace(/^\W+/, '')
}

function bindObject(state, object) {
    if (!exists(object)) {
        return 
    }
    for (let [k, v] of Object.entries(object)) {
        if (isFunction(v)) {
            state[k] = v.bind(state)
        }
        else {
            state[k] = v
        }
    }
}

function bind(state, fnKey) {
    return state[fnKey].bind(state)
}
function fparse(x, ...args) {
    return isFunction(x) ? x(...args) : x
}
class Cache extends StandardObject {
    constructor() {
        super()
    }

    get(key, fallback) {
        if (!this.has(key)) {
            this.store[key] = fparse(fallback, key)
        }
        return this.store[key]
    }

    set(key, value) {
        if (isObject(key)) {
            this.store = key
        } else {
            this.store[key] = value
            return value
        }
    }

    clear() {
        this.store = {}
    }
}

function getLongestOld(arr, measure = len, mode = Number) {
    const value = arr.reduce(
        (acc, item, i) => {
            if (!item) return acc
            const itemLength = measure(item, i)
            if (mode == Number) return Math.max(itemLength, acc)
            const accLength = isNumber(acc) ? acc : measure(acc, i)
            return accLength > itemLength ? acc : item
        },
        mode == Number ? 0 : arr[0]
    )

    return value
}

function dreplace(s, dict, regexTemplate = '\\b(?:$1)\\b', flags = 'g') {
    let escape
    if (regexTemplate === null) {
        regexTemplate = '(?:$1)'
    }

    else if (regexTemplate == 'ge') {
        flags = regexTemplate
        regexTemplate = '(?:$1)'
    }
    else if (regexTemplate == 'ge') {
        flags = regexTemplate
        regexTemplate = '(?:$1)'
    } else if (regexTemplate.length < 5) {
        flags = regexTemplate
        regexTemplate = '\\b(?:$1)\b'
    }
    if (flags.includes('e')) {
        escape = true
        flags = flags.replace('e', '')
    }

    if (flags.includes('b')) {
        flags = flags.replace('b', '')
        regexTemplate = '\\b(?:$1)\\b'
    }

    const regex = ncg(regexTemplate, dict, escape)

    function fixB(x) {
        if (isCapitalized(x)) {
            value = dict[x.toLowerCase()]
            return capitalize(value)
        }
        return dict[x]
    }
    const parser = hasCaptureGroup(regexTemplate)
        ? (_, x) => fixB(x)
        : (x) => fixB(x)

    return replace(regex, parser, s, flags)
}

function ncg(template, ref, escape) {
    //if (isString(template) && isString(escape)) {
        //ref = toArray(ref)
    //}
    //
    if (typeof template == 'object' && !ref) {
        return regexTemplater(/\b(?:$1)\b/g, template)
    }

    if (template == boundary) {
        return regexTemplater(/\b(?:$1)\b/g, ref)
    }

    if (isRegExp(template)) {
        return regexTemplater(template, ref)
    }
    if (template === '') template = '(?:$1)'
    if (arguments.length == 1) {
        return '(?:' + ncgRunner(template) + ')'
    }

    if (!ref && isIterable(template)) {
        return '\\b(?:' + ncgRunner(template, escape) + ')\\b'
    } else if (!isPrimitive(ref) && ref[0] && !isPrimitive(ref[0])) {
        let value = templater(
            template,
            ref.map((el) => ncgRunner(el, escape))
        )
        if (escape) return RegExp(value, escape)
        return value
    } else {
        return templater(template, ncgRunner(ref, escape))
    }

    function ncgRunner(ref, escape) {
        return isBoolean(escape)
            ? prepareIterable(ref, 'keys').map(rescape).join('|')
            : prepareIterable(ref, 'keys').join('|')
    }
}

function filterObject(items, fn) {
    function reducer(items, gn) {
        const store = {}
        for (let [a, b] of prepareIterable(items, 'entries')) {
            const value = gn(a,b)
            if (exists(value)) {
                if (value.length == 2 && isArray(value)) {
                    store[value[0]] = value[1]
                }
                else {
                    store[a] = value
                }
            }
        }
        return store
    }
    return getParameters(fn).length == 1 ?
         reducer(items, (k, v) => fn(v) ? v : null) :
         reducer(items, (k, v) => (fn(k, v) ? v : null))
}

// the english is hard.
function filtered(items, fn) {
    if (isObject(items)) {
        return reduce(items, (k, v) => (fn(k, v) ? v : null))
    }

    items = Array.from(items)
    if (isString(fn)) return items.filter((x) => exists(x) && test(fn, x, 'i'))
    if (isFunction(fn)) return items.filter(fn)
    if (isArray(fn)) return items.filter((x) => !fn.includes(x))
}

function getIndentAndLine(s) {
    return [getIndent(s), s.trim()]
}

function capitalize(s) {
    return s.replace(/^['"]?[a-zA-Z]/, (x) => x.toUpperCase())
}

function singlequote(s) {
    return "'" + s + "'"
}

function ftest(x, s, flags = 'i') {
    if (isArray(x)) {
        for (let item of x) {
            if (ftest(item, s, flags)) {
                return true
            }
        }
    }

    if (isFunction(x)) {
        return x(s)
    }

    if (s === x) {
        return true
    }

    if (s == '' && x.toString() == '/^$/') {
        return true
    }

    return test(x, s, flags)
}

function mapObject(a, b) {
    if (isObject(b)) {
        return reduce(a, (k,v) => {
            return b[k] ? [k, b[k]] : null
        })
    }
}
function mapConditional(a, b, c) {
    return (x, i) => {
        if (isRegExp(a)) {
            let match = x.match(a)
            if (match) {
                if (match.length == 2) {
                    if (isString(b)) {
                        return templater(b, match[1])
                    }
                    return b(match[1])
                } else {
                    if (isString(b)) {
                        return templater(b, x)
                    }
                    return b(x)
                }
            } else if (c) {
                if (isString(c)) {
                    return templater(c, x)
                }
                return c(x)
            } else {
                return x
            }
        }

        if (isFunction(a)) {
            if (a(x)) {
                if (isString(b)) {
                    return templater(b, x)
                }
                return b(x)
            } else if (c) {
                if (isString(c)) {
                    return templater(c, x)
                }
                return c(x)
            } else {
                return x
            }
        }

        if (isString(a)) {
            throw new Error('must be regex or function for mapconditional')
        }
    }
}

function merge(...args) {
    args = args.filter(exists)
    let first = args[0]

    if (args.length == 1) {
        return args[0]
    }

    if (isObject(first)) {
        const store = {}
        for (let arg of args) {
            Object.assign(store, arg)
        }
        return store
    }

    if (isArray(first)) {
        for (let arg of args) {
            if (arg) isArray(arg) ? first.push(...arg) : first.push(arg)
        }
        return first
    }

    if (isString(first)) {
        if (first.includes('\n')) return args.join('\n')
        if (first.includes(' ')) return args.join(' ')
        return args.join('\n')
    }

    if (isNumber(first)) {
        return sum(args.map(Number))
    }
}

function tryval(s, ...args) {
    try {
        if (isFunction(s)) {
            return {
                value: s(...args),
                input: smallify(args),
            }
        }
        return {
            input: smallify(s),
            value: eval(s)
        }
    } catch (e) {
        return {
            input: smallify(s),
            error: getDetailedErrorInfo(e),
        }
    }
}


function shuffle(arr) {
    const ref = Array.from(arr)
    let m = arr.length
    while (m) {
        let i = ~~(Math.random() * m--)
        let t = ref[m]
        ref[m] = ref[i]
        ref[i] = t
    }
    return ref
}

class Clock {
    static async create(n = 5, fn = null) {
        let clock = new Clock(n, fn)
        await clock.start()
    }
    setOptions(options) {
        if (!options) return
        if (options.duration) this.duration = options.duration
        if (options.increment) this.increment = options.increment
        if (options.steps) this.increment = this.duration / options.steps
        if (options.onTick) this.onTick = options.onTick.bind(this)
    }
    constructor(options = 3) {
        this.increment = 1000
        this.speed = 1

        if (isObject(options)) {
            this.setOptions(options)
        } else {
            this.duration = options
            if (arguments[1]) {
                this.onTick = arguments[1]
                console.log('setting onti')
            }
        }
    }
    pause() {
        //this._stop = true
        this._pause = true
    }

    async start(duration) {
        if (this._pause) {
            console.log('starting form pause')
            //this.duration = this.timeRemaining
            //this._duration = this.duration / 1000
            //this.count = this.currentTime
            //this.timeRemaining = null
            //this.currentTime = null
            this._pause = false
            this.count += 1
        }
        else {
            if (duration) {
                this.duration = duration == Infinity ? 
                100000 : duration
            }
            if (this.duration <= 100) this.duration *= 1000

            this._duration = this.duration / 1000
            this.count = 0
            this._stop = false
        }
        await this.runner()
    }

    stop() {
        this._stop = true
    }

    async resume() {
        this._stop = false
        await this.runner()
    }
    resetClock(count) {

            console.log('reset clock')
            this.timeRemaining = null
            this.currentTime = null
        this.duration = 0
        this.count = 0
        this._pause = 0
        this._stop = 0
    }

    runner() {
        this._onStart = this._onTick
        if (this._onStart) {
            this._onStart()
        }

        return new Promise((resolve) => {
            const runner = () => {
                if (this.isDone()) {
                    clearTimeout(this.timerID)
                    if (this._onFinish) {
                        this._onFinish()
                    }
                    this.resetClock(this.count)
                    resolve()
                } 
                else if (this._pause) {
                    //this.currentTime = this.count
                    //this.timeRemaining = this.duration - this.count * this.increment
                    //console.log(this.timeRemaining, this.currentTime)
                    clearTimeout(this.timerID)
                    resolve()
                }
                
                else {
                    this.count += 1
                    this.timerID = setTimeout(() => {
                        if (this._onTick) this._onTick()
                        runner()
                    }, Math.floor(this.increment / this.speed))
                }
            }

            runner()
        })
    }

    at(n, fn) {
        let current = this._onTick
        this._onTick = () => {
            this.count == n ? this.handle(fn(this)) : current()
        }
    }

    set onTick(fn) {
        //this._onTick = () =>
            //this.handle(fn(this.count, this.timeLeft, this.duration))

        this._onTick = async () =>
            this.handle(fn(this.count, this.timeLeft, this.duration))
    }

    set onFinish(fn) {
        this._onFinish = () => fn(this.count, this.timeLeft, this.duration)

        //fn(this.timeLeft, this.count, this.duration)
    }

    isDone() {
        return this.count >= this._duration || this._stop
    }
    get timeLeft() {
        return this._duration - this.count
    }

    handle(result) {
        if (result === true) {
            if (this.timeLeft) {
                this._pause = true
            }
            else {
                this._stop = true
            }
        }
        else if (isNumber(result)) {
            this.duration += result * 1000
            this._duration += result
        }
    }
}

function addExtension(file, ext) {
    if (getExtension(file)) {
        return file
    }
    return file + '.' + ext
}

function getExtension(file) {
    return search(/\.(\w+)$/, file)
}

function sorted(items, fn, reverse = false) {
    const defaultObjectSort = (s) => s[1]
    const defaultNumberSort = (s) => s
    let asObject = false

    if (items.store) {
        items = Object.entries(items.store)
        asObject = true
    } else if (isObject(items)) {
        items = Object.entries(items)
        asObject = true
    }

    if (!fn)
        fn = isDoubleIterable(items)
            ? defaultObjectSort
            : isNumber(items[0])
            ? defaultNumberSort
            : char2n

    function runner(a, b) {
        if (reverse) return Number(fn(b)) - Number(fn(a))
        return Number(fn(a)) - Number(fn(b))
    }

    items.sort(runner)
    return asObject ? reduce(items) : items
}

function n2char(n) {
    return String.fromCharCode(n + 97)
}
function char2n(ch) {
    return ch.toLowerCase().charCodeAt(0) - 97
}

function newlineIndent(s) {
    s = isArray(s) ? s.join('\n') : s
    return wrap(indent(s.replace(/^\n+/, '').trimEnd(), 4))
}

class Storage {
    [Symbol.iterator]() {
        this.items = this.entries
        this.index = 0
        return this
    }
    next() {
        const value = this.items[this.index++]
        const done = this.index > this.items.length
        return {
            value,
            done,
        }
    }
    constructor() {
        this.store = {}
        const options = {
            _mode: Array,
            unique: false,
            delimiter: '\n',
            mergeArray: true,
        }
        Object.assign(this, options)
        if (arguments.length == 2) {
            this.store = arguments[0]
            Object.assign(this, arguments[1])
        } else if (arguments.length == 0) {
            Object.assign(this, options)
        } else if (arguments.length == 1) {
            if (hasSharedKeys(arguments[0], options)) {
                Object.assign(this, arguments[0])
            } else {
                this.store = arguments[0]
            }
        }
        //console.log(this)
    }

    delete(k) {
        delete this.store[k]
    }
    get value() {
        return this.store
    }
    get keys() {
        return Object.keys(this.store)
    }
    get values() {
        return Object.values(this.store)
    }
    get entries() {
        return Object.entries(this.store)
    }

    get(k) {
        if (arguments.length > 1) {
            return (
                (this.store[arguments[0]] &&
                    this.store[arguments[0]][arguments[1]]) ||
                ''
            )
        }
        return this.store[k] || this.fallback
    }

    get fallback() {
        switch (this._mode) {
            case Array:
                return []
            case Number:
                return 0
            case String:
                return ''
            case Object:
                return {}
        }
    }

    has(k) {
        return this.store.hasOwnProperty(k)
    }
    forEach(fn) {
        return Object.entries(this.store).forEach(([k, v]) => fn(k, v))
    }
    reset(k) {
        if (!k) {
            this.store = {}
            return
        }

        switch (this._mode) {
            case Array:
                this.store[k] = []
                break
            case Number:
                this.store[k] = 0
                break
            case String:
                this.store[k] = ''
                break
            case Object:
                this.store[k] = {}
                break
            case null:
                this.store[k] = null
                break
        }
    }

    pop(k, v) {
        if (v) {
            return pop(this.store[k], v)
        } else {
            return pop(this.store, k)
        }
    }

    map(k, fn) {
        this.store[k] = this.get(k).map(fn)
    }

    set(k, v) {
        this.store[k] = v || null
    }

    toString() {
        return stringify(this.store)
    }
    add(k, v) {
        if (k == null) return
        if (arguments.length == 3) {
            this.addObject(...Array.from(arguments))
            return
        }

        switch (this._mode) {
            case Array:
                this.addArray(k, v)
                break
            case Object:
                this.addObject(...Array.from(arguments))
                break
            case String:
                this.addString(k, v)
                break
            case Number:
                return this.addNumber(k, v)
                break
            default:
                this.set(k, v)
                break
        }

        return this.get(k)
    }

    addNumber(k, v) {
        v = v == null ? 1 : Number(v)
        return this.store[k] ? (this.store[k] += v) : (this.store[k] = v)
    }

    addString(k, v) {
        if (!exists(v)) {
            return
        }
        this.store[k]
            ? (this.store[k] += this.delimiter + v)
            : (this.store[k] = v)
    }

    addArray(k, v) {
        if (!exists(v)) {
            return
        }
        if (this.unique && this.get(k).includes(v)) {
            return
        }

        if (isArray(v) && this.mergeArray) {
            this.store[k] ? this.store[k].push(...v) : (this.store[k] = v)
        } else {
            this.store[k] ? this.store[k].push(v) : (this.store[k] = [v])
        }
    }

    addObject(parent, child, value) {
        if (!exists(value)) {
            return
        }
        if (!this.store[parent]) this.store[parent] = {}
        this.store[parent][child] = value
    }
}

function modularIncrement(arr, item, increment = 1) {
    if (isNumber(arr)) {
        return modularIncrementNumber(Number(arr), item, increment, arguments[3] || 9)
    }
    if (isFunction(increment)) {
        return modularIncrementFn(arr, item, increment)
    }
    if (increment == '+') increment = 1
    else if (increment == '-') increment = -1

    if (isObject(arr)) {
        arr = Object.keys(arr)
    }

    if (!item) return arr[0]
    const i = arr.indexOf(item)
    if (i < 0) return arr[0]

    let newIndex

    if (i + increment < 0) {
        newIndex = arr.length - 1
    } else {
        newIndex = (i + increment) % arr.length
    }

    const p = arr[newIndex]
    return p
}

function modularIncrementFn(arr, index, fn) {
    index = indexgetter(arr, index)

    for (let i = index; i < arr.length; i++) {
        let item = arr[i]
        if (fn(item)) return item
    }

    for (let i = 0; i < index; i++) {
        let item = arr[i]
        if (fn(item)) return item
    }

    return null
}

function mreplace(regex, replacement, s, flags = 'g', singular = false) {
    if (arguments.length == 2) {
        replacement = ''
        s = arguments[1]
    }

    if (arguments.length == 3 && arguments[2] == true) {
        replacement = ''
        s = arguments[1]
        singular = arguments[2]
    }

    const store = []
    const sliceBy = hasCaptureGroup(regex) ? 1 : 0

    function parser(...args) {
        args = args.slice(sliceBy, -2).filter((x) => x != null)
        store.push(smallify(args))
        return isString(replacement) ? replacement : replacement(...args)
    }

    if (!regex.flags || !flags.includes('g')) singular = true

    const text = replace(regex, parser, s.trim(), flags)
        .replace(/^\n+/, '')
        .trimEnd()
    if (singular) return [text, smallify(store)]
    return [text, store]
}

function sleep(delay = 3000) {
    if (delay < 50) delay *= 1000
    return new Promise((resolve) => setTimeout(resolve, delay))
}

function parseJSON(s) {
    if (/^[\d/]+$/.test(s)) {
        return Number(s)
    }
    return isJsonParsable(s) ? JSON.parse(s) : s
}

function splitonce(s, delimiter = '\\s+') {
    if (!s) {
        return ['', '']
    }
    if (isArray(s)) return [s[0], s.slice(1)]
    if (isRegExp(delimiter)) delimiter = delimiter.source
    let regex = '^(.*?)' + delimiter + '([^]+)$'

    return search(regex, s) || [s, '']
}

function pop(arr, key, fallback) {
    if (isObject(arr)) {
        if (!key in arr) return fallback
        let value = arr[key]
        delete arr[key]
        return value
    }

    if (isArray(arr)) {
        const index = isFunction(key)
            ? arr.findIndex(key)
            : isNumber(key)
            ? key
            : arr.indexOf(key)
        if (index < 0) {
            if (fallback) {
                return pop(arr, fallback)
            } else {
                return
            }
        } else {
            return arr.splice(index, 1)
        }
    }
}

function fill(arr, n) {
    while (arr.length <= n) {
        arr.push(null)
        counter()
    }
}

function splitOnceReverse(s, deli) {
    const items = s.split(deli)
    return [items.slice(0, -1), getLast(items)]
}
function split(s, regex = / +/, flags = '') {
    if (isArray(s)) {
        let temp = []
        let big = []
        for (let i = 0; i < s.length; i++) {
            let item = s[i]
            if (test(regex, item)) {
                big.push(temp)
                temp = []
                //return [s.slice(0, i), s.slice(i + 1)]
            } else {
                temp.push(item)
            }
            //if (i == s.length - 1) {
            //return [s, null]
            //}
        }
        if (exists(temp)) {
            big.push(temp)
        }
        return big
    }
    if (isNumber(regex)) return [s.slice(0, regex), s.slice(regex)]
    regex = regexed(regex, flags)
    return s.trim().split(regex).filter(exists).map(trimmed)
}

function regexed(regex, flags = '') {
    const addMultiLine = (x) => (/^.?\^/.test(regex) ? x + 'm' : x)
    return isString(regex) ? RegExp(regex, addMultiLine(flags)) : regex
}
function paired(list, mode = Array) {
    const store = mode == Object ? {} : []
    const start = list[0] == '' ? 1 : 0
    for (let i = start; i < list.length - 1; i += 2) {
        if (mode == Object) store[list[i]] = list[i + 1]
        else {
            store.push([list[i], list[i + 1]])
        }
    }
    return store
}

function toUpperCase(s) {
    return s.toUpperCase()
}

function depluralize(s) {
    return s.replace(/s$/, '')
}

function intersection(a, b) {
    return a.filter((x) => b.includes(x)) || b.filter((x) => a.includes(x))
}

function shared(a, b) {
    return a.filter((x) => b.includes(x))
}

function changeDate(s, increment) {
    return s.replace(
        /-\d+/,
        (x) => '-' + zeroPad(Number(x.slice(1)) + increment)
    )
}

function sortByDependencies(items, reducer, ref) {
    const dependencies = items.reduce((acc, item, i) => {
        acc[item] = isFunction(reducer) ? reducer(item) : findall(reducer, item)
        return acc
    }, {})

    const keys = Object.keys(dependencies)
    const seen = new Set()
    const result = []
    let i
    let item
    let length

    do {
        length = keys.length
        i = 0
        while (i < keys.length) {
            if (dependencies[keys[i]].every(Set.prototype.has, seen)) {
                item = keys.splice(i, 1)[0]
                result.push(item)
                seen.add(item)
                continue
            }
            i++
        }
    } while (keys.length && keys.length !== length)

    return ref ? result.map((key) => ref[key]) : result
}

function copy(x) {
    return JSON.parse(JSON.stringify(x))
}

function toDashCase(s) {
    return s
        .replace(/[a-z][A-Z]|\W/g, (x) => {
            return x.length == 1 ? '-' : x[0] + '-' + x[1]
        })
        .toLowerCase()
}

function toSnakeCase(s) {
    return s.replace(/[a-z][A-Z]/g, (x) => x[0] + '-' + x[1]).toLowerCase()
}

function toStringObject(x) {
    function parseObj(obj) {
        let s = '{\n'
        for (let [k, v] of Object.entries(obj)) {
            s += indent(k + ': ' + parse(v)) + ',\n'
        }
        s += '}'
        return s
    }

    function parseArr(arr) {
        let s = '[\n'
        for (let item of arr) {
            s += indent(parse(item)) + ',\n'
        }
        s += ']'
        return s
    }

    function parsePrimitive(s) {
        if (s == '') return "''"
        const known = []
        if (known.includes(s)) return s
        return s.toString()
    }

    function parse(s) {
        if (isObject(s)) {
            return parseObj(s)
        }

        if (isArray(s)) {
            return parseArr(s)
        }

        if (s == null) return 'null'

        return parsePrimitive(s)
    }

    return parse(x)
}

function toArgument(s) {
    s = s.trim()

    if (isQuote(s)) {
        return s.slice(1, -1)
    }
    if (s == '0') return 0
    if (isNumber(s)) return Number(s)
    if (s == 'false') return false
    if (s == 'true') return true
    if (s == 'null') return null
    if (s == 'Number') return Number
    if (s == 'String') return String
    return s
}

function toString(x) {
    if (isObject(x)) return JSON.stringify(x, null, 2)
    if (isArray(x)) return join(x)
    if (isRegExp(x)) return x.source
    return x.toString()
}

function toAttr(a, b) {
    return a + '=' + doublequote(b)
}
function toPascal(s) {
    return capitalize(toCamelCase(s))
}

function toCamelCase(s) {
    return uncapitalize(s.trim().replace(/[- ]\w/g, (x) => x.slice(1).toUpperCase()))
}

function toggle(state, key, from, to, duration = 750) {
    if (arguments.length == 2) {
        if (isBoolean(state[key])) state[key] = !state[key]
        return
    }

    if (arguments.length == 3) {
        if (isFunction(state)) {
            return toggleFunction(...arguments)
        }
        if (isBoolean(state[key])) {
            from = state[key]
            to = !state[key]
            duration = arguments[2]
        } else {
            to = from
            from = state[key]
        }
    }

    state[key] = to
    setTimeout(() => {
        state[key] = from
    }, duration)
}

function toDictionary(items, kt, vt) {
    if (!isNestedArray(items)) items = paired(items)
    return reduce(items, (k, v) => [kt ? kt(k) : k, vt ? vt(v) : v])
}

function toLiteralArray(s) {
    return s.slice(1, -1).split(',')
}

function toInteger(x) {
    return Math.round(x)
}

const roygbiv = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']

function numberToWord(n) {
    return numberWords[n]
}
const numberWords = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
    'twenty',
]

function hasComma(s) {
    return s.includes(',')
}

function hasLetter(s) {
    return test(/[a-zA-Z]/, s)
}

function hasWord(s) {
    return /[a-zA-Z]{3,}/.test(s)
}

function hasLookAround(s) {
    return test(/\(\?\</, s.toString())
}

function endsWithWord(s) {
    return test(/\w$/, s)
}
function endsWithNumber(s) {
    return test(/\d+$/, s)
}

function wordToNumber(s) {
    return numberWords.indexOf(s.toLowerCase())
}

function stringcall(fn, ...args) {
    if (isFunction(fn)) {
        fn = fn.name
    }
    return fn + parens(args.filter(exists).join(', '))
}

function dedent(s) {
    s = s.trimEnd().replace(/^\n+/, '')
    const spaces = getSpaces(s)
    return replace('^' + spaces, '', s)
}

function getWords(s, min = 1, max = 100) {
    const regex = RegExp(`[a-zA-Z]{${min},${max}}`, 'g')
    return s.match(regex) || []
}

function zip(a, b = null) {
    if (isNestedArray(a)) {
        b = a[1]
        a = a[0]
    }

    const store = {}
    for (let i = 0; i < a.length; i++) {
        store[a[i]] = b[i]
    }
    return store
}

function cartesianProduct(arr) {
    return arr.reduce(
        function (a, b) {
            return a
                .map(function (x) {
                    return b.map(function (y) {
                        return x.concat([y])
                    })
                })
                .reduce(function (a, b) {
                    return a.concat(b)
                }, [])
        },
        [[]]
    )
}

function curry(fn, ...kwargs) {
    return (...args) => {
        let count = 0
        for (let i = 0; i < kwargs.length; i++) {
            let kwarg = kwargs[i]
            if (kwarg === null) kwargs[i] = args[count++]
        }
        return fn(...kwargs)
    }
}

function force(x, n = 2, fallback = '') {
    if (x == null) x = []
    while (x.length < n) {
        x.push(fallback)
    }
    return x
}

function isStorage(x) {
    return test(/Storage/, x.constructor.name)
}


function isNewLine(s) {
    return /^\n+$/.test(s)
}

function colorToHex(color) {
    const dict = {
        black: '000000',
    }
    return '#' + dict[color] || dict.black
}

function iter(items, fn, ...args) {
    if (isNumber(items)) {
        const store = []
        for (let i = 0; i < items; i++) {
            store.push(fn(i, ...args))
        }
        return store
    }

    if (isObject(fn)) {
        for (let item of items) {
            if (fn[item]) {
                if (isFunction(fn[item])) {
                    fn[item](...args)
                }
            }
        }
    }

    return toArray(items).map((item, i) => {
        return fn(item, i, ...args)
    })
}

class Eater {
    constructor(regex) {
        this.regex = regex
        this.store = []
    }
    eatStart(regex) {
        const [s, match] = eatStart(regex, s)
        this.s = s.trim()
        if (!match) return 1
        this.store.push(match)
    }

    eat(regex) {
        console.log(this.regex)
        const [s, match] = mreplace(regex || this.regex, this.s)
        console.log(match)
        this.s = s.trim()
        if (!match) return 1
        this.store.push(match)
    }
    run(s) {
        this.s = s.trim()
        while (true) {
            const done = this.eat()
            this.trimSpaces()
            if (done) break
        }
        return [this.s, this.store]
    }
    get dict() {
        return
    }

    trimSpaces() {
        this.s = this.s.trim()
    }
}

function notNull(s) {
    return s !== null
}

function trimSpaces(s) {
    return s.replace(/^ +| +$/g, '')
}

function eatStart(regex, s) {
    let m = search('^' + regex, s.trim())
    if (m) return [s.slice(m), m]
    return [s, null]
}

class Matrix {
    iterate(fn) {
        let count = 0
        let linebreak
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let value = this.get(x, y)
                if (value == null) continue
                count++
                fn(value, x, y, count, linebreak)
                linebreak = false
            }
            linebreak = true
        }
    }
    constructor(x, width) {
        if (isNumber(arguments[0]) && isNumber(arguments[1])) {
            this.width = arguments[0]
            this.height = arguments[1]
            this.store = []
        } else if (isNestedArray(x)) {
            this.store = flat(x)
            this.width = x[0].length
            this.height = x.length
        } else if (isArray(x)) {
            if (!width) width = 3
            if (isObject(width)) {
                width = width.width
            }

            this.store = x
            this.width = width
            this.height = Math.ceil(this.store.length / this.width)
        }
    }

    [Symbol.iterator]() {
        this.index = 0
        return this
    }

    get(x, y) {
        return this.store[y * this.width + x]
    }

    set(x, y, value) {
        this.store[y * this.width + x] = value
    }

    getColumn(n) {
        const store = []
        let y = 0
        while (y < this.height) {
            store.push(this.get(n, y))
            y += 1
        }
        return store
    }

    getRow(n) {
        const store = []
        let x = 0
        while (x < this.width) {
            store.push(this.get(x, n))
            x += 1
        }
        return store
    }

    getColumns() {
        return iter(this.width, (i) => this.getColumn(i))
    }

    getRows() {
        return iter(this.height, (i) => this.getRow(i))
    }
}

function getStrings(s) {
    return findall(/\'.*?\'|\".*?\"/g, s).map((x) => x.slice(1, -1))
}

function normalizeSpaces(s) {
    return s.replace(/^ +/gm, (x) => {
        return ' '.repeat(fixSpaceLength(x.length))
    })

    function fixSpaceLength(n) {
        switch (n) {
            case 1:
                return 0
            case 2:
                return 4
            case 3:
                return 4
            case 4:
                return 4
            case 5:
                return 4
            case 6:
                return 8
            case 7:
                return 8
            case 8:
                return 8
            case 10:
                return 12
            case 11:
                return 12
            default:
                return n
        }
    }
}

function partial(fn, arg) {
    return function () {
        return fn(arg)
    }
}

function toStringArgument(x) {
    function parseObj(obj) {
        let s = '{\n'
        for (let [k, v] of Object.entries(obj)) {
            s += indent(k + ': ' + parse(v)) + ',\n'
        }
        s += '}'
        return s
    }

    function parseArr(arr) {
        let s = '[\n'
        for (let item of arr) {
            s += indent(parse(item)) + ',\n'
        }
        s += ']'
        return s
    }

    function parseString(s) {
        if (test(/^\+\(/, s)) return s
        return singlequote(s.toString())
    }

    function parse(s) {
        if (isObject(s)) {
            return parseObj(s)
        }

        if (isFunction(s)) {
            return s.toString()
        }

        if (isArray(s)) {
            return parseArr(s)
        }

        if (s == null) return 'null'
        if (s == '') return "''"

        if (isNumber(s)) {
            return s
        }

        return parseString(s)
    }

    return parse(x)
}

function splitmapfilter(s, regex, fn, ...args) {
    const runner = (x, i, arr) => fn(x, ...args, i)
    return split(s, regex).map(runner).filter(exists)
}
function splitMapJoin(s, delimiter, fn) {
    return split(s, delimiter).map(fn).join(delimiter)

    let output = ''
    let match = ''
    let regex = RegExp(`(.*?)(${(delimiter.source || delimiter)})`, 'gs')
    console.log({logValue:regex})
    while (exists((match = regex.exec(s)))) {
        let [a, b] = match
        console.log([a,b])
        output += fn(a)
        if (!test(rescape(b), output)) output += b
    }
}

function argsplit(s, ref, regex = '($1)(\\w+)') {
    let match = search(ncg(regex, ref), s)
    return match ? match : [null, null]
}

function partitioned(items, ...args) {
    const store = range(args.length + 1, [])
    for (let item of items.filter(exists)) {
        for (let i = 0; i < args.length; i++) {
            let arg = args[i]

            if (ftest(arg, item)) {
                store[i].push(item)
                break
            }

            if (i == args.length - 1) {
                store[store.length - 1].push(item)
            }
        }
    }
    return store
}
function isOnlyWords(s) {
    return test(/^[a-zA-Z](?: [a-zA-Z]+)*$/, s)
}
function warn(s) {
    console.log('warn'.repeat(20))
    console.log(s)
    console.log(getCaller())
    console.log('---------------------------')
}
function getSingleAndDoubleAttrs(s, mode) {
    const [text, doubles] = mreplace(/(\S+?) *= *(\S+)/g, s)
    const singles = split(text)
    if (mode == Object) {
        const store = {}
        for (let single of singles) {
            store[single] = true
        }

        for (let [a,b] of doubles) {
            store[a] = b
        }
        return store
    }
    return [singles, doubles]
}
function getOptions(s, mode) {
    if (mode == Object) {
        const [text, doubleAttrs] = mreplace(/(\S+?) *= *(\S+)/g, s)
        return [text, toDictionary(doubleAttrs, null, toArgument)]
    }
    function runner(s) {
        
    if (isOnlyWords(s)) {
        return ['', reduce(split(s), (x) => [x, true])]
    }
    if (test(/:\w/, s)) {
        let [a, b] = mreplace(/:(\w+)/g, '', s)
        return [a, reduce(b, (x) => [x, true])]
    }

    if (test(/=/, s)) {
        let [a, b] = mreplace(/(\w+)=(\w+)/g, '', s)
        const p = [a, reduce(b, (k, v) => [k, v])]
        return p
    } else {
        let [a, b] = mreplace(/[;@](\w+)/g, '', s)
        return [a, reduce(b, (x) => [x, true])]
    }
    }
    
    let [a,b] = runner(s)
    if (exists(b)) {
        b = mapObject(b, dict)
    }
    return [a, b]
}

function aggregate(s, regex, kt, vt) {
    const storage = new Storage()
    const matches = isString(s) ? 
        findall(regex, s) : s

    for (let [a, b] of matches) {
        if (kt) a = kt(a)
        if (vt) b = vt(b)
        storage.add(a, b)
    }
    return storage.value
}

function pipe(...a) {
    if (isArray(a[0])) a = a[0]
    if (isFunction(a)) return a
    return (...args) =>
        a.filter((x) => x).reduce((y, f) => (isArray(y) ? f(...y) : f(y)), args)
}


function createError() {
    try {
        throw new Error()
    } catch (e) {
        return e
    }
}


function replaceFromIndex(s, index, original, replacement) {
    let length = isNumber(original) ? original : original.length
    let before = s.slice(0, index)
    let after = s.slice(index + length)
    return before + replacement + after
}

function freplace(regex, replacement, s, flags = '') {
    if (isFunction(regex)) {
        return regex(s)
    }

    const parser = (...args) => {
        return isFunction(replacement)
            ? replacement(...args)
            : replaceTemplaterHelper(replacement, args)
        //: templater([getLast(args), ...args])
    }

    return replace(regex, parser, s, flags)
}

class Table extends Matrix {
    constructor(items, width) {
        super(items, width)

        this.simulate()
    }
    simulate() {
        const widths = this.getWidthes()
        const heights = this.getHeights()
        console.log(widths)
    }

    getWidthes() {
        return this.getColumns().map((item, i) => {
            return getLongest(item, len, null)
        })
    }

    getHeights() {
        return this.getRows().map((item, i) => {
            return getLongest(item)
        })
    }
}

function evaluate(s) {
    //dep
    return eval(parens(s.toString()))
}

function regexgetter(template, dict) {
    assert(template.startsWith('/'))
    let [regex, flags] = search(/\/(.*?)\/(\w+)$/, template)
    let keys = isObject(dict) ? Object.keys(dict) : dict
    let boundary = false

    if (flags.includes('e')) {
        keys = keys.map(mapConditional(/^\W+$/, rescape))
        flags = flags.replace('e', '')
    }

    if (flags.includes('b')) {
        boundary = true
        flags = flags.replace('b', '')
    }

    regex = regex.replace(/\$1/g, keys.join('|'))
    if (boundary) regex = '\\b' + regex + '\\b'
    return RegExp(regex, flags)
}

function hasGFlag(r) {
    return r.flags.includes('g')
}

function regexStartsWithSpaces(r) {
    return /^\^?    /.test(r.source ? r.source : r)
}
function inferlang(s) {
    let match = getExtension(s)
    if (match) {
        if (match == 'vimrc') return 'vim'
        if (match == 'bash_aliases') return 'bash'
        if (match == 'bashrc') return 'bashrc'
        return match
    }

    const dict = {
        '<': 'html',
        function: 'js',
        var: 'js',
        const: 'js',
        let: 'js',
        def: 'py',
        '.': 'css',
    }

    match = s.match(regexgetter('/^($1)/me', dict))
    if (!match) match = s.match(regexgetter('/^ *($1)/me', dict))
    return dict[match[0]]
}

function isAllCaps(s) {
    return /^[A-Z]+$/.test(s)
}

function abbreviate(s, mode) {
    const regex = /[ \._-]|(\d+|[A-Z]+[a-z]*)/
    const letters = split(s, regex).map((x) => x[0])
    return mode == Array ? letters : letters 
        .join('')
        .toLowerCase()
}
function toabrev(s) {
    let regex
    if (isAllCaps(s)) {
        regex = /[ \._]/
    } else {
        regex = /[ \._-]|(?<=[a-z])(?=[A-Z]+)/
        //regex = /[ \._-]|(?=[A-Z]+)/
    }

    const items = split(s, regex)
    return items
        .map((x) => x[0])
        .join('')
        .toLowerCase()
}
class TextTokenizer {
    constructor(key) {
        const dictRE = ncg('^($1) *(.+)', dict)
        const splitRE =
            /(\n+|    +|bold \S+|bte.*|@.+|#\w+?(?:e .*?(?:\$|$)| \w+))/
        const items = split(s, splitRE)
        const store = []
        this.run
    }
    run(s) {
        this.s = s
        this.items = split(this.s, this.regex)
        console.log(this.items)
    }
    //new TextTokenizer('reddit')
}

function getFunctionNames(s) {
    return unique(findall(
        '^(?:var|const|class|(?:async )?function(?:\\*|!)?) (\\w+)',
        s,
        'gm'
    ))
}

function removeSpaces(s) {
    return s.replace(/ /g, '')
}


function identity(...args) {
    return args.length == 1 ? args[0] : args
}

function smallify(x) {
    if (isString(x)) {
        x = x.trim()
        if (lineCount(x) > 3) {
            return getFirstLine(x) + '\n...\n' + getLastLine(x)
        }
        return x
    }
    return x.length == 0 ? null : x.length == 1 ? x[0] : x
}

function spaceToCamel(s) {
    let cap
    let lower
    return listgetter(s, ' ')
        .map((item, i, arr) => {
            if (i == arr.length - 1 && item == 'to') {
                return 2
            }

            if (item == 'new') {
                cap = true
                return 'new'
            }

            if (item == 'lowercase') {
                lower = true
                return ''
            }

            if (item == 'cap' || item == 'capitalize') {
                cap = true
                return ''
            }
            if (cap) {
                if (lower) {
                    lower = false
                } else {
                    item = capitalize(item)
                }
                cap = false
            }

            return item.length == 1 || i == 0 || arr[i - 1].endsWith('.')
                ? item
                : capitalize(item)
        })
        .join('')
}

function listgetter(x, regex) {
    if (isArray(x)) {
        return x
    }
    return split(x, regex)
}

function spaceToSnake(s) {
    return listgetter(s, ' ').join('_')
}

function createConfig(s) {
    if (arguments.length > 1) {
        return reduce(paired(Array.from(arguments)))
    }
    if (!s) return { emptyConfigValue: true }
    if (isWord(s)) return { [s.trim()]: true }
    if (isObject(s)) {
        return s
    }
    s = s.trim()
    let regex
    if (test(/  /, s)) {
        //regex = /(.*?)  (.*?)(?=$|  )/g
        regex = /(\S.*?) (\S.*?)(?=  |$)/g
    } else {
        regex = /(.*?) *[:=] *(.*?)(?:$|, ?|  )/g
    }
    //console.log(regex)
    return reduce(findall(regex, s), (k, v) => {
        return [
            k.trim(),
            v ? toArgument(v) : true,
        ]
    })
}

function jspy(lang, key) {
    const indexes = ['js', 'py', 'vim', 'bash', 'css', 'html']
    const ref = {
        compiler: ['node', 'python3', 'bash'],
        runtime: ['node', 'python3', 'bash'],
        const: ['const ', '', 'let'],
        name: [spaceToCamel, spaceToSnake],
        params: [spaceToCamel, spaceToSnake],
        //'variablefn': [variablejs, variablepy]
    }

    if (key == lang) {
        let index = indexes.indexOf(lang)
        return reduce(ref, (k, v) => [k, v[index]])
    }
    const value = ref[key][indexes.indexOf(lang)]
    return value
}
function curryStart(...kwargs) {
    const fn = kwargs.pop()
    return function (...args) {
        fn(...kwargs, ...args)
    }
}
function stateCurryEnd(state, key, ...kwargs) {
    return function stateCurry(...args) {
        state[key](...args, ...kwargs)
    }
}

function stateCurryStart(state, key, ...kwargs) {
    return function stateCurry(...args) {
        return state[key](...kwargs, ...args)
    }
}

function curryEnd(...kwargs) {
    const fn = kwargs.shift()
    return function (...args) {
        fn(...args, ...kwargs)
    }
}

function timestamp() {
    let [h, m, s, ms] = getHMSM()
    //h = zeroPad(h)
    m = zeroPad(m)
    s = zeroPad(s)
    return `${h}:${m}:${s}:${ms}`
    s = new Date()
    s = s.toLocaleTimeString()
    return s
}
//console.log(timestamp())

function wordCount(s) {
    return split(s).length
}

function exporter(state, key, ...args) {
    state = new state(...args)
    return state[key].bind(state)
}

function stateTrace(state, fnKey) {
    state[fnKey] = trace(state[fnKey].bind(state))
}
class CodeLibrary {
    constructor(s) {
        //stateTrace(this, 'find')
        const functions = getfunctions(s.toString())
        this.store = mapfilter(functions, getFunctionInfo)
    }
    static create(s) {
        return new CodeLibrary(s)
    }
    getLibrary() {
        return reduce(this.store, (x) => [x.name, x.body])
    }
    get(name) {
        const item = this.find(name)
        return item.body
    }
    find(name) {
        let item = this.store.find((x) => x.name == name)
        if (!item) item = this.store.find((x) => test(name, x))
        if (!item) item = {}
        return item
    }
}

function getfunctions(s, mode = 'js') {
    return split(
        s,
        /\n+(?=export \w+|const|async|class|(@.+\n)*function|var|let)/
    ).map(trimmed)
}

function mapfilter(items, fn, filter) {
    //console.log([items])
    const store = []
    for (let i = 0; i < items.length; i++) {
        let item = items[i]
        if (!item) continue
        let value = fn(item, i)
        if (value) {
            if (filter && !filter(value)) continue
            store.push(value)
        }
    }
    return store
}


function foo(a, vb, {ff} = {
    
    }) {
    
}
function getParameters(s) {
    let r1 = /^function \w+ *\((.*?(?:} = {[^]+?)?)\) {/
    let r2 = /^function \w+ *\((.*?(?:} = {[^]+?)?)\) {/
    let m = itersearch(s, r1, r2)
    if (!m) return []
    return findall(/(?:\.\.\.)?(\w+)(?:,|$)/g, m)
}

async function foo() {
    timer = new Clock(12)
    timer.onTick = console.log
    await timer.start()
    console.log('ooo')
}

function scopedEval(expr, context) {
    if (!exists(context)) {
        return eval(expr)
    }
    const evaluator = Function.call(
        null,
        ...Object.keys(context),
        'expr',
        "return eval('expr = undefined;' + expr)"
    )
    return evaluator.call(null, ...Object.values(context), expr)
}

function timegetter(message) {
    let time = Date.now()
    return time
    console.log(timestamp(), message || '')
    return time
}
function getErrorInfo(e, getStack) {
    if (isString(e) || e.stack.length < 10) {
        return 
    }
    let s = e.stack
    let [name, message] = search(/(\w+): *(.*)/, s)

    let regex = /^ *at (\S+) \((.*?):(\d+):(\d+)/gm
    let stack = findall(regex, s).map(([caller, file, line, ch], i) => {
        line = Number(line)
        ch = Number(ch)
        if (caller.includes('.')) {
            let [className, method] = caller.split('.')
            return { class: className, method, file, line: Number(), ch }
        }
        return { caller, file, line, ch }
    })
    return getStack ? {
        name,
        message,
        stack,
    } : {name, message, stack: stack[0]}
}


function getDetailedErrorInfo(e) {
    let s = e.stack.slice(0, -465)
    let [name, message] = search(/(\w+): *(.*)/, s)

    let regex = /^ *at (\S+) \((.*?):(\d+):(\d+)/gm
    let stack = findall(regex, s).map(([caller, file, line, ch], i) => {
        line = Number(line)
        ch = Number(ch)
        if (caller.includes('.')) {
            let [className, method] = caller.split('.')
            return { class: className, method, file, line: Number(), ch }
        }
        return { caller, file, line, ch }
    })
    return {
        name,
        message,
        stack,
    }
}

class ItemIter {
    constructor(items) {
        this.load(items)
    }
    next() {
        if (this.index > this.items.length - 1) return false
        this.value = this.items[this.index++]
        return true
    }
    load(s) {
        if (!s) return
        const items = xsplit(s)
        this.items = items
        this.index = 0
        this.ei = 0
        this.value = this.items[this.index++]
        return items
    }
}

function forEach(items, fn, options) {
    const iter = new Iter(items)
    const clock = new Clock(iter.size)
    clock.setOptions(options)
    clock.onTick = () => {
        fn(iter.value)
        iter.next()
    }
    return clock.start()
}

function getCaller(target, simple = true) {
    let stack = getStackTrace().slice(3)
    if (simple) stack = stack.map((x) => x[0])
    switch (target) {
        case '':
        case null:
        case undefined:
        case 0:
            return stack[0]
        case -1:
        case -2:
        case -3:
        case 1:
            return stack[Math.abs(target)]
        case 2:
            return stack[2] + '-' + stack[1]
        case 3:
            return stack[3] + '-' + stack[2] + '-' + stack[1]
        default:
            return stack.find(testf(target))
    }
}

class WbooError extends Error {
    constructor(message) {
        super(message)
        this.foo = 'f'
    }
}

function completer(word, ref) {
    let parts = word.split('.')
}
abclist = ['a', 'b']

function owalker(o) {
    return Object.getOwnPropertyNames(o)
}
function vars(obj) {
    //console.log(owalker(obj))
    let s
    let name
    let _type
    if (!obj.prototype) {
        s = obj.constructor.toString()
        name = obj.constructor.name
        _type = 'class'
    } else if (obj.name) {
        name = obj.name
        s = obj.toString()
        _type = type(obj)
    }
    const info = { name, type: _type }

    let props = getClassProperties(s)
    if (!exists(props)) {
        props = owalker(props)
    }

    return { props, ...info }
}

function trywrap(fn, handler) {
    return (...args) => {
        try {
            return fn(...args)
        } catch (e) {
            return handler(e)
        }
    }
}

function getLoggableProperties(x) {
    let value = isClass(x) ? getClassProperties(x) : stringify(x)
    return value
}

function veval(s) {
    const vuelog = (x) => boop.push(getLoggableProperties(x))
    const boop = []
    const logs = []

    const code = s.replace(/cl (.+)/g, (_, x) => {
        logs.push(x)
        return 'vuelog($1)'
    })

    try {
        eval(s)
    } catch (e) {
        const { name, message, stack } = getDetailedErrorInfo(e)
        logs.push(name + ': ' + message)
        vuelog(stack[0])
    }
    return zip(logs, boop)
}

//function toNumber(s) {
    //if (isNumber(s)) {
        //return Number(s)
    //}
//}

function removeStrings(s) {
    return s.replace(/\'.*?\'|\".*?\"|\`[^]*?\`/g, '')
}

function addf(s) {
    return (x) => x + s
}

function toModuleImports(path, items) {
    return `${brackify(
        'var',
        toArray(items).map(addf(','))
    )} = require("${fixFilePath(path)}")`
}
function fixFilePath(s) {
    s = addExtension(s, 'js')
    if (test(/^[\/.]/, s)) {
        return s
    }
    return './' + s
}

function toModuleExports(items) {
    const moduleExports =
        '\n' + join(toArray(items).map((x) => `module.exports.${x} = ${x}`))
    return moduleExports
}

function lineCount(s) {
    return count('\n', s) + 1
}

function saybye() {
    console.log('bye')
}

function sayhi(...args) {

    if (args) {
        console.log('hi from args', ...args)
        return args[0] + 'hi'
    }
    else {
        console.log('hiya hiya')
        return 'sayinghi'
    }
}

function captureRegex(regex, flags) {
    if (isString(regex)) {
        return RegExp(parens(regex, flags))
    }
    else {
        return RegExp(parens(regex.source), regex.flags)
    }
}

function splitLast(s, regex, flags) {
    const items = s.split(captureRegex(regex, flags))
    let a = items[0]
    let b = ''
    //console.log(items)
    for (let i = 1; i < items.length - 1; i+=2) {
        let item = items[i]
        let next = items[i + 1]
        
        if (i == items.length - 2) {
            b += item
            b += next
            return [a, b]
        }
        else {
            a += item
            a += next
        }
    }
}
function replaceLast(regex, replacement, s) {
    let match
    let lastMatch
    regex = addGFlag(regex)
    while (exists((match = regex.exec(s)))) {
        lastMatch = match
    }
    let index = lastMatch.index
    let length = lastMatch[0].length
    return s.slice(0, index) + replacement + s.slice(index + length)
}
function bringToLifeLambda(s) {
    // the scope is prehibitrd to this.indexifle
    //uncapitalize(x.slice(2)) + ': ' + x
    if (!test(/^function|^\(/, s)) {
        s = '(x) => ' + s
    }
    s = parens(s)
    return eval(s)
}
function bringToLife(s, context) {
    function prepare(s) {
        s = removeComments(s)
        s = removeQuotes(s)
        s = parens(s)
        return s
    }

    s = prepare(s)
    return context ? scopedEval(s, context) : eval(s)
}

function addDeepKey(ref, key, value) {
    let [keys, last] = splitOnceReverse(key, '.')
    keys.forEach((item, i) => {
        if (!ref.hasOwnProperty(item)) {
            ref[item] = {}
        }
        ref = ref[item]
    })
    ref[last] = toArgument(value)
    return ref
}

function collectObjectFromString(s) {
    split(s, deli)
}
function looksLikeProse(s) {
    return test(/^[a-zA-Z]{2,}/, s)
}

function splitKatex(s) {
    if (!hasLatex(s)) return [s]
    const regex = /(\.? (?:[a-zA-Z]{2,}(?: |$))+)/
    return split(s, regex).filter(exists)
}

function hasLatex(s) {
    return test(/\\\w/, s)
}

function getFirstParameter(fn) {
    return search(/\((\w+)/, String(fn))
}
function isStandardHtml(s) {
    const natives = [
        //'html',
        //'main',
        'body',
        'div',
        'p',
        'a',
        'section',
        'iframe',
        'ul',
        'li',
    ]
    return natives.includes(s)

}
function isCssSymbol(s) {
    return test(/^[:#.*]/, s)
}
function fixSelector(s) {
    if (isCssSymbol(s)) return s
    if (isStandardHtml(s)) return s 
    return '.' + s
}

function fixUrl(s) {
    if (!s.startsWith('http')) s = 'https://' + s
    if (!s.includes('.')) s += '.com'
    return s
}

function isSymbol(s) {
    return test(/^[\W\s]\W*$/, s)
}

function consoleThrow(...args) {
    console.log(...args)
    throw 'CONSOLE-THROWw'
}

function getChunks(s, regex) {
    if (!regex) regex = /\n+(?=[\w.#])/
    return s.trim().split(regex).map(trimmed)
}

function pluralize(word, amount) {
    if (amount !== undefined && amount === 1) {
        return word
    }
    const plural = {
        '(quiz)$': '$1zes',
        '^(ox)$': '$1en',
        '([m|l])ouse$': '$1ice',
        '(matr|vert|ind)ix|ex$': '$1ices',
        '(x|ch|ss|sh)$': '$1es',
        '([^aeiouy]|qu)y$': '$1ies',
        '(hive)$': '$1s',
        '(?:([^f])fe|([lr])f)$': '$1$2ves',
        '(shea|lea|loa|thie)f$': '$1ves',
        sis$: 'ses',
        '([ti])um$': '$1a',
        '(tomat|potat|ech|her|vet)o$': '$1oes',
        '(bu)s$': '$1ses',
        '(alias)$': '$1es',
        '(octop)us$': '$1i',
        '(ax|test)is$': '$1es',
        '(us)$': '$1es',
        '([^s]+)$': '$1s',
    }
    const irregular = {
        move: 'moves',
        foot: 'feet',
        goose: 'geese',
        sex: 'sexes',
        child: 'children',
        man: 'men',
        tooth: 'teeth',
        person: 'people',
    }
    const uncountable = [
        'sheep',
        'fish',
        'deer',
        'moose',
        'series',
        'species',
        'money',
        'rice',
        'information',
        'equipment',
        'bison',
        'cod',
        'offspring',
        'pike',
        'salmon',
        'shrimp',
        'swine',
        'trout',
        'aircraft',
        'hovercraft',
        'spacecraft',
        'sugar',
        'tuna',
        'you',
        'wood',
    ]
    if (uncountable.indexOf(word.toLowerCase()) >= 0) {
        return word
    }
    for (const w in irregular) {
        const pattern = new RegExp(`${w}$`, 'i')
        const replace = irregular[w]
        if (pattern.test(word)) {
            return word.replace(pattern, replace)
        }
    }

    for (const reg in plural) {
        const pattern = new RegExp(reg, 'i')
        if (pattern.test(word)) {
            return word.replace(pattern, plural[reg])
        }
    }
    return word
}

function depluralize(word, amount) {
    if (amount !== undefined && amount !== 1) {
        return word
    }
    const singular = {
        '(quiz)zes$': '$1',
        '(matr)ices$': '$1ix',
        '(vert|ind)ices$': '$1ex',
        '^(ox)en$': '$1',
        '(alias)es$': '$1',
        '(octop|vir)i$': '$1us',
        '(cris|ax|test)es$': '$1is',
        '(shoe)s$': '$1',
        '(o)es$': '$1',
        '(bus)es$': '$1',
        '([m|l])ice$': '$1ouse',
        '(x|ch|ss|sh)es$': '$1',
        '(m)ovies$': '$1ovie',
        '(s)eries$': '$1eries',
        '([^aeiouy]|qu)ies$': '$1y',
        '([lr])ves$': '$1f',
        '(tive)s$': '$1',
        '(hive)s$': '$1',
        '(li|wi|kni)ves$': '$1fe',
        '(shea|loa|lea|thie)ves$': '$1f',
        '(^analy)ses$': '$1sis',
        '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$':
            '$1$2sis',
        '([ti])a$': '$1um',
        '(n)ews$': '$1ews',
        '(h|bl)ouses$': '$1ouse',
        '(corpse)s$': '$1',
        '(us)es$': '$1',
        s$: '',
    }
    const irregular = {
        move: 'moves',
        foot: 'feet',
        goose: 'geese',
        sex: 'sexes',
        child: 'children',
        man: 'men',
        tooth: 'teeth',
        person: 'people',
    }
    const uncountable = [
        'sheep',
        'fish',
        'deer',
        'moose',
        'series',
        'species',
        'money',
        'rice',
        'information',
        'equipment',
        'bison',
        'cod',
        'offspring',
        'pike',
        'salmon',
        'shrimp',
        'swine',
        'trout',
        'aircraft',
        'hovercraft',
        'spacecraft',
        'sugar',
        'tuna',
        'you',
        'wood',
    ]
    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(word.toLowerCase()) >= 0) {
        return word
    }
    // check for irregular forms
    for (const w in irregular) {
        const pattern = new RegExp(`${irregular[w]}$`, 'i')
        const replace = w
        if (pattern.test(word)) {
            return word.replace(pattern, replace)
        }
    }
    // check for matches using regular expressions
    for (const reg in singular) {
        const pattern = new RegExp(reg, 'i')
        if (pattern.test(word)) {
            return word.replace(pattern, singular[reg])
        }
    }
    return word
}

function findallStrings(s) {
    return findall(/\'.*?\'|\".*?\"/g, s).map((x) => x.slice(1, -1))
}

function isStandardCss(s) {
    if (test(/^.*?{/, s)) return true
}
function isDoubleIterable(x) {
    return isArray(x[0]) && x[0].length == 2
}
function reduceToString(iterable, fn, mode = 'entries') {
    if (!fn && isObject(iterable)) {
        fn = (k, v) => v
    }
    iterable = prepareIterable(iterable, mode)
    const runner = isDoubleIterable(iterable) ? (x, i) => fn(...x, i) : fn
    return join(iterable.map(runner).filter(exists))
}

function join(arr) {
    if (arguments.length > 1) {
        arr = Array.from(arguments).filter(exists).map(String)
    }

    else if (isString(arr)) {
        return arr
    }

    else if (isObject(arr)) {
        arr = Object.values(arr)
    } 
    
    else {
        arr = Array.from(arr)
    }

    let s = ''
    for (let item of arr) {
        s += item
        s += item.includes('\n') ? '\n\n' : '\n'
    }
    return s
}

function wrap(s, delimiter = '\n') {
    return delimiter + s + delimiter
}

function hasOwn(obj, key) {
    return obj.hasOwnProperty(key)
}

function startsWithSymbol(s) {
    const startsWithSymbolRE = /^[^\w\s]/
    return test(startsWithSymbolRE, s)
}

function splitOnceSymbolOrWord(s) {
    const value = startsWithSymbol(s)
        ? search(/^([^\w\s]+)(.*)/, s)
        : search(/^(\w+) (\w.*)/, s)

    if (!value) return [null, null]
    if (value.length == 1) return [value, null]
    return value
}

class IndexError extends Error {
    constructor(...args) {
        super(...args)
    }
}

function mergeProps(...args) {
    const store = {}

    function childRunner(store, k, v) {
        let current = store[k]
        if (isObject(v)) {
            runner(v, current)
        } else if (isArray(v)) {
            for (let item of v) {
                if (!current.includes(item)) {
                    store[k].push(item)
                }
            }
        } else if (isFunction(v)) {
            store[k] = mergeFunction(current, v)
        }
    }
    function runner(arg, store) {
        if (!arg) return
        for (let [k, v] of Object.entries(arg)) {
            if (store.hasOwnProperty(k)) {
                childRunner(store, k, v)
            } else {
                store[k] = v
            }
        }
    }

    for (let arg of args) {
        runner(arg, store)
    }
    return store
}

function mergeFunction(current, next) {
    return function mergedFunction(...args) {
        let a = current(...args)
        let b = next(...args)
    }
}
function compose(...fns) {
    return (x) => fns.reduceRight((acc, f) => f(acc), x)
}

function coerceToString(x) {
    return x.toString()
}

function coerceToNumber(x) {
    //console.log([x])
    if (isNumber(x)) {
        return Number(x)
    }
    if (isString(x)) {
        let y = wordToNumber(x)
        if (y > -1) return x
        return Number(x.replace(/\D+/g, ''))
    }
}

function startsWithPeriod(s) {
    return test(/^\./, s)
}

function splitOptionalComma(s) {
    return s.trim().split(/,? +/)
}

function brackify(name, value) {
    return (name ? name + ' ' : '') + '{' + newlineIndent(value) + '}'
}

function hasColon(s) {
    return test(/:/, s)
}

function curryEnd(fn, ...args) {
    return (...bargs) => fn(...bargs, ...args)
}

function curryStart(fn, ...args) {
    if (!isFunction(fn)) {
        return stateCurryStart(fn, ...args)
    }
    return (...bargs) => fn(...args, ...bargs)
}

function hasDash(s) {
    return test(/-/, s)
}
function getFirstLine(s) {
    return s.match(/^.*/)[0]
}

function removeStartingSpaces(s) {
    return s.toString().replace(/^\n*/, '').trimEnd()
}

function toFunctionRegex(s, flags = 'm') {
    const ignore = ['run']
    if (s.length <= 3 && !ignore.includes(s)) {
        s = toAbbreviationRegex(s)
    }
    return RegExp(
        '^(?:(?:async )?function|class|const|var|let) ' +
            s +
            '\\b[\\w\\W]*?\\n}',
        flags
    )
}

function getSpacesFromOffset(offset, original) {
    let ch
    let s = ''
    let a = offset
    while (a > 0 && ch != '\n') {
        ch = original.charAt(a--)
        s += ch
    }
    let spaces = search(/ +(?=\n)/, s)
    return (spaces && spaces.length) || 0
}

function countCaptureGroups(regex) {
    //util
    let s = regex.source || regex
    return (s.match(/(?:[^\\]|^)\((?![\?])/g) || []).length
}

function getLastLine(s) {
    return s.match(/.*?$/)[0]
}
function splitThePage(s, key) {
    return s.split(RegExp(wrap(key || '---+'))).map(trimmed)
}

function itersearch(s, ...regexes) {
    if (!s) return
    s = s.trim()
    for (let regex of regexes) {
        let value = search(regex, s)
        if (value) {
            return value
        }
    }
    return null
}

module.exports.test = test
module.exports.exists = exists
module.exports.isPrimitive = isPrimitive
module.exports.difference = difference
module.exports.unique = unique
module.exports.findall = findall
module.exports.getFunctionName = getFunctionName
module.exports.getFunctionNames = getFunctionNames
module.exports.insertText = insertText
module.exports.isArray = isArray
module.exports.isObject = isObject
module.exports.toArray = toArray
module.exports.removeComments = removeComments
module.exports.reduce = reduce
module.exports.isString = isString
module.exports.joined = joined
module.exports.prepareIterable = prepareIterable
module.exports.dedent = dedent
module.exports.toDictionary = toDictionary
module.exports.newlineIndent = newlineIndent
module.exports.trimmed = trimmed
module.exports.splitonce = splitonce
module.exports.search = search
module.exports.ncg = ncg
module.exports.isNestedArray = isNestedArray
module.exports.isNumber = isNumber
module.exports.roygbiv = roygbiv
module.exports.parens = parens
module.exports.hasNumber = hasNumber
module.exports.toCamelCase = toCamelCase
module.exports.split = split
module.exports.parseJSON = parseJSON
module.exports.stringcall = stringcall
module.exports.doublequote = doublequote
module.exports.toStringArgument = toStringArgument
module.exports.aggregate = aggregate
module.exports.splitmapfilter = splitmapfilter
module.exports.getOptions = getOptions
module.exports.argsplit = argsplit
module.exports.Storage = Storage
module.exports.sorted = sorted
module.exports.len = len
module.exports.isInteger = isInteger
module.exports.sum = sum
module.exports.replace = replace
module.exports.templater = templater
module.exports.Matrix = Matrix
module.exports.noop = noop
module.exports.isNewLine = isNewLine
module.exports.getLongest = getLongest
module.exports.isFunction = isFunction
module.exports.n2char = n2char
module.exports.trimSpaces = trimSpaces
module.exports.getLast = getLast
module.exports.dreplace = dreplace
module.exports.flat = flat
module.exports.capitalize = capitalize
module.exports.paired = paired
module.exports.ftest = ftest
module.exports.find = find
module.exports.getIndent = getIndent
module.exports.matchgetter = matchgetter
module.exports.matchall = matchall
module.exports.depluralize = depluralize
module.exports.singlequote = singlequote
module.exports.freplace = freplace
module.exports.replaceFromIndex = replaceFromIndex
module.exports.addGFlag = addGFlag
module.exports.tryval = tryval
module.exports.indent = indent
module.exports.toSpaces = toSpaces
module.exports.evaluate = evaluate
module.exports.isRegExp = isRegExp
module.exports.Eater = Eater
module.exports.cartesianProduct = cartesianProduct
module.exports.zip = zip
module.exports.toArgument = toArgument
module.exports.regexgetter = regexgetter
module.exports.hasGFlag = hasGFlag
module.exports.regexStartsWithSpaces = regexStartsWithSpaces
module.exports.inferlang = inferlang
module.exports.toabrev = toabrev
module.exports.mreplace = mreplace
module.exports.linegetter = linegetter
module.exports.assert = assert
module.exports.removeAllComments = removeAllComments
module.exports.stringify = stringify
module.exports.Cache = Cache
module.exports.toVariable = toVariable
module.exports.datestamp = datestamp
module.exports.timestamp = timestamp
module.exports.jspy = jspy
module.exports.spaceToCamel = spaceToCamel
module.exports.curryStart = curryStart
module.exports.curryEnd = curryEnd
module.exports.isUrl = isUrl
module.exports.filtered = filtered
module.exports.Clock = Clock
module.exports.removeStrings = removeStrings
module.exports.toModuleImports = toModuleImports
module.exports.type = type
module.exports.toModuleExports = toModuleExports
module.exports.getIndentAndLine = getIndentAndLine
module.exports.isDefined = isDefined
module.exports.isWord = isWord
module.exports.toSnakeCase = toSnakeCase
module.exports.toAttr = toAttr
module.exports.toDashCase = toDashCase
module.exports.quotify = quotify
module.exports.fixUrl = fixUrl
module.exports.fixSelector = fixSelector
module.exports.getWords = getWords
module.exports.CodeLibrary = CodeLibrary
module.exports.toStringDictionaryEntry = toStringDictionaryEntry
module.exports.insertBelow = insertBelow
module.exports.fparse = fparse
module.exports.toStringCallable = toStringCallable
module.exports.getChunks = getChunks
module.exports.range = range
module.exports.getFirstWord = getFirstWord
module.exports.pluralize = pluralize
module.exports.rescape = rescape
module.exports.findallStrings = findallStrings
module.exports.compose = compose
module.exports.reduceToString = reduceToString
module.exports.isStandardCss = isStandardCss
module.exports.startsWithPeriod = startsWithPeriod
module.exports.splitOptionalComma = splitOptionalComma
module.exports.brackify = brackify
module.exports.hasColon = hasColon
module.exports.hasDash = hasDash
module.exports.getSpaces = getSpaces
module.exports.getFunctionInfo = getFunctionInfo
module.exports.getLastLine = getLastLine
module.exports.countCaptureGroups = countCaptureGroups
module.exports.getSpacesFromOffset = getSpacesFromOffset
module.exports.toFunctionRegex = toFunctionRegex
module.exports.removeStartingSpaces = removeStartingSpaces
module.exports.getFirstLine = getFirstLine
module.exports.join = join
module.exports.splitThePage = splitThePage
module.exports.bringToLife = bringToLife
module.exports.tail = tail
module.exports.addf = addf
module.exports.comment = comment
module.exports.paired = paired
module.exports.split = split
module.exports.exists = exists
module.exports.splitThePage = splitThePage
module.exports.bringToLife = bringToLife
module.exports.matchall = matchall
module.exports.getChunks = getChunks
module.exports.sayhi = sayhi
module.exports.Storage = Storage
module.exports.prepareRegex = prepareRegex
module.exports.prepareRegex = prepareRegex
module.exports.toSpaces = toSpaces
module.exports.comment = comment
module.exports.getFunctionNames = getFunctionNames
module.exports.toModuleExports = toModuleExports
module.exports.getLongest = getLongest
module.exports.CodeLibrary = CodeLibrary
//console.log(getLongest([{a:1}, {a:3}], (x) => x.a, Object))
//console.log(lineCount('hi'))
module.exports.lineCount = lineCount
module.exports.exists = exists
module.exports.iter = iter
module.exports.iter = iter

function findError(s) {
    const chunks = getChunks(s)
    const store = []

    for (let chunk of chunks) {
        try {
            eval(chunk)
        } catch (e) {
            if (e.constructor.name == 'ReferenceError') {
                continue
            }
            store.push([e.toString(), chunk])
        }
    }
    console.log(store)
    console.log(store.length)
    return store
}

function hasCamelCase(s) {
    return test(/[a-z][A-Z]/, s)
}

function lbreplace(regex, replacement, s, flags) {
    let lbRegex
    let newRegex

    if (isRegExp(regex)) {
        regex = regex.toString()
        flags = regex.match(/\/(\w+)$/)
        flags = (flags && flags[1]) || ''
        regex = regex.slice(1).replace(/\/\w+$/, '')
    }

    if (test(/\?<=/, regex)) {
        let temp = ''
        let index = 0
        let close = 0
        let open = 0
        while (true) {
            let prev = regex[index - 1]
            let char = regex[index++]
            if (prev != '\\') {
                if (char == '(') {
                    open += 1
                } else if (char == ')') {
                    close += 1
                }
            }
            temp += char
            if (open == close) {
                break
            }
        }

        newRegex = regex.replace(/\?<=/, '?:')
        lbRegex = temp.replace(/\?<=/, '?:')
        return replace(newRegex, parser, s, flags)
    } else {
        return replace(regex, replacement, s, flags)
    }

    function parser(...args) {
        let x = args[0]
        //console.log(lbRegex); throw ''
        //console.log(x); throw ''
        let [text, lb] = mreplace(lbRegex, '', x, flags.replace('g', ''))
        //console.log([text, lb]); throw ''
        return lb + replacement(text, ...args.slice(1))
    }
}

function sreplace(s, r, f, flags = 'g') {
    r = rescape(r).replace(/\\\$1/g, '(\\w+)')
    return s.replace(RegExp(r, flags), (_, x) => {
        return eval(f.replace(/\$1/, singlequote(x)))
    })
}

function toRequireString(s) {
    return `const ${removeExtension(s)} = require('${s}')`
}


function removeFunctionPrefix(s) {
    return s.replace(/function /, '')
}
function removeExtension(s) {
    return s.replace(/\.\w+$/, '')
}

module.exports.coerceToNumber = coerceToNumber

function getStackTrace(e) {
    if (!e) e = createError()
    const s = isString(e) ? e : e.stack
    //console.log(s)
    const r = /at (?:new |Object\.)?([<>a-zA-Z0-9\.]+) .*?(\d+):\d+\)/g
    return findall(r, s)
}

function getStackInfo(e) {
    // DONT WRITE CONSOLE.LOG
    const stack = getStackTrace(e)
    //original(stack)
    for (let i = stack.length - 1; i >= 0; i--) {
        let name = stack[i][0]
        //original(name)
        switch (name) {
            case 'display':
            case 'lambdaDisplay':
            case 'proxyAssertion':
            case 'Console.display':
                return stack[i + 1]

            case '<anonymous>':
                if (stack[i - 1][0] == 'Console.display')
                    return ['global', stack[i][1]]
        }
    }
    return stack[0]
}
//rename sreplace ereplace
module.exports.modularIncrement = modularIncrement
module.exports.blockComment = blockComment
//rn partitioned partition
module.exports.modularIncrementNumber = modularIncrementNumber
module.exports.getLastWord = getLastWord
module.exports.join = join
module.exports.linegetter = linegetter
module.exports.depluralize = depluralize

function htmlify(s) {
    if (hasHtml(s)) return s
    s = removeComments(s)
    s = smartDedent(s)
    const dict = {
        list(s) {
            const [a, b] = splitonce(s)
            const items = b ? split(b, ',') : split(a, ',')
            const className = b ? a : 'list'
            const childClassName = depluralize(className) + '-' + 'child'
            return divify(
                'ul',
                className,
                items.map((x) => divify('li', childClassName, x))
            )
        },
    }
    function fn(line) {
        let [a, b] = splitonce(line)
        if (a in dict) {
            return dict[a](b)
        }
        return divify('div', a, b)
    }
    return join(linegetter(s).map(fn))
}

function isCss(s) {
    return test(/^\./, s)
}
class IndexedMap {
    combine(...args) {
        const map = new IndexedMap()
        map.keys = this.keys
        map.values = this.values

        for (let arg of args) {
            map.set(...arg)
        }
        return map
    }

    [Symbol.iterator]() {
        this.index = 0
        return this
    }
    next() {
        const value = this.values[this.index++]
        const done = this.index > this.values.length
        return { value, done }
    }

    constructor() {
        this.index = 0
        this.values = []
        this.keys = []
    }
    has(k) {
        return this.keys.includes(k)
    }
    set(k, v) {
        if (this.has(k)) {
            const index = this.keys.indexOf(k)
            this.values[index] = v
        } else {
            this.keys.push(k)
            this.values.push(v)
        }
    }
    get size() {
        return this.keys.length
    }
    get(key, update = true) {
        let index = this.index
        if (!key) {
            index = 0
        } else if (key == 1 || key == -1) {
            index += key
            if (index == this.size) index = 0
            else if (index == -1) index = this.size - 1
        } else if (isNumber(key)) {
            index = Number(key)
            if (index >= this.size) index = this.size - 1
            if (index < 0) index = 0
        } else if (isString(key)) {
            key = expensiveFuzzyMatch(key, this.keys)
            if (key) {
                index = this.keys.indexOf(key)
                console.log('found it', index)
            }
            else {
                return [null, null]
            }
        }
        if (update) {
            this.index = index
            this.key = this.keys[this.index]
            this.value = this.values[this.index]
            return [this.key, this.value]
        }
        else {
            return [
                this.keys[index],
                this.values[index]
            ]
        }
    }
}

function isSingleCssProperty(s) {
    return test(/^.*?{\n.+\n}/, s)
}


function smartDedent(s) {
    s = replace(/^\n*|\n$/g, '', s, 'g')
    const spaces = search(/^ *(?=\S)/m, s)
    const secondLineSpaces = search(/\n *(?=\S)/, s)
    if (!spaces  && secondLineSpaces && secondLineSpaces.length > 4) {
        return replace('^' + secondLineSpaces.slice(5), '', s, 'gm').trim()
    }
    else {
        s = replace('^' + spaces, '', s, 'gm')
        s = removeComments(s)
        return s.trim()
    }
}

function hasHtml(s) {
    if (s.includes('<')) return true
}

class Iter {
    set parser(fn) {
        this._parser = fn
    }
    get size() {
        return this.items.length
    }
    constructor(x) {
        this.items = xsplit(x)
        this.index = 0
    }
    test(x) {
        return ftest(x, this.value)
    }
    break() {
        this.index--
    }
    peek() {
        return this.items[this.index]
    }
    get remaining() {
        return this.items.slice(this.index)
    }
    replace(x) {
        this.items[this.index] = fparse(x, this.value)
    }
    next() {
        if (this.index > this.items.length - 1) return false
        this.value = this.items[this.index++]
        this.nextValue = this.items[this.index]
        if (this._parser) this.parsed = this._parser(this.value)
        if (this._sets) {
            for (let [k, v] of Object.entries(this._sets)) {
                this[k] = v(this.value)
            }
        }
        return true
    }

    set(key, fn) {
        if (!this._sets) this._sets = {}
        this._sets[key] = fn
    }
}

class LineEdit {
    toString() {
        return this.getValue()
    }

    insertLineBelow(index, content) {
        this.getset(index, (line, spaces) => {
            const spacing = isEnterBlock(line) ? 4 : 0
            return indent(content, spacing) + '\n' + line
        })
    }

    insertLineAbove(index, content) {
        this.getset(index, (line, spaces) => {
            return content + '\n' + line
        })
    }

    get(n) {
        return this.lines[n]
    }

    delete(n) {
        this.lines[n] = null
    }

    get prev() {
        return this.lines[this.index - 1]
    }

    get next() {
        let count = this.index + 1
        let line = this.get(count)
        while (!exists(line)) {
            line = this.get(count++)
        }
        return line
    }

    get isLast() {
        return this.index == this.lines.length - 1
    }
    get last() {
        return this.lines[this.lines.length - 1]
    }

    getset(index, fn, ...args) {
        let line = this.get(index)
        let spaces = getSpaces(line)
        let payload = fn(line, spaces.length, ...args)
        this.set(payload)
    }

    find(regex, n = -1) {
        let a = this.index - 1
        let match
        let line
        let count = 0

        do {
            line = this.getLine(a)
            match = search(regex, line)
            a += n
        } while (!match || count++ < 100)
        return match
    }

    peek(x) {
        if (x) {
            let a = this.index + 1
            let next = this.lines[a]
            while (a < this.lines.length && !ftest(x, next)) {
                next = this.lines[a++]
            }
            return next
        }
        return this.lines[this.index + 1]
    }

    getValue() {
        return join(this.store.filter(String))
    }

    deleteRange(range) {
        let [from, to] = range
        for (let i = from; i < to; i++) {
            this.deleteLine(i)
        }
    }

    replaceRange(range, fn) {
        const block = this.getRange(...range)
        this.deleteRange(range)
        const replacement = fn(block)
        this.setLine(range[0], replacement)
        this.lastIndex = range[1]
    }

    getRange(from, to) {
        return this.lines.slice(from, to || this.lines.length).join('\n')
    }

    constructor(parser, ...parsers) {
        //this.parsers = parsers.map((parser) => parser.bind(this))
        if (parser) this.parser = parser.bind(this)
        this.tabWidth = 4
    }

    reset() {
        this.tracker = {}
        this.store = []
        this.index = 0
    }

    run(s) {
        this.reset()
        this.lines = (this.s || s).trim().split('\n')

        for (let i = 0; i < this.lines.length; i++) {
            const [indentation, line] = getIndentAndLine(this.lines[i])
            this.spaces = indentation
            this.index = i
            //for (let parser of this.parsers) {
            //if (parser(line, indentation, i)) {
            //continue
            //}
            //}

            this.parser(line, indentation, i)
        }
        return this
    }

    insert(index, value) {
        let [spaces, line] = getSpacesAndLine(this.get(index))
        const payload = spaces + (isFunction(value) ? value(line) : value)
        insert(this.lines, payload, index)
    }

    set(value, spaces) {
        const payload = indent(value, spaces == null ? this.spaces : spaces)
        if (isArray(payload)) {
            this.store.push(...payload)
        } else {
            this.store.push(payload)
        }
    }
}

module.exports.getChunks = getChunks
module.exports.smartDedent = smartDedent
module.exports.hasHtml = hasHtml
module.exports.Iter = Iter
module.exports.LineEdit = LineEdit
function isEnterBlock(s) {
    return /[:{(\[] *$/.test(s)
}

module.exports.isEnterBlock = isEnterBlock
function fixSpaceLength(n) {
    switch (n) {
        case 1:
            return 0
        case 2:
            return 4
        case 3:
            return 4
        case 4:
            return 4
        case 5:
            return 4
        case 6:
            return 8
        case 7:
            return 8
        case 8:
            return 8
        case 10:
            return 12
        case 11:
            return 12
    }
    return n
}

module.exports.fixSpaceLength = fixSpaceLength

module.exports.isArray = isArray
module.exports.newlineIndent = newlineIndent

function isHtml(s) {
    if (test(/<\w/, s)) {
        return true
    }
}

function isHtmlAttr(s) {
    if (test(/^\.|foo/, s)) {
        return true
    }
}

module.exports.ncg = ncg
module.exports.replace = replace
module.exports.isString = isString
module.exports.join = join
module.exports.linegetter = linegetter
module.exports.doublequote = doublequote
module.exports.isObject = isObject
module.exports.hasNewline = hasNewline

//rest='foo for=mrdd'
//;[rest, doubleAttrs] = mreplace(/(\S+?) *= *(\S+)/g, rest)
//console.log([rest, doubleAttrs])
module.exports.puppetStringify = puppetStringify

class EventEmitter {
    constructor() {
        this.events = {}
    }
    on(e, listener) {
        if (isObject(e)) {
            for (let [k, v] of Object.entries(e)) {
                this.on(k, v)
            }
            return 
        }

        if (typeof this.events[e] !== 'object') {
            this.events[e] = []
        }
        this.events[e].push(listener)
        return () => this.removeListener(e, listener)
    }
    removeListener(e, listener) {
        if (typeof this.events[e] === 'object') {
            const index = this.events[e].indexOf(listener)
            if (index > -1) {
                this.events[e].splice(index, 1)
            }
        }
    }
    emit(e, ...args) {
        if (typeof this.events[e] === 'object') {
            this.events[e].forEach((listener) => {
                listener.apply(this, args)
            })
        }
    }
    once(e, listener) {
        const remove = this.on(e, (...args) => {
            remove()
            listener.apply(this, args)
        })
    }
}



//console.log(typist('<c-a-s->hizhGG<CR><3><4>44<l><r><u><d>  '))
function testf(regex, flags = '') {
    return (s) => test(regex, s, flags)
}

// what is taking so long ...
//
const vmap = {
    enter: '@keydown.enter',
    tc: 'textContent',
    t: 'textContent',
    ih: 'innerHTML',
    bind: 'v-bind',
    ref: 'ref',
    show: 'v-show',
    click: '@click',
    tg: 'transition-group',
    if: 'v-if',
    elif: 'v-else-if',
    else: 'v-else',
    key: ':key',
    for: 'v-for',
    fori: 'v-for',
    vfor: 'v-for',
    s: 'style',
    model: 'v-model',
}
module.exports.vmap = vmap

//z=new IndexedMap()
//z.set('h', 'f')
//z.set('h', 'fg')
//z.set('jh', 'gggfg')
//console.log(z.get(0))
//console.log(z.get(1))
//console.log(z.get(1))
//function a(x) {
//console.log('hi')
//}
//function b(x) {
//console.log('bye')
//}
//z=pipe(a, b)
//z()
//



function atFirst(fn, ...args) {
    return (x) => [fn(x[0], ...args), x[1]]
}

function atSecond(fn, ...args) {
    return (x) => [x[0], fn(x[1], ...args)]
}



function logger(x) {
    //dumb
    if (isClassObject(x)) {
        return x
    } else if (isPrimitive(x)) {
        return x
    } else {
        return stringify(x)
    }
}

function run(State, ...args) {
    try {
        const state = new State()
        const value = state.run(...args)
        console.log(value)
        //console.log(logger(value))
        return
    } catch (e) {
        console.log(e)
        //const value = State(...args)
        //console.log(logger(value))
        //l e
    }
}
//
//
//
//console.log(isClassObject(Cache))
//console.log(isClassObject(test))
//console.log(isClassObject(Set))
//console.log(isClassObject(4))
//console.log(isClassObject(Promise))
//console.log(isClassObject({a:1}))
//console.log(isClassObject(new Set()))
//console.log(isClassObject([3]))
//console.log(isClassObject(new Storage))
//console.log(isClassObject(new Cache))
//

class IncrementalBuilder {
    constructor() {}
}

// cannot use my parent's funds.
// unclear expectations
// unmet promises
// unreliability
// must change the discipline aspect
// i didnt take it seriously (huge)
// the same mistake i made with John && Ben
// ... ... ...
// with responsibility ...
// to be proletariat
// to entertain a reality
// to exert a reality
//
//
//



function getUniqueLetters(s) {
    return unique(findall(/\w/g, s))
}


function isAllEqual(x) {
    return x.every((item) => item == item[0])
}

function fillTo(items, item, amount) {
    if (arguments.length == 2) {
        amount = item
        item = getLast(items)
    }

    while (items.length < amount) {
        items.push(item)
    }
    return items
}
class Builder {
    constructor() {
        this.start = []
        this.end = []
    }
    append(x) {
        this.end.push(x)
    }
    prepend(x) {
        this.start.push(x)
    }
    toString() {
        const lines = [...this.start.reverse(), ...this.end]
        return join(lines)
    }
}
module.exports.fillTo = fillTo
module.exports.isAllEqual = isAllEqual
module.exports.getUniqueLetters = getUniqueLetters
module.exports.isStandardHtml = isStandardHtml
//


function getVariablesFromString(s) {
    const regex = /\w+\(|\b(?:if|else|while|for|do)\b|\/.*?\/\w*|'.*?'|".*?"/g
    return getWords(s.replace(regex, ''))
}
//console.log(getVariablesFromString('if (/foo/g, dfg, d, foo(bar) {'))
function toStringFunction(name, params, body) {
    if (isArray(params)) {
        params = params.join(', ')
    }
    params = params ? params : ''
    return brackify(`function ${name.trim()}(${params})`, body.trim())
}

module.exports.toStringFunction = toStringFunction
module.exports.stringcall = stringcall
module.exports.getVariablesFromString = getVariablesFromString
module.exports.boundary = boundary
module.exports.rescape = rescape

function checkjs(s) {
   s = s.replace(/^[\w\.]+\( *(?:\n[^]+?\n\)|\{ *\n[^]+?\n\}\)|.+)/gm, '')
   //console.log(s)
   try {
   return true 
       eval(s)
   }
   catch(e) {
       console.log(e)
       return false
    
   }
}


s = `
foo({
    hi
})
`

//console.log(checkjs(s))
//console.log(checkjs('foo(dfg)'))
module.exports.checkjs = checkjs

function toAbbreviationRegex(input, splatLength = 2) {
    
    let letters = split(input, '')
    let s = ''
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i]
        if (i == 0) {
            s += `[${letter}${capitalize(letter)}]`
            s += `\\w{${splatLength - 1},}`
        }
        else if (i == letters.length - 1) {
            s += `(?:[-_.][${letter}${capitalize(letter)}]`
            s += `|${capitalize(letter)})`
            s += '\\w+'
        }
        else {
            s += `(?:[-_.][${letter}${capitalize(letter)}]`
            s += `|${capitalize(letter)})`
            s += `\\w{${splatLength},}`
        }
    }
    //console.log([s])
    return s

}


function expensiveFuzzyMatch(input, choices, mode) {
    choices = prepareIterable(choices, 'keys')

    const FuzzyMatchTests = [
        (x) => test('^' + input, x, 'i'),
        //(x) => test('^' + toAbbreviationRegex(input) + '$', x),
        (x) => test('^' + toAbbreviationRegex(input) + '$', removeExtension(x)),
    ]

    if (choices.includes(input)) {
        return input
    }

    if (hasSymbol(input)) {
        let results = choices.filter(FuzzyMatchTests[0])
        return getLongest(results)
    }

    const [a,b] = FuzzyMatchTests.map((x) => choices.filter(x))
    //console.log([a, b])
    /* a = startswith */
    /* b = abbreviate */

    if (a.length == 0 && b.length == 0) return 
    if (a.length != 1 && b.length == 1) { return b[0] }
    if (b.length != 1 && a.length == 1) { return a[0] }
    if (a.length == 1 && b.length == 1) { return b[0] }
    if (mode == Array) return recursiveFlat(a, b)
    return getLongest(getShortest([a,b]))
}

function fuzzyMatch(input, choices) {

    const fuzzymatchtests = [
        (x) => test('^' + input, x, 'i'),
        (x) => test('^' + toabbreviationregex(input) + '$', x),
        (x) => test(boundary(input), x),
    ]
    for (let test of FuzzyMatchTests) {
        let r = choices.filter(test)
        if (exists(r)) {
            return getLongest(r, len, String)
        }
    }
}


function isAllSingleWords(s) {
    return test(/\w+/, s) && !test(/\w+ \w+/, s)
}

function startsWithSingleWord(s) {
    return test(/^(\w+)\n/m, s)
}


//console.log(split(abbreviate('to-siWoRD'), ''))
module.exports.fuzzyMatch = fuzzyMatch
module.exports.prepareIterable = prepareIterable
//fuzzyMatch('ret', ['removeType', 'refat'])
//

function count(regex, s, flags = 'g') {
    // error forgetting s
    if (isArray(s)) return s.filter(regex).length

    if (isString(regex)) {
        if (!test(/\\/, regex)) {
            regex = rescape(regex)
        }
        if (isWord(regex)) regex = '\\b' + regex + '\\b'
        regex = RegExp(regex, flags)
    }

    regex = addGFlag(regex)
    const matches = s.match(regex)
    return matches ? matches.length : 0
}
module.exports.count = count
//count
//


///functionwallu

//"schema get
//"/^ *"/gm
//"/'fn': '$1'/
//"/'\d+': '$1'/
module.exports.count = count
module.exports.abbreviate = abbreviate
module.exports.dreplace = dreplace
module.exports.reduceToString = reduceToString

//regexgetter regexGetter
//stringcall  toCallable
//counted     count
//infer-lang
//trimmed trim
//toabrev abbreviate
//console.log(stringify(aggregate(text, /(\w+) = ([a-zA-Z].+)/g)))
module.exports.getParameters = getParameters
module.exports.filterObject = filterObject
module.exports.inferlang = inferlang
module.exports.isCapitalized = isCapitalized
module.exports.uncapitalize = uncapitalize



function isLogicFunction(s) {
    return test(/^(is|start|end|has)/, s)
}

function isGetFunction(x) {
    return test(/^get/, x)
}

function sortByOccurence(items, source, reverse = true) {
    const store = []
    for (let item of items) {
        store.push([item, count('\\b' + item + '\\(', source)])
    }
    return sorted(store, null, reverse).map((x) => x[0])
}

function toVimVariable(key, items) {
    let value = isPrimitive(items) ? items : JSON.stringify(items)
    return `let g:${key} = ${value}`
}

function toConfig(s) {
    return reduce(s, (x) => [x, true])
}

function toVimDict(dict, key, value) {
    if (arguments.length == 4) {
        const [a,b,c,d] = Array.from(arguments)
        return `let g:${a}["${b}"]["${c}"] = "${d}"`
    }
    return `let g:${dict}["${key}"] = "${value}"`
}
module.exports.toVimVariable = toVimVariable
module.exports.toConfig = toConfig
module.exports.toVimDict = toVimDict
module.exports.isLogicFunction = isLogicFunction
module.exports.isGetFunction = isGetFunction
module.exports.sortByOccurence = sortByOccurence

function splitparsef(dict, fallback, regex = ' ') {
    return function splitparse(s) {
        let [a, b] = splitonce(s, regex)
        if (a in dict) {
            return dict[a](b)
        }
        return fallback(a, b, s)
    }
    // reminds me of argsplit...
}



function splitCamelCase(x) {
    return x
        .trim()
        .replace(/[a-z][A-Z]/g, (s) => s[0] + ' ' + s[1].toLowerCase())
        .split(' ')
}


function mergeSingleLetters(s) {
    return s.replace(/(?:(?:^| )[a-zA-Z]\b){2,}/g, (x) => {
        let value = removeSpaces(x)
        return ' ' + value
    })
}


class LoadUnload {
    constructor() {
        this.touched = false
    }
    load(x) {
        if (!exists(x)) return
        if (this.touched) {
            this.store = merge(this.store, x)
        } else {
            this.touched = true
            this.store = x
        }
    }
    unload() {
        this.touched = false
        return this.store
    }
}

module.exports.removeExtension = removeExtension
module.exports.tail = tail
module.exports.toPascal = toPascal
module.exports.toArray = toArray

function fixPath(s) {
    if (test(/^[\'\"]/, s)) {
        s = s.slice(1, -1)
    }
    return test(/^\w/, s) ? './' + s : s
}
module.exports.fixPath = fixPath
module.exports.xsplit = xsplit
module.exports.toDashCase = toDashCase



function once(fn, ...args) {
    if (typeof __once__ == 'undefined') {
        let value = fn(...args)
        if (value) {
            __once__ = value
            return value
        }
        return null
    }
    return __once__
}

function seen(x) {
    if (typeof __seen__ == 'undefined') {
        __seen__ = new Set()
    }
    if (__seen__.has(x)) {
        return true
    }
    __seen__.add(x)
    return false
}

//forEach(['a', 'b', 'c', 'd', 'e'], console.log).then((x) => console.log('do'))
module.exports.ncg = ncg



class FunctionBuilder extends Builder {
    constructor() {
        super()
        this.params = []
        this.name = 'hiya'
    }
    setParams(...params) {
        this.params = params
    }
    getValue() {
        const value = parens(this.toString(String))
        console.log(value)
        return eval(value)
    }
    toString() {
        return `function ${this.name}(${this.params.join(', ')}) {${newlineIndent(super.toString())}}`
    }
}


    //const newIndex = modularIncrement(8,  1, 0, 8)
    //display({newIndex})
module.exports.atSecond = atSecond


function splitNumberBoundary(s) {
    return split(s, /(\d+)/).filter(exists).map(toNumber)
}
module.exports.splitNumberBoundary = splitNumberBoundary

module.exports.getLast = getLast

function foo({x='hi'} = {}) {
    assert(1 == 2)
}
module.exports.n2char = n2char

//module.exports.getErrorInfo = getErrorInfo
module.exports.getStackInfo = getStackInfo


function functionProxy(context, method, fn) {
  return function functionProxyRunner(...args) {
    if (fn) fn()
    method.call(context, ...args)
  }
    //console.warn = functionProxy(console, console.warn, vueWarn)
}







s = `

<span class="test1 test2"></span>
<div class="test">
    <div>
        <input class="a" />
        <input class="b" />
    </div>
</div>

<span class="test1 ok test2"></span>
<div class="test fo">
    <div class="const">
        <input class="a" />
        <input class="c" />
    </div>
</div>


`
//run(HtmlTree, s)
//
//
//console.log(['a', 'b', 'c', 'd', 'e'].slice(-3))


function isStorageSchema(x) {
    const entries = isObject(x) && Object.entries(x)
    return entries && entries[0] && isArray(entries[0][1])
}

function toStorageSchema(data) {
    const entries = isObject(data) && Object.entries(data)
    if (!exists(entries)) {
        return {}
    }
    const first = entries[0]
    if (isArray(first)) {
        return data
    }
    if (isObject(first)) {
        return reduce(entries, (k,v) => [k, [v]])
    }

    if (isString(first)) {
        console.log('is a stirng')
        return reduce(entries, (k,v) => [k, [v]])
    }
    return data
    //return entries && entries[0] && isArray(entries[0][1])
}

function getModuleExports(s) {
    const r = /^module\.exports\.(\w+)/gm
    return unique(findall(r, s))
}

const catpics = [
  //'dancing.jpg',
  'fist on chin.jpg',
  'flying.jpg',
  'like a boss.jpg',
  'ocean sunset.jpg',
  'pose f.jpg',
]


module.exports.getModuleExports = getModuleExports
//storage = new Storage()
//storage.add('a', 'b', 'c')
//storage.add('a', 'b', 'd')
//storage.add('b', 'b', 'd')
//storage.add('b', 'c', 'd')
//console.log(storage.value)
//
function foo() {
    console.log('hi')
    assert(1==2)
}
module.exports.toNumber = toNumber
module.exports.getChunks = getChunks
module.exports.display = display

//bringToLife('const foo = go\nconst boo = hi\nyoyo')
module.exports.removeComments = removeComments


module.exports.splitThePage = splitThePage
module.exports.mreplace = mreplace
module.exports.replace = replace
module.exports.parens = parens
module.exports.test = test

function regexTemplater(r, dict) {
    let s = r.source.replace(/\$(\w+)/g, (_, x) => {
        if (x == '1') return prepareIterable(dict, 'keys').join('|')
    })
    let value = RegExp(s, r.flags)
    return value
}

function dynamicGetterSetter(state, key, callback) {
    const get = () => {
        if (!state['_' + key]) {
            console.log('returning cached value of ', key)
            state['_' + key] = callback(state)
        }
        return state['_' + key]
    }

    const set = () => {
        return state['_' + key]
    }
    Object.defineProperty(state, key, {get, set})
}


function hasReturnValue(s) {
    return s.toString().includes('return')
}

function defineFunctionProperty(state, k, v) {

    if (hasReturnValue(v)) {
        const get = () => {
            const value = v(state)
            return value
        }
        Object.defineProperty(state, k, {get})
    }
    else {
        state[k] = (...args) => v(state, ...args)
    }
}
function defineProperty(state, k, v) {
    const get = () => {
        const value = v(state)
        return value
    }

    Object.defineProperty(state, k, {get})
}

//class Foo {
    //constructor() {
        //this.s = 'hi'
    //}
//}
//function cmf(foo) {
    //return foo.s + 'soooup'
//}
//foo=new Foo()
//defineProperty(foo, 'boo', cmf)
//foo.boo // gets a value

module.exports.mapConditional = mapConditional
module.exports.getLastWord = getLastWord
module.exports.endsWithWord = endsWithWord
module.exports.getFirstWord = getFirstWord
module.exports.splitMapJoin = splitMapJoin
module.exports.rescape = rescape
module.exports.toVariable = toVariable
module.exports.hasSymbol = hasSymbol
//console.log(toFunctionRegex('foo'))
module.exports.trimmed = trimmed
module.exports.count = count

//console.log(getOptions('grid ab h=120', {height:30}, Object))
module.exports.removeQuotes = removeQuotes
module.exports.mapfilter = mapfilter
//console.log(brackify('', ['a', 'b', 'c', 'd', 'e'].join(',\n')))
//l 
//console.log(toStringArgument(['a', 'b', 'c', 'd', 'e']))
//

function toArrayOrObjectList(s, mode) {
    const [a,b] = mode == Array ? ['[', ']'] : ['{', '}']
    return a + newlineIndent(s.join(',\n') + ',') + b
}
//console.log(toArrayOrObjectList(['a', 'b', 'c', 'd', 'e']))
module.exports.filtered = filtered
module.exports.toArrayOrObjectList = toArrayOrObjectList
module.exports.bringToLifeLambda = bringToLifeLambda


function isEven(n) {
    return n % 2 == 0
}

function isOdd(n) {
    return n % 2 == 1
}

module.exports.isFunction = isFunction


function divify(tag, className, x) {
    let attrs = className.includes('=') ? 
        ' ' + className :
        className ? ` class="${className}"` : ''
    if (!x) x = ''
    let s = `<${tag}${attrs}>`

    if (isArray(x) || isString(x) && hasNewline(x)) {
        s += newlineIndent(x)
    } else {
        s += x
    }

    s += `</${tag}>`
    return s
}
module.exports.divify = divify



module.exports.splitThePage = splitThePage
module.exports.getWords = getWords
module.exports.bringToLifeImports = bringToLifeImports

function bringToLifeImports(s) {
    // doesnt work
    let [a,b] = search(/from (.*?) import (.+)/, s)
    b = getWords(b)
    const statement = toModuleImports(a, b)
    console.log(statement)
    eval(statement)
}

function isImport(s) {
    return test(/^import|const {|require|^from/, s)
}
module.exports.isImport = isImport
module.exports.hasNewline = hasNewline
module.exports.removeSpaces = removeSpaces
module.exports.Iter = Iter
module.exports.isWord = isWord
module.exports.bringToLife = bringToLife
module.exports.isStandardHtml = isStandardHtml
module.exports.getLastWord = getLastWord
module.exports.capitalize = capitalize


//console.log(expensiveFuzzyMatch('mes', ['element-const-com', 'foOn', 'hi']))
module.exports.paired = paired


function  removeStartingSymbols(s) {
    return s.replace(/^\W+/, '')
}
module.exports.removeStartingSymbols = removeStartingSymbols

function removeSymbols(s) {
    return s && s.replace(/[^\w-]+/g, '')
}

// ------------------------------------------ 



function edit(x, ...args) {
    if (isArray(x)) {
        return editArray(x, ...args)
    }

    if (isObject(x)) {
        return editObject(x, ...args)
    }

    function editArray(items, index, value) {
        items[index] = fparse(value, items[index])
        return items
    }

    function editObject(object, kt, vt) {
        return reduce(object, (k, v) => {
            if (kt) k = kt(k)
            if (vt) v = vt(v)
            return [k, v]
        })
    }
}



function isWordy(s) {
    const regex = /[a-zA-Z\']+ [a-zA-Z\']+ [a-zA-Z\']+/
    return test(regex, s)
}


    //dicts = [{a:1, b:2, c:3}, {ac:1, cb:2, cc:3}]
    //const regex = ncg('($1)(\\d+)|($2)\\b', dicts, 'g')
    //console.log(regex)
    //
    //
    //
s = `

        #katex-question katex=question
        #math-quill ref @onEnter focusIt
`



s = `


---------------------------
hi
`

//console.log(splitThePage(s))
//



function walk(x, fn) {
    let ref
    function runner(x) {
        ref = x
        for (let [k, v] of Object.entries(ref)) {
            if (isObject(v)) {
                runner(v)
            }
            else {
                const value = fn && fn(v)
                if (value == null) continue 
                ref[k] = value
            }
        }
    }
    runner(x)
    return x
}

//console.log(walk({a:1, b:2, c: {a:1, b:2, c:3}}))


function allowIgnoreFilterFactory(allow, ignore, ignoreRE) {
    const filter = (x) => {
        if (allow.includes(x)) return true
        if (ignore.includes(x)) return false
        if (test(ignoreRE, x)) return false
        return true
    }
    return filter
}


module.exports.getQuotes = getQuotes
module.exports.getExtension = getExtension
module.exports.unique = unique


function toHtmlRegex(tag, capture) {
    const content =  capture ? '([^]+?)' : '[^]+?'
    return `<${tag}.*?>${content}</${tag}>`
}




function removeHtmlComments(s) {
    return s.replace(/<!--[^]+?--> *\n*/g, '')
}
//console.log({a:1, b:2, c:3}.toString())
//l 
//console.log(timestamp('hi'))
//console.log(getHMSM())
module.exports.toHtmlRegex = toHtmlRegex
module.exports.hasNewline = hasNewline
module.exports.findall = findall
module.exports.isWord = isWord
module.exports.char2n = char2n


function stop() {
    throw 'stoping'
}
function assignFresh(to, from) {
    for (let [k, v] of Object.entries(from)) {
        if (!to.hasOwnProperty(k) ) {
            to[k] = v
        }
    }
}


function assignExisting(to, from) {
    for (let [k, v] of Object.entries(from)) {
        if (to.hasOwnProperty(k) ) {
            to[k] = v
        }
    }
}

function rng(min = 1, max = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomPick(items) {
    if(!isArray(items)) return items
    return items[Math.floor(Math.random() * items.length)]
}

function onceFactory(fn) {
    let touched
    return function once(x) {
        if (!touched && (fn ? fn(x) : x)) {
            touched = true
            return true
        }
    }
}
//console.log(merge({a:1}))


function getIndexesOf(items, fn) {
    return items.map((item, i) => {
        return fn(item) ? i : null
    }).filter(notNull)
}
//console.log(reduce(['hi'], (x) => null))
//console.log(getIndexesOf([1,2,3], identity))


//console.log(once(identity, 3))
//console.log(once(identity, 3))
//console.log(once(identity, 3))
//console.log(once(identity, 3))
//
// belowNonEssential
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly
// ------------------------------------------ silly

function schemaMatch(schema, s, flags = 'g') {

    const captureDictionary = {
        'quote': '(?:\'(.*?)\'|\"(.*?)\")',
        mathvar: '\\w+(?:\\^\\w+)?',
        //line: '(?:^|\\n)(.+)(?=\\n|$)',
        line: '\\S.+',
        mathop: '[+-/\\*] *',
        rest: '[^]+',
        para: '.*',
        char: '\\S',
        word: '[a-zA-Z]{1,}',
        w: '[\\w-$]{1,}',
        a: '.*?',
        A: '[^]+?',
        sym: '\\S{1,}',
        symbol: '[\\W]{1,}',
        nonspace: '\\S{1,}',
    }

    const noCaptureDictionary = {
        'q': '\\?',
        's': '\\s*',
        'ws': '\\s+',
        'to': '[^]+?',
        'linebreak': ' *(?:\\n+|$)',
    }

    let keys = []
    let names = []
    let count = 0
    let regex
    schema = prepareSchema(schema)
    regex = schema.replace(/\$(\w+)#?/g, regexParser)
    regex = regex.replace(/\*\?(?=\)(?:$|\|))/g, '*')
    regex = RegExp(regex, flags)

    function prepareSchema(s) {

        const SchemaDictionary = {
            arr: '[$1,$1]',
            config: '$word $any(?=  |$)',
            config:'$sym $sym',
        }

        if (s in SchemaDictionary) s = SchemaDictionary[s]
        return s.replace(/ *([\[\]. :,]) */g, (_, x, offset, o) => {
            if (x == '[' || x == ']' || x == '.') return '\\' + x
            if (x == ' ') return ' +'
            if (x == ':' && o[offset - 1] == '?') return ':'
            if (x == ':' || x == ',') return ` *${x} *`
        })
    }

    function regexParser(_, x) {

        if (x in noCaptureDictionary) {
            return noCaptureDictionary[x]
        }

        count++

        if (x in captureDictionary) {
            let value = captureDictionary[x]
            let groups = countCaptureGroups(value)
            if (groups == 0) return parens(value)
            else {
                count += groups - 1
                return value
            }
        }

        if (isPlural(x)) {
            let regexValue = captureDictionary[depluralize(x)]
            keys[count] = regexValue
            names[count] = x
            const all = '(\\S[^]+?)'
            return all
            //return parens(regexElongation(regexValue))
        }

        const value = parens(regexParserHelper(x))
        return value
    }

    function regexParserHelper(x) {
        switch (x) {
            case 'mc':
                keys[count - 1] = '\\w+'
                names[count - 1] = x
                return '\\S+ \\S+ \\S+ \\S+(?= *(?:$|\\n))'
        }
    }

    // ------------------------------------------ start
    //console.log(regex)
    s = smartDedent(s)
    if (flags.includes('g')) {
        let matches
        let output = []
        while (exists((matches = regex.exec(s)))) {
            let store = []
            for (let i = 1; i < matches.length; i++) {
                let index = i
                let match = matches[i]
                if (match == undefined) {
                    continue
                }
                match = match.trim()
                console.log({name: names[index], match, keys, index, r:keys[index]})
                if (keys[index]) {
                    store.push(findall(keys[index], match))
                }
                else {
                    store.push(toArgument(match))
                }
            }
            output.push(store)
        }
        return smallify(output)
        return output
        return store
    }

    else {
        let match = s.match(regex)
    }
}

s = `

dog {
   sfgf dffd 
    hog
}

foo {
    bog
    hog
}
`

//v = schemaMatch('^.?$word {$symbols}', s, 'gm')
//console.log(v)
//
//
s = `
x + 2 : red
x^2 : blue
x^2 + 5x + 6 : green
[2,3] : red
[2,5] : blue
`

//const items = schemaMatch('^[$any,$any]:$any|$any:$any', s, 'gm')
//console.log(items)
module.exports.dreplace = dreplace
module.exports.testf = testf
module.exports.templater = templater
module.exports.hasNewline = hasNewline
module.exports.tail = tail
module.exports.sorted = sorted
//console.log(abbreviate('doGo'))
//
//
//

module.exports.schemaMatch = schemaMatch
module.exports.search = search

class MathRearrangement {
    constructor(s) {
        this.s = s
    }
    generate() {
        
    }
    //const arrange = new MathRearrangement('y = x + 4')
}



s = `

The graph of f(x) crosses the yax at the coordinate point (a,b).
wmtv of a be? ans cbd a b 0      
`

sc='$A$q$s(?:ans)? *(?:$mc|$para)'

//console.log(schemaMatch(sc, s))
module.exports.getModuleExports = getModuleExports


function getOptionsFromSchema(s, schema) {
    const options = {}
    const keys = []
    schema = schema.replace(/\$(\w+)/g, (_, x) => {
        keys.push(x)
        return '(\\w+)'
    })
    schema = schema.replace(/[\[\]]/g, '\\$&')
    schema = schema.replace(/ *, */, ' *, *')
    //console.log(schema); throw "";
    s = s.replace(RegExp(schema, 'g'), (...args) => {
        for (let i = 1; i < args.length - 2; i++) {
            if (!args[i]) continue
            options[keys[i - 1]] = toArgument(args[i])
        }
        return ''
    })
    return [s.trim(), options]
}


s = `

            case 'symbol':
                return '[\\W]{1,}'
            case 'nonspace':
                return '\\S{1,}'
`

//s=schemaMatch('case $quote$to#return $quote', s)
//console.log(s)
module.exports.optiongetter = optiongetter

s = `
bb
nn

h
h
h
`

    //let [imports, html] = schemaMatch('$lines\\n\\s+$rest', s)
    //console.log(imports)

module.exports.isLink = isLink
module.exports.deletef = deletef
module.exports.looksLikeRegex = looksLikeRegex
module.exports.removeEs6 = removeEs6
module.exports.replaceLast = replaceLast
module.exports.removeComments = removeComments
module.exports.Storage = Storage

//s = 'const $1 = PM.${getLastWord($a, $3)}'
//console.log(spicyTemplater(s, {'a': sayhi, '1': 'vvv'}))
//l spicyReplace
module.exports.spicyReplace = spicyReplace
module.exports.toArgument = toArgument

function defineAliases(state, object, dict) {
    for (let [k, v] of Object.entries(dict)) {
        state[k] = object[v].bind(v)
    }
}

class KVStorage {
    constructor() {
        this.store = []
    }

    add(key, value, data) {
        const payload = data ? {...data, key, value} : {key, value}
        this.store.push(payload)
        return value
    }

    getKeys(fn = identity) {
        return this.store.filter(fn).map((x) => x.key)
    }

    getValues(fn = identity) {
        return this.store.filter(fn).map((x) => x.value)
    }

    getValue(fn) {
        const value = this.store.find(fn)
        return value && value.value
    }
}

//console.log(typist('hi<c-s>'))
module.exports.getLastLine = getLastLine
module.exports.getLastLine = getLastLine
module.exports.typist = typist
module.exports.getFirstLine = getFirstLine
module.exports.addExtension = addExtension
module.exports.dog = dog
//console.log(tally(['hi', 'hi', 'go']))
//l n
//console.log(n2char(0))
// ------------------------------------------ silly
function letterRange(x) {
    let [a,b] = split(x, '-')
    a = char2n(a)
    b = char2n(b)
    let store = []
    for (let i = a; i <= b; i++) {
        store.push(n2char(i))
    }
    return store
}
function partitionLetterGroups(groupSize, groupAmount) {
    const store = []
    const n = groupSize * groupAmount
    for (let i = 0; i < n; i++) {
        if (i % groupSize == 0) {
            store.push([])
        }
        getLast(store).push(n2char(i))
    }
    return store
}
//console.log(partitionLetterGroups(3, 3))
//
function recursiveDataBuilder(depth) {
    const store = {}
}



function debounce(fn, delay = 250) {
    let id
    return function debouncedFunction(...args) {
        clearTimeout(id)
        id = setTimeout(() => {
            fn.call(this, ...args)
        }, delay)
    }
}
//console.log(splitLast('abcbd', 'b'))
module.exports.splitLast = splitLast
//console.log(range('3-5'))
module.exports.isStringNumberRange = isStringNumberRange
s=['a', 'b', 'c', 'd', 'e']
//console.log(numbered(s))
module.exports.numbered = numbered
module.exports.dynamicGetterSetter = dynamicGetterSetter
module.exports.textTable = textTable
//console.log(textTable(['a', 'b', 'c', 'd', 'e', ...'ggggggggg'.split('')]))
//console.log(range('1-3'))
module.exports.getSingleAndDoubleAttrs = getSingleAndDoubleAttrs
//console.log(randomColor())
//console.log(randomColor())
//console.log(randomColor())
//console.log(range(2))
//
function tryAndTryAgain(fn, ...args) {
    let id = setInterval(() => {
        try {
            fn(...args)
            clearInterval(id)
        }
        catch(e) {
            console.log('trying agan')
        }
    }, 1000)

    function runner() {
        try {
            fn(...args)
        }
        catch(e) {
        
        }
    }
}



module.exports.highFrequencyJavascriptUtilities = highFrequencyJavascriptUtilities
module.exports.addExtension = addExtension

function buildFileRelations() {
    /* he */
}

function superb(...args) {
    args = gatherArgs(args)
    const store = []
    for (let i = 0; i < args.length; i++) {
        let el = args[i]
        if (isFunction(el)) {
            store.push([el, []])
        } else {
            getLast(store)[1].push(el)
        }
    }
    return store
}
//console.log(mergeProps({b: {x: 1}}, {b: {y: 1}}))

function gatherArgs(args) {
    if (isArray(args[0]) && args.length == 1) {
        return args[0]
    }
    return args
}

module.exports.gatherArgs = gatherArgs
function assertion(x) {
    if (x == null) {
        throw new AssertiongError()
    }
    else {
        //console.log('the value of x has been asserted')
        return x
    }
}

async function actions(n, fn, delay = 1000, state) {
    for (let i = 0; i < n; i++) {
        await sleep(delay)
        state ? fn.call(state) : fn()
    }
}

function optiongetter(s) {
    return mreplace(/^# *(\w+) *(.*)/gm, s.toString())
}
module.exports.isClassObject = isClassObject
module.exports.isClass = isClass
module.exports.getErrorInfo = getErrorInfo
module.exports.breaker = breaker
module.exports.scopedEval = scopedEval
module.exports.sleep = sleep
function waterfall(promises) {
    return promises.reduce((acc, promise) => {
        return acc.then(() => {
            return promise.then(() => {
                return true
            })
        })
    }, Promise.resolve([]))
}

function variableExists(v) {
    return eval(`typeof ${v} != undefined`)
}

function incrementName(name, offset = 1) {
    return test(/\d$/, name) ? 
        name.replace(/\d+$/, (x) => Number(x) + offset) :
        name + '1'
}
function defineVariable(a, b) {
    eval(`${a} = ${b}`)
}

//const a = ['a', 'b', 'c', 'd', 'e']
//b = new Iter(a)
//console.log(b.index)
//console.log(b.next())
//console.log(b.index)
//console.log(b.value)
//console.log(b.index)
//console.log(b.peek())
//console.log(search(/(hi)i/g, 'hiii'))
module.exports.smallify = smallify
module.exports.expensiveFuzzyMatch = expensiveFuzzyMatch
module.exports.boundary = boundary
module.exports.tally = tally
//console.log((new Tally(['fb', 'b', 'cc', 'cc', 'e'])).lowest())
module.exports.Tally = Tally
//console.log(split('h\n\nb', '\n'))
module.exports.doglog = doglog
module.exports.simpleSpellcheck = simpleSpellcheck
module.exports.Indexed = Indexed
function datemark04082022() {
    
}

function getThis(state, regex) {
    const value = mapfilter(Object.entries(state), (x) => {
        return (!isFunction(x[1]) && test(regex, x[0])) && [x[0], x[1]]
    })
    return reduce(value)
}


module.exports.Watcher = Watcher


module.exports.rng = rng
//console.log(toDashCase('hi'))
//console.log(toDashCase('Hi'))
//console.log(toDashCase('Hi-go'))
//console.log(toDashCase('HiGo'))
//console.log(stringify('2 + 4'))
//let k = 'fooDirectivveff'
        //let r = /(\w+)(Directive)|(nativeOn|on)(\w+)/
        //let match = search(r, k)
        //console.log(match)

        //k = 'Toooo'
        //k = toCamelCase(k)
        //console.log(k)
function foo() {
   boo()
}
//foo()
function boo() {
    console.log(getCaller(2))
}
module.exports.Spellcheck = Spellcheck


module.exports.Spellcheck = Spellcheck
module.exports.spellcheckFactory = spellcheckFactory

//generateRandomHtml
    //js = boo
    //const {name, parameters} = getFunctionInfo(js)
    //console.log({name, parameters})
























s = `

component circle-data
props h,k,r
colors h,k,r

the circle currently
has a h value of :h
has a k value of :k
is centered around the point (:h,:k)
has a radius of :r
has the equation #equation(circle, h, k, r)
`

//std.eqs.circle(:h, :k, :r)
const standards = {
    equations: {
        circle(h, k, r) {
            return `(x - ${h})^2 + (y - ${k})^2 = ${r}^2`
        }
    }
}


function lineNeedsEndingColon(s) {
    if (test(/[^a-zA-Z]$/, s)) {
        return false
    }
    const words = ['is', 'of', 'currently', 'has', 'be']
    let word = getLastWord(s)
    if (words.includes(word)) {
        return true
    }
}

function infuseVue(s) {
    return s.replace(/:([a-z]+)/g, (_, x) => {
        return `{{${x}}}`
    })
}

function infuseSpanColors(s, colors) {
    if (isArray(colors)) {
        colors = reduce(colors, rainbow)
    }
    const regex = ncg('\\b($1)\\b|({{(?:$1)}})', colors)
    return replace(regex, (_, a, b) => {
        let value = a || b
        let color = colors ? colors[getFirstWord(value)] : rainbow()
        return spanify(value, {style: {color}})
    }, s, 'g')
}
function spanify(value, options) {
    if (isString(options)) {
        options = {
            style: cssEvaluator(options)
        }
    }
    const attrs = Object.entries(options).reduce((acc, [a,b], i) => {
        acc += a + '="'
        if (a == 'style') {
            if (isObject(b)) {
                for (let [k, v] of Object.entries(b)) {
                    acc += k + ': ' + v + '; '
                }
            }
            acc = acc.trim()
        }
        acc += '" '
        return acc
    }, '').trim()
    return divify('span', attrs, value)
}

//s = infuseVue(s)
//s = infuseSpanColors(s, ['h', 'k', 'r'])
//console.log(s)
//console.log(standards.equations.circle(2,3,4))
//derived from functions on StackOverflow http://bit.ly/30qC25j
module.exports.bindObject = bindObject
module.exports.doglog = doglog
module.exports.capitalize = capitalize
module.exports.isString = isString
module.exports.identity = identity
module.exports.spellcheckFactory = spellcheckFactory
module.exports.rainbow = rainbow
//console.log(splitonce(['a', 'b']))
//

function validArgs(args) {
    return args.filter((x) => x != null && x != '')
}

function schemaRegexFactory(schema, fn) {
    let [a,template] = split(schema, / *\.\.\. */)
    const dict = {
        'wallu': '[^]+?',
        'function': 'function',
        //'\\n': '\\\\n',
        //'\\cw': '(\\\\w+)',
        //'\\w': '\\\\w+',
        'n': '\\n',
        'cw': '(\\w+)',
        'w': '\\w+',
        'dotu': '.*?',
        's8': ' {8}',
        's4': ' {4}',
    }
    let flags = 'g'
    let r = RegExp(dreplace(a, dict, null), flags)
    console.log(r)
    return function lambda(s) {
        //console.log({s})
        const matches = findall(r, s)
        //console.log(matches); throw ''
        //console.log('matches.length', matches.length)
        return matches.map((x) => spicyTemplater(template, x))
    }
}


// to be out of sight ...
module.exports.schemaRegexFactory = schemaRegexFactory
//functionStore = ['vds', 'vvv']
        //s = 'vds(fo) vvv(vds(fo)'
        //s = s.replace(ncg(functionStore), 'utilsjs.$&')
        //console.log(s)

s = `

function hasHtml(s) {
            if (s.includes('<')) return true
        }
`

//console.log(smartDedent(s))
module.exports.schemaRegexFactory = schemaRegexFactory
module.exports.smartDedent = smartDedent
module.exports.removeThis = removeThis

function removeThis(s) {
    return s.replace(/\bthis\./g, '')
}
module.exports.itersearch = itersearch
module.exports.debounce = debounce


s = `
Chapter 4: Circles

To make a circle, all you need is a [point (:h, :k)],
and a radius :r
`

//console.log(isPureObject(new StandardObject)); throw ''
//
//


function bindObjectToState(obj, state, transformer) {
    if (!transformer) transformer = (x, state) => {
        return x.bind(state)
    }

    return walk(obj, (x) => {
        if (isFunction(x)) {
            return transformer(x, state)
        }
    })
}
