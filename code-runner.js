

const VueDisplayCallbacks = {
    consoleEnter() {
        console.log('entering the console')
    },
    consoleExit() {
        console.log('eavin g the cons resetin co')
        this.console = []
    },
    htmlEnter() {
        this.html = this.editor.text
    },
    async iframeEnter(dataObject) {
        const htmlString = htmlBuilder(dataObject)
        this.frameKey += 1
        await this.$nextTick()
        this.computedHtml = htmlString
        //console.log(htmlString)
    },
    iframeExit() {
        // this was moved to the iframecomponent
        // we will se if it works
        //this.$refs.iframe.$el.contentWindow.innerHTML = ''
        //this.frameKey += 1
    },
    codemirrorEnter() {
        if (this.lastCodeMirrorCursor) {
            cmSetCursor(this.editor.cm, this.lastCodeMirrorCursor)
        }
        setTimeout(() => this.editor.cm.requestMeasure(), 50)
        autoFocus(this.editor.cm)
    },
    codemirrorExit() {
        this.lastCodeMirrorCursor = cmCursor(this.editor.cm)
        this.editor.cm.contentDOM.blur()
    },
}


function infuseHtml(code, html) {
    if (!html || html.length < 3) return code
    return code.replace(/template,/, stringDictionaryEntry('template', html))
}
function vuecmToIframeHtml(vue) {
    const buffers = vue.editor.buffers
    const data = buffers.toJSON()
    if (!data.html && data.css) {
        data.html = htmlFromCss(data.css)
    }
    vue.displayManager.enterAndLeave('iframe', data)
}
function vuecmToIframe(vue, code) {
    const cm = vue.editor.cm
    const buffers = vue.editor.buffers
    //let html = buffers.getString('index.html')
    const css = buffers.getString('styles.css')
    const js = comment(timestamp()) + '\n\n' + infuseHtml(code, buffers.getString('index.html'))
    const dataObject = { js, css}

    //const htmlString = htmlBuilder(dataObject)
    //const delay = vue.config.delay
    //vue.frameKey += 1
    //vue.$nextTick(() => {
        //vue.displayManager.enterAndLeave('iframe', delay, htmlString)
    //})
}




function extraText(text, context, overrideName) {
    let extra = ''
    //console.log(context)
    if (context.context == 'vue') {
        //console.log(context.name)
        let appNumber = 100
        extra = `app${appNumber} = new Vue(${capitalize(overrideName || context.name)}).$mount('#app${appNumber}')`
    } else if (context.context == 'function') {
        extra = stringcall(context.name, loremify({ parameters:context.parameters }))
    } else if (context.context == 'class') {
        extra = stringCallClass(context)
    }
    return extra
}

function vuecmToConsole(vue, code) {
    code = transformConsole(code)
    //console.log({code})
    let {error, success} = evaluate(code)
    if (error) {
        speak('error')
        const {line, ch} = error
        console.log({code, error})
        //cmSetCursor(vue.editor.cm, line, ch)
    }
    if (exists(app.console)) {
        vue.displayManager.enterAndLeave('console', 2000)
    }
}

function vuePreview(x) {
    app.console.push(x)
    app.displayManager.enterAndLeave('console', 2000)
}


/* needs to respond */
function vuecmCodeRunner() {

    function iframe(data) {
        return vue.displayManager.enterAndLeave('iframe', data)
    }
    function singletonIframe(obj) {
        return VueDisplayCallbacks.iframeEnter.call(app, {
            legos: false,
            ...obj
        }).then(wait).then((x) => VueDisplayCallbacks.codemirrorEnter.call(app))
    }

    let vue = app
    let editor = app.editor
    let {cm, lang, mode} = editor
    let {html, js, css} = editor.buffers.toJSON()

    if (css && !html && !js) {
        editor.mode = 'css-to-html'
        return iframe({css, html: htmlFromCss(css)})
    }

    if (mode == 'vanilla-html') {
        return iframe({css, html})
    }
    if (mode == 'vanilla-js') {
        return singletonIframe({js, html: htmlFromJs(js)})
    }

    if (mode == 'html-to-vue') {
        if (js) {
            if (lang == 'html') {
                js = changeTemplate(js, html)
                editor.buffers.patch('index.js', js)
            }
            return iframe({css, vuejs: js})
        } else {
            let vuejs = vuejsFromHtml(html)
            editor.buffers.patch('index.js', vuejs)
            return iframe({css, vuejs})
        }
    }

    let useConsole = /^console/gm.test(js)

    if (mode == 'js-to-html' || hasHtmlStuff(js))  {
        //console.log(app.editor.mode)
        //html = createHtmlFrom({js})
        if (useConsole) {
            /* the lego console ... */
            js = replace(/^[ \t]*console.log.+/gm, (x) => {
                let extra = x.replace('console.log', 'legoConsoleEl.push')
                return x + '\n' + extra
            }, js)
        }
        let data = {css, js, html}
        vue.displayManager.enterAndLeave('iframe', data)
        return 
    }

    if (useConsole) {
        return vuecmToConsole(vue, js)
    }

    if (activeBuffers.length == 3) {
        speak('full metal')
        return vuecmToIframeHtml(vue)
    }

    if (lang != 'js') {
        if (!exists(js)) {
            return vuecmToIframeHtml(vue)
        }
        let extra = extraText(js, {context: 'vue'}, 'app')
        let code = js + '\n\n' + extra
        return vuecmToIframe(vue, code)
    }
    let text = cmText(cm)
    let context = cmContext(cm)
    let extra = extraText(text, context)
    let code = text + '\n\n' + extra

    if (context.context == 'vue') {
        return vuecmToIframe(vue, code)
    } else if (context.context == 'javascript') {
        return vuecmToConsole(vue, code)
    } else {
        speak('error')
    }
}

/* maybe the feeling that i dont want to interact ... */
/* steve kerr wants really badly to win ...  */
