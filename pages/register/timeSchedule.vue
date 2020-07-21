<template>
  <div class="schedule app">
    <div class="doc-info row row-center">
      <div class="row">
        <div class="doc-logo">
          <img :src="docInfo.doctAvatar ? docInfo.doctAvatar : originImgUrl + 'ico-doctor.png'" alt="">
		   <!-- 门诊类型标签 -->
		   <span v-if="docInfo.typeId === '849772'" class="type-tag tag-putong">{{docInfo.typeName}}</span>
		   <span v-if="docInfo.typeId === '643075'" class="type-tag tag-zhuanjia">{{docInfo.typeName}}</span>
        </div>
        <div class="doc-detail">
          <p>{{docInfo.doctName ? docInfo.doctName:docInfo.name}} <span>{{docInfo.rankName?docInfo.rankName:docInfo.rank}}</span></p>
          <p class="doc-dept">{{docInfo.deptName? docInfo.deptName: docInfo.dept}}</p>
        </div>
      </div>
	  <div class="concern-doct" @click="onConcern">
		  <image :src="isConcern ? originImgUrl + 'concern.png' : originImgUrl + 'noConcern.png'"></image>
		  <span>{{ isConcern ? '已关注' : '未关注' }}</span>
	  </div>
	  
    </div>
    <tabs :tabArr="tab" v-on:changeTab="changeTab"></tabs>
    <div v-show="tabIndex === 0">
		<div class="row time-schedule">
			<p class="schedule-tip">当日排班表</p>
			<p class="schedule-more" @click="showMoreTime = !showMoreTime">
				<span>更多日期</span> 
				<img :class="{'show-time-talbe': showMoreTime}" :src="originImgUrl + 'more-arrow.png'" alt> 
			</p>
		</div>
	
      <time-table v-show="showMoreTime" @change="loadDocSchedules" :areaId="params.areaId" :deptId="params.deptId"></time-table>

      <ul class="field-list" :class="{noMarginTop: !showMoreTime}">
        <li>
          <span>预约日期</span>
          <span>{{regDate | formatDate('myRegister')}}</span>
        </li>
        <li>
          <span>挂号金额</span>
          <span><label style="color: #FF0000;">{{docInfo.fee | formatFee}}</label></span>
        </li>
      </ul>

      <div class="timeList">
        <div class="row row-center" v-for="(item,i) in schedules" :key="i" @click="item.status === 1 ? chooseSchedule(item):''">
          <div class="f3s15">{{item.phaseDesc}}</div>
          <div class="time-status">
            <p class="f3s15" :class="{isActive:item.status === 1}">{{registerScheduleType[item.status + '']}}</p>
            <img v-if="item.status === 1" :src="originImgUrl + 'more-arrow.png'" alt="">
          </div>
        </div>
      </div>
    </div>

    <div v-show="tabIndex === 1" class="docDesc">
		<!-- <div v-html="docInfo.doctDesc"></div> -->
      <pre class="str-to-html">{{docInfo.doctDesc ? docInfo.doctDesc : "暂无医生介绍"}}</pre>
    </div>
    <no-record :condition="schedules.length === 0" :tips="'当天没有医生排班，请选择其他日期'" :cusMarginTop="'2.5rem'"></no-record>

  </div>
</template>
<script>
import { loadTimeSchedules, judgeConcernDoctors, concernDoctor } from '@/services/register.js'
import timeTable from '@/components/time-table/time-table.vue'
import tabs from '@/components/tabs/tabs.vue'
import { getItem } from '@/utils/localStore.js'
import config from '@/config/index.js'
import { REGISTRATION_SCHEDULE_TYPE } from '@/common/dict/dict.js' 
import { showToast } from '@/utils/uniApi.js'

export default {
  data: function () {
    return {
      schedules: [],
      tab: [{name: '门诊排班'}, {name: '医生介绍'}],
      tabIndex: 0,
      params: {},
      regDate: '',
      docInfo: {},
	  registerScheduleType: REGISTRATION_SCHEDULE_TYPE,
	  showMoreTime: false,
	  isConcern: false
    }
  },
  components: {
    timeTable,
    tabs
  },
  computed: {
    originImgUrl () {
      return config.VUE_APP_IMG_URL
    }
  },
  onLoad () {
	const store = this.$store.getters.param
    //	获取请求排班信息的参数
	this.params = store.timeSchedule.requestParams
	//	获取医生信息
	this.docInfo = store.doctorInfo.doctorInfo
	//	获取挂号时间
	// this.regDate = store.setRegDate.regDate.value
	this.regDate = this.params.regDate
    this.initData(this.params)
	this.getConcernStatus()
  },
  methods: {
	getConcernStatus(){
		const data = {
			orgId: this.params.orgId,
			hosId: this.params.hospitalId,
			doctId: this.params.doctId,
			deptId: this.params.deptId,
			areaId: this.params.areaId
		}
		judgeConcernDoctors(data).then(res => {
			if(res.resultCode !== this.$consts.RESULT_SUCCESS) return
			this.isConcern = res.data.isFavored
		})
	},
	onConcern(){
		const { orgId, doctId, deptId, areaId } = this.params
		let concernParams = {
			orgId: orgId,
			hosId: this.params.hospitalId,
			doctId: doctId,
			deptId: deptId,
			areaId: areaId,
			follow: !this.isConcern
		}
		concernDoctor(concernParams).then((res) =>{
			if(res.resultCode !== this.$consts.RESULT_SUCCESS) return
			this.isConcern = !this.isConcern
			const message = this.isConcern ? '关注成功' : '已取消关注'
			showToast(message)
		})
	},
    chooseSchedule (item) {
      //  跳转到挂号确认界面
	  console.log(item)
	  const registerParams = {
		  regId: item.regId,
		  bookType: item.bookType,
		  deptId: item.deptId,
		  doctId: item.doctId,
		  rankId: item.rankId,
		  phaseId: item.phaseId,
		  typeId: item.typeId
	  }
	  const registerData = {
		  regDate: this.regDate,
		  phaseDesc: item.phaseDesc,
		  deptName: item.deptName,
		  regFee: item.regFee
	  }
	  //	保存参数
	  this.$store.dispatch('paramStore/updateParam', {
		  namespace: 'registerConfirm',
		  registerParams: registerParams,
		  registerData: registerData
	  })
	  this.$Router.push({name: 'registerConfirm'})
    },
    changeTab (e) {
      if (this.tabIndex === e) return
      this.tabIndex = e
      e === 0 && this.initData(this.params)
    },
    loadDocSchedules (e) {
      this.params.regDate = e.value
      this.regDate = e.value
	  console.log(this.regDate)
	  //	保存选中的日期
	  this.$store.dispatch('paramStore/updateParam', {
		  namespace: 'setRegDate',
		  regDate: e
	  })
      this.initData(this.params)
    },
    async initData (data) {
      this.schedules = []
      let res = await loadTimeSchedules(data)
	  console.log(res)
      if (res.resultCode === this.$consts.RESULT_SUCCESS) {
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
  height: 4.3rem;
  background: url($redirect-url + $img-file-path + 'bg1.png') no-repeat center;
  background-size: 100%;
  margin-bottom: 0.4rem;
  padding: 0;
  .row{
	  padding: 0;
	  align-items: center;
  }
  .doc-logo{
	  position: relative;
    img{
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 100%;
      display:block;
      padding:0 0.75rem;
    }
	span{
		position: absolute;
		bottom: 0.1rem;
		right: 1rem;
		left: auto;
		top: auto;
	}
  }
  .doc-detail{
    p:nth-child(1){
      color: #111;
      font-size: 0.9rem;
      font-weight:500;

    }
    .doc-dept,span{
      color: #111;
      font-size: 0.65rem;
    }

  }
}
.schedule-tip{
  line-height: 2.5rem;
  height: 2.5rem;
  padding-left: 0.75rem;
  color: #999999;
  font-size: 0.75rem;
}
.field-list{
  margin: 0.35rem 0;
}
.timeList{

  background: #fff;
  padding: 0 0.75rem;
  border-bottom: #D6D6D6;
  .row{
    height: 2.5rem;
    justify-content: space-between;
    border-bottom: 1px solid #D6D6D6;
	padding: 0;
  }
  .time-status{
	@include display-flex;
	@include align-items(center);
    p{
      display: inline-block;
      padding-right: 0.25rem;
      color: #999;
    }
    img{
      width: 0.4rem;
      height: 0.65rem;
    }
    .isActive{
      color: #51A8EC;
    }
  }
}
.docDesc{
  color: #333333;
  font-size: 0.65rem;
  padding: 0.7rem 0.85rem 0.75rem 0.85rem;
  border-top: 1px solid #eaeaea;
  overflow-y: auto;
  word-break: break-all;
  background-color: #fff;
}
.str-to-html{
	white-space: pre-wrap;
	word-wrap: break-word;
}
.time-schedule{
	padding: 0;
	justify-content: space-between;
	align-items: center;
	p{
		padding-right: 0.75rem;
		span{
			color: #51a8ec;
			padding-right: 0.4rem;
		}
		img{
			width: 0.5rem;
		}
	}
	.schedule-more{
		@include display-flex;
		@include align-items(center);
	}
	.show-time-talbe{
		transform: rotate(90deg);
	}
}
.noMarginTop{
	margin-top: 0;
}
.concern-doct{
	@include display-flex;
	@include align-items(center);
	width: 5.5rem;
	span{
		padding-left: 0.4rem;
	}
}
uni-image{
	width: 1.1rem;
	height: 1.1rem;
}
</style>