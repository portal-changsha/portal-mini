<template>
  <div class="myreport">
    <Hos-Voucher-Select v-on:select="select" ></Hos-Voucher-Select>

    <div class="tips row">
      <div>
        <img v-if="baseSrc" :src="baseSrc + 'tips.png'" alt="">
      </div>
      <p>温馨提示：1.特殊项目（如HIV、梅毒、微生物项目）不能查询。2.查询结果不作为任何医学凭据，请以医院打印报告单为准。</p>
    </div>
    <tabs :tabArr="tab" v-on:changeTab="changeTab"></tabs>

    <div class="clinic-info" v-for="(item,index) in reprotList" :key="index" >
      <h3 class="f3s15">{{item.itemName}} </h3>
      <div class="content row row-center" @click="goDetail(item)">
        <div class="left">
          <p>{{item.deptName}}/{{item.repDoctName}} </p>
          <p>完成时间  {{item.time}}</p>
        </div>
        <div class="arrow">
          <img :src="baseSrc + 'more-arrow.png'" alt="">
        </div>
      </div>
    </div>
    <no-record :condition="reprotList.length === 0" :tips="'暂无报告!'"></no-record>
  </div>
</template>
<script>
import tabs from '@/components/tabs'
import NoRecord from '@/components/NoRecord'
import HosVoucherSelect from '@/components/hos-voucher-select'
import { getReportExamList, getReportLabList } from '@/service/report.service'
import { getItem } from '@/utils/store'
import eventLister from '@/service/eventListener'
export default {
  data: function () {
    return {
      tab: [{name: '检验报告'}, {name: '检查报告'}],
      tabIndex: 0,
      endDate: '2019-11-29',
      startDate: '2019-01-01',
      reprotList: [],
      voucher: {},
      hosInfo: {},
      areaInfo: {},
      baseSrc: this.constant.LOCAL_IMG
    }
  },
  components: {
    tabs,
    NoRecord,
    HosVoucherSelect
  },
  onLoad () {
    // let today = new Date()
    // this.endDate = today.format('yyyy-MM-dd')
    // today.setDate(today.getDate() - 14)
    // this.startDate = today.format('yyyy-MM-dd')
    eventLister.$on('backEvent', () => {
      this.loadList(this.tabIndex)
    })
    this.loadList(this.tabIndex)
  },
  methods: {
    async loadList (type) {
      this.voucher = getItem('selectedVoucher')
      this.hosInfo = getItem('selectedHospital')
      let data = {
        hospitalId: this.hosInfo.hospitald,
        cardType: this.voucher.cardType,
        cardNo: this.voucher.cardNo,
        startDate: this.startDate,
        endDate: this.endDate,
        areaId: this.hosInfo.areaId
      }
      let res = type === 0 ? await getReportLabList(data) : await getReportExamList(data)
      if (res.result === this.constant.RESULT_SUCCESS) {
        this.forMatData(res.data)
      } else {
        this.reprotList = []
      }
    },
    forMatData (data) {
      this.reprotList = []
      if (!data || data.length === 0) return
      for (let i = 0; i < data.length; i++) {
        let temp = {
          id: data[i].examId ? data[i].examId : data[i].labId,
          copy_time: data[i].examTime ? data[i].examTime : data[i].labTime,
          time: data[i].examTime ? this.$utils.formatpayDate(data[i].examTime) : this.$utils.formatpayDate(data[i].labTime),
          itemName: data[i].examItem ? data[i].examItem : data[i].labItem,
          repDoctName: data[i].repDoctName,
          deptName: data[i].deptName,
          labType: data[i].labType ? data[i].labType : ''
        }
        this.reprotList.push(temp)
      }
    },
    goDetail (item) {
      let params = {
        hospitalId: this.hosInfo.hospitald,
        areaId: this.hosInfo.areaId,
        cardType: this.voucher.cardType,
        cardNo: this.voucher.cardNo,
        startDate: this.startDate,
        endDate: this.endDate,
        hospitalName: this.hosInfo.hospitalName
      }
      if (this.tabIndex === 0) {
        params.labId = item.id
        params.labItem = item.itemName
        params.labTime = item.copy_time
        this.$utils.navigateTo('labDetail', {params: JSON.stringify(params)})
      } else {
        params.examId = item.id
        params.examItem = item.itemName
        params.examTime = item.copy_time
        this.$utils.navigateTo('examDetail', {params: JSON.stringify(params)})
      }
    },
    changeTab (e) {
      if (this.tabIndex === e) return
      this.tabIndex = e
      this.loadList(e)
    },
    select (e) {
      this.$utils.navigateTo(e, { waitUrl: 'noredirect' })
    }
  }
}
</script>
<style lang="scss" scoped>
.myreport{
  min-height: 100%;
  background: rgb(239, 242, 245);
  .tips{
    padding: 15px 7px 12px 11px;
    width:auto;
    div{
      display: inline-block;
      img{
        height: 17px;
        width: 17px;
        display: block;
      }
    }
    p{
      color: #51A8EC;
      font-size: 13px;
      padding-left: 5px;
    }

  }
.clinic-info{
    background: #fff;
    margin-top: 10px;
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
  }
}
</style>

