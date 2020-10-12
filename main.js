import Vue from 'vue'
import App from './App'
import { apiList, apiRequest } from './http/api'

Vue.config.productionTip = false

Vue.prototype.$apiList = apiList
Vue.prototype.$apiRequest = apiRequest

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
