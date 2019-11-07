<template>
  <div class="voucher-success">
    <div class="success-img">
      <img :src="baseSrc + 'Success .png'" alt="">
    </div>
    <p class="success-tips">电子健康卡绑定成功</p>
    <div class="success-btn row">
      <button @click="toPage('departDoctor')">去挂号</button>
      <button @click="toPage('index')">去首页</button>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      baseSrc: this.constant.LOCAL_IMG
    }
  },
  methods: {
    toPage (url) {
      if (url !== 'index') {
        this.$utils.navigateTo('hospitalSelect', {waitUrl: 'departDoctor'})
        return
      }
      mpvue.reLaunch({
        url: '../' + url + '/main'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.voucher-success{
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background: #EFF2F5;
  .success-img{
    margin-top: 60px;
    text-align: center;
    img{
      width: 107px;
      height: 93.5px;
      margin: 0 auto;
    }
  }
  .success-tips{
    font-size: 18px;
    color: #333;
    text-align: center;
    margin: .5rem 0 1.5rem 0;
  }
  .success-btn{
    margin: 0 42px;
    width: auto;
    button{
      font-size: 18px;
      width: 120px;
      background: #51A8EC;
      box-shadow: 0 2px 5px #51A8EC;
      height: 44px;
      color: #fff;
      // &:nth-child(2){
      //   float: right;
      // }
    }
  }
}
</style>

