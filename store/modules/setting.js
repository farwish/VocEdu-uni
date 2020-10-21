const state = () => ({
    member_token_key: 'vocmob_member_token',
    member_info_key: 'vocmob_member_info'
})

const getters = {
    specialItems: (state, getters, rootState) => {
        return {'a':'b'}
    }
}

const actions = {
    checkout ({ commit, state }, products) {
        commit('setXxItems', null)
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
