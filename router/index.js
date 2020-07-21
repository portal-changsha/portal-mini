import modules from './modules'
import Vue from 'vue'
import { devIsIos } from '@/utils/index.js'
import config from '@/config/index.js'

import Router from 'uni-simple-router'
const NEED_ASSIGN = ['hospitalSelect', 'checkInfomation', 'pay', 'wechatPay']
Vue.use(Router)
//初始化
const router = new Router({
    routes: [...modules]//路由表
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	if(NEED_ASSIGN.includes(to.name) && devIsIos() && (config.FRONT_URL + to.path) !== location.pathname){
		location.assign(config.VUE_APP_REDIRECT_URL + to.path)
	} else {
		next()
	}
})
console.log(router)
// 全局路由后置守卫
router.afterEach((to, from) => {
})
export default router