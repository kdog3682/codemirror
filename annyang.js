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
    constructor(callback = console.log) {
        this.callback = callback.callback ? 
            callback.callback.bind(callback) :
            callback

        this.count = 0
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
        const recognition = new webkitSpeechRecognition()
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
        this.startTime = timegetter('onstart')
    }
    onerror() {
        console.log('error')
    }

    onend() {
        this.again()
    }

    again() {
        if (this.debug) {
            speak('debug stop')
            this.stop()
            return 
        }

        if (this.status == 'stopped') return
        let delay = 1000
        this.wait('setup', 'start', delay)
    }

    onresult(e) {
        let s = e.results[e.resultIndex][0].transcript
        if (!s) return
        s = mergeSingleLetters(s.toLowerCase())
        s = splitSpellcheck(s, AnnyangDictionary)
        const regex = /(\n|enter|e?nt|auntie)$/
        const [text, enter] = mreplace(regex, s)
        this.callback(text, enter)
    }
}


