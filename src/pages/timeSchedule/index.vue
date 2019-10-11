<template>
  <div class="schedule">

    <div class="doc-info row row-center">
      <div class="row">
        <div class="doc-logo">
          <img :src="docInfo.doctAvatar ? docInfo.doctAvatar : originImgUrl + 'ico-doctor.png'" alt="">
        </div>
        <div class="doc-detail">
          <p>{{docInfo.doctName ? docInfo.doctName:docInfo.name}} <span>{{docInfo.rankName?docInfo.rankName:docInfo.rank}}</span></p>
          <p class="doc-dept">{{docInfo.deptName? docInfo.deptName: docInfo.dept}}</p>
        </div>
      </div>
    </div>
    <tabs :tabArr="tab" v-on:changeTab="changeTab"></tabs>
    <div v-show="tabIndex === 0">
      <p class="schedule-tip">当日排班表</p>
      <TimeTable @change="loadDocSchedules" :areaId="params.areaId" :deptId="params.deptId"></TimeTable>

      <ul class="field-list" >
        <li>
          <span>预约日期</span>
          <span>{{regDate}}</span>
        </li>
        <li>
          <span>挂号金额</span>
          <span><label style="color: #FF0000;">{{price}}</label>元</span>
        </li>
      </ul>

      <div class="timeList">
        <div class="row row-center" v-for="(item,i) in schedules" :key="i" @click="item.status === 1 ? chooseSchedule(item):''">
          <div class="f3s15">{{item.phaseDesc}}</div>
          <div class="time-status">
            <p class="f3s15" :class="{isActive:item.status === 1}">{{item.status === 1 ? '预约':(item.status === 2)?'满诊':'停诊'}}</p>
            <img v-if="item.status === 1" :src="originImgUrl + 'more-arrow.png'" alt="">
          </div>
        </div>
        <!-- <no-record :condition="schedules.length === 0" :tips="'暂无排班!'"></no-record> -->
      </div>
    </div>

    <div v-show="tabIndex === 1" class="docDesc">
      {{docInfo.doctDesc ? docInfo.doctDesc : "暂无医生介绍"}}
    </div>


    <!-- <no-record :condition="schedules.length === 0" :tips="'当天没有医生排班，请选择其他日期'"></no-record> -->

  </div>
</template>
<script>
import { getRegisterScheduling } from '@/service/register.service'
import { getHospitalDoct } from '@/service/hospital.service'
import TimeTable from '@/components/TimeTable'
import NoRecord from '@/components/NoRecord'
import tabs from '@/components/tabs'
import { getItem } from '@/utils/store'
export default {
  data: function () {
    return {
      schedules: [],
      tab: [{name: '门诊排班'}, {name: '医生介绍'}],
      tabIndex: 0,
      params: {},
      regDate: '',
      price: '',
      docInfo: {

      },
      hosInfo: {}
    }
  },
  components: {
    TimeTable,
    NoRecord,
    tabs
  },
  computed: {
    originImgUrl () {
      return this.constant.LOCAL_IMG
    }
  },
  onLoad () {
    let q = this.$root.$mp.query
    if (q.params === undefined) {
      this.$utils.back()
      return
    }
    this.params = JSON.parse(q.params)
    // this.docInfo = JSON.parse(q.item)
    this.price = q.price
    this.regDate = this.formatDate(this.params.regDate)
    this.hosInfo = getItem('selectedHospital')
    this.getDocTimeSchedules(this.params)
    this.getDocInfo()
  },
  methods: {
    chooseSchedule (item) {
      //  跳转到挂号确认界面
      this.$utils.navigateTo('registerConfirm', { params: JSON.stringify(this.params), item: JSON.stringify(item) })
    },
    formatDate (date) {
      let res = this.$utils.formatTime(this.params.regDate)
      return res.curDate + ' ' + this.$utils.getWeekDay(this.params.regDate)
    },
    changeTab (e) {
      if (this.tabIndex === e) return
      this.tabIndex = e
      e === 0 ? this.getDocTimeSchedules(this.params) : this.getDocInfo()
    },
    async getDocInfo () {
      let data = {
        'hospitalId': this.params.hospitalId,
        'areaId': this.params.areaId,
        'doctId': this.params.doctId
      }
      let res = await getHospitalDoct(data)
      if (res.result === this.constant.RESULT_SUCCESS) {
        this.docInfo = res.data
      }
    },
    loadDocSchedules (e) {
      this.params.regDate = e.value
      this.regDate = this.formatDate(e.value)
      this.getDocTimeSchedules(this.params)
    },
    async getDocTimeSchedules (data) {
      this.schedules = []
      let res = await getRegisterScheduling(data)
      if (res.result === this.constant.RESULT_SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].phaseDesc = this.$utils.formateDesc(res.data[i].phaseDesc)
        }
        this.schedules = res.data || []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule{
  height: inherit;
  background: #EFF2F5;
}
.doc-info{
  height: 86px;
  background: url($main-img-url + 'bg1.png') no-repeat center;
  background-size: 100%;
  margin-bottom: 8px;
  .doc-logo{
    img{
      width: 50px;
      height: 50px;
      border-radius: 100%;
      display:block;
      padding:0 15px;
    }
  }
  .doc-detail{
    p:nth-child(1){
      color: #111;
      font-size: 18px;
      font-weight:500;

    }
    .doc-dept,span{
      color: #111;
      font-size: 13px;
    }

  }
}
.schedule-tip{
  line-height: 45px;
  height: 45px;
  padding-left: 15px;
  color: #999999;
  font-size: 15px;
}
.field-list{
  margin: 7px 0;
}
.timeList{

  background: #fff;
  padding: 0 15px;
  border-bottom: #D6D6D6;
  .row{
    height: 45px;
    justify-content: space-between;
    border-bottom: 1px solid #D6D6D6;
  }
  .time-status{
    p{
      display: inline-block;
      padding-right: 5px;
      color: #999;
    }
    img{
      width: 8px;
      height: 13px;
    }
    .isActive{
      color: #51A8EC;
    }
  }
}
.docDesc{
  color: #333333;
  font-size: 13px;
  padding: 14px 17px 0 17px;
}
</style>

