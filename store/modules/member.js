const state = () => ({
    hasLogin: false,
    memberToken: null
})

const getters = {
}

const actions = {
}

const mutations = {
    setHasLogin (state, hasLogin) {
        state.hasLogin = hasLogin
    },
    setMemberToken (state, memberToken) {
        state.memberToken = memberToken
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
