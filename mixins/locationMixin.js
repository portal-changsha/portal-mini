/**
 * 定位mixins
 * 
 */
import { wechatConfig, getLocation } from '@/utils/wxJsSdk.js'
import { showToast } from '@/utils/uniApi.js'

export default {
	data(){
		return {
			latitude: '',
			longitude: ''
		}
	},
	created(){
		
	},
	methods: {
		getCurrentLocation(){
			return new Promise((resolve) => {
				//  1.先调用签名接口
				const wxSignParams = {
				    orgId: this.$consts.ORG_ID,
				    url: location.href.split("#")[0]
				}
				wechatConfig(wxSignParams, () => {
					getLocation().then(res => {
						console.log(res)
						this.latitude = res.latitude
						this.longitude = res.longitude
						resolve(res)
					}).catch((error) => {
						console.log(error)
						this.latitude = ''
						this.longitude = ''
						showToast('获取定位失败')
						resolve(error)
					})
				})
			})	
		}
	}
}