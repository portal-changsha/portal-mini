<template>
  <div class="app">
    <scroll @refresh="refresh" class="base-content">
      <div class="hc-list-item">
        <div class="item-content">
          <span class="left">
            住院医院
          </span>
          <span class="right">
            {{healthInpatientDetailInfo.hosName | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            入院时间
          </span>
          <span class="right">
            {{healthInpatientDetailInfo.inHospitalTime | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            入院科室
          </span>
          <span class="right">
            {{healthInpatientDetailInfo.deptName | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            主治医生
          </span>
          <span class="right">
            {{healthInpatientDetailInfo.doctName | formatEmptyData}}
          </span>
        </div>
        <div class="area-content">
          <span class="top">
            出院诊断
          </span>
          <div class="bottom">
            {{healthInpatientDetailInfo.diagnose | formatEmptyData}}
          </div>
        </div>
      </div>
      <div class="hc-grid-content">
        <div class="menu-info-row">
          <div class="menu-info-col" v-for="(item, index) in menuInfo" :key="index" @click="toPage(item.url, item.name)">
            <div class="menu-info-col-area">
              <div class="menu-img" :class="item.class">
				  <i class="iconfont" :class="item.icon" style="color: #fff;"></i>
                <!-- <svg-icon class-name="svg-class" :icon-class="item.icon"></svg-icon> -->
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
  import { getHealthInHosInfo } from '@/services/healthArchive.js'
  import { showToast } from '@/utils/uniApi.js'
  export default {
    data() {
      return {
        healthInpatientDetailInfo: {},
        menuInfo: [
          { title: '入院记录', class: 'health-jc', url: 'inHosRecord', icon: 'iconehr-06', name: 'healthInHosRecord' },
          { title: '检查报告', class: 'health-jy', url: 'healthIPExamDetail', icon: 'iconehr-01', name: 'healthIPExamDetail' },
          { title: '检验报告', class: 'health-cf', url: 'healthIPLabDetail', icon: 'iconehr-07', name: 'healthIPLabDetail' },
          { title: '出院记录', class: 'health-mz', url: 'outHosRecord', icon: 'iconehr-010', name: 'healthOutHosRecord' },
          { title: '出院结算', class: 'health-cy', url: 'outHosCost', icon: 'iconehr-03', name: 'healthOutHosCost' }
        ]
      }
    },
    mounted() {
      this.refresh();
    },
    methods: {
      refresh() {
        const inpatientInfo = this.$store.getters.param.healthInpatientDetail.detailInfo;
		console.log(inpatientInfo)
        if (!inpatientInfo) {
          return
        }
        getHealthInHosInfo(inpatientInfo).then((res) => {
          if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
            if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
              showToast(res.resultMsg);
            }
            return;
          }
          this.healthInpatientDetailInfo = res.data
        });
      },
      toPage(url, name){
		this.$store.dispatch('paramStore/clearParam', name)
		this.$store.dispatch('paramStore/updateParam', {
			namespace: name,
			detailInfo: this.healthInpatientDetailInfo
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