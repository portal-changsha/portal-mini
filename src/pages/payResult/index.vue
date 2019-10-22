<template>
  <div class="app">
    <scroll class="pay-result-view">
      <section class="pay-result-title">
        <dl class="field pay-title-height">
          <span class="f-strong f-middle" style="float: left">订单号：{{ orderId }}</span>
          <dd class="right-item f-strongest f-largest" style="float: right">{{ payFee | formatFee }}</dd>
        </dl>
      </section>
      <section v-show="payload" class="pay-success-bg">
        <div class="failed-photo"></div>
        <label class="f-largest">支付确认中，请耐心等待</label>
      </section>
      <section v-show="payOvertime" class="pay-success-bg">
        <div class="failed-photo"></div>
        <label class="f-largest">网络错误，请稍后重试</label>
        <div class="pay-btn">
          <button @click="backHome()">完成</button>
        </div>
      </section>
      <section v-show="payFailed" class="pay-success-bg">
        <div class="failed-photo"></div>
        <label class="f-largest">支付失败</label>
        <div class="pay-btn">
          <button @click="goModule()">{{ busiName }}列表</button>
          <button @click="backHome()">完成</button>
        </div>
      </section>
      <section v-show="paySuccess" class="pay-success-bg">
        <div class="success-photo"></div>
        <label class="f-largest">支付成功</label>
        <div class="pay-btn">
          <button @click="goModule()">{{busiName}}列表</button>
          <button @click="backHome()">完成</button>
        </div>
      </section>
    </scroll>
  </div>
</template>
<script>
  import { getItem } from '@/utils/store'
  import { getPaySync } from '@/service/pay.service.js'
  export default {
    data () {
      return {
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
    },
    onShow () {
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
      },
      backHome () {
        this.$utils.navigateTo('index', {}, 2)
      }
    }
  }
</script>

<style lang="scss">

  .f-largest{
    font-size: .65rem;
  }
  .f-large{
    font-size: .65rem;
  }
  .f-middle {
    font-size: .55rem;
  }
  .f-small{
    font-size: .45rem;
  }

  .f-strongest{
    color: #ff0000;
  }
  .f-identify {
    color: #fd9c03;
  }
  .f-strong{
    color: #51a8ec;
  }
  .f-normal {
    color: #333333;
  }
  .f-minor {
    color: #999999;
  }
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
    background: url($main-img-url + 'fail.png');
    background-size: contain;
  }

  .success-photo {
    background: url($main-img-url + 'success-pay.png');
    background-size: contain;
  }

  .pay-btn {
    margin-top: 1.5rem;
    text-align: center;
    width: 100%;
    button {
      background: #51A8EC;
      border-radius: .25rem;
      width: 3rem;
      height: 1.2rem;
      font-size: .45rem;
      box-shadow: 0 4px 10px #51A8EC;
    }

    .field {
      @include display-flex();
      @include align-items(center);
      //width: 100%;
      height: 2rem;
      // line-height: 2rem;
      @include border(bottom);
      padding: .75rem;
      &.last{
        @include border(none);
      }
      dt {
        text-align: left;
        width: 4.5rem;
        color: #999999;
      }
      dd{
        width: 1px;
        text-align: right;
        @include flex(1);
        @include ellipsis();
      }
      .right-item {
        float: right;
        text-align: right;
        //margin-right: 1.75rem;
      }
    }
  }
</style>
