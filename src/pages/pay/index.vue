<template>
  <div class="app" id="wrapper">
    <scroll @refresh="refresh">
      <p class="top-tips" v-if="busiType === '1301'"> 请尽快完成支付</p>
      <p class="top-tips" v-if="busiType === '1006'"> 请在<span class='f-strongest'>15分钟</span>内完成支付，超时订单自动取消...</p>
      <section class="doctor-info">
        <div class="head pay-header"></div>
        <div class="info">
          <p class="f-small pay-tips"><span class="f-strong"><span v-if="busiType === '1006'">预约成功，</span> 请马上支付！</span>&nbsp;
          </p>
          <p class="pay-type f-strongest f-middle">{{totalFee | formatFee}}</p>
        </div>
      </section>
      <section v-if="busiType === '5'">
        <dl class="field" style="height: 65px">
          <dd class="right-item f-strongest f-middle">{{ totalFee | formatFee }}</dd>
        </dl>
      </section>
      <section>
        <div class="panel">请选择支付方式</div>
        <ul class="list">
          <li v-for="(payType,index) in payTypes" class="icon-row arr-item" @click="selectPayType(payType)"
              :key="index">
            <div class="col pay-icon"
                 :class="{ weixin: payType.channelId=='4', zhifubao: payType.channelId=='5', zizhu: payType.channelId=='8',union: payType.channelId == '7', hebao: payType.channelId == '12', qianbao: payType.channelId == '13',}"></div>
            <div class="desc col">
              <div class="gwi-size-normal pay-title">{{ payType.channelName }}</div>
              <div class="gwi-size-small">
                <span v-if="payType.channelId=='4'" class="f-minor f-small"></span>
                <span v-if="payType.channelId=='5'" class="f-minor f-small">需要安装支付宝APP客户端</span>
                <span v-if="payType.channelId=='8'" class="f-minor f-small">自助机刷银行卡和社保卡</span>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </scroll>
  </div>
</template>
<script>
  import NoRecord from '@/components/NoRecord'
  import HosVoucherSelect from '@/components/hos-voucher-select'
  import { createPayOrder } from '@/service/pay.service.js'
  import { setItem, getItem } from '@/utils/store'
  export default {
    data: function () {
      return {
        payInfo: {},
        payType: {},
        payTypes: [],
        orderId: '',
        totalFee: '',
        outOrderId: 0,
        invokeType: 0,
        channelId: 0,
        busiType: '',
        params: {},
        seconds: '',
        minutes: '14',
        openId: '',
        showMin: true,
        showWindow: false,
        voucherList: [],
        payCode: ''
      }
    },
    components: {
      NoRecord,
      HosVoucherSelect
    },
    onLoad () {
    },
    onShow () {
      const payInfo = getItem('payInfo')
      console.log(payInfo)
      this.payInfo = payInfo
      this.totalFee = this.payInfo.payFee
      this.busiType = this.payInfo.busiType
      if (this.busiType === this.constant.BUSI_TYPE.OUT_PATIENT_PAYMENT || this.busiType === this.constant.BUSI_TYPE.IN_PATIENT_RECHARGE_PAYMENT) {
        this.showMin = false
      }
      this.cardNo = this.payInfo.cardNo
      this.cardType = this.payInfo.cardType

      this.payTypes = [{
        'channelId': '4',
        'channelName': '微信',
        'limitAmt': 0,
        'extraMap': { }
      }]
    },
    methods: {
      async selectPayType (payType) {
        const orderParams = {
          'hospitalId': this.payInfo.hospitalId,
          'areaId': this.payInfo.areaId,
          'channelId': '4',
          'invokeType': '5',
          'payFee': this.payInfo.payFee,
          'cardType': this.cardType,
          'cardNo': this.cardNo,
          'busiType': this.busiType,
          'busiIds': this.payInfo.busiIds,
          'account': '621493792791273232',
          'extraMap': { }
        }
        let res = await createPayOrder(orderParams)
        if (res.result === this.constant.RESULT_SUCCESS) {
          this.forMatData(res.data)
        } else {
          this.$utils.showToast(res.resultMsg)
        }
      },
      forMatData (data) {
        this.params = JSON.parse(data.payInfo)
        setItem('payResult', {
          hospitalId: this.payInfo.hospitalId,
          areaId: this.payInfo.areaId,
          orderId: data.orderId,
          payFee: this.totalFee,
          busiType: this.busiType
        })
        wx.requestPayment(
          {
            'timeStamp': this.params.timeStamp,
            'nonceStr': this.params.nonceStr,
            'package': this.params.package,
            'signType': this.params.signType,
            'paySign': this.params.sign,
            'success': function (res) {
              if (res.errMsg === 'requestPayment:ok') {
                // 跳转界面
                mpvue.redirectTo({
                  url: '/pages/payResult/main'
                })
                console.log('支付成功')
              }
              console.log(res)
            },
            'fail': function (res) {
              console.log(res)
            },
            'complete': function (res) {
              console.log(res)
            }
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .row{
    padding: 0.75rem;
    &.thick {
      padding: 0.5rem;
    }
    &.small {
      padding: 0.25rem;
    }
    &.border-bottom {
      border-bottom: 1px solid #e9e9e9;
    }
    .left {
      text-align: left;
      width: 4.5rem;
      color: #999999;
    }
    .right {
      margin-left: .5rem;
    }
    &.without-margin-bottom {
      margin-bottom: -1.5rem;
    }
  }
  .doctor-info {
    @include display-flex();
    @include align-items(center);
    padding: 0.4rem 0 0.4rem 0.75rem;
    .head {
      width: 1.0rem;
      height: 1.0rem;
    }
    .info {
      @include flex(1);
      @include ellipsis();
      width: 1px;
      padding-left:10px;
    }
    .remain {
      margin-right: 10px;
    }
  }

  .f-largest{
    font-size: .9rem;
  }
  .f-large{
    font-size: .8rem;
  }
  .f-middle {
    font-size: .75rem;
  }
  .f-small{
    font-size: .65rem;
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
  .pay-type {
    float: right;
    vertical-align: middle;
    margin-top: -5px;
    margin-right: 10px;
  }

  .pay-tips {
    margin-bottom: 5px;
  }

  .top-tips{
    background: #dfe4e8;
    color: #51abec;
    // text-align: center;
    @extend .f-small;
    padding-left: 0.75rem;
    //line-height: 2rem;
    //text-align: center;
    padding-bottom: 10px;
    padding-top: 10px;
    &::before{
      display: inline-block;
      width: 17px;
      height: 17px;
      content: ' ';
      vertical-align: sub;
      background: url($main-img-url + + "tips.png") no-repeat;
      background-size: 100%;
    }
  }
  .big-tips{
    height: 60px;
    // line-height:90px;
    padding-top:29px;
    @include border(bottom);
    text-align: center;
  }

  .panel {
    height: .8rem;
    line-height: .8rem;
    padding-left: .75rem;
    padding-right: .75rem;
    @include border(bottom);
  }

  .panel-title {
    padding: .25rem .75rem;
    @include border(top);
    @include border(bottom);
  }

  .panel-title-large {
    padding: .45rem .75rem;
    @include border(top);
    @include border(bottom);
  }

  %arrow{
    position: absolute;
    display: block;
    content:' ';
    top:0;
    width: 8px;
    right:.75rem;
    bottom:0;
    background-size:100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  .arrow-right{
    @extend %arrow;
    background-image: url($main-img-url + 'more-arrow.png') ;
  }
  .arrow-right-blue{
    @extend %arrow;
    background-image: url($main-img-url + 'more-right-blue.png') ;
  }
  .arrow-right-guide{
    @extend %arrow;
    background-image: url($main-img-url + 'icon-navigation.png') ;
  }

  .list {
    background: #fff;
    li{
      @include border(bottom);
      padding-left: .75rem;
      padding-right: .75rem;
    }
    .list-item {
      padding: .75rem;
      height: auto;
      &.with-ipt{
        padding: 2px .75rem;
      }
    }
    .ipt-item{
      padding-top: .25rem;
      padding-bottom: .25rem;
    }
    .thick-item{
      padding: .45rem .75rem;
      .left-text {
        margin-right: .75rem;
        width: 4rem;
        @extend .f-minor;
      }
    }
    .arr-item{
      position: relative;
      padding-right:.75rem + .9rem;
      &::after{
        @extend .arrow-right;
      }
    }
    .arr-item-blue{
      position: relative;
      padding-right:.75rem + .9rem;
      &::after{
        @extend .arrow-right-blue;
      }
    }
    .arr-item-guide{
      position: relative;
      padding-right:.75rem + .9rem;
      &::after{
        @extend .arrow-right-guide;
      }
    }
    .selected{
      padding-right:.75rem * 2;
      position: relative;
      &::after{
        //上次选中图标
        @extend %arrow;
        width: 25px;
        background-image:url($main-img-url + "selected.png")
      }
    }
  }

  .pay-header {
    background: url($main-img-url + 'unpay-icon.png') center no-repeat;
    background-size: 100%;
  }

  .top-tips::before {
    background: url($main-img-url + 'yellow-warning.png') no-repeat;
    background-size: 100%;
  }
  .doctor-info .info{
    @include display-flex;
    @include justify-content(space-between);
    padding-right: 10px;
  }

  .pay-icon{
    width: 30px;
    height: 30px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    &.weixin{
      background-image: url($main-img-url + 'center_icon_wechat.png') ;
    }
  }
</style>

