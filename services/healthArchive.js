import { post } from './base.js'
import { getItem } from '@/utils/localStore.js'
import consts from '@/config/consts.js'
function getParams(data){
	const hosInfo = getItem('selectedHospital')
	const voucher = getItem('voucherSelect')
	let params = { ...data }
	params.orgId = params.orgId || consts.ORG_ID
	params.cardNo = params.cardNo || voucher.cardNo
	params.cardType = params.cardType || voucher.cardType
	params.verifyData = params.verifyData || voucher.verifyData || consts.ORG_ID
	return params
	
}
/**
 * 健康档案首页信息
 * @param {Object} params
 */
export function getArchiveHome(params) {
	return post('/app/healthArchive/home', params)
}

/**
 * 根据身份证卡号从区域平台EHR模块查询患者基本信息
 * @param {Object} params
 */
export function getPatientInfo(params){
	return post('/app/healthArchive/patientInfo', params)
}
/**
 * 查询健康档案患者概要信息
 * @param {Object} params
 */
export function getPatientSummaryInfo(params){
	return post('/app/healthArchive/patientSummaryList', params)
}
/**
 * 查询人脸认证结果
 * @param {*} params 
 */
export function verifyFaceIdentity(params){
	return post('/app/cust/gateway/verifyFaceIdentity', params)
}

// 注册人脸订单ID接口
export function getRegFaceAuthOrder(params) {
	return post('/app/cust/gateway/regFaceAuthOrder', params)
}

export function getHealthCostList(params) {
	return post('/app/healthArchive/costList', params)
}
export function getHealthClinicDetail(params) {
	return post('/app/healthArchive/clinicDetails', params)
}

export function getHealthClinicList(params) {
	return post('/app/healthArchive/clinicList', params)
}
export function getHealthLabDetail(params) {
	const data = getParams(params)
	return post('/app/healthArchive/labDetail', data)
}
export function getHealthTraditionalRecipe(params) {
	const data = getParams(params)
	return post('/app/healthArchive/traditionalRecipe', data)
}
export function getHealthWesternRecipe(params) {
	const data = getParams(params)
	return post('/app/healthArchive/westernRecipe', data)
}
export function getHealthExamDetail(params) {
	const data = getParams(params)
	return post('/app/healthArchive/examDetail', data)
}
export function getHealthInHosInfo(params) {
	const data = getParams(params)
	return post('/app/healthArchive/inHosInfo', data)
}
export function getHealthInpatientList(params) {
	const data = getParams(params)
	return post('/app/healthArchive/inHosList', data)
}
export function getHealthInHosRecord(params) {
	const data = getParams(params)
	return post('/app/healthArchive/inHosRecord', data)
}
export function getHealthOutHosCost(params) {
	const data = getParams(params)
	return post('/app/healthArchive/outHosCost', data)
}
export function getHealthOutHosRecord(params) {
	const data = getParams(params)
	return post('/app/healthArchive/outHosRecord', data)
}
export function getHealthVisitDetail(params) {
	const data = getParams(params)
	return post('/app/healthArchive/specialFollowUpRecordDetails', data)
}
export function getHealthVisitList(params) {
	const data = getParams(params)
	return post('/app/healthArchive/specialFollowUpRecordList', data)
}
export function getPhysicalExaminationDetail(params) {
	const data = getParams(params)
	return post('/app/healthArchive/healthExamRecordDetails', data)
}
export function getPhysicalExaminationList(params) {
	const data = getParams(params)
	return post('/app/healthArchive/healthExamList', data)
}
export function getVaccinationList(params) {
	const data = getParams(params)
	return post('/app/healthArchive/vaccinationList', data);
}