const state = () => ({
    currentSubjectName: ''
})

const getters = {
}

const actions = {
}

const mutations = {
    setCurrentSubjectName (state, currentSubjectName) {
        state.currentSubjectName = currentSubjectName
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
