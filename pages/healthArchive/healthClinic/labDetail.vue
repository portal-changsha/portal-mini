<template>
  <div class="app">
    <scroll @refresh="refresh" class="base-content">
      <div class="hc-list-item title" style="padding-bottom: 0px;" :class="{'lastDom': index === dataList.length - 1}" v-for="(item, index) in dataList" :key="index">
        <div class="date-item-content" @click="changeContent(index)">
          <div class="date-content">
            <span class="date-left">
              {{item.labName | formatEmptyData}}
            </span>
			<i v-show="!item.showContent" class="iconfont icondown-kong date-right"></i>
			<i v-show="item.showContent" class="iconfont iconup-kong date-right"></i>
          <!--  <svg-icon v-show="!item.showContent" icon-class="arrw-down" class="date-right"></svg-icon>
            <svg-icon v-show="item.showContent" icon-class="arrw-up" class="date-right"></svg-icon> -->
          </div>
        </div>
        <div v-show="item.showContent" class="content">
          <div class="item-content">
            <span class="left">
              报告时间
            </span>
            <span class="right">
              {{item.labTime | formatEmptyData}}
            </span>
          </div>
          <div class="item-content">
            <span class="left">
              报告单号
            </span>
            <span class="right">
              {{item.labId | formatEmptyData}}
            </span>
          </div>
          <div class="flex-content">
            <div class="title-content">
              <span class="left">
                项目名称
              </span>
              <span class="right">
                结果
              </span>
              <span class="right">
                状态
              </span>
            </div>
            <div class="val-content" v-for="(subItem, subindex) in item.detail" :key="subindex">
              <div class="value-content">
                <span class="left">
                  {{ subItem.project | formatEmptyData }}
                </span>
                <span class="right">
                  {{ subItem.result | formatEmptyData }}
                </span>
                <span class="right">
					<i class="iconfont icondown" v-show="isContains(subItem.status, '偏低')"></i>
					<i class="iconfont iconup" v-show="isContains(subItem.status, '偏高')"></i>
                   <!-- <svg-icon v-show="$utils.isContains(subItem.status, '偏低')" icon-class="down"></svg-icon>
                   <svg-icon v-show="$utils.isContains(subItem.status, '偏高')" icon-class="up"></svg-icon> -->
                </span>
               
              </div>
              <div class="tips-content">
                <span class="tip">
                  参考范围{{ subItem.reference | formatEmptyData }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-tips" v-show="dataList.length !== 0">
        <div class="flex-content">
          <div class="left">
            <!-- <svg-icon icon-class="up"></svg-icon> -->
			<i class="iconfont iconup"></i>
            表示偏高
          </div>
          <div class="right">
			<i class="iconfont icondown"></i>
            <!-- <svg-icon icon-class="down"></svg-icon> -->
            表示偏低
          </div>
        </div>
      </div>
      <no-record :condition="dataList.length === 0" :tips="'暂无数据'"></no-record>
    </scroll>
  </div>
</template>
<script>
  import { getHealthLabDetail } from '@/services/healthArchive.js'
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
        const detailInfo = this.$store.getters.param.healthLabDetail.detailInfo;
		const hosInfo = getItem('selectedHospital')
		const voucher = getItem('voucherSelect')
        const params = {
			"orgId": hosInfo.orgId || this.$consts.ORG_ID,
			"cardNo": voucher.cardNo,
			"cardType": voucher.cardType,
			"verifyData": voucher.verifyData || this.$consts.ORG_ID,
			"directoryCode": 'C0104.02',
			"extId": detailInfo.extBid || ''
        }
        this.isLoading = true
        getHealthLabDetail(params).then((res) => {
          this.isLoading = false
          if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
            if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
              showToast(res.resultMsg);
            }
            return;
          }
          for (const index in res.data) {
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
        this.dataList[index].showContent = !this.dataList[index].showContent;
      },
	  isContains(targetStr, exp) {
		if (typeof targetStr === 'undefined' || targetStr === null) {
			return false
		}
		return targetStr.indexOf(exp) !== -1
	  }
    }
  }
</script>
<style lang="scss" scoped>
  .bottom-tips {
    width: 100%;
    background: #f5f5f5;
    z-index: 200;
    position: fixed;
    bottom: 0;
    text-align: center;

    .flex-content {
      height: 1.9rem;
      line-height: 1.9rem;
      border-radius: 1rem;
      margin: 0 1.35rem 0 1.35rem;
      display: flex;
      font-size: 0.9rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3C3C3C;

      .left {
        flex: 1
      }

      .right {
        flex: 1
      }
    }
  }
  .lastDom{
    margin-bottom: 2rem;
  }
</style>