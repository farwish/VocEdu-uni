const state = () => ({
    tabbarCurrent: 0, // 初始值设为题卡Tab的index值
    currentQuestionNote: '',
    answerSheetQuestions: []
})

const getters = {
}

const actions = {
}

const mutations = {
    setTabbarCurrent (state, current) {
        state.tabbarCurrent = current
    },
    setCurrentQuestionNote (state, note) {
        state.currentQuestionNote = note
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
