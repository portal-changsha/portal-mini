<template>
  <div class="myreport">
    <Hos-Voucher-Select v-on:select="select" ></Hos-Voucher-Select>
    <TimeSelect v-on:selectDate="selectDate"></TimeSelect>

    <div class="clinic-info" v-for="(item,index) in payList" :key="index" >
      <h3 class="f3s15">{{item.deptName}}&nbsp;&nbsp;{{item.doctName}}&nbsp;&nbsp;({{item.rankName}}) </h3>
      <div class="content row row-center" @click="goDetail(item)">
        <div class="left">
          <p>总金额 {{item.copy_totalFee}} </p>
          <p>开单时间  {{item.copy_visitDate}}</p>
        </div>
        <div class="arrow">
          <img :src="baseSrc + 'more-arrow.png'" alt="">
        </div>
      </div>
    </div>
    <no-record :condition="payList.length === 0" :tips="'抱歉，没有缴费记录!'"></no-record>
  </div>
</template>
<script>
import NoRecord from '@/components/NoRecord'
import HosVoucherSelect from '@/components/hos-voucher-select'
import { getClinicPaid } from '@/service/clinic.service'
import { getItem } from '@/utils/store'
import TimeSelect from '@/components/TimeSelect'
import eventLister from '@/service/eventListener'
export default {
  data: function () {
    return {
      endDate: '',
      startDate: '',
      payList: [],
      voucher: {},
      hosInfo: {},
      baseSrc: this.constant.LOCAL_IMG
    }
  },
  components: {
    NoRecord,
    HosVoucherSelect,
    TimeSelect
  },
  onLoad () {
    let today = new Date()
    this.endDate = today.format('yyyy-MM-dd')
    today.setMonth(today.getMonth() - 3)
    this.startDate = today.format('yyyy-MM-dd')
    eventLister.$on('backEvent', () => {
      this.loadList()
    })
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
    async loadList () {
      this.hosInfo = getItem('selectedHospital')
      this.voucher = getItem('selectedVoucher')
      if (!this.voucher) return
      this.payList = []
      let params = {
        hospitalId: this.hosInfo.hospitald,
        areaId: this.hosInfo.areaId,
        cardType: this.voucher.cardType,
        cardNo: this.voucher.cardNo,
        startDate: this.startDate,
        endDate: this.endDate
      }
      let res = await getClinicPaid(params)
      if (res.result === '1') {
        this.forMatData(res.data)
      }
    },
    forMatData (data) {
      if (!data || data.length === 0) return
      this.payList = []

      for (let i = 0; i < data.length; i++) {
        let recipeDatas = data[i].recipes
        for (let j = 0; j < recipeDatas.length; j++) {
          // 处理items中默认展开
          recipeDatas[j].showDetailInfo = false
          // 统计门诊处方金额
          // if (recipeDatas[j].canPay === true) {
          //     canPayTotalFee = canPayTotalFee + Number(recipeDatas[j].recipeFee)
          //     busiIds.push(recipeDatas[j].recipeId)
          //     datas[i].canPay = true
          // }
          // newRecipes.push(recipeDatas[j])
          // this.busiIds = busiIds
        }
        data[i].copy_totalFee = this.$utils.formatFee(data[i].totalFee)
        data[i].copy_visitDate = this.$utils.formatpayDate(data[i].visitDate)

        this.payList.push(data[i])
      }
    },
    goDetail (item) {
      let hosInfo = this.hosInfo
      let voucher = this.voucher
      let unpayInfo = {
        hospitalId: hosInfo.hospitald,
        hospitalName: hosInfo.hospitalName,
        cardType: voucher.cardType,
        cardNo: voucher.cardNo ? voucher.cardNo : '0000000',
        holderName: voucher.holderName ? voucher.holderName : '',
        visitId: item.visitId,
        payFee: item.totalFee,
        deptName: item.deptName,
        doctName: item.doctName,
        canPay: item.canPay,
        visitName: item.visitName,
        visitDate: item.visitDate,
        areaId: this.hosInfo.areaId
      }
      let unpayList = item.recipes
      this.$utils.navigateTo('clinicUnpayDetail', { unpayInfo: JSON.stringify(unpayInfo), unpayList: JSON.stringify(unpayList), noPay: true })
    },
    select (e) {
      this.$utils.navigateTo(e, { waitUrl: 'noredirect' })
    }
  }
}
</script>
<style lang="scss" scoped>
.myreport{
  .tips{
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 15px;
  }
  .clinic-info{
    background: #fff;
    margin-bottom: 10px;
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

