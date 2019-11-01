<template>
  <div class="reg-detail">
    <ul class="field-list">
      <li>
        <span>医院</span>
        <span>{{ hosInfo.hospitalName }}</span>
      </li>
      <li>
        <span>院区</span>
        <span>{{ regDetail.areaName }}</span>
      </li>
      <li>
        <span>科室</span>
        <span>{{regDetail.deptName}}</span>
      </li>
      <li>
        <span>医生</span>
        <span>{{ regDetail.doctName }}</span>
      </li>
      <li>
        <span>预约时间</span>
        <span>{{regDetail.regDate}} {{regDetail.phaseDesc}}</span>
      </li>
      <li>
        <span>挂号金额</span>
        <span><label style="color: #FF0000;">{{regDetail.totalFee}}元</label></span>
      </li>
    </ul>
    <ul class="field-list">
      <li>
        <span>就诊人</span>
        <span>{{voucher.holderName}}</span>
      </li>
      <li>
        <span>就诊时间</span>
        <span>{{regDetail.regDate}}</span>
      </li>
      <li>
        <span>就诊序号</span>
        <span>{{regDetail.waitNo}}</span>
      </li>
      <li>
        <span>挂号时间</span>
        <span>{{regDetail.orderTime}}</span>
      </li>
    </ul>
    <ul class="field-list">
      <li>
        <span>挂号金额</span>
        <span>{{regDetail.totalFee}}</span>
      </li>
      <li>
        <span>订单号</span>
        <span>{{regDetail.orderNo}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import { getRegisterRefund, getRegisterUnlock } from '@/service/register.service'
  import { getItem } from '@/utils/store'
  export default {
    data: function () {
      return {
        hosInfo: {},
        regDetail: {},
        voucher: {}
      }
    },
    onLoad () {
      let q = this.$root.$mp.query
      if (q.params === undefined) {
        this.$utils.back()
        return
      }
      this.hosInfo = getItem('selectedHospital')
      this.voucher = getItem('selectedVoucher')
      this.regDetail = JSON.parse(q.params)
      this.regDetail.totalFee = (this.regDetail.totalFee / 100).toFixed(2)
      this.regDetail.regDate = (this.$utils.formatTime(this.regDetail.regDate)).curDate
      this.regDetail.phaseDesc = this.$utils.formateDesc(this.regDetail.phaseDesc)
      debugger
    },
    onShow () {
    },
    computed: {
      originImgUrl () {
        return this.constant.LOCAL_IMG
      }
    },
    methods: {
      toActive (type, item, index, tips) {
        if (type !== 2) {
          this.$utils.showModal('提示', tips, async () => {
            //  确认按钮
            let params = {
              orgId: this.hosInfo.orgId,
              hospitalId: this.hosInfo.hospitald,
              orderId: item.orderId
            }
            if (type === 1) {
              params.cardType = this.voucher.cardType
              params.cardNo = this.voucher.cardNo
              params.orderNo = item.orderNo
              params.regId = item.regId
            }
            let res = type === 1 ? await getRegisterUnlock(params) : await getRegisterRefund(params)
            if (res.result === '1') {
              // let title = type === 1 ? '取消成功' : '退号成功，退款到账时间以银行到账时间为准。'
              // this.$utils.showToast(title, 5000)
              this.loadList()
            }
          }, () => {
            //  取消
          })
        } else {
          //  去缴费
          let payInfo = {
            cardType: this.voucher.cardType,
            cardNo: this.voucher.cardNo,
            payFee: item.totalFee,
            busiType: this.constant.BUSI_TYPE.REGISTRATION_PAYMENT,
            busiIds: [item.orderNo]
          }
          mpvue.navigateTo({
            url: '../payType/main?params=' + JSON.stringify(payInfo)
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .reg-detail{
    height: inherit;
    background: #EFF2F5;
  }
  .field-list{
    margin: 10px 0;
  }
  .confirm-btn{
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 60px;
    box-shadow:0px -1px 2px 0px rgba(81,168,236,0.2);
    background:#fff;
    button{
      height: 44px;
      background: #51A8EC;
      color: #FFFFFF;
      font-size: 18px;
      border-radius: 5px;
      margin:7px 15px;
    }
    .disabled{
      background: #999;
    }
  }
</style>

