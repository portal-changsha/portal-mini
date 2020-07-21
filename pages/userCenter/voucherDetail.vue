<template>
	<view class="app">
		<div class="scroll scroll-bottom-btn">
			<section class="bigger" v-show="qrcodeText">
				<div class="row myrow">电子健康卡二维码</div>
				<div class="no-qr-code">
					<qr-code :size="171" :cid="'voucherDetail-qrcode'" :foregroundColor="qrcodeColor" :text="qrcodeText" v-if="!!qrcodeText"></qr-code>
				</div>
				 <!-- <qrcode id="voucherDetail-qrcode" :size="171" class="qrcode" :cls="qrCls" :value="qrcodeText" :level="qrcodeLenth" :foreground="qrcodeColor"></qrcode> -->
				 <div class="logo">
					<img :src="logo" alt="">
				 </div>
			</section>
			<section class="bigger" v-show="!qrcodeText">
				<div class="row myrow">电子健康卡二维码</div>
				<div class="no-qr-code"></div>
			</section>
			<section>
				<dl class="field">
					<dt>姓名</dt>
					<dd>{{voucherDetail.holderName}}</dd>
				</dl>
				<dl class="field">
					<dt>身份证号</dt>
					<dd>{{voucherDetail.cardNo | dotted}}</dd>
				</dl>
				<dl class="field">
					<dt>手机号码</dt>
					<dd>{{voucherDetail.mobileNo | dotted}}</dd>
				</dl>
			</section>
			<div class="card-btn">
				<button @click="goCCBHealthyWallet(voucherDetail)" style="margin-bottom: .5rem; color: white">健康钱包</button>
				<button @click="goVoucherCard(voucherDetail)" style="margin-bottom: .5rem; color: white">进入卡包</button>
				<button @click="showFaceConfirm=true" style="display: none; color: white">人脸认证</button>
			</div>
			<div id="voucherDetail-btn-delete" class="delete-voucher-btn" type="button" @click="delHealthCard">解绑电子健康卡</div>
			<div>
			<img :src="qrcodeTips" alt="" style="width: 100%; margin-top: 1rem;">
			</div>
		</div>
		<!-- <sub-web-view :webUrl="webUrl" v-if="isOpenSubView"></sub-web-view> -->
	</view>
</template>

<script>
	import config from '@/config/index.js'
	import qrCode from '@/components/qr-code/qr-code.vue'
	import subWebView from '@/components/subWebView.vue'
	import { getVoucherQrCode, deleteVoucherCard, getCCBHealthyWallet, getCardPackOrderId } from '@/services/voucher.js'
	import { showToast, showModal } from '@/utils/uniApi.js'
	// import{ getIframUrl, devBack } from '@/utils/index.js'
	const IMG_BASE_URL = config.VUE_APP_IMG_URL
	export default {
		components:{
			qrCode
		},
		// beforeRouteLeave(to, from, next) {
		// 	// 导航离开该组件的对应路由时调用
		// 	const iframeUrl = getIframUrl()
		// 	devBack()
		// 	console.log(iframeUrl)
		// 	if(this.isOpenSubView && iframeUrl !== location.href){
		// 		this.isOpenSubView = false
		// 		// setTitle('电子健康卡')
		// 		next({
		// 		    name: 'voucherDetail',
		// 		    NAVTYPE: 'push'
		// 		})
		// 	}else {
		// 		next()
		// 	}
		// },
		data() {
			return {
				voucherDetail: {},
				qrcodeText: '',
				qrcodeColor: '',
				qrcodeTips: IMG_BASE_URL + 'health-qrcode-tips.png',
				showConfirm: false,
				logo: IMG_BASE_URL + 'card-logo.png',
				backgroundImage: IMG_BASE_URL + 'health-card.png',
				cardPackOrderId: '',
				showFaceConfirm: false
			}
		},
		onLoad(){
			//	人脸识别有返回，暂时跳过
			console.log(this.$store.getters.param.voucher)
			this.voucherDetail = this.$store.getters.param.voucher.voucherInfo
			console.log(this.voucherDetail)
			this.getReCode(this.voucherDetail)
		},
		methods: {
			//获取动态二维码
			getReCode(selectedVoucher) {
				getVoucherQrCode({
					orgId: this.$consts.ORG_ID,
					cardType: selectedVoucher.cardType,
					cardNo: selectedVoucher.cardNo
				}).then(res => {
					console.log(res)
					if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
					this.qrcodeText = res.data.qrcodeText
					this.qrcodeColor = res.data.qrcodeColor ? res.data.qrcodeColor : this.$consts.QR_CODE_COLOR
					if (this.qrcodeText === '') {
						showToast('二维码加载失败，请刷新界面重新获取')
						return
					}
				})
			},
			//	解绑电子健康卡
			delHealthCard(){
				showModal('提示', '确认解绑该电子健康卡？').then(result => {
					if(result.confirm){
						deleteVoucherCard({
							orgId: this.$consts.ORG_ID,
							cardType: this.voucherDetail.cardType,
							cardNo: this.voucherDetail.cardNo
						}).then((res) => {
							if (res.resultCode === this.$consts.RESULT_SUCCESS) {
								this.$Router.back()
							}
						})
					}
				})
			},
			//	前往健康钱包
			goCCBHealthyWallet(selectedVoucher){
				//获取健康钱包参数
				getCCBHealthyWallet({
					orgId: this.$consts.ORG_ID,
					cardType: selectedVoucher.cardType,
					cardNo: selectedVoucher.cardNo,
					redirectUrl: location.href,
				}).then(res => {
					if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
					window.open(res.data.url)
				})
			},
			goVoucherCard(selectedVoucher) {
				//获取卡ID
				getCardPackOrderId({
					orgId: this.$consts.ORG_ID,
					cardType: selectedVoucher.cardType,
					cardNo: selectedVoucher.cardNo
				}).then(res => {
					if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
					this.cardPackOrderId = res.data.orderId
					//配置回调地址
					// const redirect_uri = location.href.split('voucherDetail')[0] + 'Profile';
					const redirect_uri = location.href.replace('voucherDetail', 'profile')
					let src = 'https://health.tengmed.com/open/takeMsCard?order_id=' + this.cardPackOrderId + '&redirect_uri=' + redirect_uri
					window.open(src)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
    .app{
        background: #f5f5f5;
    }
    .row.myrow {
        padding: 1rem 0 1.25rem .75rem;
    }
    .scroll-bottom-btn{
        .bigger{
            position: relative;
            padding-bottom: 1.5rem;
            margin-bottom: .5rem;
            .logo{
                position: absolute;
                top: 50%;
                left: 50%;
                color: #fff;
                transform: translate(-50%, -50%);
                margin-top: .6rem;
                width: 1.8rem;
                height: 1.8rem;
                background: #fff;
                border-radius: .4rem;
                img{
                    width: 1.5rem;
                    height: 1.5rem;
                    display: block;
                    margin: .15rem auto;
                }
            }
        }
    }
    .card-code{
        padding: 1rem 1.25rem 0 1.25rem;
        .f-strong{
            color: rgb(102, 102, 102);
        }
    }
    .field{
        height: 2.25rem;
    }
    .qrcode{
        text-align: center;
        padding: 0;
        img{
            width: 6.75rem;
            height: 6.75rem;
        }
    }

    .card-btn {
        margin-top: 1.5rem;
        text-align: center;
        padding: 0 .75rem;

        button {
            width: 100%;
            background: #51A8EF;
            box-shadow: 0 3px 6px #51A8EF;
            height: 2.2rem;
        }
    }

    .delete-voucher-btn {
        margin-top: 1.5rem;
        text-align: center;
        padding: 0 .75rem;
        color: #999999;
    }

    .face-voucher-btn {
        text-align: center;
        padding: 0 .75rem;
        color: #999999;
    }

    .no-qr-code {
        width: 171px;
        height: 171px;
		margin: 0 auto;
    }
</style>
