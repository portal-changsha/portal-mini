<template>
	<view>
		<div class="hospital-name">
			<img :src="baseImgSrc+ 'hisp-icon.png'" />
		{{hospitalName}}
		</div>
	</view>
</template>

<script>
	import config from '@/config/index.js'
	import { getItem } from '@/utils/localStore.js'
	export default {
		data(){
			return {
				baseImgSrc: config.VUE_APP_IMG_URL,
				hospitalName: ''
			}
		},
		mounted(){
			this.initData()
			uni.$on('backEvent', () => {
				this.initData()
			})
		},
		methods: {
			initData(){
				const hosInfo = getItem('selectedHospital')
				hosInfo && (this.hospitalName = hosInfo.name)
			}
		}
	}
</script>

<style lang="scss" scoped>
.hospital-name{
	@include display-flex;
	@include align-items(center);
	@include justify-content(center);
	height: 2rem;
	line-height: 2rem;
	background: #51a8ec;
	color: #fff;
	img{
		height: 0.75rem;
		width: 0.75rem;
	}
}
</style>
