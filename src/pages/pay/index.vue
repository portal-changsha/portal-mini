<template>
 <div class="payType">
    <div class="tips row row-center">
      <div class="tips-logo">
        <img v-if="originImgUrl" :src="originImgUrl + 'yellow-warning.png'" alt="">
      </div>
      <p v-if="busiType === '1301'">请尽快完成支付</p>
      <!-- <p v-if="busiType === '1006'">请在<span>15分钟</span>内完成支付，超时订单自动取消.</p> -->
      <p v-else>请在<span>15分钟</span>内完成支付，超时订单自动取消.</p>
    </div>
    <div class="pay-content row row-center">
      <div class="unpay-icon">
        <img v-if="originImgUrl" :src="originImgUrl + 'unpay-icon.png'" alt="">
      </div>
      <div class="pay-tips">
        <p>预约成功，请马上支付！</p>
        <p>订单号：{{orderId}}</p>
      </div>
      <div class="price">
        {{totalFee / 100}}元
      </div>
    </div>

    <div class="pay">
      <p class="f3s15">请选择支付方式</p>
      <Nav-List :navList="navList" v-on:toPage="selectPayType" ></Nav-List>
    </div>
  </div>

  <!-- <div class="app" id="wrapper">
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
  </div> -->
</template>
<script>
  import NoRecord from '@/components/NoRecord'
  import NavList from '@/components/NavList'
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
        payCode: '',
        navList: [
          {
            imgSrc: this.constant.LOCAL_IMG + 'ico-weixin.png',
            name: '微信支付',
            url: ''
          }
        ]
      }
    },
    components: {
      NoRecord,
      HosVoucherSelect,
      NavList
    },
    computed: {
      originImgUrl () {
        return this.constant.LOCAL_IMG
      }
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
          this.$utils.showToast(res.message)
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
  .payType{
    height: inherit;
    background: #EFF2F5;
    .tips{
      height: 40px;
      width: auto;
      padding: 0 15px;
      .tips-logo{
        img{
          width: 17px;
          height: 17px;
          display: block;
        }
      }
      p{
        color: #51A8EC;
        font-size: 13px;
        padding-left: 4px;
        span{
          color: #FF3636;
          font-size: 13px;
        }
      }
    }
    .pay-content{
      height: 63px;
      background: #fff;
      position: relative;
      padding: 0 15px;
      width: auto;
      .unpay-icon{
        img{
          width: 33px;
          height: 35px;
          display: block;
        }
      }
      .pay-tips{
        padding-left: 11px;
        p:nth-child(1){
          color: #51A8EC;
          font-size: 15px;
        }
        p:nth-child(2){
          color: #999;
          font-size: 13px;
        }
      }
      .price{
        position: absolute;
        color: #FF0101;
        font-size: 18px;
        right: 15px;
      }
    }
    .pay{
      margin-top: 10px;
      p{
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        background: #fff;
        border-bottom: 1px solid #D6D6D6;
      }
    }
  }
</style>

