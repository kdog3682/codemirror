class JSXGraph {
    foo() {
        this.compose([
            this.circle([0, 0], 1),
            {name: 'glider', onDrag: onDrag1},
        ])
    }
    glider(target, on) {
        const glider = this.create('glider', [target], {
            snapToGrid: this.snapToGrid,
            snapSizeX: this.snapSizeX,
            snapSizeY: this.snapSizeY,
            fillColor: this.gliderFillColor,
            fillOpacity: this.gliderFillOpacity,
            useKatex: false,
            label: {
                offset: [0, 10],
                /* x && y offsets */
                anchorX: 'middle',
                anchorY: 'bottom',
                cssClass: 'glider-label',
                cssStyle: 'color: red',
                useKatex: true,
            },
            name: 'glider',
        }, on)

        return glider
    }
    compose(...args) {
        const argTable = {
            circle: 2,
            glider: 1,
        }
        const store = []
        for (let arg of args) {
            if (!isPureObject(arg)) {
                store.push(arg)
            }
            else {
                let argValue = toArray(arg.value 
                    || store.slice(argTable[arg.name]))

                if (arg.name) {
                    if (arg.options) {
                        argValue.push(arg.options)
                    }
                    const obj = this[arg.name](...argValue)
                    if (arg.onDrag) {
                        obj.on('drag', () => {
                            const listenerArgs = store
                            arg.onDrag(...listenerArgs)
                        })
                    }

                    if (arg.onUp) {
                        obj.on('up', () => {
                            const listenerArgs = store
                            arg.onUp(...listenerArgs)
                        })
                    }
                    store.push(obj)
                }
                else {
                    store.push(argValue)
                }
            }
        }
        this.compositions.push(store)
        return store
    }
    addListener(fn, key = 'out') {
        this.listeners.push(this.lastPointObject)
        const listener = this.lastPointObject.on(key, (e) => {
            fn(this, this.lastPointObject, e)
        })
        console.log(listener)
        $f('@', 'JSXGraph', '@upline', 'console.log(listener)')
    }

    removeListener() {
        const target = this.listeners.pop()
        target.on('move', null)
    }

    render(options = {}) {
        $f('@', 'JSXGraph', '@upline', 'render(options =}) {')
        console.log(JSON.stringify(options, null, 2))
        const { method, args, optionString } = options
        this.set(optionString)
        const object = this[method](...args)
        return object
    }

    text(s, a = 0, b = 0) {
        const anchor = this.lastObject
        const options = {
            anchor,
            cssStyle: 'font-weight: 600',
            useKatex: true,
        }
        const [A, B] = [1, 1]
        return this.create('text', [A, B, s], options)
    }
    square() {}
    rhombus() {}
    quad() {}

    triangleArcAngle(a, b, c) {
        /* JSX points */

        const options = {
            strokeWidth: this.triangleStrokeWidth,
            strokeColor: this.triangleStrokeColor,
            fillColor: this.triangleFillColor,
            fillOpacity: this.triangleFillOpacity,
        }

        var A = [c, b, a]
        var B = [a, c, b]
        var C = [b, a, c]
        const arcA = this.angleArc(A)
        const arcB = this.angleArc(B)
        const arcC = this.angleArc(C)
        const triangle = this.triangle(A, options)
        return triangle
    }

    angleArc(point) {
        const arc = this.create('nonreflexangle', point, {
            radius: 1,
            label: {
                offset: [0, 10],
                anchorX: 'middle',
                anchorY: 'bottom',
                cssClass: 'myLabel',
                cssStyle: 'color: blue',
                useKatex: true,
            },
            name: 'hiya',
        })

        const name = toDegrees(arc.Value())
        arc.name = name
        this.board.update()
        return arc
    }

    constructor(snap = true) {
        this.compositions = []
        //JXG.Options.text.useKatex = true
        // should be activated conditionally
        if (snap) {
            JXG.Options.grid.snapToGrid = true
            this.snapToGrid = true
        }

        this.curveFillOpacity = 0.3
        this.triangleFillOpacity = 0.3
        this.triangleStrokeWidth = 1
        this.triangleStrokeColor = 'black'
        this.triangleFillColor = 'yellow'

        this.circleFillOpacity = 0.3
        this.circleStrokeWidth = 1
        this.circleStrokeColor = 'black'
        this.circleFillColor = 'yellow'
        this.graphStrokeWidth = 1
        this.graphStrokeColor = 'blue'
        this.snapSizeX = 1
        this.snapSizeY = 1
        this.pointSize = 3

        this.gliderFillColor = 'black'
        this.gliderFillOpacity = 0.7

        this.pointFillColor = 'blue'
        this.pointFillOpacity = 0.4
        this.pointStrokeColor = ''
        this.lineStrokeWidth = 2
        this.lineStrokeColor = 'black'

        this.board = JSXInit()
        this.listeners = []
    }

    set(s) {
        if (!s) return

        const [a, b] = getSingleAndDoubleAttrs(s)
        let type = this.lastType

        for (let item of a) {
            switch (item) {
                case 'circle':
                case 'graph':
                case 'line':
                case 'point':
                    type = item
                    break
                case 'snap':
                    break
            }
        }

        const dict = {
            sw: 'strokeWidth',
            sc: 'strokeColor',
            fc: 'fillColor',
            fo: 'fillOpacity',
        }
        for (let [k, v] of b) {
            k = dict[k] || k
            this[type + capitalize(k)] = Number(v)
        }
    }

    create(key, args, options, listener) {
        const dict = {
            nonreflexangle: 'triangle',
        }

        this.lastType = dict[key] || key
        const object = this.board.create(key, args, options)
        if (listener) {
            object.on('up', listener)
        }

        this.lastObject = object
        if ((this.lastType = 'point')) {
            this.lastPointObject = object
        }

        return object
    }
    point(x, y, name = '') {
        const coordinate = [x, y]
        return this.create('point', coordinate, {
            name,
            size: this.pointSize,
            snapSizeY: this.snapSizeY,
            snapSizeX: this.snapSizeX,
            snapToGrid: this.snapToGrid,
            fillColor: this.pointFillColor,
            fillOpacity: this.pointFillOpacity,
            strokeColor: this.pointStrokeColor,
        })
    }

    line(p1, p2) {
        return this.create('line', [p1, p2], {
            strokeColor: this.lineStrokeColor,
            strokeWidth: this.lineStrokeWidth,
        })
    }

    graph(s, a = -10, b = 10) {
        return this.create('functiongraph', [s, a, b], {
            strokeColor: this.graphStrokeColor,
            strokeWidth: this.graphStrokeWidth,
        })
    }

    circle(A, B, options) {
        return this.create('circle', [A, B], options || {
            strokeWidth: this.circleStrokeWidth,
            strokeColor: this.circleStrokeColor,
            fillColor: this.circleFillColor,
            fillOpacity: this.circleFillOpacity,
            fixed: true,
        })
    }

    curve(fnX, fnY, close = true, overrideOptions) {
        const self = this
        const start = [[0], [0]]
        const options = {
            curveFillOpacity: this.curveFillOpacity,
            updateDataArray,
        }
        if (overrideOptions) {
            Object.assign(options, overrideOptions)
        }

        const curve = this.create('curve', start, options)
        this.board.update()

        function updateDataArray() {
            this.dataX = []
            this.dataY = []

            if (close) {
                this.dataX.push(0)
                this.dataY.push(0)
            }

            if (fnX) {
                this.dataX.push(...fnX(self))
            }

            if (fnY) {
                this.dataY.push(...fnY(self))
            }

            if (close) {
                this.dataX.push(0)
                this.dataY.push(0)
            }
        }
    }
    curlyBrace(a, b, height) {
        const options = {
            strokeWidth: 1,
            strokeColor: 'black',
            bezierDegree: 3,
        }
        return this.curve(fnX, fnY, true, options)
    }

    polygon() {}

    segment(A, B) {
        return this.create('segment', [p1, p2], {
            strokeColor: this.lineStrokeColor,
            strokeWidth: this.lineStrokeWidth,
        })
    }

    clear(key) {
        const objects = key
            ? this.board.select(key)
            : this.board.objectsList
        this.board.removeObject(objects)
    }
}

function JSXInit(n = 10, grid = true, axis = true) {
    const defaultConfig = {
        //grid,
        grid: false,
        axis: false,
        boundingbox: [-n, n, n, -n],
        showNavigation: false,
        pan: { enabled: false },
        drag: { enabled: true },
        //registerEvents: false,
        keyboard: false,
        mode: JXG.Board.BOARD_MODE_NONE,
        keepaspectratio: false,
        zoom: false,
        showCopyright: false,
    }
    JXG.Options.label.cssStyle = 'color: blue'
    JXG.Options.ticks.cssStyle = 'color: green'
    //JXG.Options.axis.cssStyle = 'color: green'
    const board = JXG.JSXGraph.initBoard(
        'jsxgraph',
        defaultConfig
    )
    //JXG.Options.axis.ticks.label.cssStyle = 'color: red'
    //JXG.Options.axis.ticks.label.cssClass = 'my-tick-label'
    createXYAxis(board)
    createGrid(board)
    b = board
    return board
}

function toDegrees(rad) {
    return ((rad * 180) / Math.PI).toFixed(1)
}

function jsxgDistance(A, B) {
    const a = jsxgCenter(A)
    const b = jsxgCenter(B)
    return distance(a, b)
}
function jsxgCenter(P) {
    return [P.X(), P.Y()]
}
function jsxListen(el, fn, key = 'down') {
    el.on(key, fn)
}

class JSXComposition extends JSXGraph {
    constructor() {
        super()
    }
    build() {}
    compose() {}
}

function createXYAxis(board) {
    createAxis(board, 'X')
    createAxis(board, 'Y')
}

function createGrid(board, direction) {
}

function createAxis(board, direction) {
    var axisArrayPoints = 
        direction == 'X' ? 
        [[0,0], [1,0]] : 
        direction == 'Y' ?
        [[0,0], [0,1]] : 
        [[0,0], [1,0]]  

    let offset = []
    let anchorX
    let anchorY

    if (direction == 'X') {
        offset = [0, -5]
        anchorX = 'middle'
        anchorY = 'top'
    }

    else if (direction == 'Y') {
        offset =  [-10, 0]
        anchorX = 'right'
        anchorY = 'middle'
    }

    var axis = board.create('axis', axisArrayPoints)
    
    var tickArg = 5 || [2, 4, 6, 8]
    axis.removeTicks(axis.defaultTicks)
    var ticks = board.create('ticks', [axis, tickArg], {
        //strokeColor: 'blue',
        //strokeWidth: 0.5,
        //majorHeight: -1,
        drawLabels: true,
        label: {
            cssClass: 'my-text-label',
            cssStyle: 'font-weight: 800',
            offset,
            anchorX,
            anchorY,
            //useKatex: true,
        },
    })
    return axis
}

//axis() {
//this.create('axis', [[0, 0], [0, 1]], {
//ticks: {
//label: {
//fontSize: 20, cssClass: 'fancy', anchorX: 'right', offset: [-10, 0]}}})
//}
//---------------------------
//console.log(['a', 'b', 'c', 'd', 'e'].slice(-2))
