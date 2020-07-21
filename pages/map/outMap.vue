<template>
	<view>
		
	</view>
</template>

<script>
	import wxJsSdk from '@/utils/wxJsSdk.js'
	import config from '@/config/index.js'
	export default {
		data() {
			return {
				latitude:'',
				longitude: ''
			};
		},
		onLoad(){
			const query = this.$Route.query
			const { latitude, longitude } = query
			let params = {
				orgId: this.$consts.ORG_ID,
				url: config.VUE_APP_REDIRECT_URL
			}
			wxJsSdk.wechatConfig(params, () => {
				wxJsSdk.openLocation(latitude, longitude)
			})
		}
	}
</script>

<style lang="scss" scoped>

</style>
