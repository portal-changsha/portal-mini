<template>
	<view>
		<div class="user-info">
		  <img style="width:100%;height:3.5rem;" :src="bgUser" alt="">
		  <div class="avatar">
			<img  :src="userInfo.avatar" alt="">
		  </div>
		  <p class="name">{{userInfo.name}}</p>
		</div>
		<navList :navList="lists" v-on:toPage="toPage" :size="'medium'"></navList>
	</view>
</template>

<script>
	import navList from '@/components/nav-list/nav-list.vue'
	import config from '@/config/index.js'
	import { getUserInfo } from '@/services/userInfo.js'
	const BASE_IMG_URL = config.VUE_APP_IMG_URL
	export default {
		data() {
			return {
				lists: [
				{
				  imgSrc: BASE_IMG_URL + 'Healthcard.png',
				  name: '电子健康卡',
				  url: 'profile'
				},
				{
				  imgSrc: BASE_IMG_URL + 'Interaction.png',
				  name: '政民互动',
				  url: 'zmhd'
				},
				{
				  imgSrc: BASE_IMG_URL + 'service.png',
				  name: '政民服务',
				  url: 'zwfw'
				},
				{
				  imgSrc: BASE_IMG_URL + 'concernDoctor.png',
				  name: '关注的医生',
				  url: 'concernDoctors'
				}
			  ],
			  userInfo: {},
			  bgUser: BASE_IMG_URL + 'bg-user.png'
			}
		},
		components: {
			navList
		},
		onLoad(){
			this.getInfo()
		},
		methods: {
			getInfo(){
				getUserInfo().then(res => {
				if(res.resultCode === this.$consts.RESULT_SUCCESS){
				  if (res.data.role === this.$consts.MONITOR_ROLE.ADMIN_ROLE) {
					this.lists.push(
					  {
						imgSrc: BASE_IMG_URL + 'center_icon_monitoring.png',
						name: '政务监管',
						url: 'cszwjg'
					  })
				  }
				  this.userInfo = res.data
				}
			  })
			},
			toPage(e){
			  console.log(e)
			  this.$Router.push({ name: e })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user-info{
	  position: relative;
	  height: 7.6rem;
	  .avatar{
		position: absolute;
		top: 2rem;
		border-radius: 100%;
		right: 0;
		left: 0;
		margin: 0 auto;
		width: 3.3rem;
		height: 3.3rem;
		background: #fff;
		text-align: center;
		img{
		  width: 3rem;
		  height: 3rem;
		  border-radius: 100%;
		  margin: .15rem 0;
		}
	  }
	  .name{
		position: absolute;
		bottom: .7rem;
		left: 0;
		right: 0;
		margin: 0 auto;
		text-align: center;
	  }
	}
</style>


