<template>
	<view>
		
	</view>
</template>

<script>
	import common from '@/mixins/common.js'
	import { getUserInfo } from '@/services/userInfo.js'
	export default {
		mixins:[common],
		data() {
			return {
				userInfo: {}
			}
		},
		onLoad(){
			this.initData()
		},
		methods: {
			initData(){
				//	获取个人信息
				getUserInfo().then(res => {
					if(res.resultCode !== this.$consts.RESULT_SUCCESS) return
					this.userInfo = res.data
					this.getVoucherListInfo().then(voucher => {
						//组装健康体检链接
						//遍历卡列表
						let newVoucherList = []
						for (var i = 0; i < voucher.length; i++) {
							var oldVoucher = voucher[i]
							var newVoucher = {
								name: oldVoucher.holderName,
								idCard: oldVoucher.certNo,
								phone: oldVoucher.mobileNo
							}
							newVoucherList.push(newVoucher)
						}
						this.aesEncrption(this.userInfo, newVoucherList)
					})
				})
			},
			aesEncrption(userInfo, voucherList) {
				let clientAppId = JSON.parse(userInfo.clientAppId)
				const checkJson = {
					openId: clientAppId[3],  //3为公众号、7为小程序
					list: voucherList
				}
				const CryptoJS = require("crypto-js");
				// Encrypt
				const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(checkJson), 'E7uqaqJ9YJRjH3ZpwfRbDylioQ2SWJeL').toString();

				const url = 'http://wsjkw.changsha.gov.cn/jkcs/jktj/cssbyy/HerPeisNet/toAuthInfo?' + ciphertext
				// #ifdef H5
				location.replace(url)
				// #endif
				
			}
		}
	}
</script>

<style>

</style>
