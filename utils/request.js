import Vue from 'vue'
import appConfig from '@/config/index.js'
import { getItem, removeItem, setItem } from '@/utils/localStore.js'
import { getWxRedirectUrl } from '@/utils/index.js'
import { showToast, showModal } from '@/utils/uniApi.js'
import { getTokenId } from '@/services/userInfo.js'
import loading from '@/components/loading/loading.js'
Vue.use(loading)
const load = Vue.$loading

// const { mockXHR } = process.env.NODE_ENV === 'development' ? require('@/utils/mockjs.js') : { mockXHR: null }
let fly = null
let newFly = null
const SUCCESS_CODE = {
	'1': true
}
const NEED_LOGIN_STATUS = {
  '10000018': true,
  '10000017': true,
  '10000024': true
}

// #ifdef H5
	// fly = require("flyio")
	const Fly=require("flyio/dist/npm/fly")
	fly = new Fly
	newFly = new Fly
// #endif
// #ifdef MP-WEIXIN
	const Fly=require("flyio/dist/npm/wx")
	fly=new Fly
	newFly = new Fly
// #endif

// #ifdef MP-ALIPAY
	const Fly=require("flyio/dist/npm/ap")
	fly=new Fly
	newFly = new Fly
// #endif

//浏览器环境下
// fly.engine=MockXMLHttpRequest

fly.config.baseURL = appConfig.VUE_APP_REQUEST_URL


fly.config.timeout = 15000

fly.config.headers = {
  'Content-Type': 'application/json;charset=UTF-8',
  'deviceId': '1',
  'version': 'WeChat',
  'channel': '3'
}

newFly.config.baseURL = appConfig.VUE_APP_REQUEST_URL
newFly.config.timeout = 15000
newFly.config.headers = {
'Content-Type': 'application/json;charset=UTF-8',
'deviceId': '1',
'version': 'WeChat',
'channel': '3',
'reqTime': `${new Date().getTime()}`,
'timestamp': String(new Date().getTime())
}

//  添加请求拦截器
fly.interceptors.request.use(config => {
	//	加载动画
	load.show()
	const tokenId = getItem('tokenId') || ''
	//	请求loading
	console.log(`发起请求：path:${config.url}，baseURL:${config.baseURL}`)
	if (!tokenId) {
		if(!getItem('code')){
			const redirUrl = location.href
			const wxUrl = getWxRedirectUrl(appConfig.VUE_APP_APPID, redirUrl)
			console.log(wxUrl)
			// window.open(wxUrl)
			location.href = wxUrl
			load.hide()
			return
		}
	  console.log("没有登录，先请求token...");
	  
	  //锁定当天实例，后续请求会在拦截器外排队
	  fly.lock();
	  console.log(getItem('code'))
	  return newFly.post(appConfig.VUE_APP_REQUEST_URL + '/app/user/login', {code: getItem('code'), loginType: '3'}).then(d => {
		  console.log(d)
		  config.headers["tokenId"] =  d.data.data.tokenId;
		  config.headers['reqTime'] = `${new Date().getTime()}`
		  config.headers['timestamp'] = String(new Date().getTime())
		  setItem('tokenId', d.data.data.tokenId)
		  console.log(d.data.data.tokenId)
		  console.log(`继续完成请求：path:${config.url}，baseURL:${config.baseURL}`)
		  removeItem('code')
		  return config; //只有最终返回request对象时，原来的请求才会继续
	  }).finally(()=>{
		  console.log('finally....')
		  // load.hide()
		// fly.clear(); //clear the request queue
	      fly.unlock();//解锁后，会继续发起请求队列中的任务
	  }) 
	} else {
	  config.headers['tokenId'] = tokenId
	}
	//	添加自定义header
	config.headers['reqTime'] = `${new Date().getTime()}`
	config.headers['timestamp'] = String(new Date().getTime())
  return config
})
//  添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  response => {
    //	结束loading
	console.log(response)
	load.hide()
	
	const code = response.status
	if (code < 200 || code > 300) {
	  //	错误提示
	  showModal('提示', '服务异常,请稍后再试', false)
	  return Promise.reject('error')
	} else {
	  const data = response.data
	  //token失效、没有token、后台重启的情况
	  /*直接静默获取微信code用于获取新的token*/
	  if(NEED_LOGIN_STATUS[data.errorCode]) {
	  		//TODO 需要获取code登录
	  		console.log('需要重新登录')
	  		//	清空本地tokenId
	  		removeItem('tokenId')
	  		//	调用授权登录
	  		// #ifdef H5
	  			const redirUrl = location.href
	  			const wxUrl = getWxRedirectUrl(appConfig.VUE_APP_APPID, redirUrl)
				console.log(wxUrl)
				// window.open(wxUrl)
				location.href = wxUrl
	  			return
	  		// #endif
	  }
	  if(!SUCCESS_CODE[data.resultCode]){
		  //	全局错误提示
		  showToast(data.resultMsg)
		  return Promise.reject(data)
	  }
	  //健康档案接口通用过滤器 (暂时注释)
	 //  if (localStorage.selectedVoucher && (data.errorCode === consts.HEALTH_ARCHIVE_VERIFY_FAILED || data.errorCode === consts.HEALTH_ARCHIVE_SESSION_FAILED)) {
		// if (!localStorage.needFaceVerify) {
		// 	localStorage.setItem('needFaceVerify', 'needFaceVerify')
		// 	localStorage.setItem('pushUrl', 'HealthArchive')
		// 	router.replace({name: 'index'})
		// 	return
		// }
	 //  }  
	  
	  return data
	}
  },
  (error) => {
    //	结束loading
	if (error.toString().indexOf('Error: timeout') !== -1) {
	  // Notify({ type: 'danger', message: '网络请求超时' })
	  uni.$emit('net-error')
	}
	if (error.toString().indexOf('Error: Network Error') !== -1) {
	  // Notify({ type: 'danger', message: '网络请求错误' })
	  uni.$emit('net-error')
	}
	load.hide()
	return Promise.reject(error)
  }
)
export default fly