const state = () => ({
    tabbarCurrent: -1
})

const getters = {
}

const actions = {
}

const mutations = {
    setTabbarCurrent (state, current) {
        state.tabbarCurrent = current
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
