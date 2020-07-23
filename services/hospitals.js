
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
export function loadHosByNear(params){
	return post('/app/hospital/nearby', params)
}
/**
 * 3.2.4根据机构ID获取医院列表
 * @param {*} params 
 */
export function loadHosByOrg(params){
	return post('/app/hospital/queryListByOrgId', params)
}
/**
 * 3.2.5模糊查询医院列表
 * @param {*} params 
 */
export function loadHosByName(params){
	return post('/app/hospital/fuzzyHos', params)
}