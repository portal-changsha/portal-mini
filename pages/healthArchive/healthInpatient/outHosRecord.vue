<template>
  <div class="app">
    <scroll @refresh="refresh" class="base-content">
      <div class="hc-list-item">
        <div class="item-content">
          <span class="left">
            科室
          </span>
          <span class="right">
            {{data.deptName | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            病室
          </span>
          <span class="right">
            {{data.sickRoom | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            床号
          </span>
          <span class="right">
            {{data.bedNo | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            住院号
          </span>
          <span class="right">
            {{data.inHosNo | formatEmptyData}}
          </span>
        </div>
        <div class="item-content">
          <span class="left">
            入院时间
          </span>
          <div class="right">
            {{data.inHosTime | formatEmptyData}}
          </div>
        </div>
        <div class="item-content">
          <span class="left">
            出院时间
          </span>
          <div class="right">
            {{data.outHosTime | formatEmptyData}}
          </div>
        </div>
        <div class="item-content">
          <span class="left">
            住院天数
          </span>
          <div class="right">
            {{data.inHosdays | formatEmptyData}}
          </div>
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
            出院情况
          </span>
          <div class="bottom">
            {{data.outHosStatus | formatEmptyData}}
          </div>
        </div>
        <div class="area-content">
          <span class="top">
            出院诊断
          </span>
          <div class="bottom">
            {{data.outHosDiagnosis | formatEmptyData}}
          </div>
        </div>
        <div class="area-content">
          <span class="top">
            出院医嘱
          </span>
          <div class="bottom">
            {{data.outHosAdvice | formatEmptyData}}
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
  import { getHealthOutHosRecord } from '@/services/healthArchive.js'
  import { showToast } from '@/utils/uniApi.js'
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
        const detailInfo = this.$store.getters.param.healthOutHosRecord.detailInfo;
        const params = {
          "directoryCode": 'C0305.13',
          "extId": detailInfo.extBid || ''
        }
        getHealthOutHosRecord(params).then((res) => {
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
