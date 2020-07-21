<template>
	<view>
		<div class="health" @click="selectVoucher(voucher)">
			<img class="card-img" :src="healthCardImg" alt="">
			<div class="health-content">
				<div class="health-content-area">
					<!-- <p class="health-content-title">湖南省卫生健康委员会</p> -->
					<div class="card-info">
						<div class="card-info-left">
							<h4>{{voucher.holderName}}</h4>
							<p>{{voucher.cardNo | dotted}}</p>
						</div>
						<div class="card-info-right">
							<qr-code :cid="'qrcode-id'" :foregroundColor="qrcodeColor" :text="voucher.qrcodeText"></qr-code>
							<img class="card-logo" :src="healthCardLogo" alt="">
						</div>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>

	import qrCode from '../qr-code/qr-code.vue'
	import config from '@/config/index.js'
	import { setItem } from '@/utils/localStore.js'
	const IMG_BASE_URL = config.VUE_APP_IMG_URL

    export default {
        components: {
            qrCode,
        },
        data() {
            return {
                healthCardImg: IMG_BASE_URL + 'health-card.png',
                healthCardLogo: IMG_BASE_URL + 'card-logo.png'
            }
        },
        props: {
            voucher: {
                type: Object
            },
            index: {
                type: Number
            }
        },
        computed: {
            qrcodeLenth(){
				let codeString = this.voucher.qrcodeText
				return codeString.split(':').length > 2 ? 'Q' : 'L'
			},
			qrcodeColor(){
				return this.voucher.qrcodeColor ? this.voucher.qrcodeColor : this.$consts.QR_CODE_COLOR
			}
        },
        methods: {
            selectVoucher(voucher) {
                setItem('selectedVoucher', voucher)
                this.$emit('selected', voucher, this.index);
            }
        }
    }
</script>
<style lang="scss">
  .health{
        position: relative;
        .card-img{
            width:100%;
        }
        &-content{
            top: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            &-area{
                position: relative;
                padding: 0 1rem 0 0.875rem;
                height: 100%;
                @include display-flex;
                @include flex-direction(column);
                @include justify-content(space-between);
                .card-info{
                    @include display-flex;
                    @include justify-content(space-between);
                    @include align-items(flex-end);
                    margin-bottom: 13%;
                    height: inherit;
                    &-left{
                        color: #2B2B2B;
                        h4,p{
                            font-size: .9rem;
                            font-weight: bold;
                            font-family: PingFang-SC-Medium;
                        }
                    }
                    &-right{
                        position: relative;
                        background: #fff;
                        padding: 4px;
                        .card-logo{
                            position: absolute;
                            width: .9rem;
                            height: .9rem;
                            left: 0;
                            right: 0;
                            top: 0;
                            bottom: 0;
                            margin: 1.675rem auto;
                        }
                    }
                    
                }
            }
        }
    }
</style>
