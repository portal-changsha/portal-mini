import { get, post } from './base.js'

/**
 * 查询挂号记录
 */
export function getRegisterLists(params) {
	return get('/app/register/list', params);
}
/**
 * 取消预约
 * @param {Object} params
 */
 export function unLock(params){
	return post('/app/register/unlock',params)
}

/**
 * 退号
 * @param {Object} params
 */
export function refund(params){
	return post('/app/register/refund',params);
}
 /**
  * 生成外部订单
  * @param {Object} params
  */
export function loadOutOrder(params) {
	return post('/app/pay/order', params)
}

/**
 * 获取医院的appid
 * @param {Object} params
 */
export function getHosAppId(params){
	return get('/app/pay/config', params)
}

/**
 * 线上取号
 * @param {Object} params
 */
export function takeNo(params){
	return post('/app/register/takeNo',params);
}
/**
 * 获取挂号历史记录
 * @param {Object} params
 */
export function getRegisterHistory(params){
	return post('/app/register/history', params);
}

/*获取症状*/
 export function loadTriageDiseaseList(params) {
	return post('/app/triage/symptoms', params);
}
/*获取推荐科室*/
export function loadTriageDeptList(params) {
	return post('/app/triage/depts', params)
}

/* 获取科室列表 */
export function getRegisterDept(params){
	return get('/app/register/dept', params);
}
/**
 * 获取医院医生列表
 * @param {Object} params
 */
export function getHospitalDocts(params){
	return get('/app/hospital/docts' , params)
}
/**
 * 获取科室信息
 * @param {Object} params
 */
export function loadDeptInfo(params) {
	return get('/app/hospital/deptInfo', params);
}
/**
 * 获取医生排班
 * @param {Object} params
 */
export function loadDoctorSchedule(params){
	return get('/app/register/doct', params);
}
/**
 * 获取医院科室的可挂号日期列表
 * @param {Object} params
 */
export function getRegisterDate(params){
	return get('app/register/date', params)
}
/**
 * 挂号时获取医生的实时排班列表
 * @param {Object} params
 */
export function loadTimeSchedules(params){
	return get('/app/register/scheduling', params)
}

/**
 * 判断医生是否已关注
 * @param {Object} params
 */
export function judgeConcernDoctors(params){
	return post('/app/user/isFavored',params)
}
/**
 * 关注/取消医生
 * @param {Object} params
 */
export function concernDoctor(params){
	return post('/app/user/favorDoct',params)
}
/**
 * 挂号选择排班后进行锁号确认操作
 * @param {Object} params
 */
export function registerLock(params){
	return post('/app/register/lock', params)
}
