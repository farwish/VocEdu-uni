const state = () => ({
    items: [],
    checkoutStatus: null
})

const getters = {
    specialItems: (state, getters, rootState) => {
        return {}
    }
}

const actions = {
    checkout ({ commit, state }, products) {
    c   ommit('setXxItems', null)
    }
}

const mutations = {
    setXxItems (state, items) {
        state.items = items
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
