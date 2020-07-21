// 综合服务
import { get, post } from './base.js'

/**
 * 获取评价列表
 * @param {Object} params
 */
export function queryEvaluation(params){
	return get('/app/satisfaction/query', params)
}
/**
 * 提交评价
 * @param {Object} params
 */
export function submitEvaluation(params){
	return post('/app/satisfaction/submit',params)
}
