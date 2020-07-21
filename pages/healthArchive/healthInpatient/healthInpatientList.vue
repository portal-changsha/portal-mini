<template>
  <div class="app">
    <scroll @refresh="refresh" class="base-content">
      <div class="hc-list-item" v-for="(item, index) in healthInpatientList" :key="index" @click="goDetail(item)">
        <div class="date-item-content">
          <div class="date-content">
            <span class="date-left">
              {{item.inHospitalDate | formatEmptyData}}
            </span>
			<i class="iconfont iconright-kong"></i>
            <!-- <svg-icon icon-class="arrw-right" class="date-right"></svg-icon> -->
          </div>
        </div>
        <div class="item-content">
          <span class="left">
            住院医院
          </span>
          <span class="right">
            {{item.inpatientHospital | formatEmptyData}}
          </span>
        </div>
        <div class="area-content">
          <span class="top">
            住院诊断
          </span>
          <div class="bottom">
            {{item.inpatientDiagnosis | formatEmptyData}}
          </div>
        </div>
      </div>
      <no-record :condition="healthInpatientList.length === 0" :tips="'暂无数据'"></no-record>
    </scroll>
  </div>
</template>
<script>
  import { getHealthInpatientList } from '@/services/healthArchive.js'
  import { getItem } from '@/utils/localStore.js'
  import { showToast } from '@/utils/uniApi.js'
  export default {
    data() {
      return {
        healthInpatientList: []
      };
    },
    mounted() {
      this.refresh();
    },
    methods: {
      refresh() {
        const requestParams = {
          globalId: getItem(this.$consts.HEALTH_ARCHIVE_GLOBLE_ID),
        }
        getHealthInpatientList(requestParams).then((res) => {
          //结束加载提示
          if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
            if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
              showToast(res.resultMsg);
            }
            return;
          }
          this.healthInpatientList = res.data
        });
      },
      goDetail(info) {
		this.$store.dispatch('paramStore/clearParam', 'healthInpatientDetail')
		this.$store.dispatch('paramStore/updateParam', {
			namespace: 'healthInpatientDetail',
			detailInfo: info
		})
        this.$Router.push({
          name: 'healthInpatientDetail'
        });
      }
    },
  }
</script>
