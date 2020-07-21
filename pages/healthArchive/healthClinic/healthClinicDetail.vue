<template>
  <div class="app">
    <scroll @refresh="refresh" class="base-content">
      <div class="hc-list-item">
        <div class="item-content">
          <span class="left">
            就诊医院
          </span>
          <span class="right">
            {{healthClinicDetailInfo.hospitalName | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            就诊时间
          </span>
          <span class="right">
            {{healthClinicDetailInfo.diagnoseTime | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            就诊科室
          </span>
          <span class="right">
            {{healthClinicDetailInfo.deptName | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            就诊医生
          </span>
          <span class="right">
            {{healthClinicDetailInfo.doctName | formatEmptyData}}
          </span>
        </div>
        <div class="area-content">
          <span class="top">
            门诊诊断
          </span>
          <div class="bottom">
            {{healthClinicDetailInfo.diagnose | formatEmptyData}}
          </div>
        </div>
      </div>
      <div class="hc-grid-content">
        <div class="menu-info-row">
          <div class="menu-info-col" v-for="(item, index) in menuInfo" :key="index" @click="toPage(item.url, item.name)">
            <div class="menu-info-col-area">
              <div class="menu-img" :class="item.class">
				  <i style="color: #fff;" class="iconfont" :class="item.icon"></i>
              </div>
              <div class="menu-title">
                <p>{{item.title}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
  import { getHealthClinicDetail } from '@/services/healthArchive.js'
  import { showToast } from '@/utils/uniApi.js'
  export default {
    data() {
      return {
        isLoading: false,
        healthClinicDetailInfo: {},
        menuInfo: [
          { title: '检查报告', class: 'health-jc', url: 'healthExamDetail', icon: 'iconehr-01', name: 'healthExamDetail' },
          { title: '检验报告', class: 'health-jy', url: 'healthLabDetail', icon: 'iconehr-07', name: 'healthLabDetail' },
          { title: '药品处方', class: 'health-cf', url: 'westernRecipe', icon: 'iconehr-05', name: 'healthWesternRecipe' },
          { title: '门诊费用', class: 'health-mz', url: 'costList', icon: 'iconehr-03', name: 'healthCostList' }
        ]
      }
    },
    mounted() {
      this.refresh();
    },
    methods: {
      refresh() {
        // var clinicInfo = this.$store.state.paramModule.param.healthClinicDetail.clinicInfo;
		const store = this.$store.getters.param
		const clinicInfo =store.healthClinicDetail.clinicInfo
        if (!clinicInfo) {
          return
        }
        this.isLoading = true;
        getHealthClinicDetail(clinicInfo).then((res) => {
          //结束加载提示
          this.isLoading = false;

          if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
            if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
              showToast(res.resultMsg);
            }
            return;
          }
          this.healthClinicDetailInfo = res.data
        });
      },
      toPage(url, name){
		this.$store.dispatch('paramStore/clearParam', name)
		this.$store.dispatch('paramStore/updateParam', {
			namespace: name,
			detailInfo: this.healthClinicDetailInfo
		})
        this.$Router.push({
          name: url
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.hc-list-item{
  margin-bottom: 0;
}
.hc-grid-content{
  padding: 0.6rem 1.2rem 0 1.2rem;
}
</style>