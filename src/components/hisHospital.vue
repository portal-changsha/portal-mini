<template>
  <div class="his-hospital" v-if="flag">
    <div class="his-content">
      <span>上次选择:{{selectHosInfo.hospitalName}}({{selectHosInfo.areaName}})</span>
      <!-- <span> {{selectHosInfo.hospitalName}}({{selectHosInfo.areaName}})</span> -->
      <!-- <img :src="originImgUrl + 'more-arrow.png'" alt=""> -->
      <span @click="toPage(selectHosInfo)">继续 ></span>
    </div>
  </div>
</template>
<script>
import { getItem } from '@/utils/store'
export default {
  data: function () {
    return {
      selectHosInfo: false,
      flag: false
    }
  },
  computed: {
    originImgUrl () {
      return this.constant.LOCAL_IMG
    }
  },
  onShow () {
    let temp = getItem('selectedHospital')
    if (temp) {
      this.selectHosInfo = temp
      this.flag = true
    }
  },
  methods: {
    toPage (item) {
      this.$emit('toPage', item)
    }
  }
}
</script>
<style lang="scss" scoped>
  .his-hospital{
    width: 100%;
    // min-height: 40px;
    // line-height: 40px;
    color: #3272C9;
    // padding: 0 15px;
    font-size: 15px;
    position: relative;
    background: #E0EDFA;
    .his-content{
      @include display-flex;
      @include align-items(center);
      padding: 10px 15px;
      span:nth-child(2){
        // float: right;
        white-space: nowrap;
        img{
          width: 7px;
          height: 12px;
        }
      }
    }
  }
</style>

