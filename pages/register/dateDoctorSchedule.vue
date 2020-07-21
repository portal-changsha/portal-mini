<template>
  <div class="schedule app">
    <time-table @change="loadDocSchedules" :areaId="areaId" :deptId="deptId"></time-table>

    <div v-if="schedules.length>0">
      <div  class="row row-center doc-list" v-for="(item,i) in schedules" :key="i" @click="toPage(item)">
        <div class="doc-logo">
          <img v-if="item.doctAvatar || originImgUrl" :src="item.doctAvatar ? item.doctAvatar: originImgUrl + 'ico-doctor.png'" alt="">
        </div>
        <div class="doc-info">
          <p>{{item.rankName}}&nbsp;{{item.doctName}}</p>
          <p style="padding: 2px 0;">挂号金额： <span>{{item.fee | formatFee }}</span></p>
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
	import { setPageTitle, parseTime } from '@/utils/index.js'
	import timeTable from '@/components/time-table/time-table.vue'
	import { getItem } from '@/utils/localStore.js'
	import config from '@/config/index.js'
	import { loadDoctorSchedule } from '@/services/register.js'
	export default {
		components:{
			timeTable
		},
		data() {
			return {
				deptId: '',
				areaId: '',
			    regDate: parseTime(new Date(), '{y}-{m}-{d}'),
			    schedules: []
			}
		},
		computed: {
		    originImgUrl () {
		      return config.VUE_APP_IMG_URL
		    }
		},
		onLoad(){
			const query = this.$Route.query
			setPageTitle(query.deptName)
			if(!query.deptId){
				this.$Router.back()
				return
			}
			const areaInfo = getItem('selectedArea')
			this.areaId = areaInfo.areaId
			this.deptId = query.deptId
			this.initData()
			console.log(this.$Route.query)
		},
		methods: {
			initData(){
				const hosInfo = getItem('selectedHospital')
				this.schedules = []
				const params = {
					orgId: hosInfo.orgId,
					hospitalId: hosInfo.id,
					areaId: this.areaId,
					deptId: this.deptId,
					regDate: this.regDate
				}
				loadDoctorSchedule(params).then(res => {
					if(res.resultCode !== this.$consts.RESULT_SUCCESS) return
					this.schedules = res.data || []
				})
			},
			loadDocSchedules (e) {
				console.log(e)
				this.regDate = e.value
				this.initData()
			},
			toPage (item) {
			  //  整合选择当前挂号时间
			  let data = {
				value: this.regDate,
				weekDay: parseTime(this.regDate, '{a}'),
				mounth: parseTime(this.regDate, '{m}'),
				day: parseTime(this.regDate, '{d}')
			  }
			  //	记录当前选择的日期
			  this.$store.dispatch('paramStore/updateParam', {
				  namespace: 'setRegDate',
				  regDate: data
			  })
			  const hosInfo = getItem('selectedHospital')
			  // let price = (item.fee / 100).toFixed(2)
			  let params = {
				orgId: hosInfo.orgId,
				hospitalId: hosInfo.id,
				areaId: this.areaId,
				deptId: this.deptId,
				regDate: this.regDate,
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
  height: 4.3rem;
  position: relative;
  box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
  margin-top: 0.35rem;
  padding: 0;
  .doc-logo{
    padding: 0 0.7rem 0 0.75rem;
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
      color: #333;
      font-size: 0.75rem;
    }
    p:nth-child(2),p:nth-child(3){
      color: #999;
      font-size: 0.65rem;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  width: 80%;
    }
    span{
      color: #FF0000;
      font-size: 0.65rem;
    }
  }
  .doc-arrow{
    position: absolute;
    right: 0.7rem;
    p{
      font-size: 0.75rem;
      color: #999999;
      display:inline-block;
      padding-right:0.25rem;
      span{
        font-size: 0.75rem;
        color: #51A8EC;
		padding: 0 0.2rem;
      }
    }
    img{
      width: 0.4rem;
      height: 0.65rem;
    }
  }
}
</style>