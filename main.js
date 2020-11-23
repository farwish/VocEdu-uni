import Vue from 'vue'
import App from './App'
import store from './store/index'
import { apiList, apiRequest } from './http/api'
// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);

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
