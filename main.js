import Vue from 'vue'
import App from './App'
import store from './store/index'
import { apiList, apiRequest } from './http/api'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$apiList = apiList
Vue.prototype.$apiRequest = apiRequest

App.mpType = 'app'

const app = new Vue({
    store,
	...App
})
app.$mount()
