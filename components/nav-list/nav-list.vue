<template>
	<view class="navigator">
		<ul>
		  <li v-for="(item, index) in navList" :key="index" @click="toPage(item.url)" :class="{hasBotBor:flag,small:size === 'small',medium: size === 'medium'}">
			<div class="navigator-area">
			  <img v-if="item.imgSrc" :src="item.imgSrc" alt>
			  <p :style='{color: fontColor}'>{{item.name}}</p>
			</div>
			<div class="navigator-icon">
			  <img v-if="flag" :src="flagMoreImg" alt>
			  <img v-else :src="flagRightImg" alt>
			</div>
		  </li>
		</ul>
	</view>
</template>

<script>
	import config from '@/config/index.js'
	const BASE_IMG_URL = config.VUE_APP_IMG_URL
	export default {
		props:{
			navList: {
			  type: Array,
			  default: () => {
				return []
			  }
			},
			flag: {
			  type: Boolean,
			  default: () => {
				return true
			  }
			},
			size: {
			  type: String,
			  default: () => {
				return 'big'
			  }
			},
			fontColor: {
				type: String,
				default: () => {
					return '#111'
				}
			}
		},
		data() {
			return {
				flagMoreImg: BASE_IMG_URL + 'more-arrow.png',
				flagRightImg: BASE_IMG_URL + 'more-right-blue.png'
			};
		},
		methods: {
		    toPage(url){
		      this.$emit('toPage',url)
		    }
		}
	}
</script>

<style lang="scss" scoped>
.navigator{
    background: #fff;
    // margin: .25rem 0 0 0;
    ul{
      li{
        height: 3rem;
        display: flex;
        align-items: center;
        padding: 0 .75rem;
        justify-content: space-between;
        border-bottom: 1px solid #eaeaea;
        &:last-child{
          border: 0;
        }
        .navigator-area{
          display: flex;
          align-items: center;
          img{
            width: 1.25rem;
          }
          p{
            padding-left: .6rem;
            color: #111;
            font-size: 15px;
          }
        }
        .navigator-icon{
          img{
            width: .5rem;
          }
        }
        
      }
      .small{
        height: 1.5rem;
      }
      .medium{
        height: 2.5rem;
      }
    }
    .hasBotBor{
      border-bottom: 1px solid #eaeaea !important;
    }
  }
</style>
