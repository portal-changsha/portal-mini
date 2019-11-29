<template>
  <div class="clinic">
    <Hos-Voucher-Select v-on:select="select" ></Hos-Voucher-Select>
    <TimeSelect v-on:selectDate="selectDate"></TimeSelect>
    <div class="clinic-info" v-for="(unpay,index) in unpayList" :key="index" @click="goDetail(unpay)">
      <h3 class="f3s15">{{unpay.deptName}}</h3>
      <div class="content row row-center">
        <div class="left">
          <p>总金额 <span>{{unpay.totalFee / 100}}元</span> </p>
          <p>开单时间 {{unpay.visitDate}}</p>
        </div>
        <div class="rigth">
          <button @click.stop="toPay(unpay)">缴费</button>
        </div>
        <div class="arrow">
          <img :src="baseSrc + 'more-arrow.png'" alt="">
        </div>
      </div>
    </div>
    <no-record :condition="unpayList.length === 0" :tips="'暂无缴费!'"></no-record>
  </div>
</template>

<script>
import NoRecord from '@/components/NoRecord'
import HosVoucherSelect from '@/components/hos-voucher-select'
import { getClinicUnpay } from '@/service/clinic.service'
import { getItem, setItem } from '@/utils/store'
import TimeSelect from '@/components/TimeSelect'
import eventLister from '@/service/eventListener'
export default {
  data () {
    return {
      unpayList: [],
      hosInfo: {},
      voucherInfo: {},
      areaInfo: {},
      baseSrc: this.constant.LOCAL_IMG
    }
  },
  components: {
    HosVoucherSelect,
    NoRecord,
    TimeSelect
  },
  onLoad () {
    eventLister.$on('backEvent', () => {
      this.getClinicUnpayInfo()
    })
    this.getClinicUnpayInfo()
  },
  methods: {
    async getClinicUnpayInfo () {
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
      getClinicUnpay(data).then(res => {
        this.unpayList = res.data || []
      }).catch(() => {
        this.unpayList = []
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
    async toPay (item) {
      let busiIds = await this.getBusiIds(item.recipes)
      let data = {
        cardType: this.voucherInfo.cardType,
        cardNo: this.voucherInfo.cardNo,
        payFee: item.totalFee,
        busiType: this.constant.BUSI_TYPE.OUT_PATIENT_PAYMENT,
        busiIds: busiIds,
        hospitalId: this.hosInfo.hospitald,
        areaId: this.hosInfo.areaId
      }
      setItem('payInfo', data)
      this.$utils.navigateTo('pay', {params: JSON.stringify(data)})
    },
    getBusiIds (arr) {
      return new Promise((resolve) => {
        let busiIds = []
        for (let i = 0; i < arr.length; i++) {
          busiIds.push(arr[i].recipeId)
        }
        resolve(busiIds)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .clinic{
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
        height: 80px;
        .left{
          font-size: 15px;
          p{
            color: #999999;
          }
          span{
            color: #FE0000;
          }
        }
        .rigth{
          position: absolute;
          right:33px;
          button{
            color: #fff;
            font-size: 15px;
            height: 40px;
            width: 70px;
            background: #51A8EC;
            border-radius: 5px;
          }
        }
        .arrow{
          img{
            width: 8px;
            height: 13px;
          }
        }
      }
    }
  }
</style>
