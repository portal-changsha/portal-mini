/**
 * 推送
 */
import { setItem } from '@/utils/localStore.js'
import { postNotifyReceipt } from '@/services/notify.js'
import { getLabDetail, getExamDetail } from '@/services/report.js'
import { getClinicPaid } from '@/services/clinic.js'
import { request } from '@/services/base.js'
export default {
	created(){
		//	判断路径是否带了需要的参数
		const query = this.$Route.query
		this.queryParams = {}
		//	判断是否是检查检验推送（其它推送待定）
		if(query.labId || query.examId || query.visitId){
			this.queryParams = {
				"orgId": query.orgId,
				"hospitalName": query.hospitalName,
				"hospitalId": query.hospitalId,
				"areaName": query.areaName,
				"areaId": query.areaId,
				"holderName": query.holderName,
				"cardType": query.cardType,
				"cardNo": query.cardNo,
				"startDate": query.endDate,
				"endDate": query.endDate
			}
			if(query.labId){
				this.queryParams.labId = query.labId
				this.queryParams.labTime = query.labTime
				this.queryParams.labItem = query.labTime
			} else if(query.examId){
				this.queryParams.examId = query.examId
				this.queryParams.examTime = query.examTime
				this.queryParams.examItem = query.examItem
			} else if(query.regId) {
				this.queryParams.regId = query.regId
				this.queryParams.pushUrl = query.pushUrl
			} else {
				this.queryParams.visitId = query.visitId
			}
			//设置医院消息头和localStorage
			const hospital = {
				"orgId": query.orgId,
				"id": query.hospitalId,
				"name": query.hospitalName,
			};
			//设置医院消息头和localStorage
			const area = {
				"areaId": query.areaId,
				"areaName": query.areaName,
			}
			//  缓存查询用户的健康卡卡号
			const voucher = {
				orgId: query.orgId,
				cardType: query.cardType,
				cardNo: query.cardNo,
				holderName: query.holderName || '',
				mobileNo: query.mobileNo || ''
			}
			setItem('selectedHospital', hospital)
			setItem('selectedArea', area)
			setItem('selectedVoucher', voucher)
			this.sendReceipt(1, [query.notifyId])
		} else {
			//	获取从上级带过去的参数
			const reportDetail = this.$store.getters.param.reportDetail
			console.log(reportDetail)
			reportDetail && (this.queryParams = reportDetail.queryParams)
			if(!reportDetail){
				this.$Router.back(1)
			}
		}
		console.log(this.queryParams)
	},
	data(){
		return {
			queryParams: {}
		}
	},
	methods: {
		sendReceipt(receiptType, notifyIds) {
			let params = {
				notifyIds: notifyIds,
				receiptType: receiptType
			}
			postNotifyReceipt(params)
		},
		async initData(url, data, method){
			return new Promise((resolve, reject) => {
				request(url, data, method).then(res => {
					if(res.resultCode === this.$consts.RESULT_SUCCESS){
						resolve(res)
					} else {
						reject(res)
					}
				}).catch((error) => {
					reject(error)
				})
			})
		}
	}
}