const jsSnippets1 = [
   'const box = document.querySelector(".box")',
   'const boxes = document.querySelectorAll(".boxes")',
  "const watcher = new Watcher()",
  "const name = x.constructor.name",
  "const store = []",
  "const regex = /$c/g",
  "const matrix = new Matrix($c)",
  "const storage = new Storage($c)",
  "const stack = getStackTrace()",
  "const matches = findall(${regex}, s)",
  "const seen = new Set()",
  "const result = []",
  "const store = {}",
  "const store = range(args.length + 1, [])",
  "const items = split(s)",
  "const clock = new Clock({\n\tonTick() {\n\t\t$c\n\t}\n}))",
]
const jsSnippets1a = jsSnippets1.map((item, i) => {
    let boost = null
    /* not necessary */
    if (test(/\$\{/, item)) {
        let template = item
        let label = getSecondWord(item)
        return snippetCompletion(template, {label, boost})
    }
    if (test(/=/, item) && !test(/\$/, item)) {
        item += '\n$c'
    }
    return {
        label: item.replace(/^\w+ /, ''),
        template: item,
        //boost: itemBoost(item),
        apply: applySnippet,
    }
})

/*   */







var snippetCache = new Cache(WeakMap)

class SnippetManager {
    forceStart() {}
    jsSnippets() {
        const words = this.watcher.filter(cmCollectWords(e.cm))
        const newSnippets = SnippetManager.toSnippets(words)
        return this.baseSnippets.concat(newSnippets)
    }
    snippetGetter(s) {
        switch (this.lang) {
            case 'css':
                return getClassNames(s, 'all')
            case 'js':
                this.jsSnippets()
        }
    }
    updateCache(text, overwrite) {
        const baseTags = ['section', 'main', 'span']
        const snippets = [
            ...baseTags,
            ...getClassNames(text, 'all'),
        ]
        this.cache.set('htmlNames', snippets)
        //console.log(snippets)
        //console.log(JSON.stringify(this.cache, null, 2))
        return snippets
    }

    temp(...snippets) {
        let prev = this.snippets
        let self = this
        this.snippets = snippets.map((item, i) => {
            return {
                label: item,
                apply(cm, completion, from, to) {
                    //console.log('hi apply', item, completion, from, to)
                    cmInsert(cm, 'sup!')
                    //console.log('resetting')
                    self.snippets = prev
                },
            }
        })
    }
    update() {
        const words = this.watcher.filter(cmCollectWords(e.cm))
        const newSnippets = SnippetManager.toSnippets(words)
        this.snippets = this.baseSnippets.concat(newSnippets)
        return words
    }

    reset() {
        this.watcher.reset()
        this.tempSnippets = []
    }

    factory() {
        if (!this[this.lang]) return
        const fn = this[this.lang].bind(this)
        const maxRenderedOptions = 10
        return {
            override: [fn],
            maxRenderedOptions,
        }

        return autocompletion({
            override: [fn],
            maxRenderedOptions,
        })
    }

    static toSnippet(key) {
        //const type = typeOf(value[key])
        return {
            label: key,
            //type: type,
        }
    }

    static toSnippets(o) {
        return isString(o)
            ? { label: o }
            : isArray(o)
            ? o.map((label) => ({ label }))
            : Object.entries(o).map(([label, template]) => {
                  return snippetCompletion(template, { label })
              })
    }

    constructor(lang) {
        this.lang = lang
        this.watcher = new Watcher()
        this.snippetCache = new Cache(WeakMap)
        /* not in use ... it is the global one being used */
        this.cache = new Cache()
        this.baseSnippets = SnippetManager.toSnippets(
            SnippetLibrary[lang] || {}
        )
        if (lang == 'js') {
            this.solSnippets = jsSnippets1a
            this.argSnippets = []
            this.methodSnippets = Object.keys(jsMethodSnippets)
            .map((x) => {
                return {
                    label: x,
                    apply: applyFunctionalSnippet,
                }
            })
        }

        /* the mistake was pushing ... vs concating */
        this.tempSnippets = []
        this.snippets = this.baseSnippets
        //console.log(this.snippets)
    }

    /* deprecating it */
    _css(context) {
        let word = context.matchBefore(/\w*$/)
        console.log(word)
        let line = context.state.doc.lineAt(context.pos)
        let [spaces, text] = getIndentAndLine(line.text)
        //console.log({spaces, text})
        //console.log(spaces, 'sp')
        let snippets
        //console.log(); throw ''
        if (spaces == 0) {
            let fallback = () => {
                return this.updateCache(
                    app.editor.buffers.getString(
                        'index.html'
                    ) || ['booga']
                )
            }
            snippets = this.cache.get('htmlNames', fallback)
            snippets = snippets.map(SnippetManager.toSnippet)
            //snippets = snippets.map(x=>toFunctionalSnippet(x, y => '.' + y + ' {\n\t$c\n}'))
        } else if (text.includes(':')) {
            let prop = search(/[\w-]+/, text)
            snippets = cssPropertyValueRef[prop]
            //console.log({snippets, prop})
            snippets = snippets.map((x) =>
                toFunctionalSnippet(x, ';\n\t')
            )
        } else {
            snippets = cssPropertyNames
            snippets = filteredSnippets(snippets, word)
            //console.log(snippets)
            snippets = snippets.map((x) =>
                toFunctionalSnippet(x, ': ', word)
            )
        }

        return {
            from: word.from,
            options: snippets,
            validFor: /[\w$]*$/,
        }
    }
    js(context) {
        let before = context.matchBefore(/.*/)
        let text = before.text

        if (test(/^@/, text)) {
            let from = before.to + 1
            return functionCompleter(from)
        }

        if (test(/^ *\S+$/, text)) {
            /* only has starting spaces */
            //console.log([text])
            let from = text.includes(' ') ? before.to - text.search(/\w/) : before.from
            return autoCompleter(from, this.solSnippets)
        }

        if (test(/\.\w*$/, text)) {
            /* ends with a period or period-word */
            let [a,b] = search(/(\w+)\.(\w*)$/, text)
            const from = before.to - b.length
            return autoCompleter(from, this.methodSnippets)
        }


        //if (test(/\($/, text)) {
            //return autoCompleter(before.to, this.argSnippets)
        //}

        let value = cmpit(context)
        if (value) return value
    }

    autocomplete(context, snippets) {
        let word = context.matchBefore(/\w*$/)

        if (this.override) {
            console.log('returning override')
            return {
                from: word.from,
                options: snippets,
                span: /[\w$]*$/,
            }
        }

        let possibles = snippets.filter((x) => {
            return x.label.startsWith(word.text)
        })
        if (!exists(possibles)) {
            return
        }

        return {
            from: word.from,
            options: snippets,
            span: /[\w$]*$/,
        }
    }
}

function cmpit(context) {
    const completePropertyAfter = [
        'PropertyName',
        '.',
        '?.',
        '[',
    ]
    //let node = cmNode(context)
    //let before = node.resolveInner(context.pos, -1)

    let before = cmNodeBefore(context.state, context.pos)
    if (before.name == 'VariableName') {
        const beforeString = cmNodeValue(context, before)
        return {
            from: before.from,
            options: getSnippetOptions(),
            validFor: /^[\w$]*$/,
        }
    }
    if (!completePropertyAfter.includes(before.name)) {
        return
    }

    const farLeft = before.parent.getChild('Expression')
    if (!farLeft) return
    const expr = cmNodeValue(context.state, farLeft)
    let from = /[\.\[]/.test(before.name)
        ? before.to
        : before.from

    let options = getSnippetOptions(expr, from)

    let payload = {
        from,
        options,
        validFor: /^[\w$]*$/,
    }
    return payload
}

function splitMemberExpression(s) {
    if (!s.includes('[')) return s.split('.')
    return s.match(/\w+/g)
}

function getSnippetOptions(s, transformer) {
    transformer = SnippetManager.toSnippet
    function getKeys(ref) {
        const value =
            ref == window ? getWindowKeys() : Object.keys(ref)
        return value.map(transformer)
    }

    let ref = window
    if (!s) return snippetCache.get(ref, getKeys)
    let keys = splitMemberExpression(s)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let next = ref[key]
        if (isObject(next)) {
            ref = next
        } else if (i > 0) {
            return []
        } else {
            return []
        }
    }
    return snippetCache.get(ref, getKeys)
}
function getWindowKeys() {
    const ignore = ['chrome']
    const filter = (k, v) => {
        return isObject(v) && !ignore.includes(k)
    }
    return filterObject(window, filter, 'keys')
}

function toFunctionalSnippet(snippet, extra, word) {
    return {
        label: snippet,
        //info(c) {
            //return elt('hi ' + snippet)
        //},
        type: 'css snippet',
        apply(cm, c, f, t) {
            return applySnippet(cm, c, f, t, snippet, extra)
        },
    }
}
function applySnippet(cm, c, f, t, snippet, extra) {
    let value
    //console.log({extra})
    if (isFunction(extra)) {
        value = extra(snippet)
    } else {
        value = snippet + extra
    }
        //console.log({value})

    if (value.includes('$')) {
        const [insert, cursor] = getCursorFromText(value)
        const anchor = f + cursor
        return cmDispatchText(cm, f, f + 1, insert, anchor)
    } else {
        cmDispatchText(cm, f, t, value, f + value.length)
    }
    return 1
}

function fakeSnippets() {
    return alphabet
        .map((x) => x.repeat(3))
        .map(SnippetManager.toSnippet)
}




function functionalMethodSnippets(parent) {
    const update = function lambda(current, f, t, context) {
        console.log('hi')
        console.log(JSON.stringify(arguments, null, 2))
    }
    const snippets = ['red', 'redab', 'redkv', 'fil']
    const options = snippets.map((x) => {
        return {
            label: x,
        }
    })
    console.log(options)
    return { update, options }
}

function applyFunctionalSnippet(cm, c, f, t) {
    let template = jsMethodSnippets[c.label]
    let line = cmLine(cm, f)
    let spaces = getTabs(line.text)
    return cmDollar(cm, line, template, spaces, f, 'spicy', t)
}

function filteredSnippets(snippets, word) {
    return (snippets || []).filter((snippet) => {
        return (
            snippet.startsWith(word.text) ||
            abbreviate(snippet) == word.text
        )
    })
}
//
//

function functionSnippets(apply) {
    const functions = assets.windowFunctions
    return Object.entries(assets.windowFunctions).map(([a,b], i) => {
        return {label: a, value: b.toString(), apply}
    })
}

function completionFactory(snippetFn, applyFn) {
    let snippets = snippetFn(applyFn)
    return function lambda(s) {
        return {
            from: from,
            options: snippets,
            validFor: /[\w$]*$/,
        }
    }
}

const functionCompleter = completionFactory(functionSnippets)

function autoCompleter(from, snippets) {
        return {
            from: from,
            options: snippets,
            validFor: /[\w$]*$/,
        }
}

function applySnippet(cm, c, f, t) {
    let template = c.template
    let line = cmLine(cm, f)
    let spaces = getTabs(line.text)
    return cmDollar(cm, line, template, spaces, f, 'spicy', t)
}
