import { get, post } from './base.js'

/**
 * 获取医院的appid
 * @param {Object} params
 */
export function getHosAppId(params){
	return get('/app/pay/config', params)
}

/**
 * 获取支付方式
 * @param {Object} params
 */
export function getPayChannels(params) {
	return get('/app/pay/channel', params)
}

/**
 * 支付完成同步订单
 * @param {Object} params
 */
export function syncOrder(params) {
	return post('/app/pay/sync', params)
}