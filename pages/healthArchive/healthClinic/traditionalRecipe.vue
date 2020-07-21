<template>
  <div class="app">
    <scroll @refresh="refresh" class="base-content">
      <div class="hc-list-item title" style="padding-bottom: 0px;" v-for="(item, index) in dataList" :key="index">
        <div class="date-item-content" @click="changeContent(index)">
          <div class="date-content">
            <span class="date-left">
              处方编号：{{item.recipeId | formatEmptyData}}
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
              处方类型
            </span>
            <span class="right">
              {{item.recipeType | formatEmptyData}}
            </span>
          </div>
          <div class="item-content">
            <span class="left">
              处方有效天数
            </span>
            <span class="right">
              {{item.expiryDate | formatEmptyData}}
            </span>
          </div>
          <div class="flex-content">
            <div class="title-content">
              <span class="left">
                药物名称
              </span>
              <span class="left">
                药物使用计量
              </span>
              <span class="right">
                单位
              </span>
            </div>
            <div class="val-content" v-for="(subItem, subindex) in item.medicine" :key="subindex">
              <div class="value-content">
                <span class="left">
                  {{ subItem.name | formatEmptyData }}
                </span>
                <span class="left">
                  {{ subItem.dosage | formatEmptyData }}
                </span>
                <span class="right">
                  {{ subItem.unit | formatEmptyData }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <no-record :condition="dataList.length === 0" :tips="'暂无数据'"></no-record>
    </scroll>
  </div>
</template>
<script>
  import { getHealthTraditionalRecipe } from '@/services/healthArchive.js'
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
        const detailInfo = this.$store.getters.param.healthTraditionalRecipe.detailInfo;
        const params = {
			"directoryCode": 'C0103.02',
			"extId": detailInfo.extBid || ''
        }
        this.isLoading = true
        getHealthTraditionalRecipe(params).then((res) => {
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
      }
    }
  }
</script>
