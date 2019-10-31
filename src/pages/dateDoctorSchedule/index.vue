<template>
  <div class="schedule">
    <TimeTable @change="loadDocSchedules" :areaId="areaId" :deptId="deptId"></TimeTable>

    <div v-if="schedules.length>0">
      <div  class="row row-center doc-list" v-for="(item,i) in schedules" :key="i" @click="toPage(item)">
        <div class="doc-logo">
          <img v-if="item.doctAvatar || originImgUrl" :src="item.doctAvatar ? item.doctAvatar: originImgUrl + 'ico-doctor.png'" alt="">
        </div>
        <div class="doc-info">
          <p>{{item.rankName}}&nbsp;{{item.doctName}}</p>
          <p style="padding: 2px 0;">挂号金额： <span>{{item.fee / 100}}</span> 元</p>
          <p>{{item.doctDesc ? item.doctDesc : '暂无介绍'}}</p>
        </div>
        <div class="doc-arrow">
          <p>剩 <span>{{item.restCount}}</span> 号</p>
          <img :src="originImgUrl + 'more-arrow.png'" alt="">
        </div>
      </div>
    </div>
    <no-record :condition="schedules.length === 0" :tips="'当天没有医生排班，请选择其他日期'"></no-record>

  </div>
</template>
<script>
import { getRegisterDoct } from '@/service/register.service'
import TimeTable from '@/components/TimeTable'
import NoRecord from '@/components/NoRecord'
import { getItem } from '@/utils/store'
export default {
  data: function () {
    return {
      areaId: '',
      deptId: '',
      regDate: '',
      schedules: []
    }
  },
  components: {
    TimeTable,
    NoRecord
  },
  computed: {
    originImgUrl () {
      return this.constant.LOCAL_IMG
    }
  },
  onLoad () {
    let q = this.$root.$mp.query
    if (q.areaId === undefined || q.deptId === undefined) {
      this.$utils.back()
      return
    }
    this.areaId = q.areaId
    this.deptId = q.deptId
    this.regDate = new Date().format('yyyy-MM-dd')
    this.getDocSchedules()
  },
  methods: {
    loadDocSchedules (e) {
      this.regDate = e.value
      this.getDocSchedules()
    },
    async getDocSchedules () {
      this.schedules = []
      let hosInfo = getItem('selectedHospital')
      let data = {
        // orgId: hosInfo.orgId,
        hospitalId: hosInfo.hospitald,
        areaId: this.areaId,
        deptId: this.deptId,
        regDate: this.regDate
      }
      let res = await getRegisterDoct(data)
      if (res.result === this.constant.RESULT_SUCCESS) {
        this.schedules = res.data || []
      }
    },
    toPage (item) {
      //  整合选择当前挂号时间
      let data = {
        value: this.regDate,
        weekDay: this.$utils.getWeekDay(this.regDate),
        mounth: this.regDate.substring(5, 7),
        day: this.regDate.substring(8, 10)
      }
      this.$store.commit('setRegDate', data)
      let hosInfo = getItem('selectedHospital')
      let price = (item.fee / 100).toFixed(2)
      let params = {
        // orgId: hosInfo.orgId,
        hospitalId: hosInfo.hospitald,
        areaId: this.areaId,
        deptId: this.deptId,
        regDate: this.regDate,
        doctId: item.doctId
        // rankId: item.rankId
      }
      this.$utils.navigateTo('timeSchedule', { params: JSON.stringify(params), price: price, item: JSON.stringify(item) })
      // mpvue.navigateTo({
      //   url: '../timeSchedule/main?params=' + JSON.stringify(params) + '&price=' + price + '&item=' + JSON.stringify(item)
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule{
  height: inherit;
  background: #EFF2F5;
}
.doc-list{
  background: #fff;
  height: 86px;
  position: relative;
  // border-bottom: 1px solid #D6D6D6;
  box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
  margin-top: 7px;
  .doc-logo{
    padding: 0 14px 0 15px;
    img{
      width: 50px;
      height: 50px;
      border-radius: 100%;
      display:block;
    }
  }
  .doc-info{
    p:nth-child(1){
      color: #333;
      font-size: 15px;
      // line-height: 25px;
    }
    p:nth-child(2),p:nth-child(3){
      color: #999;
      font-size: 13px;
      // line-height: 25px;
    }
    span{
      color: #FF0000;
      font-size: 13px;
    }
  }
  .doc-arrow{
    position: absolute;
    right: 14px;
    p{
      font-size: 15px;
      color: #999999;
      display:inline-block;
      padding-right:5px;
      span{
        font-size: 15px;
        color: #51A8EC;
      }
    }
    img{
      width: 8px;
      height: 13px;
    }
  }
}
</style>

