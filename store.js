const store = new Vuex.Store({
    state: {
        count: 0,
        clickCount: 0,
        clicks: [],
    },
    mutations: {
        increment(state, key, value = 1) {
            state[key] += value
        },

        increment(state, value = 1) {
            state.count += value
        },

        click(state, key) {
            if (key) state.clicks.push(key)
        },

        reset(state) {
            state.clicks = []
        },
    },
    getters: {
        clicks(state) {
            return tally(state.clicks)
        },
    },
})

