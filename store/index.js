import Vue from 'vue'
import Vuex from 'vuex'
import setting from './modules/setting'
import member from './modules/member'
import subject from './modules/subject'

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: true,
    modules: {
      setting,
      member,
      subject
    }
})

export default store
