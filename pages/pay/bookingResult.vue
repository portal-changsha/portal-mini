<template>
    <div class="app">
        <scroll>
            <section>
                <dl class="field" style="height: 65px">
                    <span class="f-strong f-middle">订单号：{{ bookingInfo.orderId }}</span>
                    <dd v-if="bookingInfo.takeType === '1'" class="right-item f-strongest f-largest">{{ bookingInfo.payFee | formatFee }}</dd>
                </dl>
            </section>
            <section v-if="paySuccess" class="pay-success-bg">
                <div class="success-photo"></div>
                <label class="f-largest">预约成功</label>
                <div>
                    <span class="f-strong f-middle">请提前15分钟到【{{ bookingInfo.deptName | formatDeptName }}】护士站排队取号</span>
                </div>
                <div class="pay-btn">
                    <button @click="backHome()">去首页</button>
                </div>
            </section>
            <section v-else class="pay-success-bg">
                <div class="failed-photo"></div>
                <label class="f-largest">支付失败</label>
                <div class="pay-btn">
                    <button @click="backHome()">去首页</button>
                </div>
            </section>

        </scroll>

    </div>
</template>
<script>
	import { setItem } from '@/utils/localStore.js'
    export default {
        data(){
            return {
                paySuccess: true,
				bookingInfo: {}
            }
        },
        onLoad(){
            //获取上级传入参数
			this.bookingInfo = this.$store.getters.param.bookingResult.regInfo
			console.log(this.bookingInfo)
			this.paySuccess = this.bookingInfo.takeType === '2'
        },
        methods: {
            //回首页
            backHome() {
                this.$Router.replace({name: 'index'})
            },
            goModule() {
                //根据业务流程busiType，跳转对应业务模块
                if (this.bookingInfo.busiType === this.$consts.BUSI_TYPE.REGISTRATION_PAYMENT) { //挂号
                    //跳转的目标页面name
                    setItem('pushUrl', 'myRegister')
                    this.$Router.replace({name: 'index'})
                }
                if (this.bookingInfo.busiType === this.$consts.BUSI_TYPE.OUT_PATIENT_PAYMENT) {
                    setItem('pushUrl', 'myPay')
                    this.$Router.replace({name: 'index'})
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pay-success-bg {
        top: 3.8rem;
        right: 0rem;
        bottom: 0rem;
        left: 0rem;
        background-color: white;
        position: absolute;
        text-align: center
    }

    .failed-photo {
        background: url( $redirect-url + $img-file-path + "fail.png");
        background-size: contain;
    }

    .success-photo {
        background: url( $redirect-url + $img-file-path + "success-pay.png");
        background-size: contain;
    }

    .pay-btn {
        margin-top: 1.5rem;
        button {
            background: #51A8EC;
            border-radius: .25rem;
            width: 6rem;
            height: 2.2rem;
            font-size: .9rem;
            box-shadow: 0 0.2rem 0.5rem #51A8EC;
        }
    }
</style>
