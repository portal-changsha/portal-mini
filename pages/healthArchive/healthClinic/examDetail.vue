<template>
  <div class="app">
    <scroll @refresh="refresh" class="base-content">
      <div class="hc-list-item title" style="padding-bottom: 0px;" v-for="(item, index) in dataList" :key="index">
        <div class="date-item-content" @click="changeContent(index)">
          <div class="date-content">
            <span class="date-left">
              {{item.examName | formatEmptyData}}
            </span>
			<i v-show="!item.showContent" class="iconfont icondown-kong date-right"></i>
			<i v-show="item.showContent" class="iconfont iconup-kong date-right"></i>
            <!-- <svg-icon v-show="!item.showContent" icon-class="arrw-down" class="date-right"></svg-icon>
            <svg-icon v-show="item.showContent" icon-class="arrw-up" class="date-right"></svg-icon> -->
          </div>
        </div>
        <div v-show="item.showContent" class="content">
          <div class="item-content">
            <span class="left">
              报告时间
            </span>
            <span class="right">
              {{item.repTime | formatEmptyData}}
            </span>
          </div>
          <div class="area-content">
            <span class="top">
              检查部位
            </span>
            <div class="bottom">
              {{item.part | formatEmptyData}}
            </div>
          </div>
          <div class="area-content">
            <span class="top">
              检查描述
            </span>
            <div class="bottom">
              {{item.describe | formatEmptyData}}
            </div>
          </div>
          <div class="area-content">
            <span class="top">
              检查诊断
            </span>
            <div class="bottom">
              {{item.diagnose | formatEmptyData}}
            </div>
          </div>
        </div>
      </div>
      <no-record :condition="dataList.length === 0" :isLoading="isLoading" :tips="'暂无数据'"></no-record>
    </scroll>
  </div>
</template>
<script>
  import { getHealthExamDetail } from '@/services/healthArchive.js'
  import { showToast } from '@/utils/uniApi.js'
  import { getItem } from '@/utils/localStore.js'
  export default {
    data() {
      return {
        isLoading: false,
        dataList: [],
        showSubContent: false
      };
    },
    mounted() {
      this.refresh();
    },
    methods: {
      refresh() {
        // const detailInfo = this.$store.state.paramModule.param.healthExamDetail.detailInfo;
		const store = this.$store.getters.param
		const detailInfo =store.healthExamDetail.detailInfo
		const hosInfo = getItem('selectedHospital')
		const voucher = getItem('voucherSelect')
        const params = {
			"orgId": hosInfo.orgId || this.$consts.ORG_ID,
			"cardNo": voucher.cardNo,
			"cardType": voucher.cardType,
			"verifyData": voucher.verifyData || this.$consts.ORG_ID,
			"directoryCode": 'C0104.01',
			"extId": detailInfo.extBid || ''
        }
        this.isLoading = true
        getHealthExamDetail(params).then((res) => {
          this.isLoading = false
          if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
            if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
              showToast(res.resultMsg);
            }
            return;
          }
          for(const index in res.data) {
            if (index === '0') {
              res.data[index].showContent = true
            } else {
              res.data[index].showContent = false
            }
          }
          this.dataList = res.data
        })
      },
      changeContent(index) {
        this.dataList[index].showContent=!this.dataList[index].showContent;
      }
    }
  }
</script>
