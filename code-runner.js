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
        //console.log(dataObject); throw "";
        dataObject.lastElementName = app.lastElementName
        const htmlString = htmlBuilder(dataObject)
        //const delay = this.config.delay
        this.frameKey += 1
        await this.$nextTick()
        const htmlstamp = jspy('html', 'comment', timestamp()) + '\n'
        this.computedHtml = htmlstamp +  htmlString
        console.log(this.computedHtml)
        //console.log('the html - inside the iframe')
    },
    iframeExit() {
        this.$refs.iframe.$el.contentWindow.innerHTML = ''
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
    //throw ''
    //const delay = vue.config.delay
    //vue.frameKey += 1
    //vue.$nextTick(() => {
        //vue.displayManager.enterAndLeave('iframe', delay, htmlString)
    //})
}




function extraText(text, context, overrideName) {
    let extra = ''
    console.log(context)
    if (context.context == 'vue') {
        //console.log(context.name)
        let appNumber = 100
        extra = `app${appNumber} = new Vue(${capitalize(overrideName || context.name)}).$mount('#app${appNumber}')`
        //console.log(extra); throw ''
    } else if (context.context == 'function') {
        extra = stringcall(context.name, loremify({ parameters:context.parameters }))
        //console.log({extra, name}); throw "";
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



function vuecmCodeRunner() {
    let cm = app.editor.cm
    let lang = app.editor.lang
    let vue = app
    app.overrideName = 'app'
    const activeBuffers = app.editor.buffers.getActiveBuffers()

    let css = app.editor.buffers.getString('styles.css')
    let js = app.editor.buffers.getString('index.js')
    let useConsole = /^console/gm.test(js)

    if (app.editor.mode == 'js-html' || hasHtmlStuff(js))  {
        //console.log(app.editor.mode)
        let html = createHtmlFrom({js})
        if (useConsole) {
            js = replace(/^[ \t]*console.log.+/gm, (x) => {
                let extra = x.replace('console.log', 'legoConsoleEl.push')
                return x + '\n' + extra
            }, js)
        }
        let data = {css, js, html}
        vue.displayManager.enterAndLeave('iframe', data)
        return 
    }
    else if (useConsole) {
        console.log('hiiii')
        return vuecmToConsole(vue, js)
    }

    if (activeBuffers.length == 3) {
        console.log('returning iframe html')
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
    console.log(context)
    let extra = extraText(text, context, app.overrideName)
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
