<template>
  <div class="payResult">
    <div class="row row-center content">
      <p>订单号：{{ orderId }}</p>
      <p>{{ payFee/100 }}元</p>
    </div>
    <div class="pay-img">
      <img v-if="paySuccess && baseSrc" :src="baseSrc + 'pay-success-bg.png'" alt="">
      <img v-if="(payOvertime || payFailed) && baseSrc" :src="baseSrc + 'fail.png'" alt="">
    </div>
    <div class="pay-btn">
      <p>{{paySuccess ? '支付成功' : '支付失败'}}</p>
      <button @click="payConfirm"> {{paySuccess? '完成' : '确认'}}</button>
    </div>
  </div>
</template>

<script>
import { getItem } from '@/utils/store'
import { getPaySync } from '@/service/pay.service.js'
export default {
  data () {
    return {
      flag: -1, //  判断支付的结果1:成功 -1:失败
      baseSrc: this.constant.LOCAL_IMG,
      payFee: '0',
      orderId: '0',
      busiType: '',
      busiName: '',
      payFailed: false,
      payOvertime: false,
      paySuccess: false,
      payload: true,
      payResultInfo: {}
    }
  },
  onLoad () {
    // let q = this.$root.$mp.query
    // this.flag = q.flag
    const payResult = getItem('payResult')
    console.log(payResult)
    this.orderId = payResult.orderId
    this.payFee = payResult.payFee
    this.busiType = payResult.busiType

    // 通过busiType判断业务名称，显示到界面
    if (this.busiType === this.constant.BUSI_TYPE.REGISTRATION_PAYMENT) {
      this.busiName = '挂号'
    }
    if (this.busiType === this.constant.BUSI_TYPE.OUT_PATIENT_PAYMENT) {
      this.busiName = '缴费'
    }
    if (this.busiType === this.constant.BUSI_TYPE.IN_PATIENT_RECHARGE_PAYMENT) {
      this.busiName = '充值'
    }
    this.syncOrder(payResult)
  },
  methods: {
    payConfirm () {
      mpvue.reLaunch({
        url: '../index/main'
      })
    },
    async syncOrder (payResultInfo) {
      const paySyncParams = {
        hospitalId: payResultInfo.hospitalId,
        areaId: payResultInfo.areaId,
        orderId: payResultInfo.orderId,
        extraMap: { }
      }
      let res = await getPaySync(paySyncParams)
      console.log(res)
      if (res.result === this.constant.RESULT_SUCCESS) {
        if (res.data.orderStatus === this.constant.ORDER_STATUS.ALREADY_PAYMENT) {
          this.payload = false
          this.paySuccess = true
        } else if (res.data.orderStatus === this.constant.ORDER_STATUS.UN_PAYMENT || res.data.orderStatus === this.constant.ORDER_STATUS.PAYING) {
          this.syncOrder(this.payResultInfo)
        } else {
          this.payload = false
          this.payFailed = true
        }
      } else {
        this.payload = false
        this.payOvertime = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .payResult{
    height: inherit;
    background: rgb(239,242,245);
    .content{
      width: auto;
      background: #fff;
      padding: 0 15px;
      height: 60px;
      line-height: 60px;
      justify-content: space-between;
      p:nth-child(1){
        color: #51A8EC;
        font-size: 15px;
      }
      p:nth-child(2){
        color: #FF0000;
        font-size: 18px;
      }
    }
    .pay-img{
      text-align: center;
      padding: 40px 0 18px 0;
      img{
        width: 110px;
        height: 110px;
        display: block;
        margin: 0 auto;
      }

    }
    .pay-btn{
      text-align: center;
      p{
        color: #333;
        font-size: 18px;
        padding-bottom: 30px;
      }
      button{
        font-size: 18px;
        background: #51A8EC;
        color: #fff;
        border-radius: 5px;
        width: 120px;
        height: 44px;
        box-shadow: 0 1px 2px #51A8EC;
      }
    }
  }
</style>
