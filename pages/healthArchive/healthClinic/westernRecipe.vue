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
          <ul class="health-field-list margin12">
              <li>
                  <span>处方类型</span>
                  <span>{{item.recipeType | formatEmptyData}}</span>
              </li>
              <li>
                  <span>处方有效天数</span>
                  <span>{{item.expiryDate | formatEmptyData}}</span>
              </li>
          </ul>
          <div v-for="(subItem, subindex) in item.medicine" :key="subindex">
            <div class="western-content">
              <span class="left">
                {{ subItem.name | formatEmptyData }}（{{subItem.specification | formatEmptyData}}）
              </span>
            </div>
            <div class="western-val-content dash-border">
              <span class="left">
                使用方法：
              </span>
              <span class="right">
                {{subItem.method | formatEmptyData}}
              </span>
            </div>
            <div class="western-val-content dash-border">
              <span class="left">
                频次：
              </span>
              <span class="right">
                {{subItem.frequency | formatEmptyData}}
              </span>
            </div>
            <div class="western-val-content">
              <span class="left">
                药物使用剂量/单位：
              </span>
              <span class="right">
                {{subItem.dosage | formatEmptyData}}/{{subItem.unit | formatEmptyData}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <no-record :condition="dataList.length === 0" :tips="'暂无数据'"></no-record>
    </scroll>
  </div>
</template>
<script>
  import { getHealthWesternRecipe } from '@/services/healthArchive.js'
  import { showToast } from '@/utils/uniApi.js'
  export default {
    data() {
      return {
        dataList: [],
        showSubContent: false
      };
    },
    mounted() {
      this.refresh();
    },
    methods: {
      refresh() {
        const detailInfo = this.$store.getters.param.healthWesternRecipe.detailInfo;
        const params = {
          "directoryCode": 'C0103.01',
          "extId": detailInfo.extBid || ''
        }
        getHealthWesternRecipe(params).then((res) => {
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
