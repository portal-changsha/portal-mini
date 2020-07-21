<template>
	<view>
		<div v-show="condition" class="noData-pic" :style="{marginTop: cusMarginTop}">
		    <p class="noData-text">{{tips}}</p>
		</div>
	</view>
</template>

<script>
	export default {
		props: {
		    condition: {
		      type: Boolean,
		      default: function () {
		        return false
		      }
		    },
		    tips: {
		      type: String,
		      default: function () {
		        return '没有找到相关数据'
		      }
		    },
			cusMarginTop: {
				type: String,
				default: () => {
					return '7.5rem'
				}
			}
		},
		data() {
			return {
				isShow: false,
				origin: []
			};
		}
	}
</script>

<style lang="scss" scoped>
.noData-pic {
  background: url($redirect-url + $img-file-path + 'Norecord.png') no-repeat top center;
  background-size: 5.55rem 5.55rem;
  margin: 7.5rem auto 0 auto;
  width: 100%;
}
.noData-text {
  font-size: 0.9rem;
  color: #333333;
  text-align: center;
  padding-top: 6.5rem;
}
</style>
