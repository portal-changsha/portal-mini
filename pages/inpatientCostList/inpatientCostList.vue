<template>
  <div class="inpatient-cost app">
    <hos-voucher-select v-on:select="select" ></hos-voucher-select>
    <time-select v-on:selectDate="selectDate"></time-select>
 
    <div style="margin-bottom:55px;">
      <div class="cost-detail" v-for="(item,index) in inpatientCostList" :key="index">
        <div class="row row-center title">
          <div class="project">费用发生时间：{{item.day}}</div>
          <p class="price">{{item.totalFee /100}}元</p>
        </div>
        <div class="content" v-for="(subItem,i) in item.rows" :key="i">
          <p class="content-name">{{subItem.itemName}}<span v-if="subItem.specs" style="color: #DBDBDB;">/规格({{subItem.specs}})</span></p>
          <div style="padding: 0 .75rem;">
			  <div class="content-detail row row-center">
			    <div class="col">
			      <p>单价</p>
			      <p>{{subItem.price /100}}元</p>
			    </div>
			    <div class="col">
			      <p>数量</p>
			      <p>{{subItem.qty}}</p>
			    </div>
			    <div class="col">
			      <p>总价</p>
			      <p>{{subItem.totalFee /100 }}元</p>
			    </div>
			  </div>
		  </div>
        </div>
      </div>
    </div>

    <div v-if="inpatientInfoList.length === 0">
      <no-record :condition="inpatientInfoList.length === 0" :tips="'抱歉,没有查到您的住院信息!'"></no-record>
    </div>
    <div v-else>
      <no-record :condition="inpatientCostList.length === 0" :tips="'暂无费用记录'"></no-record>
    </div>
  </div>
</template>
<script>
  import hosVoucherSelect from '@/components/hos-voucher-selcet/hos-voucher-selcet.vue'
  import timeSelect from '@/components/time-select/time-select.vue'
  import { getInpatientInfo, getCostList } from '@/services/inpatient.js'
  import { getItem, setItem } from '@/utils/localStore.js'
  import { showToast, showModal } from '@/utils/uniApi.js'
  import { parseTime } from '@/utils/index.js'
  
  export default {
    data() {
      return {
        endDate: '',
        startDate: '',
        inpatientCostList: [],
        inpatientInfoList: [],
        inpatientInfo: {},
        tips: '抱歉,没有查到您的住院信息!',
        voucher: {},
        hosInfo: {},
		areaInfo: {}
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
	  this.initData()
	  uni.$on('backEvent', () => {
		  this.initData()
	  })
    },
	onUnload(){
		uni.$off('backEvent')
	},
    methods: {
		initData(){
			console.log('init...')
			this.voucher = getItem('selectedVoucher')
			if (!this.voucher) {
				showToast('请先绑定电子健康卡')
				return
			}
			this.hosInfo = getItem('selectedHospital')
			this.areaInfo = getItem('selectedArea')
			
			console.log(this.hosInfo)
			this.loadInpatientInfo()
		},
      async loadInpatientInfo () {
        let params = {
		  orgId: this.hosInfo.orgId,
          hospitalId: this.hosInfo.id,
          areaId: this.areaInfo.areaId,
          cardType: this.voucher.cardType,
          cardNo: this.voucher.cardNo
        }
        let res = await getInpatientInfo(params)
        if (res.resultCode === this.$consts.RESULT_SUCCESS) {
          this.forMatInpatientInfoData(res.data)
          this.loadList()
        }
      },
      forMatInpatientInfoData (data) {
        if (data.length === 0 || data[0].status === '1') {
          return
        }
        // 防止数组越界
        this.inpatientInfoList = data
        this.inpatientInfo = this.inpatientInfoList[0]
      },
      selectDate (date) {
        if (date) {
          this.startDate = date.startDate
          this.endDate = date.endDate
          this.inpatientCostList = []
          this.loadList()
        }
      },
      async loadList (type) {
        this.inpatientCostList = []
        let params = {
		  orgId: this.hosInfo.orgId,
          hospitalId: this.hosInfo.id,
          areaId: this.areaInfo.areaId,
          cardType: this.voucher.cardType,
          cardNo: this.voucher.cardNo,
          startDate: this.startDate,
          endDate: this.endDate,
          inPatientNo: this.inpatientInfo.inPatientNo,
        }
		  console.log(params)
        let res = await getCostList(params)
        if (res.resultCode === this.$consts.RESULT_SUCCESS) {
          this.inpatientCostList = res.data.rows
          console.log(JSON.stringify(this.inpatientCostList.length))
          this.forMatData(res.data.rows)
        }
      },
      forMatData (data) {
        if (!data || data.length === 0) return
        this.inpatientCostList = []
        for (let i = 0; i < data.length; i++) {
          data[i].operTime = this.formatTime(data[i].operTime)
        }

        let days = []
        for (let i = 0; i < data.length; i++) {
          let dayCostArr = []
          let dayTotalFee = 0

          if (days.indexOf(data[i].operTime) === -1) {
            for (let j = 0; j < data.length; j++) {
              if (data[i].operTime === data[j].operTime) {
                dayCostArr.push(data[j])
                dayTotalFee += parseInt(data[j].totalFee)
              }
            }
            days.push(data[i].operTime)
            let rowCost = { 'day': data[i].operTime, 'totalFee': dayTotalFee, 'rows': dayCostArr }
            this.inpatientCostList.push(rowCost)
          }
        }

        function compare (a, b) {
          return new Date(a.day).getTime() - new Date(b.day).getTime()
        }

        this.inpatientCostList.sort(compare)
        console.log(JSON.stringify(days))
        console.log(JSON.stringify(this.inpatientCostList))
      },
      formatTime (time) {
        let date = new Date(time)
        let month = (date.getMonth() + 1 + '').length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 + ''
        let day = (date.getDate() + '').length === 1 ? '0' + date.getDate() : date.getDate() + ''
        return date.getFullYear() + '-' + month + '-' + day
      },
      select (e) {
		  this.$store.dispatch('paramStore/updateParam', {
		  	namespace: 'DistrictSelect',
		  	target: 'hospitalCostList',
		  })
		  this.$Router.push({name: e});
      }
    }
  }
</script>
<style lang="scss" scoped>
	.row{
		padding: 0;
	}
	.app{
		background: $common-background-color;
	}
  .inpatient-cost {
    .tips{
      text-align: center;
      height: 2rem;
      line-height: 2rem;
      color: #333;
      font-size: 0.75rem;
    }
    .inpatient-info{
      background: #fff;
      border-bottom: 0.5rem solid #eff2f5;
      h3{
        height: 2.25rem;
        line-height: 2.25rem;
        padding: 0 0.75rem;
        border-bottom: 1px solid #DBDBDB;
      }
      .content{
        width: auto;
        padding: 0 0.75rem;
        position: relative;
        justify-content: space-between;
        height: 80px;
        .left{
          font-size: 0.75rem;
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
      .project{
        color: #51A8EC;
        font-size: 0.75rem;
      }
      .price{
        color: #FF0000;
        font-size: 0.75rem;
        position: absolute;
        right: 1.65rem;
      }
    }
  }
  .cost-detail{
	  margin-bottom: 0.5rem;
    .title{
      justify-content: space-between;
      position: relative;
      padding: 0 0.75rem;
      width: auto;
      height: 2.5rem;
      background:rgba(254,255,255,1);
      box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
      .project{
        color: #51A8EC;
        font-size: 0.75rem;
      }
      .price{
        color: #FF0000;
        font-size: 0.75rem;
        position: absolute;
        right: 1.65rem;
      }
      .arrow{
        img{
          width: 0.65rem;
          height: 8px;
          display: block;
        }
      }
    }
    .content{
      padding-bottom: 0.5rem;
      .content-name{
        padding: 0 0.75rem;
        height: 2rem;
        line-height: 40px;
        color: #222222;
        font-size: 0.75rem;
        border-bottom: 1px solid #DBDBDB;
        span{
          color: #999999;
          font-size: 0.75rem;
        }
      }
      .content-detail{
        height: 3rem;
		background: #f8f8f8;
        .col{
          text-align: center;
          p:nth-child(1){
            color: #999;
            font-size: 0.75rem;
          }
          p:nth-child(2){
            color: #222;
            font-size: 0.75rem;
          }
        }
      }
    }
    .trans_arrow{
      transform: rotate(180deg)
    }
  }
</style>

