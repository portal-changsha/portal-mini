<template>
  <div class="myreport app">
    <hos-voucher-select v-on:select="select" ></hos-voucher-select>
    <time-select v-on:selectDate="selectDate"></time-select>

    <div class="clinic-info" v-for="(item,index) in payList" :key="index" >
      <h3 class="f3s15">{{item.deptName}}&nbsp;&nbsp;{{item.doctName}}</h3>
      <div class="content row row-center" @click="goDetail(item)">
        <div class="left">
          <p>总金额 <span>{{item.totalFee | formatFee}}</span></p>
          <p>支付时间  {{item.recipes[0].operateTime | formatDate}}</p>
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
import hosVoucherSelect from '@/components/hos-voucher-selcet/hos-voucher-selcet.vue'
import { getClinicPaid } from '@/services/clinic.js'
import { getItem } from '@/utils/localStore.js'
import timeSelect from '@/components/time-select/time-select.vue'
import config from '@/config/index.js'
import { parseTime } from '@/utils/index.js'
export default {
  data: function () {
    return {
      endDate: '',
      startDate: '',
      payList: [],
      voucher: {},
      hosInfo: {},
      baseSrc: config.VUE_APP_IMG_URL
    }
  },
  components: {
    hosVoucherSelect,
    timeSelect
  },
  onLoad () {
    let today = new Date()
    this.endDate = parseTime(today, '{y}-{m}-{d}')
    today.setMonth(today.getMonth() - 3)
    this.startDate = parseTime(today, '{y}-{m}-{d}')
    uni.$on('backEvent', () => {
      this.initData()
    })
    this.initData()
  },
  onUnload(){
	  uni.$off('backEvent')
  },
  methods: {
    selectDate (date) {
      if (date) {
        this.startDate = date.startDate
        this.endDate = date.endDate
        this.initData()
      }
    },
    async initData () {
      this.hosInfo = getItem('selectedHospital')
      this.voucher = getItem('selectedVoucher')
      if (!this.voucher) return
      this.payList = []
      let params = {
		orgId: this.hosInfo.orgId,
        hospitalId: this.hosInfo.id,
        areaId: this.hosInfo.areaId,
        cardType: this.voucher.cardType,
        cardNo: this.voucher.cardNo,
        startDate: this.startDate,
        endDate: this.endDate
      }
      let res = await getClinicPaid(params)
      if (res.resultCode === this.$consts.RESULT_SUCCESS) {
        this.payList = res.data
      }
    },
    goDetail (item) {
	  // this.$store.dispatch('paramStore/clearParam', 'reportDetail')
      let hosInfo = this.hosInfo
      let voucher = this.voucher
      let payInfo = {
        hospitalId: hosInfo.id,
        hospitalName: hosInfo.name,
        cardType: voucher.cardType,
        cardNo: voucher.cardNo,
        holderName: voucher.holderName || '',
        visitId: item.visitId,
        payFee: item.totalFee,
        deptName: item.deptName,
        doctName: item.doctName,
        visitDate: item.visitDate,
        areaId: hosInfo.areaId,
		recipeTime: item.recipes[0].recipeTime,
		execDept: item.execDept,
		execLoaction: item.execLoaction,
		canPay: false
      }
	  this.$store.dispatch('paramStore/updateParam', {
		  namespace: 'reportDetail',
		  queryParams: payInfo
	  })
	  console.log(payInfo)
	  this.$Router.push({ name: 'clinicDetail' })
      // let unpayList = item.recipes
	  
      // this.$utils.navigateTo('clinicUnpayDetail', { unpayInfo: JSON.stringify(unpayInfo), unpayList: JSON.stringify(unpayList), noPay: true })
    },
    select (e) {
		this.$store.dispatch('paramStore/updateParam', {
			namespace: 'DistrictSelect',
			target: 'myPay',
		})
		this.$Router.push({name: e});
    }
  }
}
</script>
<style lang="scss" scoped>
.app{
	background: $common-background-color;
}
.myreport{
  min-height: 100%;
  background: rgb(239, 242, 245);
  .tips{
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    color: #333;
    font-size: 0.75rem;
  }
  .clinic-info{
    background: #fff;
    margin-bottom: 0.5rem;
    h3{
      height: 2.25rem;
      line-height: 2.25rem;
      padding: 0 0.75rem;
      border-bottom: 1px solid #DBDBDB;
	  margin: 0;
	  text-align: left;
    }
    .content{
      width: auto;
      padding: 0 0.75rem;
      position: relative;
      justify-content: space-between;
      height: 4rem;
      .left{
        font-size: 0.75rem;
		width: auto;
        p{
          color: #999999;
		  span{
			  color: #ff0000;
			  padding-left: .25rem;;
		  }
        }
      }
      .arrow{
        img{
          width: 0.4rem;
          height: 0.65rem;
        }
      }
    }
    .reg-status{
      height: 2.5rem;
      padding:0 0.75rem;
      width:auto;
      border-top: 1px solid #DBDBDB;
      justify-content: space-between;
      p{
        color: #51A8EC;
        font-size: 0.75rem;
      }
      .right{
        text-align: right;
      }
      button{
        color: #fff;
        font-size: 0.75rem;
        display: inline-block;
        width: 3.5rem;
        height: 1.75rem;

        border-radius: 0.25rem;
        border: 0;

        margin-left: 0.5rem;
        &:nth-child(1){
          background: #DBDBDB;
          box-shadow: 0 0.1rem 0.2rem #DBDBDB;
        }
        &:nth-child(2){
          background: #51A8EC;
          box-shadow: 0 0.1rem 0.2rem #51A8EC;
        }
        &:nth-child(3){
          background: #FF0000;
          box-shadow: 0 0.1rem 0.2rem #FF0000;
        }
      }
    }
  }
}
</style>