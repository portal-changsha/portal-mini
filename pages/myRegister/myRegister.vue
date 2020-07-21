<template>
  <div class="my-register app">
    <hos-voucher-select v-on:select="select" ></hos-voucher-select>
    <time-select v-on:selectDate="selectDate"></time-select>
    <div class="reg-info" v-for="(item,index) in registerList" :key="index" >
      <h3 class="f3s15">{{item.deptName}}&nbsp;&nbsp;{{item.doctName}}&nbsp;&nbsp;({{item.rankName}}) </h3>
      <div class="content row row-center" @click="goDetail(item)">
        <div class="left">
          <p>挂号时间 {{ item.orderTime | formatDate }} </p>
          <p>就诊时间  {{item.regDate | formatDate('myRegister')}} {{item.phaseDesc}}</p>
        </div>
        <div class="arrow">
          <img :src="originImgUrl + 'more-arrow.png'" alt="">
        </div>
      </div>
      <div class="reg-status row row-center">
		<p v-if="item.regStatus === '4' && (item.takeType === '2' || item.busiStatus !== '2') " class="col order-status f-strong">已预约</p>
		<p v-if="item.regStatus === '1'  || item.regStatus === '2' || item.regStatus === '3' || item.regStatus === '5'" class="col order-status f-minor">已取消</p>
        <p v-if="item.regStatus === '6' || item.regStatus === '7' || item.regStatus === '8'" class="col order-status f-minor">已完成</p>
        <p v-if="item.regStatus === '9' &&  (item.busiStatus === '5' || item.busiStatus === '6')" class="col order-status f-minor">已退号</p>
		<div class="col right">
		  <button v-if="item.regStatus === '4' && (item.busiStatus === '1' || item.busiStatus === '2')" @click.stop="toActive(item, index, 'cancel')">取消</button>
		  <button v-if="item.takeType !== '2' && item.regStatus === '4' && item.busiStatus === '2' " @click.stop="goPay(item)">缴费</button>
		  <button v-if="item.busiStatus === '4' && item.regStatus === '4'" @click.stop="toActive(item, index, 'fade')">退号</button>
		</div>
      </div>
    </div>
    <no-record :condition="registerList.length === 0" :tips="'暂无挂号记录!'"></no-record>
  </div>
</template>
<script>
import hosVoucherSelect from '@/components/hos-voucher-selcet/hos-voucher-selcet.vue'
import timeSelect from '@/components/time-select/time-select.vue'
import { getRegisterLists, unLock, refund, loadOutOrder, getHosAppid } from '@/services/register.js'
import { getItem, setItem } from '@/utils/localStore.js'
import config from '@/config/index.js'
import { parseTime } from '@/utils/index.js'
import { showToast, showModal } from '@/utils/uniApi.js'
import payMixin from '@/mixins/payMixin.js'
import registerMixin from '@/mixins/registerMixin.js'

export default {
  mixins: [payMixin, registerMixin],
  data: function () {
    return {
      endDate: '',
      startDate: '',
      registerList: [],
	  selectedReg: {},
	  selectedIndex: 0
    }
  },
  components: {
    hosVoucherSelect,
    timeSelect
  },
  computed: {
    originImgUrl () {
      return config.VUE_APP_IMG_URL
    }
  },
  onLoad () {
    let today = new Date()
    this.endDate = parseTime(today, '{y}-{m}-{d}')
    today.setMonth(today.getMonth() - 3)
    this.startDate = parseTime(today, '{y}-{m}-{d}')
	this.initData()
	uni.$on('backEvent', () => {
		this.initData()
	})
  },
  onUnload(){
	uni.$off('backEvent')  
  },
  methods: {
    selectDate (date) {
      if (date) {
        this.startDate = date.startDate
        this.endDate = date.endDate
        this.registerList = []
        this.initData()
      }
    },
    async initData (type) {
	  this.voucher = getItem('selectedVoucher')
      this.hosInfo = getItem('selectedHospital')
	  this.areaInfo = getItem('selectedArea')
      this.registerList = []
      let params = {
		orgId: this.hosInfo.orgId,
        hospitalId: this.hosInfo.id,
		areaId: this.areaInfo.areaId,
        cardType: this.voucher.cardType,
        cardNo: this.voucher.cardNo,
        startDate: this.startDate,
        endDate: this.endDate
      }
      let res = await getRegisterLists(params)
	  console.log(res)
      if (res.resultCode === this.$consts.RESULT_SUCCESS) {
        this.registerList = res.data
      }
    },
    goDetail (item) {
		// let params = {
		// 	orgId: this.hosInfo.orgId,
		// 	hospitalId: this.hosInfo.id,
		// 	cardType: this.voucher.cardType,
		// 	cardNo: this.voucher.cardNo,
		// 	startDate: this.startDate,
		// 	endDate: this.endDate,
		// 	regId: item.regId
		// }
		this.$store.dispatch('paramStore/updateParam', {
			namespace: 'reportDetail',
			queryParams: item
		})
		this.$Router.push({name: 'regDetail'})
    },
	// 去缴费
	goPay(item){
		const busiType = this.$consts.BUSI_TYPE.REGISTRATION_PAYMENT
		//判断是否0元需求
		if (parseFloat(item.payFee) <= 0) {
			this.createOrderId(item, busiType).then(() => {
				this.$Router.push({name: 'payResult'})
			})
			return;
		}
		//挂号不缴费，取号缴费
		if (item.takeType === '2') {
			this.bookingPay(item, busiType)
			return
		}
		this.getPayConfig(item, busiType).then(() => {
      this.$Router.push({name: 'pay'})
    })
	},
	
    select (e) {
		this.$store.dispatch('paramStore/updateParam', {
			namespace: 'DistrictSelect',
			target: 'myRegister',
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
.my-register {
  .tips{
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    color: #333;
    font-size: 0.75rem;
  }
  .reg-info{
    background: #fff;
	margin-top: 0.5rem;
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

