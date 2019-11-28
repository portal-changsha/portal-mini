<template>
  <div class="my-register">
    <Hos-Voucher-Select v-on:select="select" ></Hos-Voucher-Select>
    <TimeSelect v-on:selectDate="selectDate"></TimeSelect>
    <div class="reg-info" v-for="(item,index) in registerList" :key="index" >
      <h3 class="f3s15">{{item.deptName}}&nbsp;&nbsp;{{item.doctName}}&nbsp;&nbsp;({{item.rankName}}) </h3>
      <div class="content row row-center" @click="goDetail(item)">
        <div class="left">
          <p>挂号时间 {{item.orderTime}} </p>
          <p>就诊时间  {{item.regDate}} {{item.phaseDesc}}</p>
        </div>
        <div class="arrow">
          <img :src="originImgUrl + 'more-arrow.png'" alt="">
        </div>
      </div>
      <div class="reg-status row row-center">
        <p class="col">{{regStatus[item.regStatus]}}</p>
        <div class="col right">
          <button v-if="(item.payStatus === '2' || item.payStatus === '1') && item.regStatus === '4'" @click.stop="toActive(1,item,index,'确认取消预约?')">取消</button>
          <button v-if="item.payStatus === '2' && item.regStatus === '4'" @click.stop="toActive(2,item,index,'')">缴费</button>
          <!-- <button v-if="item.busiStatus === '4'" @click.stop="toActive(3,item,index,'确认退号?')">退号</button> -->
        </div>
      </div>
    </div>
    <no-record :condition="registerList.length === 0" :tips="'暂无记录!'"></no-record>
  </div>
</template>
<script>
import NoRecord from '@/components/NoRecord'
import HosVoucherSelect from '@/components/hos-voucher-select'
import TimeSelect from '@/components/TimeSelect'
import { getRegisterList, getRegisterRefund, getRegisterUnlock } from '@/service/register.service'
import { getItem, setItem } from '@/utils/store'
export default {
  data: function () {
    return {
      endDate: '',
      startDate: '',
      registerList: [],
      voucher: {},
      hosInfo: {},
      regStatus: { '1': '已取消', '2': '已取消', '3': '已取消', '4': '已预约', '5': '已取消', '6': '已完成', '7': '已完成', '8': '已完成', '9': '已退号' },
      areaInfo: {},
      busiStatus: { '1': '未支付(不可支付)', '2': '未支付(可支付)', '3': '已支付(不可退费)', '4': '已支付(可退费)', '5': '已退费(已退号)', '6': '已退号(未退费)' }
    }
  },
  components: {
    NoRecord,
    HosVoucherSelect,
    TimeSelect
  },
  computed: {
    originImgUrl () {
      return this.constant.LOCAL_IMG
    }
  },
  onLoad () {
    let today = new Date()
    this.endDate = today.format('yyyy-MM-dd')
    today.setMonth(today.getMonth() - 3)
    this.startDate = today.format('yyyy-MM-dd')
  },
  onShow () {
    this.voucher = getItem('selectedVoucher')
    if (!this.voucher) {
      this.$utils.showToast('请先绑定电子健康卡')
      return
    }
    this.hosInfo = getItem('selectedHospital')
    // this.areaInfo = getItem('selectedArea')
    this.loadList()
  },
  methods: {
    selectDate (date) {
      if (date) {
        this.startDate = date.startDate
        this.endDate = date.endDate
        this.registerList = []
        this.loadList()
      }
    },
    toActive (type, item, index, tips) {
      //  取消、退号
      if (type !== 2) {
        this.$utils.showModal('提示', tips, async () => {
          //  确认按钮
          let params = {
            orgId: this.hosInfo.orgId,
            hospitalId: this.hosInfo.hospitald,
            areaId: item.areaId,
            orderId: item.orderId
          }
          if (type === 1) {
            params.cardType = this.voucher.cardType
            params.cardNo = this.voucher.cardNo
            params.orderNo = item.orderNo
            params.regId = item.regId
          }
          let res = type === 1 ? await getRegisterUnlock(params) : await getRegisterRefund(params)
          if (res.result === this.constant.RESULT_SUCCESS) {
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
          hospitalId: this.hosInfo.hospitald,
          areaId: item.areaId,
          cardType: this.voucher.cardType,
          cardNo: this.voucher.cardNo,
          payFee: item.totalFee,
          totalFee: item.totalFee,
          busiType: this.constant.BUSI_TYPE.REGISTRATION_PAYMENT,
          busiIds: [item.orderNo]
        }
        setItem('payInfo', payInfo)
        this.$utils.navigateTo('pay', { params: JSON.stringify(payInfo) })
      }
    },
    async loadList (type) {
      this.registerList = []
      let params = {
        hospitalId: this.hosInfo.hospitald,
        areaId: this.hosInfo.areaId,
        cardType: this.voucher.cardType,
        cardNo: this.voucher.cardNo,
        startDate: this.startDate,
        endDate: this.endDate
      }
      let res = await getRegisterList(params)
      if (res.result === this.constant.RESULT_SUCCESS) {
        this.forMatData(res.data)
      }
    },
    forMatData (data) {
      if (!data || data.length === 0) return
      this.registerList = []
      for (let i = 0; i < data.length; i++) {
        data[i].orderTime = (this.$utils.formatTime(data[i].orderTime)).curDate + '     ' + (this.$utils.formatTime(data[i].orderTime)).curTime
        data[i].regDate = (this.$utils.formatTime(data[i].regDate)).curDate
        this.registerList.push(data[i])
      }
    },
    goDetail (item) {
      this.$utils.navigateTo('regDetails', {params: JSON.stringify(item)})
    },
    select (e) {
      this.$utils.navigateTo(e, { waitUrl: 'noredirect' })
    }
  }
}
</script>
<style lang="scss" scoped>
.my-register {
  .tips{
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 15px;
  }
  .reg-info{
    background: #fff;
    border-bottom: 10px solid #eff2f5;
    h3{
      height: 45px;
      line-height: 45px;
      padding: 0 15px;
      border-bottom: 1px solid #DBDBDB;
    }
    .content{
      width: auto;
      padding: 0 15px;
      position: relative;
      justify-content: space-between;
      height: 80px;
      .left{
        font-size: 15px;
        p{
          color: #999999;
        }
      }
      .arrow{
        img{
          width: 8px;
          height: 13px;
        }
      }
    }
    .reg-status{
      height: 50px;
      padding:0 15px;
      width:auto;
      border-top: 1px solid #DBDBDB;
      justify-content: space-between;
      p{
        color: #51A8EC;
        font-size: 15px;
      }
      .right{
        text-align: right;
      }
      button{
        color: #fff;
        font-size: 15px;
        display: inline-block;
        width: 70px;
        height: 35px;

        border-radius: 5px;
        border: 0;

        margin-left: 10px;
        &:nth-child(1){
          background: #DBDBDB;
          box-shadow: 0 2px 4px #DBDBDB;
        }
        &:nth-child(2){
          background: #51A8EC;
          box-shadow: 0 2px 4px #51A8EC;
        }
        &:nth-child(3){
          background: #FF0000;
          box-shadow: 0 2px 4px #FF0000;
        }
      }
    }
  }
}
</style>

