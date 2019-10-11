<template>
  <div class="depart">
    <tabs :tabArr="tab" v-on:changeTab="changeTab"></tabs>
    <div class="search-bar">
      <button>
        <icon class="searchicon" type="search" size="16" />
        {{tips}}
      </button>
    </div>

    <!-- 按科室 -->
    <div class="departArea row" :style="{height: devAvaHeight + 'px'}" v-show="tabIndex === 0">
      <div class="col row left">
        <div class="col content" :class="{active:flag === index}" v-for="(item,index) in deptInfo" :key="index" @click="flag = index" >{{item.deptName}}</div>
      </div>
      <div class="col row right">
        <div class="col content"  v-for="(subItem,i) in deptInfo[flag].children" :key="i" @click="toPage(subItem,1)">{{subItem.deptName}}</div>
      </div>
    </div>
    <!-- 按医生 -->
    <div v-show="tabIndex === 1" class="doctor">
      <div  class="row row-center doc-list" v-for="(item,i) in docList" :key="i"  @click="toPage(item,2)">
        <div class="doc-logo">
          <img :src="item.avatar ? item.avatar: originImgUrl + 'ico-doctor.png'" alt="">
        </div>
        <div class="doc-info">
          <p>{{item.doctName}} {{item.rankName}}</p>
          <p>{{item.deptName}}</p>
          <p>{{item.doctDesc ? item.doctDesc : '暂无介绍'}}</p>
        </div>
        <div class="doc-arrow"><img :src="originImgUrl + 'more-arrow.png'" alt=""></div>
      </div>
    </div>


  </div>
</template>
<script>
import tabs from '@/components/tabs'
import { getRegisterDept } from '@/service/register.service'
import { getHospitalDocts } from '@/service/hospital.service'
import { getItem } from '@/utils/store'
export default {
  data: function () {
    return {
      waitUrl: '',
      tab: [{name: '按科室'}, {name: '按医生'}],
      tips: '输入二级科室',
      devAvaHeight: 0,
      areaId: '',
      deptInfo: [
        {children: []}
      ],
      docList: [],
      flag: 0,
      tabIndex: 0
    }
  },
  components: {
    tabs
  },
  computed: {
    originImgUrl () {
      return this.constant.LOCAL_IMG
    }
  },
  onLoad () {
    this.flag = 0
    let devInfo = mpvue.getSystemInfoSync()
    let area = getItem('selectedHospital')
    this.devAvaHeight = devInfo.windowHeight - 110
    //  获取传过来的区域id及待进入的页面url
    let q = this.$root.$mp.query
    this.areaId = q.areaId ? q.areaId : area.areaId
    if (this.areaId) {
      this.getHospitalDept()
    }
  },
  methods: {
    changeTab (e) {
      if (this.tabIndex === e) return
      this.tabIndex = e
      this.tips = e === 0 ? '输入二级科室' : '输入医生姓名'
      e === 0 ? this.getHospitalDept() : this.getDocInfo()
    },
    async getDocInfo () {
      let hosInfo = getItem('selectedHospital')
      let data = {
        hospitalId: hosInfo.hospitald,
        areaId: this.areaId
      }
      let res = await getHospitalDocts(data)
      if (res.result === this.constant.RESULT_SUCCESS) {
        this.docList = res.data.length > 100 ? res.data.slice(0, 90) : res.data
      }
    },
    async getHospitalDept () {
      let hosInfo = getItem('selectedHospital')
      let data = {
        hospitalId: hosInfo.hospitald,
        areaId: this.areaId
      }
      let res = await getRegisterDept(data)
      if (res.result === this.constant.RESULT_SUCCESS) {
        this.deptInfo = res.data
      }
    },
    toPage (item, type) {
      //  重置挂号时间
      this.$store.commit('setRegDate', null)
      if (type === 1) {
        //  跳转到该科室所有医生排班
        this.$utils.navigateTo('dateDoctorSchedule', { deptId: item.deptId, areaId: this.areaId })
        // mpvue.navigateTo({
        //   url: '../dateDoctorSchedule/main?deptId=' + item.deptId + '&areaId=' + this.areaId
        // })
      } else {
        //  跳转到该医生排班
        let hosInfo = getItem('selectedHospital')
        // let price = (item.fee / 100).toFixed(2)
        let params = {
          orgId: hosInfo.orgId,
          hospitalId: hosInfo.id,
          areaId: this.areaId,
          deptId: item.deptId,
          regDate: new Date().format('yyyy-MM-dd'),
          doctId: item.doctId,
          rankId: item.rankId
        }
        mpvue.navigateTo({
          url: '../timeSchedule/main?params=' + JSON.stringify(params) + '&item=' + JSON.stringify(item)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.depart{
  .search-bar{
    height: 60px;
    padding: 0 15px;
    border-bottom: 1px solid #D6D6D6;
    button{
      height: 32px;
      background: #EFF2F5;
      border: 1px solid #D6D6D6;
      line-height: 32px;
      color: #999999;
      font-size: 13px;
      margin: 14px 0;
      display:inline-block;
      width:100%;
      icon{
        transform:translateY(3px);
      }
    }
  }
  .departArea{
    // position: absolute;
    // height: 100%;
    // top: 110px;
    // width: 100%;
    .row{
      flex-direction: column;
      overflow: hidden;
    }
    .left{
      background: #EFF2F5;
      overflow-y:auto;
    }
    .content{
      height: 50px;
      line-height: 50px;
      padding-left: 20px;
      color: #111;
      font-size: 15px;
    }
    .active{
      background:#fff;
      color:#51A8EC;
    }
  }
  .doc-list{
    align-items: center;
    background: #fff;
    height: 75px;
    position: relative;
    border-bottom: 1px solid #D6D6D6;
    box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
    // margin-bottom: 2px;
    .doc-logo{
      padding: 0 14px;
      img{
        width: 50px;
        height: 50px;
        border-radius: 100%;
        display:block;
      }
    }
    .doc-info{
      p:nth-child(1){
        color: #111;
        font-size: 15px;
        // line-height: 16px;
      }
      p:nth-child(2){
        color: #51A8EC;
        font-size: 15px;
        // line-height: 14px;
      }
      p:nth-child(3){
        color: #666;
        font-size: 13px;
      }
    }
    .doc-arrow{
      position: absolute;
      right: 14px;
      img{
        width: 8px;
        height: 13px;
      }
    }
  }
}
</style>

