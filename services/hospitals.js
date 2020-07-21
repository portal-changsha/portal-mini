
import { get, post } from './base.js'

/**
 * 获取医院列表
 */
export function getAllHospitals(params) {
	return get('/app/hospital/list', params);
}

/**
 * 获取区域列表
 * @param {Object} params
 */
export function loadArea(params){
	return get('/app/hospital/areas', params);
}
/**
 * 模糊查询医生/科室/医院信息
 * @param {Object} params
 */
export function fuzzyHosDeptDoctor(params) {
	return post('/app/hospital/search', params);
}
/**
 * 模糊查询医院下所有医生
 * @param {Object} params
 */
export function searchDoctorInHos(params){
	return get('/app/hospital/fuzzyDoct', params);
}