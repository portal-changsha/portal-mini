<template>
  <div class="app patientInfo">
      <flex-title :isShowContent="true">
        <template v-slot:title>基本信息</template>
        <template v-slot:content>
     <div>
      <ul class="health-field-list">
         <li>
          <span>姓名</span>
          <span>{{patientInfo.name | dotted}}</span>
         </li>
         <li>
          <span>证件号码</span>
          <span>{{voucher.cardNo | dotted}}</span>
         </li>
         <li>
          <span>性别</span>
          <span>{{patientInfo.sex | formatEmptyData}}</span>
         </li>
         <li>
          <span>出生日期</span>
          <span>{{patientInfo.birthday | dotted(2,2)}}</span>
         </li>
         <li>
          <span>联系电话</span>
          <span>{{patientInfo.mobileNo | dotted}}</span>
         </li>
         <li>
          <span>居住地址</span>
          <span>{{patientInfo.address | dotted}}</span>
         </li>
         <li>
          <span>民族</span>
          <span>{{patientInfo.nation | formatEmptyData}}</span>
         </li>
         <li>
          <span>婚姻状态</span>
          <span>{{patientInfo.marriageStatus | formatEmptyData}}</span>
         </li>
         <li>
          <span>文化程度</span>
          <span>{{patientInfo.degree | formatEmptyData}}</span>
         </li>
         <li>
          <span>户籍地址</span>
          <span>{{patientInfo.domicileAddress | formatEmptyData}}</span>
        </li>
         <li>
          <span>职业</span>
          <span>{{patientInfo.profession | formatEmptyData}}</span>
         </li>
         <li>
          <span>工作单位</span>
          <span>{{patientInfo.organization | formatEmptyData}}</span>
         </li>
         <li>
          <span>血型</span>
          <span>{{patientInfo.blood | formatEmptyData}}</span>
         </li>
         <li>
            <span>RH</span>
            <span>{{patientInfo.rhBloodGroupCode | formatEmptyData}}</span>
          </li>
        </ul>
      </div>
    </template>
  </flex-title>
  
    <div class="other-type">
      <flex-title>
      <template v-slot:title>既往史</template>
      <template v-slot:content>
        <div class="patient-history">
        <p class="patient-history-name">既往手术</p>
        <ul class="health-field-list patient-history-content">
          <li v-for="(history, i) in summaryInfo.history.operation" :key="i">
            <span>{{history.name}}</span>
            <span>{{history.time}}</span>
          </li>
          <li v-if="!summaryInfo.history.operation || (summaryInfo.history.operation && summaryInfo.history.operation.length === 0)">
            <span>-</span>
          </li>
        </ul>
        </div>
        <div class="patient-history">
          <p class="patient-history-name">既往疾病</p>
          <ul class="health-field-list patient-history-content">
            <li v-for="(history, i) in summaryInfo.history.illness" :key="i">
              <span>{{history.name}}</span>
              <span>{{history.time}}</span>
            </li>
            <li v-if="!summaryInfo.history.illness || (summaryInfo.history.illness && summaryInfo.history.illness.length === 0)">
              <span>-</span>
            </li>
          </ul>
        </div>
        <div class="patient-history">
          <p class="patient-history-name">既往输血</p>
          <ul class="health-field-list patient-history-content">
            <li v-for="(history, i) in summaryInfo.history.bloodTransfusions" :key="i">
              <span>{{history.causes}}</span>
              <span>{{history.time}}</span>
            </li>
            <li v-if="!summaryInfo.history.bloodTransfusions || (summaryInfo.history.bloodTransfusions && summaryInfo.history.bloodTransfusions.length === 0)">
              <span>-</span>
            </li>
          </ul>
        </div>
        <div class="patient-history">
          <p class="patient-history-name">既往外伤</p>
          <ul class="health-field-list patient-history-content">
            <li v-for="(history, i) in summaryInfo.history.traumas" :key="i">
              <span>{{history.name}}</span>
              <span>{{history.time}}</span>
            </li>
            <li v-if="!summaryInfo.history.traumas || (summaryInfo.history.traumas && summaryInfo.history.traumas.length === 0)">
              <span>-</span>
            </li>
          </ul>
        </div>
     </template>
     </flex-title>
    </div>
    <div class="other-type">
      <flex-title>
        <template v-slot:title>家族史</template>
        <template v-slot:content>
          <ul class="health-field-list">
            <li>
              <span>父亲</span>
              <span>{{summaryInfo.family.father  | formatEmptyData}}</span>
            </li>
            <li>
              <span>兄弟</span>
              <span>{{summaryInfo.family.brother  | formatEmptyData}}</span>
              </li>
            <li>
              <span>儿女</span>
              <span>{{summaryInfo.family.sonAndDaughter  | formatEmptyData}}</span>
            </li>
            <li>
              <span>母亲</span>
              <span>{{summaryInfo.family.mother  | formatEmptyData}}</span>
            </li>
          </ul>
        </template>
      </flex-title>
    </div>
    <div class="other-type marginBtm">
        <flex-title>
            <template v-slot:title>遗传史</template>
            <template v-slot:content>
                <ul class="health-field-list" style="padding-bottom: 0.5rem;">
                    <li>
                        <span>遗传病史</span>
                        <span>{{summaryInfo.genetic.hereditaryDisease | formatEmptyData}}</span>
                    </li>
                    <li>
                        <span>暴露史</span>
                        <span>{{summaryInfo.genetic.exposure | formatEmptyData}}</span>
                    </li>
                </ul>
                <div class="patient-history">
                    <p class="patient-history-name">药物过敏史</p>
                    <ul class="health-field-list patient-history-content">
                        <li v-for="(drugAllergy, i) in summaryInfo.genetic.drugAllergy" :key="i">
                            <span>{{drugAllergy.desc}}</span>
                            <span>{{drugAllergy.time}}</span>
                        </li>
                        <li v-if="!summaryInfo.genetic.drugAllergy || (summaryInfo.genetic.drugAllergy && summaryInfo.genetic.drugAllergy.length === 0)">
                            <span>-</span>
                        </li>
                    </ul>
                </div>
                <div class="patient-history">
                    <p class="patient-history-name">残疾情况</p>
                    <ul class="health-field-list patient-history-content">
                        <li v-for="(disability, i) in summaryInfo.genetic.disability" :key="i">
                            <span>{{disability.name}}</span>
                            <span>{{disability.time}}</span>
                        </li>
                        <li v-if="!summaryInfo.genetic.disability || (summaryInfo.genetic.disability && summaryInfo.genetic.disability.length === 0)">
                            <span>-</span>
                        </li>
                    </ul>
                </div>
            </template>
      </flex-title>
    </div>
  </div>
</template>

<script>
	import flexTitle from '@/components/flex-title/flex-title.vue'
	import { getPatientInfo, getPatientSummaryInfo } from '@/services/healthArchive.js'
	import { getItem } from '@/utils/localStore.js'
	import { showToast } from '@/utils/uniApi.js'
	export default {
		components:{
			flexTitle
		},
		data() {
			return {
				patientInfo: {},
				summaryInfo: {
					family: {},
					genetic: {},
					history: {}
				},
				voucher: {}
			}
		},
		onLoad() {
			this.initData()
		},
		methods: {
			initData(){
				const hosInfo = getItem('selectedHospital')
				this.voucher = getItem('selectedVoucher')
				const globalId = localStorage.getItem(this.$consts.HEALTH_ARCHIVE_GLOBLE_ID)
				const params = {
					orgId: hosInfo ? hosInfo.orgId : this.$consts.orgId,
					cardType: this.voucher.cardType,
					cardNo: this.voucher.cardNo,
					idCardNo: this.voucher.cardNo,
					globalId: globalId
				}
				getPatientInfo(params).then(res => {
					if(res.resultCode !== this.$consts.RESULT_SUCCESS) return
					this.patientInfo = res.data
					const data = {...params, extmpi: res.data.globalId, directoryCode: 'A0101.01'}
					this.getPatientSummary(data)
				})
			},
			getPatientSummary(data){
				getPatientSummaryInfo(data).then(res => {
					if(res.resultCode !== this.$consts.RESULT_SUCCESS){
						if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
							showToast(res.resultMsg);
						}
					}
					const { family, genetic, history } = res.data
					this.summaryInfo.family = family || {}
					this.summaryInfo.genetic = genetic || {}
					this.summaryInfo.history = history || {}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
// .patientInfo{
// 	height: inherit;
// 	background: #F5F5F5;
// }
// .health-field-list{
//   background: #fff;
//   li{
//     height: 2.4rem;
//     align-items: center;
//     border-bottom: 1px solid #E8E8E8;
// 	@include display-flex;
// 	@include justify-content(space-between);
// 	&:last-child{
// 	  border-bottom: 0;
// 	}
//     span{
//       font-size: 0.8rem;
//     }
//     span:nth-child(1){
//       color: #666;
// 	  flex: 0.4;
// 	  font-weight: 300;
//     }
//     span:nth-child(2){
// 	  font-weight: 400;
//       color: #3C3C3C;
// 	  flex: 0.6;
// 	  display: inline-block;
// 	  overflow: hidden;
// 	  text-overflow: ellipsis;
// 	  text-align: right;
//     }
//   }
// }
// .other-type{
// 	margin-top: 0.6rem;
// }
// .marginBtm{
// 	padding-bottom: 0.6rem;
// }
// .patient-history{
// 	padding-bottom: 0.5rem;
// 	&-name{
// 		color: #3C3C3C;
// 		font-size: 0.8rem;
// 		margin-bottom: 0.5rem;
// 	}
// 	&-content{
// 		background: #E9F3FF;
// 		padding: 0 0.4rem;
// 		li{
// 			height: 1.9rem;
// 		}
// 	}
// }
.patientInfo{
  height: inherit;
  background: #F5F5F5;
  overflow-x: hidden;
  padding-top: 0.6rem;
}
.other-type{
  margin-top: 0.6rem;
}
.marginBtm{
  padding-bottom: 0.6rem;
}
.patient-history{
  padding-bottom: 0.5rem;
  &-name{
    color: #3C3C3C;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
}
  &-content{
    background:rgba(233,243,255,0.3);
    padding: 0 0.4rem;
li{
  height: 1.9rem;
}
}
}
</style>
