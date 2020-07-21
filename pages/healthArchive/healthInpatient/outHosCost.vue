<template>
  <div class="app">
    <scroll @refresh="refresh" class="base-content">
      <div class="hc-list-item">
        <div class="date-item-content">
          <div class="date-content">
            <span class="date-left">
              费用合计：{{ data.total | formatMoney }}元
            </span>
          </div>
          <i></i>
        </div>
        <div v-for="(item, index) in data.costList" :key="index">
          <div class="item-content">
            <span class="left">
              {{item.name}}
            </span>
            <span class="right">
              {{item.cost | formatMoney }}元
            </span>
          </div>
        </div>
      </div>
      <no-record :condition="data.costList.length === 0" :tips="'暂无数据'"></no-record>
    </scroll>
  </div>
</template>
<script>
  import { getHealthOutHosCost } from '@/services/healthArchive.js'
  import { showToast } from '@/utils/uniApi.js'
  export default {
    data() {
      return {
        data:{
			costList: []
		}
      };
    },
    mounted() {
      this.refresh();
    },
    methods: {
      refresh() {
        const detailInfo = this.$store.getters.param.healthOutHosCost.detailInfo;
        const params = {
          "directoryCode": 'C0301.01',
          "extId": detailInfo.extBid || ''
        }
        getHealthOutHosCost(params).then((res) => {
          if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
            if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
              showToast(res.resultMsg);
            }
            return;
          }
          this.data = res.data
        });
      }
    }
  }
</script>
