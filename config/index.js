/**
 * @description 系统全局配置
 */
export default {
	VUE_APP_MOCK: false,
	// #ifdef GWI-PORTAL
	// 回调地址
	VUE_APP_REDIRECT_URL: 'https://csmh.hngwmt.com/liwenhong',
	// 图片地址
	VUE_APP_IMG_URL: 'https://csmh.hngwmt.com/portal/archive/resource/img/',
	// 请求地址
	VUE_APP_REQUEST_URL: 'https://csmh.hngwmt.com/portal',
	VUE_APP_APPID: 'wx64616ad80452e505',
	FRONT_URL: '/liwenhong'
	// #endif
	
	// #ifdef GWI-BASE
	// 回调地址
	VUE_APP_REDIRECT_URL: 'https://csmh.hngwmt.com/base',
	// 图片地址
	VUE_APP_IMG_URL: 'https://csmh.hngwmt.com/base/archive/resource/img/',
	// 请求地址
	VUE_APP_REQUEST_URL: 'https://csmh.hngwmt.com/base',
	// VUE_APP_REQUEST_URL: '',
	VUE_APP_APPID: 'wx64616ad80452e505',
	FRONT_URL: '/base'
	// #endif
	
	// #ifdef GWI-JKCS
	// 回调地址
	VUE_APP_REDIRECT_URL: 'http://wsjkw.changsha.gov.cn/jkcs',
	// 图片地址
	VUE_APP_IMG_URL: 'http://wsjkw.changsha.gov.cn/jkcs/archive/resource/img/',
	// todo 请求地址
	VUE_APP_REQUEST_URL: 'https://csmh.hngwmt.com/jkcs',
	VUE_APP_APPID: 'wx563314d21c5f5cbd',
	FRONT_URL: '/jkcs'
	// #endif
}
