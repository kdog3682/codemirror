

class Stylesheet {
    constructor(name, styles) {
        this.cssName = fixSelector(name)
        this.name = removeSymbols(name) || this.cssName
        this.$el = createElement('style', { name: this.name })
        this.clear()
        this.addStyles(styles)
    }

    set(s) {
        this.$el.innerHTML = s
    }
    clear() {
        this.styles = []
        this.popped = []
        this.$el.innerHTML = ''
    }

    update() {
        const value = this.styles.join('\n')
        this.$el.innerHTML = value
    }

    undo() {
        if (this.styles.length == 0) return
        this.popped.push(this.styles.pop())
        this.update()
        return true
    }

    redo() {
        if (this.popped.length == 0) return
        this.styles.push(this.popped.pop())
        this.update()
        return true
    }

    get style() {
        return this.$el.innerHTML || ''
    }

    addStyles(styles) {
        if (!styles) return

        for (let style of toArray(styles)) {
            this.addStyle(style, false)
        }
        this.update()
    }

    addStyle(s, update = true) {
        let style = cssParser(this.cssName, s)
        if (style) {
            this.styles.push(style)
            if (update) this.update()
        }
        return style
    }

    getLastProperty() {
        let regex = /(\S+) *: *(\S+?);?\s*\}$/
        let [key, value] = search(regex, getLast(this.styles))
        return { key, value }
    }
    increment(direction = 1) {
        if (!exists(this.styles)) {
            return
        }
        let prev = getLast(this.styles)
        if (!isSingleCssProperty(prev)) {
            return
        }

        let replacer = (_, key, value) => {
            return cssEntry(key, cssIncrement(key, value, direction, 1))
        }
        let regex = /(\S+) *: *([^\s;]+(?: \/.+)?)/
        let newStyle = prev.replace(regex, replacer)
        return this.addStyle(newStyle)
    }
    decrement() {
        return this.increment(-1)
    }
}

