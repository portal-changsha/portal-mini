<script>
	import payMixin from '@/mixins/payMixin.js'
	import { getQueryVariable } from '@/utils/index.js'
	import { payWithWxJSBridge, payByWechat, wechatConfig } from '@/utils/wxJsSdk.js'
	import { removeItem } from '@/utils/localStore.js'
	import { showToast } from '@/utils/uniApi.js'
	import { getItem } from '@/utils/localStore.js'
	export default {
	    mixins: [payMixin],
	    async created() {
			const code = getItem('code')
			if(code){
				//	获取参数
				const params = this.$store.getters.param.weChatPay.loadOutOrderParams
				const item = { ...params, payCode: code }
				const outParams = await this.createOrderId(item, item.busiType)
				this.createOutOrder(outParams).then(data => {
					const payInfo = JSON.parse(data.data.payInfo) 
					this.payWithWechatBySdk(payInfo)
				})
			}else {
				//	没有code 直接返回
				showToast('没有获取道code....')
				this.$Router.back()
			}
	    },
	    render: function(h) {
		  return h()
	    },
		onUnload(){
			removeItem('pushName')
		},
		methods:{
			payWithWechat(payInfo){
				if (typeof WeixinJSBridge !== "undefined") {
					payWithWxJSBridge(payInfo).then(() => {
						//	支付成功，跳转到payResult页面
						this.$Router.replace({ name: 'payResult' })
					}).catch((err) =>{
						//	支付失败，跳转返回
						showToast(JSON.stringify(err))
						this.$Router.back()
					})
				}else{
					showToast('无法拉起微信支付，请重新拉起支付')
					this.$Router.back()
				}
			},
			payWithWechatBySdk(data){
				const wxSignParams = {
					orgId: this.$consts.ORG_ID,
					url: location.href.split("#")[0],
				};
				wechatConfig(wxSignParams, () => {
					payByWechat(data).then(res => {
						//	支付成功
						this.$Router.replace({ name: 'payResult' })
					}).catch(err => {
						//	支付失败
						showToast('支付失败')
						this.$Router.back()
					})
				})
			}
		}
	}
</script>