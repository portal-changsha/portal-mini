<template>
  <div class="clinic app">
    <hos-voucher-select v-on:select="select" ></hos-voucher-select>
    <!-- <time-select v-on:selectDate="selectDate"></time-select> -->
    <div class="clinic-info" v-for="(unpay,index) in unpayList" :key="index" @click="goDetail(unpay)">
      <h3 class="f3s15">{{unpay.deptName}}</h3>
      <div class="content row row-center">
        <div class="left">
          <p>总金额 <span>{{unpay.totalFee | formatFee}}</span> </p>
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
import hosVoucherSelect from '@/components/hos-voucher-selcet/hos-voucher-selcet.vue'
import { getClinicList } from '@/services/clinic.js'
import { getItem, setItem } from '@/utils/localStore.js'
import timeSelect from '@/components/time-select/time-select.vue'
import config from '@/config/index.js'
export default {
  data () {
    return {
      unpayList: [],
      hosInfo: {},
      voucherInfo: {},
      areaInfo: {},
      baseSrc: config.VUE_APP_IMG_URL
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
      this.hosInfo = getItem('selectedHospital')
      this.voucherInfo = getItem('selectedVoucher')
      let data = {
		orgId: this.hosInfo.orgId,
        hospitalId: this.hosInfo.id,
        cardType: this.voucherInfo.cardType,
        cardNo: this.voucherInfo.cardNo,
        areaId: this.hosInfo.areaId
      }
      getClinicList(data).then(res => {
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
        hospitalId: hosInfo.id,
        hospitalName: hosInfo.name,
        cardType: voucher.cardType,
        cardNo: voucher.cardNo,
        holderName: voucher.holderName || '',
        visitId: unpay.visitId,
        payFee: unpay.totalFee,
        deptName: unpay.deptName,
        doctName: unpay.doctName,
        canPay: true,
        visitName: unpay.visitName,
        visitDate: unpay.visitDate,
        areaId: hosInfo.areaId,
		recipeTime: unpay.recipes[0].recipeTime,
      }
	  this.$store.dispatch('paramStore/updateParam', {
		namespace: 'reportDetail',
		queryParams: unpayInfo
	  })
	  this.$Router.push({ name: 'clinicDetail' })
    },
    select (e) {
      this.$store.dispatch('paramStore/updateParam', {
      	namespace: 'DistrictSelect',
      	target: 'clinicUnpayList',
      })
      this.$Router.push({name: e})
    },
    async toPay (item) {
      let busiIds = await this.getBusiIds(item.recipes)
      let data = {
        cardType: this.voucherInfo.cardType,
        cardNo: this.voucherInfo.cardNo,
        payFee: item.totalFee,
        busiType: this.$consts.BUSI_TYPE.OUT_PATIENT_PAYMENT,
        busiIds: busiIds,
      }
	  this.$store.dispatch('paramStore/updateParam', {
	  		namespace: 'pay',
	  		payInfo: data
	  })
	  this.$Router.push({name: 'pay'})
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
  .app{
	  background: $common-background-color;
  }
  .clinic{
    min-height: 100%;
    background: rgb(239, 242, 245);
    .clinic-info{
      background: #fff;
      margin-top: .5rem;
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
				padding-left: 0.25rem;
			}
          }
          span{
            color: #FE0000;
          }
        }
        .rigth{
          position: absolute;
          right:1.65rem;
          button{
            color: #fff;
            font-size: 0.75rem;
            height: 2rem;
            width: 3.5rem;
            background: #51A8EC;
            border-radius: 0.25rem;
          }
        }
        .arrow{
          img{
            width: 0.4rem;
            height: 0.65rem;
          }
        }
      }
    }
  }
</style>
