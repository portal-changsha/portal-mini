import { get } from './base.js'

/**
 * 获取排队信息
 * @param {Object} params
 */
export function getWaitInfo(params) {
	return get('/app/clinic/queueInfo', params)
}
/**
 * 获取我的缴费记录
 * @param {Object} params
 */
export function getClinicPaid(params){
	return get('/app/clinic/paid', params)
}
/**
 * 查询门诊缴费列表
 * @param {Object} params
 */
export function getClinicList(params){
	return get('/app/clinic/unpay', params)
}

/**
 * 查询电子处方信息  默认查询七天
 * @param {Object} params
 */
export function getReceipe(params) {
	return get('/app/clinic/recipes', params)
}