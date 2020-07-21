import { get, post } from './base.js'

/**
 * 查询住院患者信息
 * @param {Object} params
 */
export function getInpatientInfo(params) {
	return get('/app/inpatient/info', params)
}

export function getCostList(params){
	return post('/app/inpatient/bill', params)
}

export function getInpatientRechargeList(params){
	return get('/app/inpatient/rechargeList', params)
}
