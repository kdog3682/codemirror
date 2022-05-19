const AnnyangDictionary = {
    ...WordToNumberDictionary,
    'do you want': 'newline',
    nearby: 'newline',
    'to string': '.toString()',
    strain: 'string',
    circle: '()',
    'lower case': 'lowercase',
    free: 'see',
    industry: 'indexTree',
    vu: 'Vue',
    hush: 'push',
    '. ': '.',
    'dot ': '.',
    'drd ': 'drdaction',
    'test function': 'function func() {\n messageToVue("mtv")\n}',
    'dogs ': 'doc',
    whats: 'select',
    queer: 'clear',
    'she and': 'cm',
    control: 'ctrl-',
    'left paren': 'left-paren',
    lp: 'left-paren',
    'right paren': 'right-paren',
    rp: 'right-paren',
    'except ': 'accept',
    car: 'char',
    cars: 'chars',
    courser: 'cursor',
    parentheses: 'parentheses',
    pn: 'parentheses',
    courser: 'char',
    courser: 'char',
    function: 'function',
    uline: 'newline',
}

class Annyang {
    set lang(lang) {
        if (!lang) return 
        if (lang == 'chinese') lang = 'zh-CN'
        else if (lang == 'french') lang = 'zh-CN'
        else if (lang == 'spanish') lang = 'zh-CN'
        else if (lang == 'english') lang = 'us-EN'
        this.recognition.lang = lang
    }
    get lang() {
        return this.recognition.lang
    }

    constructor(callback = console.log) {
        this.callback = callback.callback ? 
            callback.callback.bind(callback) :
            callback

        this.lastTime = 0
        this.count = 0
        this.debug = false
        this.setup()
    }
    wait(...args) {
        const delay = args.pop()
        this.timerId = setTimeout(() => {
            args.forEach((arg) => this[arg]())
        }, delay)
    }

    setup() {
        this.init()
        this.recognition.onend = this.onend.bind(this)
        this.recognition.onstart = this.onstart.bind(this)
        this.recognition.onresult = this.onresult.bind(this)
        this.recognition.onerror = this.onerror.bind(this)
    }
    init() {
        //const recognition = new webkitSpeechRecognition()
        const recognition = getRecognition()
        recognition.lang = 'en-US'
        recognition.continuous = true
        recognition.interimResults = false
        recognition.maxAlternatives = 1
        this.recognition = recognition
    }

    stop() {
        this.recognition.abort()
        this.status = 'stopped'
        this.count = 0
    }

    resume() {
        if (this.status != 'stopped') return
        this.setup()
        this.start()
    }
    start() {
        console.log('starting annyang')
        this.status = 'started'
        this.resultTime = 0
        this.recognition.start()
        this.count += 1
    }
    onstart() {
        this.startTime = Date.now()
        console.log('stttttttttarted', this.startTime)
    }
    onerror(e) {
        if (e.error == 'not-allowed') {
            if (this._stopOnce == true) {
                this._stopOnce = false
                speak('gogo')
            } else {
                this._stopOnce = true
            }
        }
    }


    onend() {
        this.again()
    }

    again() {
        if (this._stopOnce) {
            this._stopOnce = false
            return 
        }

        if (this.status == 'stopped') return
        let delay = 1000
        this.wait('setup', 'start', delay)
    }

    onresult(e) {
        let data = e.results[e.resultIndex][0]
        let s = data.transcript
        if (!s) return
        let timestamp = Date.now()
        let timeDelta = Math.round(timestamp - this.lastTime)
        this.lastTime = timestamp
        if (this.debug) console.log({beforeParse: s})
        s = mergeSingleLetters(s.toLowerCase())
        s = splitSpellcheck(s, AnnyangDictionary)
        if (this.debug) console.log({afterParse: s})
        const regex = /(\n|enter|e?nt|(?:next|new) line|auntie)$/
        let [text, enter] = mreplace(regex, s)
        if (this.debug) console.log({afterAfterParse: text})
        if (text == '' || enter) enter = true
        this.callback(text, enter, timeDelta)
    }
}


function getRecognition() {
    return new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
}
