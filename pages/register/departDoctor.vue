<template>
  <div class="depart app">
	  <hospital-name></hospital-name>
    <tabs :tabArr="tab" v-on:changeTab="changeTab"></tabs>
    <div class="search-bar">
      <button @click="openSearch()">
        <icon class="searchicon" type="search" size="14" />
        <span>{{tips}}</span> 
      </button>
    </div>

    <!-- 按科室 -->
    <div class="departArea row" :style="{height: devAvaHeight + 'px'}" v-show="tabIndex === 0">
      <div class="col row left">
        <div class="col area-content" :class="{active:flag === index}" v-for="(item,index) in deptInfo" :key="index" @click="flag = index" >{{item.deptName}}</div>
      </div>
      <div class="col row right" v-if="deptInfo[flag] && deptInfo[flag].children">
        <div class="col area-content"  v-for="(subItem,i) in deptInfo[flag].children" :key="i" @click="toPage(subItem,1)">{{subItem.deptName}}</div>
      </div>
    </div>
    <!-- 按医生 -->
    <div v-show="tabIndex === 1" class="doctor">
      <div  class="row row-center doc-list" v-for="(item,i) in docList" :key="i"  @click="toPage(item,2)">
        <div class="doc-logo">
          <img :src="item.doctAvatar ? item.doctAvatar: originImgUrl + 'ico-doctor.png'" alt="">
        </div>
        <div class="doc-info">
          <p>{{item.name}} {{item.rank}}</p>
          <p>{{item.dept}}</p>
          <p>{{item.doctDesc ? item.doctDesc : '暂无介绍'}}</p>
        </div>
        <div class="doc-arrow"><img :src="originImgUrl + 'more-arrow.png'" alt=""></div>
      </div>
    </div>
  </div>
</template>
<script>
import tabs from '@/components/tabs/tabs.vue'
import { getRegisterDept, getHospitalDocts } from '@/services/register.js'
import { getItem } from '@/utils/localStore.js'
import config from '@/config/index.js'
import { parseTime } from '@/utils/index.js'
import hospitalName from '@/components/hospital-name/hospital-name.vue'
export default {
  data: function () {
    return {
      tab: [{name: '按科室'}, {name: '按医生'}],
      tips: '输入二级科室',
      deptInfo: [
        {children: []}
      ],
      docList: [],
      flag: 0,
      tabIndex: 0,
	  hosInfo: getItem('selectedHospital'),
	  areaInfo: getItem('selectedArea')
    }
  },
  components: {
    tabs,
	hospitalName
  },
  computed: {
    originImgUrl () {
      return config.VUE_APP_IMG_URL
    },
	devAvaHeight(){
		let devInfo = uni.getSystemInfoSync()
		return devInfo.windowHeight - 140
	}
  },
  onLoad () {
    this.flag = 0
	this.getHospitalDept()
  },
  onShow(){
	//	重置时间
	this.$store.dispatch('paramStore/clearParam', 'setRegDate')
  },
  methods: {
    changeTab (e) {
      if (this.tabIndex === e) return
      this.tabIndex = e
      this.tips = e === 0 ? '输入二级科室' : '输入医生姓名'
      e === 0 ? this.getHospitalDept() : this.getDocInfo()
    },
    async getDocInfo () {
      let data = {
		orgId: this.hosInfo.orgId,
        hospitalId: this.hosInfo.id,
        areaId: this.areaInfo.areaId
      }
      let res = await getHospitalDocts(data)
      if (res.resultCode === this.$consts.RESULT_SUCCESS) {
        this.docList = res.data.length > 100 ? res.data.slice(0, 90) : res.data
      }
    },
    async getHospitalDept () {
      this.deptInfo = []
	  this.allSubDeparts = []
      let data = {
		orgId: this.hosInfo.orgId,
        hospitalId: this.hosInfo.id,
        areaId: this.areaInfo.areaId
      }
      let res = await getRegisterDept(data)
      if (res.resultCode === this.$consts.RESULT_SUCCESS) {
        this.deptInfo = res.data
		this.deptInfo.forEach((item) => {
			//搜索数组赋值前屏蔽重点科室，源头上达到去重效果 0: 非重点  1: 重点科室
			if (item.isKey !== '1' && item.deptName !== '重点科室') {
				this.allSubDeparts = this.allSubDeparts.concat(item["children"]);
				//	保存数据
				this.$store.dispatch('paramStore/updateParam', {
					namespace:'allSubDeparts',
					allSubDeparts: this.allSubDeparts
				})
			}
		});
      }
    },
    toPage (item, type) {
      //  重置挂号时间
      // this.$store.commit('setRegDate', null)
      if (type === 1) {
        //  跳转到该科室所有医生排班
		this.$Router.push({path: '/pages/register/dateDoctorSchedule', query: {deptId: item.deptId, deptName: item.deptName}})
      } else {
        //  跳转到该医生排班
        const hosInfo = getItem('selectedHospital')
        const params = {
          orgId: hosInfo.orgId,
          hospitalId: hosInfo.id,
          areaId: this.areaInfo.areaId,
          deptId: item.deptId,
          regDate: parseTime(new Date(), '{y}-{m}-{d}'),
          doctId: item.doctId
        }
		//	记录请求的数据
		this.$store.dispatch('paramStore/updateParam', {
		  namespace: 'timeSchedule',
		  requestParams: params
		})
		//	记录当前医生数据
		this.$store.dispatch('paramStore/updateParam', {
		  namespace: 'doctorInfo',
		  doctorInfo: item
		})
		this.$Router.push({name: 'timeSchedule'})
      }
    },
	openSearch(){
		this.$Router.push({path: '/pages/searchSelect/departSearch', query: {searchType: this.tabIndex}})
	}
  }
}
</script>
<style lang="scss" scoped>
.depart{
  .search-bar{
    padding: 0 0.75rem;
    border-bottom: 1px solid #D6D6D6;
    button{
	  display: flex;
	  align-items: center;
	  justify-content: center;
      height: 32px;
      background: #EFF2F5;
      border: 1px solid #D6D6D6;
      line-height: 32px;
      color: #999999;
      font-size: 0.65rem;
      margin: 12px 0;
      width:100%;
      icon{
        transform:translateY(0.15rem);
		padding-right: 0.25rem;
      }
    }
  }
  .departArea{
	  padding: 0;
    .row{
      flex-direction: column;
      overflow: hidden;
	  padding: 0;
	  margin: 0;
    }
    .left{
      background: #EFF2F5;
      overflow-y:auto;
    }
    .area-content{
      height: 2.5rem;
      line-height: 2.5rem;
      padding-left: 1rem;
      color: #111;
      font-size: 0.75rem;
    }
    .active{
      background:#fff;
      color:#51A8EC;
    }
  }
  .doc-list{
    align-items: center;
    background: #fff;
    height: 3.75rem;
    position: relative;
    border-bottom: 1px solid #D6D6D6;
    box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
	padding: 0;
    .doc-logo{
      padding: 0 0.7rem;
      img{
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 100%;
        display:block;
      }
    }
    .doc-info{
		width: 100%;
      p:nth-child(1){
        color: #111;
        font-size: 0.75rem;
      }
      p:nth-child(2){
        color: #51A8EC;
        font-size: 0.75rem;
      }
      p:nth-child(3){
        color: #666;
        font-size: 0.65rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 80%;
      }
    }
    .doc-arrow{
      position: absolute;
      right: 0.7rem;
      img{
        width: 0.4rem;
        height: 0.65rem;
      }
    }
  }
}

</style>

