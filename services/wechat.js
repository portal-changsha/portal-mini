import { post } from './base.js'

/**
 * 微信签名
 * @param {Object} params
 */
export function wxSign(params){
	return post('/app/wechat/jsapisign', params)
}

/**
 * 调用后台ocr接口
 * @param {Object} params
 */
export function getOcrInfo(params){
	return post('/app/cust/gateway/ocr', params)
}
