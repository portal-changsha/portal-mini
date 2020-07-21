import Vue from 'vue'
import App from './App'
import consts from '@/config/consts.js'
import store from '@/store/index.js'
import bus from '@/utils/eventListener.js'
import * as filters from '@/filters/index.js'
import scroll from '@/components/scroll.vue'
import noRecord from '@/components/no-record/no-record.vue'
import directives from './directives/index.js'
import loginMixin from '@/mixins/loginMixin.js'

import VConsole from 'vconsole';
 
const isDebug = true;
// 本地开发调试注入vConsole
if (isDebug) {
    new VConsole();
}

import router from './router'
import { RouterMount } from 'uni-simple-router'
// 引入loading
// import loading from '@/components/loading/loading.js'
// Vue.use(loading)

Vue.config.productionTip = false

App.mpType = 'app'
Vue.component('scroll', scroll)
Vue.component('noRecord', noRecord)
Vue.prototype.$consts = consts
Vue.prototype.bus = bus

//注册全局指令
for (let key in directives) {
    if (Object.prototype.hasOwnProperty.call(directives, key)) {
        Vue.directive(key, directives[key])
    }
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
	mixins:[loginMixin],
	store,
    ...App
})
// #ifdef H5
	RouterMount(app,'#app')
// #endif

// #ifndef H5
	app.$mount()
// #endif
export default app