<template>
	<view class="app">
		<section class="no-bottom">
			<div class="search-bar">
				<label></label>
				<input class="input-search" type="text" placeholder="请输入医院、科室或医生姓名" readonly="true" @click="goSearch">
			</div>
		</section>
		<div class="app-content">
			<div class="banner" v-if="voucherList.length === 0">
				<img :src="banner" alt="">
				<button @click="toPage('checkInfomation')"></button>
			</div>
			<!-- 绑卡之后的样式 -->
			<div v-else class="banner-content">
				<swiper ref="mySwiper" v-if="voucherList.length>0" @change="swiperChange" :autoplay="false" :current="currentSlide">
					<swiper-item v-for="(voucher, index) in voucherList" :key="index" >
						<div class="swiper-item-content">
							<health-card-item :voucher="voucher" class="swiper-voucher"
								v-on:selected="selectVoucher(voucher, index, $event)">
							</health-card-item>
						</div>
					</swiper-item>
				</swiper>
				<div class="add-voucher">
					<button @click="toPage('checkInfomation')">+添加电子健康卡</button>
				</div>
			</div>
			
		</div>
		<div class="index-content">
			<menu-list :type="'mainService'"></menu-list>
			<menu-list :type="'multipleService'"></menu-list>
			<menu-list :type="'hospitalService'"></menu-list>
			<menu-list :type="'otherService'" v-on:toPage="toPage"></menu-list>
		</div>
		 <!-- 个人中心按钮底部固定-->
		<footer class="user-btn">
			<button @click="toPage('userCenter')">前往个人中心</button>
		</footer>
	</view>
</template>

<script>
	import menuList from '@/components/menusList.vue'
	import healthCardItem from "@/components/health-card-item/health-card-item.vue"
	import config from '@/config/index.js'
	import { showModal, showActionSheet, showToast } from '@/utils/uniApi.js'
	import { getVoucherList } from '@/services/voucher.js'
	import { matchLocalStoreVoucher } from '@/utils/index.js'
	const BASE_IMG_URL = config.VUE_APP_IMG_URL
	import { getItem, removeItem } from '@/utils/localStore.js'
	import healthArchiveMixin from '@/mixins/healthArchive.js'
	import locationMixin from '@/mixins/locationMixin.js'

	export default {
		mixins:[healthArchiveMixin, locationMixin],
		data() {
			return {
				voucherList: [],
				banner: BASE_IMG_URL + 'banner.png',
				inputText: '',
				isChoose: false,
				currentSlide: 0,
				showSubView: false,
				dialogConfig: {
				  'notThreeHighs': `目前健康档案仅面向<span style="color: #2A8DFF;">老年人、糖尿病、高血压</span>居民提供查阅，后续将逐步向全民开放。如信息有误，请向该用户所在的社区服务卫生服务中心或乡镇卫生院进行反馈`,
				  'globalIdNull': `您还未建档，请联系居住地所在社区医院进行建档！`
				}
			}
		},
		components:{
			menuList,
			healthCardItem
		},
		//跳转支付完成的业务模块
		beforeMount() {
			const query = this.$Route.query
			console.log(query)
			console.log(location.href)
			const pushUrl = getItem('pushUrl')
			if (pushUrl) {
				this.$Router.push({name: pushUrl})
				removeItem('pushUrl');
			}
			this.$store.dispatch('paramStore/clearParam', 'all')
		},
		// computed:{
		// 	swiperTransform(){
		// 		console.log(this.currentSlide)
		// 		return {
		// 			transform: `translate(86+${this.currentSlide * 100}%, 0) scale(.8) !important`
		// 			// color: 'red'
		// 		}
		// 	}
		// },
		onLoad() {
			// this.testData = '我有值了'
			getVoucherList().then(res => {
				console.log(res)
				if(res.resultCode === this.$consts.RESULT_SUCCESS){
					this.voucherList = res.data
					matchLocalStoreVoucher(res.data)
					//	定位
					this.getCurrentLocation()
				}
			})
		},
		methods: {
			toPage(url){
				if (url === 'checkInformation') {
					if (this.voucherList.length === 5) {
						showToast('您已绑定5张电子健康卡，如需绑定其他电子健康卡，请先解绑一张');
						return
					}
				}
				if(url === 'healthVoucherSelect' && this.voucherList.length === 1){
					//  判断健康卡张数
					this.valideUser(this.voucherList).then(() => {
						this.$Router.push({name: url})
					}).catch(res => {
						if (res.resultCode !== this.constant.RESULT_SUCCESS) {
							if(res.errorCode === 'notThreeHighs' || res.errorCode ==='globalIdNull'){
								showModal('提示', this.dialogConfig[err.errorCode], false)
							}
						}
					})
					return
				}
				this.$Router.push({name: url})
			},
			swiperChange(e){
				console.log(e)
				this.currentSlide = e.detail.current;
			},
			swiperTransform(index){
				return {
					color: 'red',
					transform: 'translate(-90px, 0) scale(.8) !important'
				}
			},
			goSearch(){
				this.$Router.push({name: 'searchSelect'})
			},
			selectVoucher(selectedVoucher) {
				//	保存数据至vuex
				this.$store.dispatch('paramStore/updateParam', {
					namespace: 'voucher',
					voucherInfo: selectedVoucher
				})
				// this.$store.dispatch('voucherStore/addVoucherInfo', selectedVoucher)
				this.$Router.push({name: 'voucherDetail'});
			}
		}
	}
</script>

<style lang="scss">
	uni-swiper{
		height: 9.55rem;
	}
	$fontFamilyMedium: PingFang-SC-Medium;
    $fontFamilyBold: PingFang-SC-Bold;
    .app {
        background: #EDEEF2;
    }

    .app-content {
        padding-top: .55rem;
        background: white;
    }
    .banner {
        height: 4.5rem;
        position: relative;

        img {
            width: 100%;
            height: 100%;
        }

        button {
            position: absolute;
            height: 1.8rem;
            right: .4rem;
            width: 40%;
            bottom: 1rem;
            background: transparent;
        }
    }

    .banner-content {
        background: #fff;
    }
	.index-content{
		margin-bottom: 4.15rem;
	}
    .user-btn {
		position: fixed;
        padding: .75rem;
        background: white;
        button {
            height: 2.2rem;
            background: linear-gradient(270deg, rgba(61, 134, 255, 1), rgba(113, 190, 255, 1));
            border-radius: .4rem;
            width: 100%;
            font-size: .9rem;
            font-family: PingFang-SC-Medium;
            font-weight: 400;
            color: #fff;
        }
    }

    .add-voucher {
        text-align: center;
        margin-top: -.6rem;
        z-index: 99999999;
        position: relative;

        button {
            width: 80%;
            height: 1.7rem;
            color: #619cff;
            font-size: .8rem;
            font-family: $fontFamilyBold;
            border-radius: .85rem;
            background: #fff;
            box-shadow: 0 0 1rem rgba(58, 151, 255, .3);
            font-weight: bold;
        }
    }

    .swiper-slide-next,
    .swiper-slide-prev {
        -webkit-transition: all .3s ease 0s;
        transition: all .3s ease 0s;
    }
    .swiper-slide-next{
        // transform: translate(-90px, 0) scale(.8) !important;
		transform: scale(.8) !important;
    }
    .swiper-slide-prev{
        // transform: translate(90px, 0) scale(.8) !important;
		transform: scale(.8) !important;
    }

    .swiper-slide-active {
        transition: all 0.3s ease 0s;
        -webkit-transition: all 0.3s ease 0s;
    }
    .search-bar {
        height: 2.5rem;
        background: #fff;
        box-shadow: 0px 1px 2px 0px rgba(81, 168, 236, 0.2);
        padding: 0 .25rem 0 .25rem;
        display: flex;

        input {
            height: 1.6rem;
            flex: 1;
            margin: .75rem .45rem 0 .45rem;
            border: 1px solid white;
            border-radius: 20px;
            padding-left: .5rem;
            background: #EFF2F5;
            text-align: center;
        }
        label {
            left: 16%;
            background: url($redirect-url + $img-file-path + "icon-search.png") no-repeat center;
            background-size: .7rem;
            width: 1.6rem;
            height: 1.6rem;
            position: absolute;
            top: .75rem;
        }
    }
	.swiper-voucher{
		width: 80%;
		margin: 0 auto;
	}
</style>
