class KeyListener {
    constructor(callback, earlyReturn, errorHandler = console.log) {
        if (isObject(earlyReturn)) {
            const ref = earlyReturn
            const state = callback
            earlyReturn = null
            callback = (key) => {
                if (ref.hasOwnProperty(key)) {
                    ref[key].call(state)
                }
            }
        }

        else if ('callback' in callback) {
            callback = callback.callback.bind(callback)
        }
        else if (isObject(callback)) {
            const ref = callback
            const state = earlyReturn
            earlyReturn = null
            callback = (key) => {
                if (ref.hasOwnProperty(key)) {
                    ref[key](state)
                }
            }
        }

        this.callback = (e) => {
            preventDefault(e)
            let key = getKeyArg(e)
            if (earlyReturn && earlyReturn(key)) {
                return 
            }
            try {
                callback(key)
            }
            catch(e) {
                errorHandler(e)
            }
        }

        const preventDefault = preventDefaultFactory()
        window.addEventListener('keydown', this.callback.bind(this))
    }
    async type(s) {
        const inputs = typist(s)
        //console.log(inputs)
        for (let input of inputs) {
            if (input.sleep) {
                await sleep(input.sleep)
            }

            this.callback(input)
            await sleep(100)
        }
    }
}

function getKeyArg(e) {
    let key = e.key || e
    let arg = ''
    if (e.ctrlKey) arg += 'Ctrl-'
    if (e.altKey) arg += 'Alt-'
    if (e.shiftKey && e.key == 'Tab') arg += 'Shift-'
    arg += key
    return arg
}

function preventDefaultFactory() {
    
    let shiftKey
    let ctrlKey

    function preventDefault(e) {
        if (e.ctrlKey && !test(/[i\-\+]/, e.key)) {
            return true
        }

        if (e.isFakeKeyboardEvent) return 
        if (e.shiftKey && e.key == '') {
            shiftKey = true
            return 
        }

        if (e.ctrlKey && e.key == '') {
            ctrlKey = true
            return 
        }

        if (e.shiftKey && e.ctrlKey) {
            return 
        }

        if (isString(e)) return 
        if (ctrlKey && test(/[abcdefg]/, e.key)) e.preventDefault()
        if (ctrlKey && test(/[i\-\+]/, e.key)) {
            return 
        }

        ctrlKey = false
        shiftKey = false
        if (e.srcElement != document.body) return 
        const allowDefault = ['F5', 'r', 'F1', 'F2']
        if (allowDefault.includes(e.key)) return 
        e.preventDefault()
    }
    return preventDefault
}


////console.log(typist('<c-a-s->hizhGG<CR><3><4>44<l><r><u><d>  '))





