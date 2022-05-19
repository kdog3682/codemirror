function configuration(app, data) {
    // dynamic parsing
    // raw data
    if (data.length == 0) {
        return 
    }

    if (data.length == 1) {
        if (data[0].toString().includes('vtc')) {
            return 
        }
        app.config[key]
    }
}

function startVoice() {
    app.vtc.setArgParse(ArgParserRef[app.editor.lang])
    app.vtc.toggle()
    speak('starting voice')
}

function stringIt(s) {
    return s.join(' ')
}

function dictationFinished() {
    const payload = app.vtc.payload()
    if (app.config.uploadVoiceLogs && payload) {
        speak('uploading voice logs')
        jsonbin(app.voiceLogs).then(logJsonBinResult)
    }

    speak('dictation finished')
}

function createIframeCallbacks(iframe) {
    const {
        elementController,
        consoleEl,
        ecAddStyle,
        ecPrevious,
        ecNext,
        ecUndo,
        ecRedo,
        ecDecrement,
        ecIncrement,
    } = iframe
    const _ecCommands = {
        Enter: ecAddStyle,
        previous: ecPrevious,
        next: ecNext,
        undo: ecUndo,
        redo: ecRedo,
        less: ecDecrement,
        more: ecIncrement,
    }
    /* this is such a circuitious route of doing it lol */
    /* it would be much better to decorate via the externality of the iframe. that way there is nnoremap interference.
     * u can still hide everything */
    const ecCommands = reduce(_ecCommands, (k, v) => {
        return function childVoiceCallback(s) {
            v(elementController)
            console.log(s, s == k, v.name)
            //speak(s)
        }
    })

    /* u put it in the other place */

    return {
        commands: {
            ...ecCommands,
            toggle() {
                consoleEl.toggleVisibility()
            },
            finished() {
                const data = elementController.toString()
                app.editor.buffers.append('styles.css', data)
                app.vtc.override = null
                app.displayManager.exit()
            },
        },
        defaultCallback: console.log,
    }
}

function proseVoice(s, enter, timeDelta) {
    let cm = e.cm

    let extra = enter
        ? '\n'
        : timeDelta > 6000
        ? '\n'
        : timeDelta > 10000
        ? '\n\n'
        : ' '

    cmInsert(cm, extra + s)
}

class SpeechParser {
    /* u can do it with raw data. */
    constructor() {
        this.stack = []
    }
    parse(words, enter, timeDelta) {
        // the time delta between phrases.
        // fix accoridng to subject context
        //
        if (this.lastWord in knownCommas) {
        } else if (this.lastWord in knownCommas) {
        }
        let [first, last] = getFirstAndLast(words)
        /* there are certain good aspects of having an invivo parser */
        if (this.endsWithPeriod()) {
            this.capitalize()
        }
        /* a game which is usefunction console.log(...) */
        return before + s + after
    }

    looksComplete() {
        return
    }
}
