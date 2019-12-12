<template>
  <div>
    <div><img src="/static/images/inMap.jpg" alt="" @click="showBigImg()"></div>
  </div>
</template>
<script>
  export default {
    methods: {
      showBigImg () {
        var arr = []
        arr.push('/static/images/inMap.jpg')
        this.$utils.showBigImg(0, arr)
      }
    }
  }
</script>
