const DateComponent = {
    props: ['value'],
    template: `
        <div>
            <div class="computedDate">{{computedDate}}</div>
        </div>
    `,
    data() {
        return {}
    },
    computed: {
        computedDate() {
            return datestamp(this.value)
        },
    },
}

function gistDisplayComponent(data) {
    const { created_at, description, files, owner } = data

    return {
        components: {
            DateComponent,
        },
        template: `
                <div>
                <div class="description">{{description}}</div>
                <date-component :value="date"/>
                <div class="owner">{{owner}}</div>
                <div class="name">{{name}}</div>
                </div>
            `,
        data() {
            return {
                date: new Date(created_at),
                description,
                owner: owner.login,
                name,
            }
        },
        methods: {
            click(i) {
                console.log('clicked', i)
            },
        },
    }
}

const HelloWorldString = `

const HelloWorld = {
    components: {},
    name: 'HelloWorld',
    async mounted() {
        console.log('Mounted from HelloWorld')
        await sleep(1000)
        console.log('Mounted from HelloWorld after sleep')
        try {
            console.log(Clock)
        }
        catch(e) {
            console.log(e.toString())
        }
        try {
            console.log(isLezerNode)
        }
        catch(e) {
            console.log(e.toString())
        }

        try {
            this.board = new JSXGraph()
            console.log(this.board)
        }
        catch(e) {
            console.log(e.toString())
        }
        console.log('color')
        console.log(document.body.style.background)
        eval('X"')
    },
    props: [''],
    template: \`<div class="HelloWorld">
        <div>hello</div>
        <div>{{foo}}</div>
    </div>\`,
    data() {
        return {
            foo:'HelloWorld'
        }
    },
}
`

const IframeComponent = {
    props: ['value'],
    template: `<iframe :srcDoc="value" ref="iframe" class="iframe"></iframe>`,
    //template: `<iframe ref="iframe" class="iframe"></iframe>`,
    watch: {
        //value(val) {
            //toIframe(this.$el, val)
        //}
    },
    methods: {
        keydown(e) {
            console.log(typeof app)
            console.log(typeof app100)
            console.log('hiiiiiiiiiiiiiiiiiii from keydon')
        },

        click() {
            console.log('clickkkk')
            //console.log('clicked the iframe leavinggg')
            //this.$parent.displayManager.exit('iframe')

        },
        unload() {
            console.log('uuuuuuuuunloaaaaaaaaaaaaaded')
        },
        error(e) {
            console.log('eeeeeeeerrrrrrrrrrror')
        },

        load() {
            console.log('looooooaaaaaaaaaaaaaded iframe')
            if (app.vtc.running) {
              app.vtc.override = createIframeCallbacks(this.iframe)
            }
        },
    },
    async mounted() {
        const iframe = this.$el.contentWindow
        this.iframe = iframe
        //iframe.addEventListener('click', this.click.bind(this))
        iframe.addEventListener('load', this.load.bind(this))
        //iframe.addEventListener('unload', this.unload.bind(this))
        //iframe.addEventListener('error', this.error.bind(this))
        //iframe.addEventListener('keydown', this.keydown.bind(this))
        await sleep(50)
        iframe.focus()
    },
    beforeDestroy() {
        console.log('destroyer of worlds')
        //this.$refs.iframe.$el.contentWindow.innerHTML = ''
    },
}


