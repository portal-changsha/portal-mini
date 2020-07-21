<template>
	<view class="health-archive-padding">
		<div class="flex-title" @click="showDetail()">
			<div class="flex-title-text">
				<slot name="title"></slot>
			</div>
			<div class="flex-arrow">
				<div class="arrow-button">
					<i v-if="direction ==='right'" class="iconfont iconright-kong"></i>
					<i v-else-if="direction !=='right' && showContent" class="iconfont iconup-kong"></i>
					<i v-else class="iconfont icondown-kong"></i>
				</div>
			</div>
		</div>
		<div v-show="showContent" class="flex-content">
			<slot name="content"></slot>
		</div>
		
	</view>
</template>

<script>
	export default {
		props:{
			isShowContent: {
			  type: Boolean,
			  default: false
			},
			direction: {
			  type: String,
			  default: 'down'
			},
			showArrow: {
			  type: Boolean,
			  default: true
			}
		},
		data() {
			return {
				showContent: false
			};
		},
		mounted(){
			this.showContent = this.isShowContent
		},
		methods: {
			showDetail(){
			  if(this.direction === 'right' || !this.showArrow) return
			  this.showContent = !this.showContent
			}
		}
	}
</script>

<style lang="scss" scoped>
.flex-title{
	height: 2.3rem;
	@include display-flex;
	@include justify-content(space-between);
	@include align-items(center);
	background: #fff;
	&::after{
		content: '';
		position: absolute;
		width: 0.2rem;
		height: 0.9rem;
		background: #2A8DFF;
	}
	&-text{
		color:#3C3C3C;
		font-weight: 500;
		font-size: 0.8rem;
		padding-left: 1rem;
	}
	.flex-arrow{
		margin-right: 0.6rem;
		.arrow-button{
			width:1.2rem;
			height:1.2rem;
			padding: 0;
			border-radius: 100%;
			text-align: center;
			i{
				font-size: 1.2rem;
			}
		}
	}
}
.flex-content{
	padding: 0 0.6rem 0.6rem 1.2rem;
	background: #fff;
}
.health-archive-padding{
  background: #fff;
  padding: 0 0.6rem;
	margin-bottom: 0.6rem;
}
</style>
