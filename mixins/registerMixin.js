/**
 * 挂号部分
 * 
 */
import { getItem, setItem } from '@/utils/localStore.js'
import { unLock, refund } from '@/services/register.js'
import { showToast, showModal } from '@/utils/uniApi.js'
const action = {
	cancel: {
		msg: '确认取消预约？',
		handler() {
			//取消预约
			const params = {
				orgId: this.hosInfo.orgId,
				hospitalId: this.hosInfo.id,
				cardType: this.voucher.cardType,
				cardNo: this.voucher.cardNo,
				orderNo: this.selectedReg.orderNo,
				regId: this.selectedReg.regId
			};
			unLock(params).then((res) => {
				if (res.resultCode === this.$consts.RESULT_SUCCESS) {
					// 修改当前状态为已取消
					console.log(this.registerList)
					console.log(this.selectedIndex)
					this.registerList[this.selectedIndex].regStatus = this.$consts.REGISTERED_BUSI_STATUS.CANCELED;
					showToast('取消成功')
				}
				
			})
		}
	},
	fade: {
		msg: '确认退号？',
		handler() {
			//退号
			const params = {
				orgId: this.hosInfo.orgId,
				hospitalId: this.hosInfo.id,
				orderId: this.selectedReg.orderId
			};
			refund(params).then((res) => {
				if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
					// 退号成功，退费失败。
					if (res.errorCode === '11079005') {
						// 修改当前状态为已退号(未退费)
						this.registerList[this.selectedIndex].regStatus = this.$consts.REGISTERED_BUSI_STATUS.REFUNDED;
						this.registerList[this.selectedIndex].busiStatus = this.$consts.REGISTERED_PAY_STATUS.RETURNED_FEE_WITHOUT_NUM;
					}
					return;
				}
				// 修改当前状态为已退号
				this.registerList[this.selectedIndex].regStatus = this.$consts.REGISTERED_BUSI_STATUS.REFUNDED;
				this.registerList[this.selectedIndex].busiStatus = this.$consts.REGISTERED_PAY_STATUS.RETURNED_FEE_NUM;
				showToast('退号成功，退款到账时间以银行到账时间为准。');
			})
		}
	}
}
export default {
	data(){
		return {
			registerList: [],
			selectedIndex: 0,
			voucher: {},
			hosInfo: {},
			areaInfo: {}
		}
	},
	methods: {
		toActive (item, index, type) {
		  this.selectedIndex = index
		  this.selectedReg = item
		  const msgs = action[type].msg
		  showModal('提示', msgs).then(res => {
			  if(res.confirm){
				  action[type].handler.call(this)
			  }
		  })
		},
	}
}