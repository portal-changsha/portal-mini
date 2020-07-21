/**
 * 公共函数
 * 项目里调用频率比较高的函数
 * 
 */
import { getVoucherList } from '@/services/voucher.js'
export default {
	data(){
		return {
			voucherList: []
		}
	},
	created(){
		
	},
	methods: {
		getVoucherListInfo(){
			return new Promise((resolve, reject) => {
				getVoucherList().then(res => {
					if(res.resultCode !== '1'){
						reject(res)
						return
					}
					this.voucherList = res.data
					resolve(res.data)
				})
			})
			
		}
	}
}