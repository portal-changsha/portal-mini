<template>
  <div class="app">
    <div class="user-info">
      <img style="width:100%;height:70px;" v-if="baseSrc" :src="baseSrc + 'bg-user.png'" alt="">
      <div class="avatar">
        <img  :src="userInfo.avatar" alt="">
      </div>
      <p class="name">{{userInfo.name}}</p>
    </div>
    <Nav-List :navList="lists" v-on:toPage="toPage" :size="'medium'"></Nav-List>
  </div>
</template>
<script>
import NavList from '@/components/NavList'
import { getUserInfo } from '@/service/user.service.js'
export default {
  data: function () {
    return {
      lists: [
        {
          imgSrc: this.constant.LOCAL_IMG + 'Healthcard.png',
          name: '电子健康卡',
          url: 'profile'
        },
        {
          imgSrc: this.constant.LOCAL_IMG + 'zmhd.png',
          name: '政民互动',
          url: 'zmhd'
        },
        {
          imgSrc: this.constant.LOCAL_IMG + 'service.png',
          name: '政民服务',
          url: 'zwfw'
        }
      ],
      userInfo: {},
      baseSrc: this.constant.LOCAL_IMG
    }
  },
  components: {
    NavList
  },
  onLoad () {
    this.getInfo()
  },
  methods: {
    async getInfo () {
      let user = await getUserInfo()
      if (user.result !== this.constant.RESULT_SUCCESS) return
      this.userInfo = user.data
    },
    toPage (e) {
      this.$utils.navigateTo(e)
    }
  }
}
</script>
<style lang="scss" scoped>
.user-info{
  position: relative;
  height: 152px;
  .avatar{
    position: absolute;
    top: 40px;
    border-radius: 100%;
    right: 0;
    left: 0;
    margin: 0 auto;
    width: 66px;
    height: 66px;
    background: #fff;
    text-align: center;
    img{
      width: 60px;
      height: 60px;
      border-radius: 100%;
      margin: 3px 0;
    }
  }
  .name{
    position: absolute;
    bottom: 14px;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
  }
}
</style>

