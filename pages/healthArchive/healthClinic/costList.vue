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
  import { getHealthCostList } from '@/services/healthArchive.js'
  import { getItem } from '@/utils/localStore.js'
  import { showToast } from '@/utils/uniApi.js'
  export default {
    data() {
      return {
        isLoading: false,
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
        // const detailInfo = this.$store.state.paramModule.param.healthCostList.detailInfo;
		const store = this.$store.getters.param
		const detailInfo =store.healthCostList.detailInfo
		const hosInfo = getItem('selectedHospital')
		const voucher = getItem('voucherSelect')
        const params = {
			"orgId": hosInfo.orgId || this.$consts.ORG_ID,
			"cardNo": voucher.cardNo,
			"cardType": voucher.cardType,
			"verifyData": voucher.verifyData || this.$consts.ORG_ID,
			"directoryCode": 'C0102.01',
			"extId": detailInfo.extBid || ''
        }
        this.isLoading = true;
        getHealthCostList(params).then((res) => {
          //结束加载提示
          this.isLoading = false;
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
