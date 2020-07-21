<template>
  <div class="myreport app">
    <hos-voucher-select v-on:select="select" ></hos-voucher-select>

    <div class="tips row">
      <div>
        <img v-if="baseSrc" :src="baseSrc + 'tips.png'" alt="">
      </div>
      <p>温馨提示：1.特殊项目（如HIV、梅毒、微生物项目）不能查询。2.查询结果不作为任何医学凭据，请以医院打印报告单为准。</p>
    </div>
    <tabs :tabArr="tab" v-on:changeTab="changeTab"></tabs>

    <div class="clinic-info" v-for="(item,index) in reportList" :key="index" >
      <h3 class="f3s15">{{item.itemName}} </h3>
      <div class="content row row-center" @click="goDetail(item)">
        <div class="left">
          <p v-if="item.deptName && item.repDoctName">{{ item.deptName | formatDeptName }}/{{item.repDoctName}} </p>
          <p>完成时间  {{item.time | formatDate}}</p>
        </div>
        <div class="arrow">
          <img :src="baseSrc + 'more-arrow.png'" alt="">
        </div>
      </div>
    </div>
    <no-record :condition="reportList.length === 0" :tips="'暂无报告!'"></no-record>
  </div>
</template>
<script>
import tabs from '@/components/tabs/tabs.vue'
import hosVoucherSelect from '@/components/hos-voucher-selcet/hos-voucher-selcet.vue'
import { getLabList, getExamList } from '@/services/report.js'
import { getItem } from '@/utils/localStore.js'
import config from '@/config/index.js'
import { parseTime } from '@/utils/index.js'
export default {
  data: function () {
    return {
      tab: [{name: '检验报告'}, {name: '检查报告'}],
      tabIndex: 0,
      endDate: '',
      startDate: '',
      reportList: [],
      voucher: {},
      hosInfo: {},
      areaInfo: {},
      baseSrc: config.VUE_APP_IMG_URL
    }
  },
  components: {
    tabs,
    hosVoucherSelect
  },
  onLoad () {
	let today = new Date()
	this.endDate = parseTime(today, '{y}-{m}-{d}')
	today.setMonth(today.getDate() - 14)
	this.startDate = parseTime(today, '{y}-{m}-{d}')
    uni.$on('backEvent', () => {
      this.initData(this.tabIndex)
    })
    this.initData(this.tabIndex)
  },
  onUnload(){
	uni.$off('backEvent')
  },
  methods: {
    async initData (type) {
      this.voucher = getItem('selectedVoucher')
      this.hosInfo = getItem('selectedHospital')
	  console.log(this.hosInfo)
      let data = {
		orgId: this.hosInfo.orgId,
        hospitalId: this.hosInfo.id,
        cardType: this.voucher.cardType,
        cardNo: this.voucher.cardNo,
        startDate: this.startDate,
        endDate: this.endDate,
        areaId: this.hosInfo.areaId
      }
      let res = type === 0 ? await getLabList(data) : await getExamList(data)
      if (res.resultCode === this.$consts.RESULT_SUCCESS) {
        this.forMatData(res.data)
      } else {
        this.reportList = []
      }
    },
    forMatData (data) {
      this.reportList = []
      if (!data || data.length === 0) return
      for (let i = 0; i < data.length; i++) {
        let temp = {
          id: data[i].examId ? data[i].examId : data[i].labId,
          time: data[i].examTime || data[i].labTime,
          itemName: data[i].examItem ? data[i].examItem : data[i].labItem,
          repDoctName: data[i].repDoctName,
          deptName: data[i].deptName,
          labType: data[i].labType ? data[i].labType : ''
        }
        this.reportList.push(temp)
      }
    },
    goDetail (item) {
		//	清空之前的数据
	  this.$store.dispatch('paramStore/clearParam', 'reportDetail')
      let params = {
		orgId: this.hosInfo.orgId,
        hospitalId: this.hosInfo.id,
        areaId: this.hosInfo.areaId,
        cardType: this.voucher.cardType,
        cardNo: this.voucher.cardNo,
        startDate: this.startDate,
        endDate: this.endDate,
        hospitalName: this.hosInfo.name
      }
      if (this.tabIndex === 0) {
        params.labId = item.id
        params.labItem = item.itemName
        params.labTime = item.time
      } else {
        params.examId = item.id
        params.examItem = item.itemName
        params.examTime = item.time
      }
	  this.$store.dispatch('paramStore/updateParam', {
		  namespace: 'reportDetail',
		  queryParams: params
	  })
	  const routeName = this.tabIndex === 0 ? 'labDetail' : 'examDetail'
	  this.$Router.push({name: routeName})
    },
    changeTab (e) {
      if (this.tabIndex === e) return
      this.tabIndex = e
      this.initData(e)
    },
    select (e) {
		this.$store.dispatch('paramStore/updateParam', {
			namespace: 'DistrictSelect',
			target: 'myReport',
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
    padding: 0.75rem 0.35rem 0.6rem 0.55rem;
    width:auto;
    div{
      display: inline-block;
      img{
        height: 0.85rem;
        width: 0.85rem;
        display: block;
      }
    }
    p{
      color: #51A8EC;
      font-size: 0.65rem;
      padding-left: 0.25rem;
    }

  }
.clinic-info{
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
  }
}
</style>

