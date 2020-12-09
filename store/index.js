import Vue from 'vue'
import Vuex from 'vuex'
import setting from './modules/setting'
import member from './modules/member'
import subject from './modules/subject'
import question from './modules/question'

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: true,
    modules: {
      setting,
      member,
      subject,
      question
    }
})

export default store
