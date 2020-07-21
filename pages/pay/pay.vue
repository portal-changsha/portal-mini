<template>
    <div class="app" id="wrapper">
        <div>
            <p class="top-tips" v-if="payInfo.busiType === '1301'"> 请尽快完成支付</p>
            <p class="top-tips" v-if="payInfo.busiType === '1006'"> 请在<span class='f-strongest'>15分钟</span>内完成支付，超时订单自动取消...</p>
            <section class="doctor-info">
                <div class="head pay-header"></div>
                <div class="info">
                    <p class="f-large pay-tips"><span class="f-strong"><span v-if="payInfo.busiType === '1006'">预约成功，</span> 请马上支付！</span>&nbsp;
                    </p>
                    <p class="pay-type f-strongest f-largest">{{payInfo.payFee | formatFee}}</p>
                </div>
            </section>
            <section>
                <div class="panel">请选择支付方式</div>
                <ul class="list">
                    <li v-for="(payType,index) in payTypes" class="icon-row arr-item" @click="selectPayType(payType)"
                        :key="index">
                        <div class="pay-icon"
                             :class="{ weixin: payType.channelId=='4', zhifubao: payType.channelId=='5', zizhu: payType.channelId=='8',union: payType.channelId == '7', hebao: payType.channelId == '12', qianbao: payType.channelId == '13', 'zr_jh': payType.channelId == '14',}"></div>
                        <div v-if="payType.channelId == '14'" style="width: 2px"></div>
                        <div class="pay-icon" v-if="payType.channelId == '14'"
                             :class="{ 'zr_wx': payType.channelId == '14',}"></div>
                        <div class="desc">
                            <div class="gwi-size-normal pay-title">{{ payType.channelName }}</div>
                            <div class="gwi-size-small">
                                <span v-if="payType.channelId=='4'" class="f-minor f-small"></span>
                                <span v-if="payType.channelId=='14'" class="f-minor f-small"></span>
                                <span v-if="payType.channelId=='5'" class="f-minor f-small">需要安装支付宝APP客户端</span>
                                <span v-if="payType.channelId=='8'" class="f-minor f-small">自助机刷银行卡和社保卡</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>

<script>
	import { getPayChannels } from '@/services/pay.js'
	import { getItem, setItem } from '@/utils/localStore.js'
	import payMixin from '@/mixins/payMixin.js'
	import config from '@/config/index.js'
	import { showToast } from '@/utils/uniApi.js'
	import { getWxRedirectUrl } from '@/utils/index.js'
	import { payWithWxJSBridge, payByWechat, wechatConfig } from '@/utils/wxJsSdk.js'
	export default {
		mixins: [payMixin],
		data() {
			return {
				payInfo: {},
				payTypes: []
			};
		},
		onLoad(){
			console.log('333')
			this.hosInfo = getItem('selectedHospital')
			this.areaInfo = getItem('selectedArea')
			const store = this.$store.getters.param
			this.payInfo = store.pay.payInfo
			//加载支付渠道
			this.initData()
		},
		methods: {
			initData(){
				const params = {
					orgId: this.hosInfo.orgId,
					hospitalId: this.hosInfo.id,
					areaId: this.areaInfo.areaId,
					busiType: this.payInfo.busiType
				}
				getPayChannels(params).then(res => {
					if(res.resultCode !== this.$consts.RESULT_SUCCESS) return
					this.payTypes = res.data
				})
			},
			async selectPayType(payType) {
				const channelId = payType.channelId
				const item = { ...this.payInfo, channelId: channelId, invokeType: this.$consts.INVOKE_TYPE.WAP_INVOKE }
				console.log(item)
				const outParams = await this.createOrderId(item, this.payInfo.busiType)
				this.goPayModules(channelId, outParams)
			},
			async goPayModules(channelId,outParams){
				// 判断支付方式
				switch (channelId) {
					case '4':
						const payConfig = await this.getPayConfig(outParams, this.payInfo.busiType)
						if(payConfig){
							//	判断是否支持联合支付
							if(getItem('wxPayAppId') ===  this.$consts.WECHART_PAY_APPID){
								this.createOutOrder(outParams).then(outOrder => {
									this.payWithWechatBySdk(outOrder)
								})
							} else{
								//	需要获取code拉起支付
								this.$store.dispatch('paramStore/updateParam', {
									namespace: 'weChatPay',
									loadOutOrderParams: outParams,
								})
								// //设置微信回调来源
								// setItem('pushName', 'wechatPay')
								const redirectUrl = config.VUE_APP_REDIRECT_URL + '/pages/pay/wechatPay'
								console.log(redirectUrl)
								const authUrl = getWxRedirectUrl(getItem('wxPayAppId'), redirectUrl)
								location.href = authUrl
								// window.open(authUrl)
							}
						}
						break
					//	和包支付
					// case '12': 
					
					// break
					// //建融支付
					// case '14':
					// 	this.createOutOrder(outParams).then(res => {
					// 		const redirUrl = JSON.parse(res.data.payInfo)
					// 		location.href = redirUrl
					// 		// window.open(redirUrl)
					// 	})
					// 	break
					case '16':
						this.createOutOrder(outParams).then(outOrder => {
							//	微信支付
							this.payWithWechatBySdk(outOrder)
						})
						break;
					default:
						this.createOutOrder(outParams).then(res => {
							const redirUrl = JSON.parse(res.data.payInfo)
							location.href = redirUrl
							// window.open(redirUrl)
						})
						break
				}
			},
			//自助机支付
			goSelfMachinePay(res) {
				this.$store.dispatch('paramStore/updateParam', {
					namespace: 'order',
					order: res,
					totalFee: this.totalFee,
				})
				this.$Router.push({name: 'selfPay'})
			},
			payWithWechatBySdk(data){
				const payInfo = JSON.parse(data.data.payInfo) 
				const wxSignParams = {
					orgId: this.$consts.ORG_ID,
					url: location.href.split("#")[0],
				};
				wechatConfig(wxSignParams, () => {
					payByWechat(payInfo).then(res => {
						//	支付成功
						this.$Router.replace({ name: 'payResult' })
					}).catch(err => {
						//	支付失败
						showToast('支付失败')
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app{
		background: $common-background-color;
	}
	.pay-type {
        float: right;
        vertical-align: middle;
        margin-right: 0.5rem;
    }
    .pay-tips {
        margin-bottom: 0.25rem;
    }
    .pay-header {
        background: url($redirect-url + $img-file-path + "unpay-icon.png") center no-repeat;
        background-size: 88%;
    }
    .top-tips::before {
        background: url($redirect-url + $img-file-path + "yellow-warning.png") no-repeat;
        background-size: 100%;
    }
    .doctor-info .info {
        @include display-flex;
        @include justify-content(space-between);
        padding-right: 0.5rem;
    }
	.arr-item{
		@include display-flex;
		@include align-items(center);
	}
</style>
