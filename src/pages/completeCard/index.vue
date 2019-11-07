<template>
    <div>
        <section>
            <div class="card-area">
                <ul>
                    <li>
                        <img v-if="baseSrc" :src="baseSrc + 'Telephone.png'" alt="">
                        <input type="tel" placeholder="请输入手机号码" v-model.trim="user.mobileNo">
                    </li>
                    <li>
                        <img v-if="baseSrc" :src="baseSrc + 'VerificationCode.png'" alt="">
                        <input style="width: 55%;" type="text" placeholder="请输入验证码" v-model.trim="user.verifyCode">
                        <button class="upload-card" @click="sendVerifyCode()" :disabled="msgTips != '获取验证码'"
                                :class="{disabledColor: msgTips != '获取验证码'}">
                            {{msgTips}}
                        </button>
                    </li>
                    <div class="card-btn">
                        <button @click="completeCard()">完成办卡</button>
                    </div>
                </ul>
        </div>
        </section>
    </div>
</template>
<script>
    import { getVoucherSend, getVoucherAdd } from '@/service/voucher.service'
    import { setItem } from '@/utils/store'

    const checkMobile = function (mobile) {
      if (!/^1\d{10}$/.test(mobile)) {
        return '手机号码格式不正确'
      }
    }

    export default {
      data: function () {
        return {
          userInfo: {},
          user: {},
          msgTips: '获取验证码',
          baseSrc: this.constant.LOCAL_IMG
        }
      },
      onLoad () {
        //  接收从上级页面传过来的姓名和名族
        // this.userInfo = this.$store.state.paramModule.param.CompleteCard.ocrInfo
      },
      methods: {
        // 发送验证码
        sendVerifyCode () {
          // 1.验证手机号，单纯作为验证，不使用返回参数
          let errorMsg = checkMobile(this.user.mobileNo)
          if (errorMsg) {
            return this.$utils.showToast(errorMsg)
          }
          this.getMsgCode()
        //   let verifyParams = {
        //     orgId: this.constant.ORG_ID,
        //     bizContent: this.userInfo.name + '&' + this.user.mobileNo + '&' + this.userInfo.idCardNo + '&' + this.constant.CARD_TYPE.ID_CARD
        //   }
        //   verifyBizContent(verifyParams).then(res => {
        //     if (res.result !== this.constant.RESULT_SUCCESS) {
        //       this.$utils.showToast(res.resultMsg)
        //       return
        //     }
        //     // 2.发送验证码
        //     if (res.data.length > 0) {
        //       this.getMsgCode(res.data[0])
        //     }
        //   })
        },
        // 获取验证码
        getMsgCode (cardInfo) {
          let sendParams = {
            cardNo: cardInfo.cardNo,
            cardType: cardInfo.cardType,
            name: this.userInfo.name,
            mobileNo: this.user.mobileNo
          }
          getVoucherSend(sendParams).then(res => {
            if (res.result !== this.constant.RESULT_SUCCESS) {
              this.$utils.showToast(res.resultMsg)
              return
            }
            let count = 60
            const taskId = setInterval(() => {
              --count
              if (count === 0) {
                clearInterval(taskId)
                count = 60
                this.msgTips = '获取验证码'
                return
              }
              this.msgTips = '重新获取(' + count + ')'
            }, 1000)
          })
        },
        // 3.完成绑卡
        completeCard () {
          // 手机号码验证合法性
          let errorMsg = checkMobile(this.user.mobileNo)
          if (errorMsg) {
            return this.$utils.showToast(errorMsg)
          }
          //   let query = this.$root.$mp.query
          let completeCardParams = {
            // orgId: this.constant.ORG_ID,
            cardType: this.constant.CARD_TYPE.ID_CARD,
            cardNo: this.userInfo.idCardNo,
            verifyCode: this.user.verifyCode,
            nation: this.userInfo.nation,
            sex: this.userInfo.sex,
            address: this.userInfo.address ? this.userInfo.address : '',
            mobileNo: this.user.mobileNo
            // extraMap: {
            //   wechatCode: query.wechatCode ? query.wechatCode : '',
            //   nation: this.userInfo.nation,
            //   sex: this.userInfo.sex,
            //   address: this.userInfo.address,
            //   mobileNo: this.user.mobileNo
            // }
          }
          getVoucherAdd(completeCardParams).then(res => {
            if (res.result !== this.constant.RESULT_SUCCESS) {
              this.$utils.showToast(res.resultMsg)
              return
            }
            if (this.$store.state.paramModule.param.voucherAdd.target === 'registConfirm') {
              this.$utils.back(2)
              return
            }
            setItem('pushUrl', 'voucherSuccess')
            this.$utils.navigateTo('index', {}, 2)
          })
        }
      }
    }
</script>
<style lang="scss" scoped>
.card-area{
    ul{
      li{
        height: 48px;
        line-height: 48px;
        position: relative;
        margin: 0 10px;
        border-bottom: 1px solid #eaeaea;
        img{
          width: 22px;
          height: 22px;
          margin: 14px 0 0 20px;
          position: absolute;
        }
        input{
          border: 0;
          height: 48px;
          width: 100%;
          padding-left: 60px;
          font-size: 15px;
        }
        .disabledColor{
            font-size:15px;
            font-family:PingFang;
            font-weight:500;
            color:rgba(153,153,153,1);
        }
      }
    }
    .card-btn{
      margin-top: 30px;
      text-align: center;
      padding: 0 15px;
      button{
        width: 100%;
        background: #51A8EF;
        box-shadow: 0 3px 6px #51A8EF;
        height: 44px;
        font-size:18px;
        font-family:PingFang;
        font-weight:500;
        color:rgba(255,255,255,1);
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
        height: 48px;
        color: #51A8EF;
        font-size: 15px;
        img {
            padding-right: 5px;
            width: 20px;
            height: 15px;
            margin: 0;
            position: relative;
        }
        span {
            color: #51A8EF;
            font-size: 13px;
        }
    }
    .disabledColor{
        color: #eaeaea;
    }
}

</style>

