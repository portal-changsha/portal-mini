<template>
  <div class="survey-doctor app">
    <hos-voucher-select v-on:select="select" ></hos-voucher-select>
    <time-select v-on:selectDate="selectDate" :tips="'此处展示近7天的历史记录'"></time-select>
    <div class="doc-info" v-for="(item, index) in docLists" :key="index">
      <ul>
        <li>
          <span>{{item.typeName}}</span>
          <label>{{item.deptName | formatDeptName}} <span>({{item.doctName}})</span></label>
        </li>
        <li class="time">
          <span>就诊时间</span>
          <label>{{item.visitDate | formatDate}}</label>
        </li>
      </ul>
      <div class="doc-btn">
        <button @click="toSurvey(item)">{{item.isEvaluative === '0' ? '评价': '查看'}}</button>
      </div>
    </div>
    <no-record :condition="docLists.length === 0" :tips="'暂无记录!'"></no-record>
  </div>
</template>

<script>
	import hosVoucherSelect from '@/components/hos-voucher-selcet/hos-voucher-selcet.vue'
	import timeSelect from '@/components/time-select/time-select.vue'
	import { parseTime } from '@/utils/index.js'
	import { queryEvaluation } from '@/services/synthesis.js'
	import { getItem } from '@/utils/localStore.js'
	export default {
		components:{
			hosVoucherSelect,
			timeSelect
		},
		data() {
			return {
				docLists: [],
				startDate: '',
				endDate: '',
				voucher: {},
				hosInfo: {},
				areaInfo: {}
			}
		},
		onLoad() {
			let today = new Date()
			this.endDate = parseTime(today, '{y}-{m}-{d}')
			today.setMonth(today.getDate() - 7)
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
				this.voucher = getItem('selectedVoucher')
				this.hosInfo = getItem('selectedHospital')
				this.areaInfo = getItem('selectedArea')
				this.docLists = []
				const params = {
					orgId: this.hosInfo.orgId,
					hospitalId: this.hosInfo.id,
					areaId: this.areaInfo.areaId,
					cardType: this.voucher.cardType,
					cardNo: this.voucher.cardNo,
					startDate: this.startDate,
					endDate: this.endDate
				}
				queryEvaluation(params).then((res) => {
					if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
					this.docLists = res.data
				})
			},
			selectDate(date) {
				if (date) {
					this.startDate = date.startDate
					this.endDate = date.endDate
					this.initData()
				}
			},
			select (e) {
				this.$store.dispatch('paramStore/updateParam', {
					namespace: 'DistrictSelect',
					target: 'surveyDoctorList',
				})
				this.$Router.push({name: e});
			},
			toSurvey(item){
				const params = {
				  orgId: this.hosInfo.orgId,
				  hospitalId: this.hosInfo.id,
				  areaId: this.hosInfo.areaId,
				  cardType: this.voucher.cardType,
				  cardNo: this.voucher.cardNo,
				  regId: item.regId,
				  hospitalName: this.hosInfo.name
				}
				this.$store.dispatch('paramStore/updateParam', {
				  namespace: 'reportDetail',
				  queryParams: params
				})
				this.$Router.push({name: 'survey'})
			}
		}
	}
</script>

<style lang="scss" scoped>
  $main_color: #51A8EC;
  .app{
	  background: $common-background-color;
  }
  .survey-doctor {
    height: inherit;
    background: #eff2f5;

  }
  .doc-info {
    background: #fff;
    height: 3.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    border-bottom: 1px solid #DBDBDB;
    padding: 0 0.5rem 0 0.75rem;
    position: relative;
    box-shadow: 0px 1px 2px 0px rgba(81, 168, 236, 0.2);
          ul {
              background: #fff;
              li {
                  span {
                      color: #999;
                  }
                  label {
                    color: #333;
                    span {
                        color: $main_color;
                    }
                  }
              }
              .time {
                  padding-top: 0.4rem;
                  .label{
                    color: #333;
                    font-size: 0.75rem;
                  }
              }
          }
          .doc-btn {
              button {
                  width: 3.25rem;
                  height: 2rem;
                  background: #51A8EC;
                  border-radius: 0.2rem;
                  font-size: 0.75rem;
                  color: #fff;
              }
          }
      }
</style>

