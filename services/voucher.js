
import { get, post } from './base.js'

/**
 * 获取电子健康卡列表
 */
export function getVoucherList() {
	return get('/app/voucher/list')
}
/**
 * 获取动态二维码
 */
export function getVoucherQrCode(params){
	return post('/app/cust/gateway/dynamicCode', params) 
}

/**
 * 解绑电子健康卡
 */
export function deleteVoucherCard(params){
	return post('/app/voucher/del', params)
}
/**
 * 获取健康钱包参数
 * @param {Object} params
 */
export function getCCBHealthyWallet(params){
	return post('/app/cust/gateway/healthyWallet', params)
}

export function getCardPackOrderId(params){
	return post('/app/cust/gateway/cardPackOrderId', params)
}
/**
 * 获取健康卡id
 * @param {Object} params
 */
export function bindCardWithHealthCode(params) {
	return post('/app/cust/gateway/associateCard', params)
}
/**
 * 绑卡验证
 * @param {Object} params
 */
export function verifyBizContent(params) {
	return post('/app/voucher/verify', params);
}
/**
 * 发送验证码
 * @param {Object} params
 */
export function sendVerifyCodeMsg(params) {
	return post('/app/voucher/send', params);
}
/**
 * 添加电子健康卡
 * @param {Object} params
 */
export function addVoucherCard(params) {
	return post('/app/voucher/add', params)
}

/**
 * 调用后台ocr接口
 * @param {Object} params
 */
export function getOcrInfo(params) {
	return post('/app/cust/gateway/ocr', params)
}