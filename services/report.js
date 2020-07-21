import { get, post } from './base.js'

 /**
  * 查询检验报告列表
  * @param {Object} params
  */
export function getLabList(params) {
	return get('/app/report/lab/list', params)
}

/**
 * 查询检查报告列表
 * @param {Object} params
 */
export function getExamList(params) {
	return get('/app/report/exam/list', params)
}

export function getLabDetail(params){
	return get('/app/report/lab/common', params)
}

export function getExamDetail(params){
	return get('/app/report/exam/detail', params)
}
