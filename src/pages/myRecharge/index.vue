<template>
  <div class="clinic">
    <Hos-Voucher-Select v-on:select="select" ></Hos-Voucher-Select>
    <TimeSelect v-on:selectDate="selectDate"></TimeSelect>
    <div class="clinic-info" v-for="(item,index) in rechargeList" :key="index" @click="goDetail(unpay)">
      <h3 class="f3s15">订单号: {{item.orderId}}</h3>
      <div class="content row row-center">
        <div class="left">
          <p>充值时间 {{item.operateTime}}</p>
        </div>
        <div class="rigth">
         {{item.amount / 100}}元
        </div>
      </div>
    </div>
    <no-record :condition="rechargeList.length === 0" :tips="'暂无缴费!'"></no-record>
  </div>
</template>

<script>
import NoRecord from '@/components/NoRecord'
import HosVoucherSelect from '@/components/hos-voucher-select'
import { getInpatientInfo, getInpatientRechargeList } from '@/service/inpatient.service'
import { getItem } from '@/utils/store'
import TimeSelect from '@/components/TimeSelect'
import eventLister from '@/service/eventListener'
export default {
  data () {
    return {
      rechargeList: [],
      hosInfo: {},
      voucherInfo: {},
      areaInfo: {},
      baseSrc: this.constant.LOCAL_IMG,
      inPatientNo: '',
      startDate: '',
      endDate: ''
    }
  },
  components: {
    HosVoucherSelect,
    NoRecord,
    TimeSelect
  },
  onLoad () {
    eventLister.$on('backEvent', () => {
      this.getInfo()
    })
    this.getInfo()
  },
  methods: {
    async getInfo () {
      this.rechargeList = []
      this.hosInfo = getItem('selectedHospital')
      this.voucherInfo = getItem('selectedVoucher')
      if (!this.hosInfo || !this.hosInfo.hospitald) {
        this.$utils.showToast('请选择医院')
        return
      }
      if (!this.voucherInfo.cardType || !this.voucherInfo.cardNo) {
        this.$utils.showToast('请先绑定电子健康卡')
        return
      }
      let data = {
        hospitalId: this.hosInfo.hospitald,
        cardType: this.voucherInfo.cardType,
        cardNo: this.voucherInfo.cardNo,
        areaId: this.hosInfo.areaId
      }
      getInpatientInfo(data).then(res => {
        if (res.result === this.constant.RESULT_SUCCESS) {
          this.inPatientNo = res.data[0].inPatientNo
          this.getRechargeList()
        } else {
          this.$utils.showToast('查找住院信息出错')
        }
      }).catch(() => {
        this.$utils.showToast('查找住院信息出错')
      })
    },
    getRechargeList () {
      let params = {
        hospitalId: this.hosInfo.hospitald,
        areaId: this.hosInfo.areaId,
        inPatientNo: this.inPatientNo,
        startDate: this.startDate,
        endDate: this.endDate
      }
      getInpatientRechargeList(params).then(res => {
        if (res.result === this.constant.RESULT_SUCCESS) {
          this.rechargeList = res.data || []
          this.rechargeList.forEach(item => {
            item.operateTime = this.$utils.formatpayDate(item.operateTime)
          })
        }
      }).catch(() => {
        this.rechargeList = []
      })
    },
    // 去未缴费详单
    goDetail (unpay) {
      let hosInfo = this.hosInfo
      let voucher = this.voucherInfo
      let unpayInfo = {
        hospitalId: hosInfo.hospitald,
        hospitalName: hosInfo.hospitalName,
        cardType: voucher.cardType,
        cardNo: voucher.cardNo ? voucher.cardNo : '0000000',
        holderName: voucher.holderName ? voucher.holderName : '',
        visitId: unpay.visitId,
        payFee: unpay.totalFee,
        deptName: unpay.deptName,
        doctName: unpay.doctName,
        canPay: unpay.canPay,
        visitName: unpay.visitName,
        visitDate: unpay.visitDate,
        areaId: this.hosInfo.areaId
      }
      let unpayList = unpay.recipes
      this.$utils.navigateTo('clinicUnpayDetail', {unpayInfo: JSON.stringify(unpayInfo), unpayList: JSON.stringify(unpayList)})
    },
    select (e) {
      this.$utils.navigateTo(e, { waitUrl: 'noredirect' })
    },
    selectDate (time) {
      this.startDate = time.startDate
      this.endDate = time.endDate
      this.getRechargeList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .clinic{
    min-height: 100%;
    background: rgb(239, 242, 245);
    .clinic-info{
      background: #fff;
      border-bottom: 20rpx solid #eff2f5;
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
        height: 45px;
        .left{
          font-size: 15px;
          p{
            color: #999999;
          }
        }
        .rigth{
          color: #FE0000;
          font-size: 14px;
        }
      }
    }
  }
</style>
