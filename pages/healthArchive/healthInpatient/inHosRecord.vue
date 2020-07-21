<template>
  <div class="app">
    <scroll @refresh="refresh" class="base-content">
      <div class="hc-list-item">
        <div class="item-content">
          <span class="left">
            入院病情
          </span>
          <span class="right">
            {{data.inHosCondition | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            入院途径
          </span>
          <span class="right">
            {{data.inHosPath | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            入院原因
          </span>
          <span class="right">
            {{data.inHosReasons | formatEmptyData}}
          </span>
        </div>
        <div class="area-content">
          <span class="top">
            入院诊断
          </span>
          <div class="bottom">
            {{data.inHosDiagnosis | formatEmptyData}}
          </div>
        </div>
        <div class="area-content">
          <span class="top">
            住院症状
          </span>
          <div class="bottom">
            {{data.inHosSymptoms | formatEmptyData}}
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
  import { getHealthInHosRecord } from '@/services/healthArchive.js'
  import { $consts } from '@/utils/localStore.js'
  export default {
    data() {
      return {
        data: {}
      }
    },
    mounted() {
      this.refresh();
    },
    methods: {
      refresh() {
        const detailInfo = this.$store.getters.param.healthInHosRecord.detailInfo;
        const params = {
          "directoryCode": 'C0303.01',
          "extId": detailInfo.extBid || ''
        }
        getHealthInHosRecord(params).then((res) => {
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
