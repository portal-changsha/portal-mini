<template>
    <div v-if="tempJumpTip === ''">
        <section>
            <div class="card-area">
                <ul>
                    <li>
                        <img :src="phoneIcon" alt="">
                        <input type="tel" placeholder="请输入手机号码" v-model.trim="user.mobileNo">
                    </li>
                    <li>
                        <img :src="lockIcon" alt="">
                        <input style="width: 75%;" type="text" placeholder="请输入验证码" v-model.trim="user.verifyCode">
                        <button class="upload-card" @click="sendVerifyCode()" :disabled="msgTips != '获取验证码'"
                                :class="{disabledColor: msgTips != '获取验证码'}">
                            {{msgTips}}
                        </button>
                    </li>
                    <div class="note">
                        <p>手机号主要用于接收挂号、缴费、检验检查报告进度等通知</p>
                    </div>
                    <div class="card-btn">
                        <button @click="completeCard()">完成办卡</button>
                    </div>
                </ul>
        </div>
        </section>
    </div>
</template>
<script>
	import { bindCardWithHealthCode, verifyBizContent, sendVerifyCodeMsg, addVoucherCard } from '@/services/voucher.js'
	import config from '@/config/index.js'
	import { setItem, getItem } from '@/utils/localStore.js'
	import { showToast } from '@/utils/uniApi.js'
	const checkMobile = function (mobile) {
	    if (!/^1[3456789]\d{9}$/.test(mobile)) {
	        return '手机号码格式不正确'
	    }
	}
    export default {
        /*eslint-disable*/
        data: function () {
            return {
                userInfo: {},
                user: {},
                msgTips: '获取验证码',
                phoneIcon: config.VUE_APP_IMG_URL + 'Telephone.png',
                lockIcon: config.VUE_APP_IMG_URL + 'VerificationCode.png',
                healthCode: '',
                tempJumpTip: '',
				taskId: null
            }
        },
		onUnload() {
			this.taskId && clearInterval(this.taskId)
		},
        //绑定卡回调时，判断是否有healthCode参数区分办卡、绑卡来源
        beforeMount() {
            const query = this.$Route.query
			console.log(location.href)
			console.log(this.$Route)
			console.log(query)
			const store = this.$store.getters.param
            if (query.healthCode) {
                this.tempJumpTip = query.healthCode
                //一键绑卡回调返回healthCode
                //用户取消授权，返回上一步操作
                if (query.healthCode === '-1') {
					this.$Router.back(2)
                    return;
                }
                //用户点击添加电子健康卡按钮，返回上一步添加卡界面
                if (query.healthCode === '0') {
					
                    if (store.voucherAdd.target === 'profile' || store.voucherAdd.target === 'profileBindCard') {
                        //判断是否iOS设备，避免iOS微信签名失败，解决返回首页标题不变的情况
                        // if(this.$utils.devIsIos()) {
                        //     window.location.replace(REDIRECT_URL + '/checkInformation')
                        //     return;
                        // }
                        this.$Router.replace({name: 'checkInfomation'});
                        return
                    }
                    this.$Router.back(2)
                    return
                }

                this.healthCode = query.healthCode
                setItem('healthCode', query.healthCode)
                this.bindPackCard(query.healthCode);
            }

            this.userInfo = store.completeCard.ocrInfo
        },
        methods: {
            //发送验证码
            sendVerifyCode() {
                //1.验证手机号，单纯作为验证，不使用返回参数
                const errorMsg = checkMobile(this.user.mobileNo);
                if (errorMsg) {
					showToast(errorMsg)
                    return
                }
                const verifyParams = {
                    orgId: this.$consts.ORG_ID,
                    bizContent: this.userInfo.name + '&' + this.user.mobileNo + '&' + this.userInfo.idCardNo.toUpperCase() + '&' + this.$consts.CARD_TYPE.ID_CARD,
                }
                verifyBizContent(verifyParams).then(res => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
                    //2.发送验证码
                    if (res.data.length > 0) {
                        this.getMsgCode(res.data[0])
                    }
                })
            },

            //获取验证码
            getMsgCode(cardInfo) {
                const sendParams = {
                    orgId: this.$consts.ORG_ID,
                    cardNo: cardInfo.cardNo.toUpperCase(),
                    cardType: cardInfo.cardType,
                }
                sendVerifyCodeMsg(sendParams).then(res => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
                    let count = 60
                    this.taskId = setInterval(() => {
                        --count;
                        if (count === 0) {
                            clearInterval(this.taskId)
                            count = 60
                            this.msgTips = '获取验证码'
                            return
                        }
                        this.msgTips = '重新获取(' + count + ')'
                    }, 1000)
                })
            },
            //3.完成绑卡
            completeCard() {
                //手机号码验证合法性
                const errorMsg = checkMobile(this.user.mobileNo);
                if (errorMsg) {
					showToast(errorMsg)
                    return
                }
                const completeCardParams = {
                    orgId: this.$consts.ORG_ID,
                    cardType: this.$consts.CARD_TYPE.ID_CARD,
                    cardNo: this.userInfo.idCardNo.toUpperCase(),
                    verifyCode: this.user.verifyCode,
                    extraMap: {
                        wechatCode: getItem('healthCode') || '',
                        nation: this.userInfo.nation,
                        sex: this.userInfo.sex,
                        address: this.userInfo.address,
                        mobileNo: this.user.mobileNo,
                    }
                }

                addVoucherCard(completeCardParams).then(res => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
					const store = this.$store.getters.param
                    if (store.voucherAdd.target === 'registConfirm' ) {
                        if (getItem('hasUserAuth')) {
                            // this.$router.go(-2);
							this.$Router.back(2)
                        } else {
                            //Todo 用户确认授权以后，缓存授权标识
                            setItem('hasUserAuth', this.$consts.ORG_ID)
                            // this.$router.go(-3);
							this.$Router.back(3)
                        }
                        return
                    }
                    //  跳转到成功界面
                    setItem('pushUrl', 'voucherSuccess')
                    this.$Router.replace({name: 'index'})
                })
            },

            bindPackCard(healthCode) {
                //获取卡ID
                bindCardWithHealthCode({
                    orgId: this.$consts.ORG_ID,
                    healthCode: healthCode,
                }).then(res => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
                        // this.$router.go(-2);
						this.$Router.back(2)
                        return
                    }
					const store = this.$store.getters.param
                    if (store.voucherAdd.target === 'registConfirm') {
                        //  本地保存新关联的电子健康卡,确保确认挂号页面选中的卡片是刚关联的
                        setItem('selectedVoucher', res.data)
                        if (getItem('hasUserAuth')) {
							this.$Router.back(3)
                            // this.$router.go(-3);
                        } else {
                            //Todo 用户确认授权以后，缓存授权标识
                            setItem('hasUserAuth', this.$consts.ORG_ID)
                            // this.$router.go(-4);
							this.$Router.back(4)
                        }
                        return
                    }

                    setItem('pushUrl', 'profile');
                    this.$Router.replace({name: 'index'})
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .card-area{
    ul{
      li{
        height: 2.4rem;
        line-height: 2.4rem;
        position: relative;
        margin: 0 .5rem;
        border-bottom: 1px solid #eaeaea;
        img{
          width: 1.2rem;
          margin: .7rem 0 0 1rem;
          position: absolute;
        }
        input{
          border: 0;
          height: 2.4rem;
          width: 100%;
          padding-left: 3rem;
        }
        .disabledColor{
            color: #eaeaea;
        }
      }
    }
    .card-btn{
      margin-top: 1.0rem;
      text-align: center;
      padding: 0 .75rem;
      button{
        width: 100%;
        background: #51A8EF;
        box-shadow: 0 0.15rem 0.3rem #51A8EF;
        height: 2.2rem;
      }
    }
    .upload-card {
        display: flex;
        align-items: center;
        background: transparent;
        border: 0;
        position: absolute;
        top: 0;
        right: 0;
        height: 2.4rem;
        color: #51A8EF;
        img {
            padding-right: 0.25rem;
            width: 1rem;
            height: .75rem;
            margin: 0;
            position: relative;
        }
        span {
            color: #51A8EF;
            font-size: 0.65rem;
        }
    }
    .disabledColor{
        color: #eaeaea;
    }
    .note {
        padding: 0.5rem 1.0rem;
        font-size: 0.6rem;
        color: #8e8f92;
    }
}

</style>