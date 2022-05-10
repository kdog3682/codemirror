function vueText(s) {
    return '{{' + toCamelCase(s) + '}}'
}

function fixClassName(s) {
    s = s.trim()
    if (!s || test(/[A-Z]/, s)) return s
    const items = [
        'post',
        'get',
        'split',
        'set',
        'is',
        'has',
        'create',
        'component',
    ]
    const regex = ncg('^(?:$1)(?!(?:-|$))', items)
    return replace(regex, '$&-', s, '')
}

class HtmlEdit extends LineEdit {
    constructor(s, parser) {
        super()
        this.setParser(parser)
        this.s = s
    }
    static generate(s, parser) {
        const editor = new HtmlEdit(s, parser)
        const value = editor.run().toString()
        return value
    }

    setParser(fn) {
        this.parserA = (line) => fn(this, line, false)
        this.parserB = (line) => fn(this, line, true)
    }

    parser(line, spaces, i) {
        if (!exists(line)) {
            this.set('')
            return
        }

        if (this.isLast) {
            const value = this.parserA(line)
            this.set(value)

            const entries = sorted(
                Object.entries(this.tracker),
                (x) => x[0],
                'reverse'
            )
            for (let [spacing, closingTag] of entries) {
                if (closingTag == null) continue
                const payload = toClosingTag(closingTag)
                this.set(payload, Number(spacing))
            }

            this.tracker = {}
            return
        }

        let nextSpaces = fixSpaceLength(getIndent(this.peek(exists)))

        if (nextSpaces == spaces) {
            this.set(this.parserA(line))
            return
        }

        if (nextSpaces > spaces) {
            const value = this.parserB(line)
            this.set(value)
            this.tracker[spaces] = search(/[\w-]+/, value)
            return
        }

        if (nextSpaces < spaces) {
            this.set(this.parserA(line))

            while (spaces - nextSpaces > 0) {
                spaces -= 4

                let memory = this.tracker[spaces]
                if (memory) {
                    this.set(toClosingTag(memory), spaces)
                    this.tracker[spaces] = null
                }
            }
            return
        }
    }
}

function toVueHtml(s, className) {
    if (hasHtml(s)) return s
    s = removeComments(s)
    s = smartDedent(s)
    if (!exists(s)) {
        return divify('div')
    }

    if (className) className = toDashCase(className)
    const html = HtmlEdit.generate(s, htmlParser)
    const value = divify('div', className, html)
    console.log(value)
    return value
}

function htmlParser(state, s, isOpening) {
    const defaultattrmap = {
        autofocus: '',
    }
    const divdict = {
        title: {
            class: 'title',
            tag: 'h3',
        },

        main: {
            tag: 'main',
            class: 'main',
        },
    }

    let attrs = []
    let text
    let item
    let rest
    let div = 'div'
    let className = ''
    let refName
    let tag = 'div'
    let doubleAttrs
    let singleAttrs
    if (!state.count) state.count = 0
    let containerClass = 'container-' + 100 + state.count++
    let isComponent

    if (test(/^\w\S+$/, s)) {
        if (s.includes('=')) {
            let [a, b] = split(s, '=')
            let div = 'div'
            if (a == 'for') {
                let arg = depluralize(b)
                let stuff = `(${arg}, index) in ${b}`
                className = toDashCase(arg) + '-item'
                return toOpeningTag('div', {
                    class: className,
                    'v-for': stuff,
                })
            }
        }
        if (s == 'div' || s == 'container') {
            return toOpeningTag(div, {
                class: containerClass,
            })
        }

        if (s == 'transition') {
            return toOpeningTag(s, {
                mode: 'out-in',
                name: 'fade',
            })
        }

        if (s == 'component') {
            return divify(s, {
                ':is': 'currentComponent',
            })
        }
        if (test(/^item\.\w+$/, s)) {
            let className = state.forArg
                ? state.forArg + '-' + toDashCase(s)
                : toDashCase(s)

            return divify('div', { class: className }, vueText(s))
        }

        return divify('div', { class: toDashCase(s) }, vueText(s))
        return toOpeningTag(div, { class: s })
    }

    ;[s, text] = mreplace(/\[(.*?)\]/, s)
    if (test(/^{/, text)) {
        text = text.replace(/\{{1,2}/, '{{').replace(/\}{1,2}/, '}}')
    }
    ;[item, rest] = splitonce(s)
    ;[item, tag] = mreplace(/^[.!@#]/, item)
    ;[rest, doubleAttrs] = mreplace(/(\S+?) *= *(\S+)/g, rest)
    singleAttrs = split(rest)
    let originalItem = item
    if (!doubleAttrs) doubleAttrs = []
    if (!singleAttrs) singleAttrs = []

    if (item == 'slot') {
        return ``
        singleAttrs = []
        div = 'ul'
    }

    if (item == 'for') {
        singleAttrs = []
        div = 'ul'
        let target = getLastWord(rest)
        className = target
        let arg = 'item'
        state.forArg = target
        let vfor = `${arg} in ${target}`
        attrs.push(['v-for', vfor])
    } else if (tag == '@') {
        le.componentName = item
        className = item + '-component'
    } else if (tag == '#') {
        div = item + '-component'
        className = item + '-component'
        isComponent = true
    } else if (item in divdict) {
        let ref = divdict[item]
        className = ref.class || ''
        div = ref.tag
    } else if (tag == '.') {
        div = 'div'
        className = item
    } else if (isStandardHtml(item)) {
        div = item
    } else if (test(/^item\.\w+$/, item)) {
        className = state.forArg
            ? state.forArg + '-' + toDashCase(item)
            : toDashCase(item)

        text = vueText(item)
        div = 'div'
    } else if (item) {
        div = 'div'
        className = item
        if (!isOpening) text = vueText(item)
    }

    for (let [attr, val] of doubleAttrs) {
        if (attr == 'class') {
            if (!className.includes(val)) className += ' ' + val
            continue
        }

        if (attr.startsWith(':')) {
            attrs.push([attr, val])
            continue
        }

        if (attr == 'key') {
            attrs.push([':key', val])
            continue
        }

        if (attr == 'show') {
            if (!test(/^(show|is)/, val) && !val.includes('.')) {
                val = 'show' + capitalize(val)
            }
            attrs.push(['v-show', val])
            continue
        }

        if (attr == 'for') {
            const b = depluralize(val)
            const c = pluralize(val)
            const stuff = `(${b}, index) in ${c}`

            if (isComponent) {
                attrs.push([':' + b, b])

                if (!attrs.find((x) => x[0] == ':key')) {
                    attrs.push([':key', 'index'])
                }
            }

            attrs.push(['v-for', stuff])
            continue
        }
        if (attr.startsWith('v')) {
            attr = attr.replace(/^v(?=\w)/, 'v-')
            attrs.push([attr, val])
            continue
        }

        if (vmap[attr]) {
            attr = vmap[attr]
            attrs.push([attr, val])
            continue
        }

        if (true) {
            attr = ':' + attr
            attrs.push([attr, val])
            continue
        }
    }

    //console.log(singleAttrs)
    for (let attr of singleAttrs) {
        if (attr.startsWith('@')) {
            if (attr == '@') {
                attrs.push([
                    '@' + toDashCase(originalItem),
                    toCamelCase('on' + capitalize(originalItem)),
                ])
                continue
            }

            let val = attr.slice(1)
            let value = toCamelCase(
                val.startsWith('on') ? val : 'on' + capitalize(val)
            )
            attrs.push(['@' + toDashCase(val), value])
            continue
        }
        if (attr.startsWith('.')) {
            let name = attr.slice(1)
            if (!className.includes(name)) className += ' ' + name
            continue
        }

        if (attr == 'style') {
            attrs.push([
                ':style',
                `computed${capitalize(originalItem)}Style`,
            ])
            continue
        }

        if (attr == 'show') {
            attrs.push([
                'v-show',
                toCamelCase('show-' + originalItem),
            ])
            continue
        }

        if (attr == 'for') {
            const a = getFirstWord(originalItem.toLowerCase())
            const b = depluralize(a)
            const c = pluralize(a)
            const stuff = `(${b}, index) in ${c}`
            attrs.push(['v-for', stuff])
            continue
        }

        if (attr == 'ref') {
            attrs.push(['ref', toCamelCase(originalItem)])
            continue
        }

        if (attr.startsWith('v')) {
            attr = attr.replace(/^v(?=\w)/, 'v-')
            attrs.push([attr, getFirstWord(originalItem)])
            continue
        }

        if (defaultattrmap[attr]) {
            attrs.push(...defaultattrmap[attr])
            continue
        }

        if (attr) {
            attrs.push([':' + toDashCase(attr), attr])
            continue
        }
    }

    //console.log([text, className])
    if (className) {
        className = fixClassName(className)
        attrs.push(['class', className])
    }
    let htmlPayload = divify(div, attrs, text)
    return isOpening
        ? toOpeningTag(div, attrs, isComponent /* force */)
        : htmlPayload
}

module.exports.htmlParser = htmlParser

function hasHtml(s) {
    return test(/<[a-z]/, s)
}

function divify(tag, attrs = '', x = '') {
    if (!x) x = ''
    let s = toOpeningTag(tag, attrs)

    if (
        isArray(x) ||
        (isString(x) && (hasNewline(x) || hasHtml(x)))
    ) {
        s += newlineIndent(x)
    } else {
        s += x
    }

    s += toClosingTag(tag)
    return s
}

function toOpeningTag(el, attrs = '', force) {
    if (el == 'html') return '<!doctype html><html>'

    if (isString(attrs)) {
        attrs = ' class=' + doublequote(attrs)
    } else if (attrs) {
        attrs = reduceToString(attrs, (a, b) => {
            return b ? ` ${a}="${b}"` : a
        })
    } else {
        attrs = ''
    }

    const suffix = hasHtmlSuffix(el, force) ? '>' : '/>'
    return '<' + el + attrs + suffix
}

function toClosingTag(el) {
    if (closers.includes(el)) return '</' + el + '>'
    return ''
}

function divifyImage(src) {
    return divify('img', { class: 'img', src: src }, '')
}

function hasHtmlSuffix(el, force) {
    if (force) return true
    return closers.includes(el)
}

const ccclosers = [
    'style',
    'pre',
    'script',
    'body',
    'ul',
    'li',
    'p',
    'textarea',
    'button',
    'section',
    'div',
    'h1',
    'h2',
    'h3',
    'main',
    'blockquote',
    'span',
    'article',
    'body',
    'html',
    'head',
    'template',
    'h4',
    'h5',
    'h6',
]

const noclosers = ['input', 'hr', 'br', 'link', 'img']

function toSingularForArg(s) {
    if (!s.endsWith('s')) return 'item'
    if (s == 'matches' || s == 'regexes') return s.slice(0, -2)
    return s.slice(0, -1)
}

//console.log(vueHtml(`
//#foo abc def show
//aple
//`))

//console.log(htmlify(`
//list ${['a', 'b', 'c', 'd', 'e']}
//intro hi
//`))

function htmlify(s) {
    if (hasHtml(s)) return s
    s = removeComments(s)
    s = smartDedent(s)
    const dict = {
        list(s) {
            const [a, b] = splitonce(s)
            const items = b ? split(b, ',') : split(a, ',')
            const className = b ? a : 'list'
            const childClassName =
                depluralize(className) + '-' + 'child'
            return divify(
                'ul',
                className,
                items.map((x) => divify('li', childClassName, x))
            )
        },
    }
    const fn = splitparsef(dict, (a, b, line) => divify('div', a, b))
    return join(linegetter(s).map(fn))
}
