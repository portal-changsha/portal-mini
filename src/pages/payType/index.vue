<template>
  <div class="payType container">
    <div class="tips row row-center">
      <div class="tips-logo">
        <img src="http://bmob-cdn-20712.b0.upaiyun.com/2019/03/31/f9a03da440a8e9b6807d00ff8dcf2776.png" alt="">
      </div>
      <p v-if="showMin">请尽快完成支付</p>
      <p v-else>请在<span>{{min}}分钟{{sec}}秒</span>内完成支付，超时订单自动取消.</p>
    </div>
    <div class="pay-content row row-center">
      <div class="unpay-icon">
        <img src="http://bmob-cdn-20712.b0.upaiyun.com/2019/03/31/a6f7990c40f14aad8004b537ff7ed4ee.png" alt="">
      </div>
      <div class="pay-tips">
        <p>预约成功，请马上支付！</p>
        <p>订单号：{{orderId}}</p>
      </div>
      <div class="price">
        {{price}}元
      </div>
    </div>

    <div class="pay">
      <p class="f3s15">请选择支付方式</p>
      <Nav-List :navList="navList" v-on:toPage="pay" ></Nav-List>
    </div>
  </div>
</template>

<script>
import NavList from '@/components/NavList'
// import { applyOrder, createOrderId } from '@/service/api.service'
// import { getItem } from '@/utils/store'
export default {
  data () {
    return {
      params: {},
      price: '',
      min: 14,
      sec: 59,
      timer: '',
      navList: [
        {
          imgSrc: this.constant.LOCAL_IMG + 'ico-weixin.png',
          name: '微信支付',
          url: ''
        }
      ],
      showMin: true,
      orderId: ''
    }
  },
  components: {
    NavList
  },
  async onLoad () {
    let q = this.$root.$mp.query
    this.params = JSON.parse(q.params)
    this.price = (this.params.payFee / 100).toFixed(2)
    // if (this.params.busiType === this.constant.BUSI_TYPE.OUT_PATIENT_PAYMENT || this.params.busiType === this.constant.BUSI_TYPE.IN_PATIENT_RECHARGE_PAYMENT) {
    //   this.showMin = false
    // }

    //  获取挂号/创建订单的时间
    // let regTime = this.$store.getters.getRegisterDate, curTime = new Date().getTime()

    // if(!!regTime && (curTime - regTime) < 900000){
    //   let lastTime = curTime - regTime
    //   this.countdown(regTime,lastTime)
    //   return
    // }
    //  申请系统订单号
    // let hosInfo = getItem('selectedHospital')
    // let areaInfo = getItem('selectedArea')
    // let data = {
    //   orgId: hosInfo.orgId,
    //   hospitalId: hosInfo.id,
    //   areaId: areaInfo.areaId
    // }
    // let res = await createOrderId(data)
    // if (res.resultCode === '1') {
    //   this.orderId = res.data.orderId
    //   this.$store.commit('setRegisterDate', new Date().getTime())
    //   this.countdown(curTime, 0)
    // }
  },
  onUnload () {
    clearInterval(this.timer)
  },
  methods: {
    //  微信支付
    async pay () {
      // let hosInfo = getItem('selectedHospital')
      // let data = {
      //   orgId: hosInfo.orgId,
      //   hospitalId: hosInfo.id,
      //   // orderId: response.data.orderId,
      //   orderType: this.constant.ORDER_TYPE.REGISTRATION_TYPE,
      //   cardType: this.params.cardType,
      //   cardNo: this.params.cardNo,
      //   channelId: '4',
      //   invokeType: this.constant.INVOKE_TYPE.WAP_INVOKE,
      //   busiType: this.constant.BUSI_TYPE.REGISTRATION_PAYMENT,
      //   payFee: this.price,
      //   busiIds: this.params.busiIds
      // }
      // let res = await applyOrder(data)
      // if (res.resultCode === '1') {
      //  拉起微信支付
      // wx.requestPayment(
      // {
      // 'timeStamp': '',
      // 'nonceStr': '',
      // 'package': '',
      // 'signType': 'MD5',
      // 'paySign': '',
      // 'success':function(res){},
      // 'fail':function(res){},
      // 'complete':function(res){}
      // })
      //  支付成功跳转到支付成功界面否则跳转到支付失败界面
      // }
    },
    showTips () {
      this.$utils.showModal('提示', '订单已超时,请重新挂号!', () => {
        this.$utils.back()
      }, () => {}, false)
    },
    payConfirm () {
      mpvue.reLaunch({
        url: '../index/main'
      })
    },
    countdown (regTime, lastTime) {
      //  获取挂号/创建订单的时间
      // let regTime = this.$store.getters.getRegisterDate, curTime = new Date().getTime();
      // if(regTime === undefined){
      //   // this.$utils.back()
      //   return
      // }
      // let lastTime = curTime - regTime
      // //  判断当前时间与挂号时间是否超过了15分钟,超过了则提示订单超时,返回挂号界面,没超时则计算倒计时
      // if(lastTime > 900000){
      //   //  重置挂号时间
      //   this.$store.commit('setRegisterDate',undefined)
      //   this.$utils.back()
      //   // this.showTips()
      //   return
      // }
      let minutes = Math.floor((900000 - lastTime) / 1000 / 60)
      let second = Math.floor((900000 - lastTime) / 1000 - minutes * 60)
      this.min = minutes < 10 ? ('0' + minutes) : minutes
      this.sec = second < 10 ? ('0' + second) : second
      this.timer = setInterval(() => {
        if (minutes === 0 && second === 0) {
          clearInterval(this.timer)
          this.showTips()
          return
        }
        second -= 1
        if (second === -1 && minutes > 0) {
          second = 59
          minutes -= 1
        }
        this.min = minutes < 10 ? ('0' + minutes) : minutes
        this.sec = second < 10 ? ('0' + second) : second
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .payType{
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
