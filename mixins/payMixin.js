/**
 * 支付部分
 */
import { setItem, getItem } from '@/utils/localStore.js'
import { loadOutOrder, getHosAppId } from '@/services/register.js'
export default {
	data(){
		return {
			voucher: {},
			hosInfo: {},
			areaInfo: {}
		}
	},
	created(){
		//	初始化
		this.voucher = getItem('selectedVoucher')
		this.hosInfo = getItem('selectedHospital')
		this.areaInfo = getItem('selectedArea')
		console.log(this.voucher)
		console.log(this.hosInfo)
		console.log(this.areaInfo)
		console.log('222')
	},
	methods: {
		createOrderId(item, busiType) {
			return new Promise((resolve) => {
				const params = {
					orgId: this.hosInfo.orgId,
					hospitalId: this.hosInfo.id,
					areaId: this.areaInfo.areaId,
					payFee: item.payFee,
					busiType: busiType,
					busiIds:  item.busiIds || [item.orderNo],
					channelId: item.payFee <= 0 ? '' : item.channelId,
					invokeType: item.payFee <= 0 ? '' : item.invokeType,
					cardType: this.voucher.cardType,
					cardNo: this.voucher.cardNo,
					orderId: item.orderId
				}
				item.payCode && (params.payCode = item.payCode)
				resolve(params)
				// 生成外部订单号
				// this.createOutOrder(params).then((res) => {
				// 	resolve(res)
				// }).catch((err) => {
				// 	reject(err)
				// })
			})
		},
		bookingPay(item, busiType){
			//将数据存入本地,给预约成功界面使用
			this.$store.dispatch('paramStore/updateParam', {
				namespace: 'bookingResult',
				regInfo: {
					cardType: this.voucher.cardType,
					cardNo: this.voucher.cardNo,
					payFee: item.payFee,
					busiType: busiType,
					busiIds: item.busiIds || [item.orderNo],
					deptName: item.deptName,
					takeType: item.takeType,
					orderId: item.orderId
				}
			});
			this.$Router.push({name: 'bookingResult'});
		},
		getPayConfig(item, busiType){
			return new Promise((resolve, reject) => {
				//将数据存入本地
				this.$store.dispatch('paramStore/updateParam', {
					namespace: 'pay',
					// 支付模块所需要的参数
					payInfo: {
						cardType: this.voucher.cardType,
						cardNo: this.voucher.cardNo,
						payFee: item.payFee,
						busiType: busiType,
						busiIds: item.busiIds || [item.orderNo]
					}
				})
				const params = {
					orgId: this.hosInfo.orgId,
					hospitalId: this.hosInfo.id,
					areaId: this.areaInfo.areaId,
					channelId: this.$consts.PAY_TYPE.WX_PAY,
					invokeType: this.$consts.INVOKE_TYPE.WAP_INVOKE,
				}
				//获取医院支付信息
				getHosAppId(params).then(res => {
					if(res.resultCode === this.$consts.RESULT_SUCCESS){
						setItem('wxPayAppId', res.data.appId)
						resolve(true)
						return
						// this.$Router.push({name: 'pay'})
					}
					reject(false)
				})
			})
		},
		createOutOrder(params){
			return new Promise((resolve, reject) => {
				loadOutOrder(params).then((res) => {
					if (res.resultCode !== this.$consts.RESULT_SUCCESS){
						reject(res)
						return
					}
					// 本地缓存同步订单及界面展示需要的数据
					this.$store.dispatch('paramStore/updateParam', {
						namespace: 'payResult',
						payResultInfo: {
							orgId: this.hosInfo.orgId,
							hospitalId: this.hosInfo.id,
							orderId: res.data.orderId,
							payFee: res.data.payFee,
							busiType: params.busiType,
							extraMap: res.extraMap || {}
						},
					})
					resolve(res)
				})
			})
			
		}
	}
}