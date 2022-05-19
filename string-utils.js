
//ss = unique(findall(/family(.*?)rel/g, arg).map((item, i) => findall(/[a-zA-Z+]+/g, item).filter((x) => x != 'px' && x != 'italic')))
//https://unsplash.com/photos/OWq8w3BYMFY?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink
function removeEmptyLines(s) {
    return s.replace(/\n *\n *\n+/g, '\n\n')
}

function smCleanup(s) {
    s = removeAllComments(s)
    s = pretty(s)
    s = removeEmptyLines(s)
    return s
}


function loremify(o) {
    return ''
    if (o.parameters) {
        return o.parameters.map((item, i) => {
            return LoremParameters[item]
        })
    }
    return ''
}

const LoremParameters = {
    foo: {
        s: 'vv',
    },
    n: 33,
}

function stringCallClass({
    name,
    context,
    parameters,
    innerName,
}) {
    let s = `const ${name.toLowerCase()} = new ${name}(${constructorParameters.join(
        ', '
    )})\n`
    if (innerName && innerName != 'constructor') {
        s += `${name.toLowerCase()}.${innerName}(parameters.join(', ')})`
    }
    return s
}

//const transformConsole = repf('console.log', 'app.console.push')

const transformConsole = repf(/^[ \t]*console.log.+/gm, (x) => {
    return x + '\n' + x.replace('console.log', 'app.console.push')
})

function changeExtension(s, ext) {
    return s.replace(/\.\w+$/, '.' + ext)
}

function hasCallables(s) {
    return /^[\w\.]+\(/m.test(s)
}



function removeLegoScripts(s, js) {
    const regex = ncg('src="$1"', ['assets.js', 'stylesheet.js', 'css-utils.js', 'ec.js', 'lego.js', 'ec2.css'])

    return s.split('\n').filter((line) => {
        if (test(/<!--/, line)) return 
        if (test(/let lastElementName/, line)) return 
        if (!js && test(`src="\\S+.js"`, line)) return 
        if (test(regex, line)) return 
        return true
    }).join('\n')
}

function htmlFromCss(s) {
    const matches = unique(findall(/^\.(\S+) {/gm, s))
    //console.log([s, matches])
    const tags = ['button', 'input', 'section', 'p', 'btn']
    const html = reduceToString(matches, (x) => {
        let tag = search(boundary(tags), x) || 'div'
        if (tag == 'btn') tag = 'button'
        return divify(tag, x, x)   
    })
    return divify('div', 'html-from-css-container', html)
}


//testRunner(s, htmlLineParser)
function indentWrap(s, fn) {
        let spaces = getTabs(s)
        s = dedent(s, spaces)
        s = fn(s)
        s = indent(s, spaces)
        return s
}

function replaceInner(s, key, fn) {
    const regex = new RegExp(`<${key}>\\n*(\\s*\\S[^]*?)\\s*</${key}`)
    const gn = (_, x) => {
        let y = indentWrap(x, fn)
        return _.replace(RegExp(rescape(x)), y)
    }
    return s.replace(regex, gn)
}

//console.log(htmlLineParser('p .foo hi goign the store'))
//console.log(stringcall('ffo', ''))


//console.log(transformConsole('console.log("CC")'))
//hate taking photos...
//that is my feeling
//console.log(createConfig('s s  a b f ?SLKAJS<@#()@D'))
// load a ton of fonts...

function addCssImports(s) {
    const ref = assets.css
    //const more = fonts.reduce((acc, item, i) => {
        //cabmap[item.toLowerCase()] = [['font-family', item]]
        //acc[item] = toGoogleFontUrl()
        //return acc
    //}, {})
    //Object.assign(ref, more)
    return dreplace(s, ref, 'import ($1)\\b')
}
//console.log(addCssImports('import abc abcd babc'))

function getBindings(s) {
    //return s.match(/\w+(?= )|
}
function addLetAndConst(s) {
    const ignore = ['e', 'app']
    const bindings = getBindings(s)
    const params = getAllParameters(s)
}

function htmlFromJs(js) {
    const ref = {
        getElementById,
        querySelector,
        querySelectorAll,
    }
    const runner = (x) => divify('div', x, '')
    function getElementById(s) {
        return runner({id: s})
    }
    function querySelector(s) {
        return runner({class: s})
    }

    function querySelectorAll(s) {
        return divify('div', s, [
            divify('div', s.slice(0, -1), ''),
            divify('div', s.slice(0, -1), ''),
            divify('div', s.slice(0, -1), ''),
            divify('div', s.slice(0, -1), ''),
        ])
    }
    const matches = findall('(getElementById|querySelector(?:All)?)(?:\\([\"\']\\W?(.*?)[\'\"]\\))', js)
    let s = ''
    for (let [a,b] of matches) {
        let fn = ref[a]
        s += fn(b) + '\n'
    }
    return s
}

function varializeEverything(s, target) {
    const block = getBlock(target)
    let i = 0
    const output = block.replace(regex, (x) => {
        return '__config__.' + n2char(i++)
    })
    const regex = /\b-\d+(?:\.\d+)?|[\'\"].*?[\'\"]/g
}
function hasHtmlStuff(s) {
    return test('getElementById|querySelector', s.slice(0, 300))
}

function getFileDependencies(s) {
    const regex = /=[\'\"]?([\w-\.]+\.(?:js|css))/g
    return unique(findall(regex, removeAllComments(s)))
}


class LineParser {
    constructor(s) {
        this.lines = s.split('\n')
        this.index = 0
    }
    run(fn) {
        for (let line of this.lines) {
            if (this.skipEmptyLines && !exists(line)) {
                continue
            }
            if (this.skip && this.skip(line)) {
                continue
            }
            this.line = line
            fn(this, this.index)
            this.index += 1
        }
    }
    match(x) {
        if (hasFlag('g', x)) {
            return findall(x, this.line)
        }
        return search(x, this.line)
    }
}
function vuejsFromHtml(s) {

    const textRE = /{{(\w+)}}/g
    const a = /([@:])(\w+)="(.*?)"/g
    const b = /v-(\w+)="(.*?)"/g
    const c = /<([A-Z][\w-]+|\w+-[\w-]+)/

    function runner(storage, atCols, vifs, texts) {
       for (let [type, k, v] of atCols) {
           if (type == '@') {
               base.add('methods', fillerMethod(v))
           }

           else if (type == ':') {
               base.add('data', v, toValueFromKey(v))
               if (storage != base) {
                   storage.add('props', v)
               }
           }
       }
       for (let vif of vifs) {
               base.add('data', vif[1], true)
           //if (vif[0] == 'for') {
               //let name = search(/\S+$/, vif[1])
               //base.add('data', name, placeholders)
           //} else {
           //}
       }
       for (let text of texts) {
           base.add('data', text, text)
       }
    }

    const parser = new LineParser(s)
    const store = []
    let base = new Storage()
    parser.skipEmptyLines = true
    parser.skip = (x) => /^ *<\//.test(x)
    parser.run((x, i) => {
        let component = x.match(c)
        let atCols = x.match(a)
        let vifs = x.match(b)
        let texts = x.match(textRE)
        if (i == 0) {
            let className = x.match('class="(.*?)"')
            base.set('name', className ? toPascal(className) : "my-name")
            base.set('template', s)
            runner(base, atCols, vifs, texts)
            store.push(base)
        }
        else if (component) {
            let item = new Storage()
            item.set('name', component)
            item.set('template', sampleTemplate(component))
            base.add('components', component)
            runner(item, atCols, vifs, texts)
            store.push(item)
        }
        else {
            runner(base, atCols, vifs, texts)
        }
    })

    let value = store.map((x) => x.value)
        .map(vueStringify).reverse().join('\n\n')

    return value + '\n\n' + callVue(store[0].get('name'))
}
/* mock-up-helper */
function hasFlag(flag, regex) {
    return regex.flags && regex.flags.includes(flag)
}


function vueStringify(obj) {
    return createVariable(toPascal(obj.name), toVueString(obj))
}

function toVueString(obj) {
    function toVueDataObjectFromArray(dataItems) {
        if (isObject(dataItems)) {
            return reduceObject(dataItems, (a, b) => {
                let key = nameIt(a)
                return [key, toValueFromKey(key, b)]
            })
        }
        return dataItems.reduce((acc, item, i) => {
            item = nameIt(item)
            acc[item] = toValueFromKey(item)
            return acc
        }, {})
    }

    const functionals = [
        'methods',
        'computed',
        'watch',
    ]

    let useTemplate = true

    function wrapper(key, payload) {
        if (!exists(payload)) return

        if (key == 'name') {
            return `${key}: '${toPascal(payload)}',`
        }
        if (key == 'methods' || key == 'computed') {
            payload = prepareIterable(payload, 'values')
                .map(removeFnPrefix).join(',\n') + ','
            return `${key}: {\n${indent(payload)}\n},`
        }

        if (key == 'template' && useTemplate) {
            if (!test(/^\s*<[^<\n]+?>\n/, payload)) {
                payload = moveFirstClassUp(payload)
                //payload = divify('div', 'app-container', payload)
            }
            return `${key}: \`\n${indent(
                payload.trimEnd()
            )}\n\`,`
        } else if (key == 'data') {
            payload =
                'return ' +
                toStringObject(
                    toVueDataObjectFromArray(payload)
                )
            return `${key}() {\n${indent(payload)}\n},`
        } else if (key == 'render') {
            useTemplate = false
            if (test(/.*?context/, payload)) {
                return `functional: true,\n${payload},\n`
            }
            return `${payload},\n`
        } else if (key == 'mounted' || key == 'created') {
            return `${payload},\n`
        } else if (key == 'props') {
            return `${key}: [${payload
                .map(singlequote)
                .join(', ')}],`
        } else if (key == 'components') {
            return `${key}: {${payload
                .map((x) => toPascal(x))
                .join(', ')}},`
        } else {
            return `${key}: {\n${indent(payload)}\n},`
        }
    }

    let s = ''
    const order = [
        'name',
        'components',
        'props',
        'render',
        'template',
        'data',
        'methods',
        'created',
        'mounted',
        'computed',
        'watch',
    ]
    for (let key of order) {
        if (
            key == 'template' &&
            obj.hasOwnProperty('render')
        )
            continue
        let value = wrapper(key, obj[key])
        if (value) s += value + '\n'
    }

    s = '{\n' + indent(s.trimEnd(), 4) + '\n}'
    return s
}

function nameIt(s) {
    
            return toCamelCase(search(/[\w-]+$/, s))
}

function toValueFromKey(s) {
    const known = {
        'active': 'true',
        'hi': '"hi"',
        'foo': '"fooo"',
    }
    if (s in known) return known[s]
    if (s.endsWith('s')) {
       let placeholders = range(3).map((x) => s.slice(0, -1) + x)
       return toStringArgument(placeholders)
        return '[]'
    }
    if (/(dict|info|ref|config)$/i.test(s)) return '{}'
    if (/(level|count|index)$/i.test(s)) return 0
    return singlequote(s) + comment('ph')
    //return '\'\''
}

function moveFirstClassUp(s) {
    let [text, className] = mreplace(/ class="(.*?)"/, s)
    return divify('div', className, text)
}

function removeFnPrefix(s) {
    return s.toString().replace(/function /, '').replace(/^    /gm, '')
}
//console.log(vueStringify(o))

    function fillerMethod(s) {
        if (isWord(s)) {
            return `${s}() {\n\t\console.log('${s}')\n}`
        }
        return s
    }


  //s=`<button @click="onClick" class="SaveForLaterButton"
        //save for later
    //</button>`
    //
    //
    //
    //
function callVue(name, appNumber = 100) {
    return `app${appNumber} = new Vue(${toPascal(name)}).$mount('#app${appNumber}')`
}

function cleanupHtml(s) {
    return s.replace(/\n\s*(?:<style>\s*<\/style>|<script>\s*<\/script>)/g, '')
}

function sampleTemplate(name) {
    return divify('div', name, name + '-placeholder')
}

const TextTemplates = {
    'index.html': '',
}

s = `
<p class="sugar">hii</p>
<div class="fooboo">{{fooboo}}</div>
<div class="gold">
	<div v-if="go">
		<div v-if="go">
			<div class="zark" v-if="hi">
			</div>
		</div>
	</div>
</div>
`
//console.log(changeTemplate(vuejsFromHtml(s), 'sup'))
//
//


function transformColors(s) {
    colors = roygbiv.reduce((acc, item, i) => {
        acc[item] = tailwind[item + '4']
        return acc
    }, {})
    return dreplace(s, colors)
}

function changeTemplate(s, template) {
    template = moveFirstClassUp(template)
    let value = s.replace(/template: \`[\w\W]+?\`,/, (x) => {
        return `template: \`${newlineIndent(template, 8)}\t\`,`
    })
    //console.log(value)
    return value
}

//s='const box = document.querySelector("foo")'
//console.log(htmlFromJs(s))
function lambdaAsyncify(s) {
    return `(async () => {\n${s}\n})()`
}
        //console.log(divify('div', 'v', 'v'))
        //console.log(htmlFromCss(".apple-input-foo {}"))
