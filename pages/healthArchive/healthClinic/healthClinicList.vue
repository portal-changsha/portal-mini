<template>
  <div class="app">
    <scroll @refresh="refresh" class="base-content">
      <div style="margin-top: 0.6rem;" v-for="(clinicInfo, index) in healthClinicList" :key="index" @click="goDetail(clinicInfo)">
        <flex-title :isShowContent="true" :direction="'right'">
            <template v-slot:title>{{clinicInfo.visitData | formatEmptyData}}</template>
            <template v-slot:content>
                <ul class="health-field-list">
                    <li>
                        <span>就诊医院</span>
                        <span>{{clinicInfo.hospitalName | formatEmptyData}}</span>
                    </li>
                    <li>
                        <span>就诊科室</span>
                        <span>{{clinicInfo.deptName | formatEmptyData}}</span>
                    </li>
                </ul>
            </template>
        </flex-title>
      </div>
      <no-record :condition="healthClinicList.length === 0" :tips="'暂无数据'"></no-record>
    </scroll>
  </div>
</template>
<script>
  import { getHealthClinicList } from '@/services/healthArchive.js'
  import flexTitle from '@/components/flex-title/flex-title.vue'
  import { showToast } from '@/utils/uniApi.js'
  import { getItem } from '@/utils/localStore.js'
  export default {
    components: {
      flexTitle
    },
    data() {
      return {
        isLoading: false,
        healthClinicList: []
      };
    },
    mounted() {
      this.refresh();
    },
    methods: {
      refresh() {
		const hosInfo = getItem('selectedHospital')
		const voucher = getItem('voucherSelect')
        const requestParams = {
          "globalId": getItem(this.$consts.HEALTH_ARCHIVE_GLOBLE_ID),
		  "orgId": hosInfo.orgId || this.$consts.ORG_ID,
		  "cardNo": voucher.cardNo,
		  "cardType": voucher.cardType,
		  "verifyData": voucher.verifyData || this.$consts.ORG_ID,
        }
        getHealthClinicList(requestParams).then((res) => {
          //结束加载提示
          this.isLoading = false;

          if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
            if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
              showToast(res.resultMsg);
            }
            return;
          }
          this.healthClinicList = res.data
        });
      },
      goDetail(clinicInfo) {
		this.$store.dispatch('paramStore/clearParam', 'healthClinicDetail')
		this.$store.dispatch('paramStore/updateParam', {
			namespace: 'healthClinicDetail',
			clinicInfo: clinicInfo
		})
        this.$Router.push({
          name: 'healthClinicDetail'
        });
      }
    },
  }
</script>
<style scoped lang="scss">
	.health-field-list{
	  background: #fff;
	  li{
	    min-height: 2.4rem;
	    align-items: center;
	    border-bottom: 1px solid #E8E8E8;
	    @include display-flex;
	    @include justify-content(space-between);
	  
	    span{
	      font-size: 0.8rem;
	    }
	    span:nth-child(1){
	      color: #3C3C3C;
	      flex: 0.4;
	      font-weight: 300;
	    }
	    span:nth-child(2){
	      font-weight: 400;
	      color: #3C3C3C;
	      flex: 0.6;
	      display: inline-block;
	      overflow: hidden;
	      text-overflow: ellipsis;
	      text-align: right;
	    }
	  }
	}
</style>