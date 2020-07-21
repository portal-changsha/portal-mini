<template>
  <div class="clinic app">
    <hos-voucher-select v-on:select="select" ></hos-voucher-select>
    <time-select v-on:selectDate="selectDate"></time-select>
    <div class="clinic-info" v-for="(item,index) in rechargeList" :key="index">
      <h3 class="f3s15">订单号: {{item.orderId}}</h3>
      <div class="content row row-center">
        <div class="left">
          <p>充值时间: {{item.operateTime | formatDate}}</p>
        </div>
        <div class="rigth">
         {{item.amount | formatFee}}
        </div>
      </div>
    </div>
    <no-record :condition="rechargeList.length === 0" :tips="'暂无缴费!'"></no-record>
  </div>
</template>

<script>
import hosVoucherSelect from '@/components/hos-voucher-selcet/hos-voucher-selcet.vue'
import timeSelect from '@/components/time-select/time-select.vue'
import { getInpatientInfo, getInpatientRechargeList } from '@/services/inpatient.js'
import { getItem } from '@/utils/localStore.js'
import { showToast } from '@/utils/uniApi.js'
export default {
  data () {
    return {
      rechargeList: [],
      hosInfo: {},
      voucherInfo: {},
      areaInfo: {},
      inPatientNo: '',
      startDate: '',
      endDate: ''
    }
  },
  components: {
    hosVoucherSelect,
    timeSelect
  },
  onLoad () {
    uni.$on('backEvent', () => {
      this.initData()
    })
    this.initData()
  },
  onUnload(){
	uni.$off('backEvent')  
  },
  methods: {
    async initData () {
      this.rechargeList = []
      this.hosInfo = getItem('selectedHospital')
	  this.areaInfo = getItem('selectedArea')
      this.voucherInfo = getItem('selectedVoucher')
      if (!this.hosInfo) {
        showToast('请选择医院')
        return
      }
      if (!this.voucherInfo.cardType || !this.voucherInfo.cardNo) {
        showToast('请先绑定电子健康卡')
        return
      }
      let data = {
		orgId: this.hosInfo.orgId,
        hospitalId: this.hosInfo.id,
        cardType: this.voucherInfo.cardType,
        cardNo: this.voucherInfo.cardNo,
        areaId: this.areaInfo.areaId
      }
      getInpatientInfo(data).then(res => {
        if (res.resultCode === this.$consts.RESULT_SUCCESS) {
          this.inPatientNo = res.data[0].inPatientNo
          this.getRechargeList()
        }
      }).catch(() => {
        showToast('查找住院信息出错')
      })
    },
    getRechargeList () {
      let params = {
		orgId: this.hosInfo.orgId,
        hospitalId: this.hosInfo.id,
        areaId: this.areaInfo.areaId,
        inPatientNo: this.inPatientNo,
        startDate: this.startDate,
        endDate: this.endDate
      }
      getInpatientRechargeList(params).then(res => {
        if (res.resultCode === this.$consts.RESULT_SUCCESS) {
          this.rechargeList = res.data || []
        }
      }).catch(() => {
        this.rechargeList = []
      })
    },
    select (e) {
		this.$store.dispatch('paramStore/updateParam', {
			namespace: 'DistrictSelect',
			target: 'myRecharge',
		})
		this.$Router.push({name: e});
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
   .app{
		background: $common-background-color;
	}
  .clinic{
    min-height: 100%;
    background: rgb(239, 242, 245);
    .clinic-info{
      background: #fff;
      border-bottom: 20rpx solid #eff2f5;
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
        height: 2.25rem;
        .left{
          font-size: 0.75rem;
		  width: auto;
          p{
            color: #999999;
          }
        }
        .rigth{
          color: #FE0000;
          font-size: 0.7rem;
        }
      }
    }
  }
</style>
