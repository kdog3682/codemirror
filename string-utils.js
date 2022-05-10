
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
    return reduceToString(matches, (x) => {
        return divify('div', x, x)   
    })
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


function createHtmlFrom({js}) {
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
