<template>
	<view>
		<div class="profile">
			<div class="top-tips" v-if="voucherList.length === 0">
			  <span>挂号、缴费、查报告前请先绑定电子健康卡。</span>
			</div>
			<div class="btn" :class="{novoucher:voucherList.length > 0}">
			  <button :class="{unableToAdd: 5 === voucherList.length}" :disabled="5 === voucherList.length" @click="goAddVoucher">绑定电子健康卡</button>
			</div>
			<p class="one-step-bind-card" type="button" @click="goBindMoreCard" :class="{unableToBindCard: 5 === voucherList.length}" >已有健康卡，一键快速关联</p>
			<p class="voucher-tips" v-if="5 === voucherList.length">如需绑定新的电子健康卡,请先<span>解绑</span>一张</p>
			<p class="voucher-tips" v-if="voucherList.length>0 && voucherList.length<5">还能绑定<span> {{5 - voucherList.length}} </span>张电子健康卡</p>
			<div class="voucher-list">
			  <health-card-item @selected="selectVoucher($event)" v-for="(item,index) in voucherList" :key="index" :voucher="item"></health-card-item>
			</div>
			<no-record :condition="voucherList.length === 0" :tips="'暂无电子健康卡'"></no-record>
			<sub-web-view :webUrl="webUrl" v-if="isOpenSubView"></sub-web-view>
		 </div>
		 
	</view>
</template>

<script>
	import healthCardItem from "@/components/health-card-item/health-card-item.vue"
	import subWebView from '@/components/subWebView.vue'
	import noRecord from '@/components/no-record/no-record.vue'
	import config from '@/config/index.js'
	import { getVoucherList } from '@/services/voucher.js'
	import { setTitle } from '@/utils/uniApi.js'
	const BASE_IMG_URL = config.VUE_APP_IMG_URL
	export default {
		components:{
			healthCardItem,
			noRecord,
			subWebView
		},
		data() {
			return {
				usermessage: [],
				voucherList: [],
				withoutCard: BASE_IMG_URL + 'Norecord.png',
				baseSrc: BASE_IMG_URL,
				isOpenSubView: false,
				webUrl: ''
			};
		},
		beforeRouteLeave(to, from, next) {
			// 导航离开该组件的对应路由时调用
			if(this.isOpenSubView){
				this.isOpenSubView = false
				// setTitle('电子健康卡')
				next({
				    name: 'profile',
				    NAVTYPE: 'push'
				})
			}else {
				next()
			}
		},
		onLoad(){
			this.initData()
		},
		methods:{
			initData(){
				getVoucherList().then(res => {
					if(res.resultCode === this.$consts.RESULT_SUCCESS){
						this.voucherList = res.data
					}
				})
			},
			selectVoucher(e){
				console.log(e)
				//	保存数据至vuex
				this.$store.dispatch('paramStore/updateParam', {
					namespace: 'voucher',
					voucherInfo: e
				})
				//	跳转卡详情页
				this.$Router.push({ name: 'voucherDetail' })
			},
			goBindMoreCard(){
				if(this.voucherList.length === 5){
					return
				}
				//配置回调地址
				// const redirect_uri = location.href.split('Profile')[0] + 'completeCard';
				const redirect_uri = location.href;
				// const redirect_uri = 'https://csmh.hngwmt.com/base';
				this.webUrl = 'https://health.tengmed.com/open/getHealthCardList?redirect_uri=' + redirect_uri
				this.isOpenSubView = true
			},
			goAddVoucher(){
				this.$Router.push({name: 'checkInfomation'})
			}
				
		}
	}
</script>

<style lang="scss" scoped>
	$fontColor: #51A8EC;
	  .profile{
	    padding: 0 0.75rem 0 0.75rem;
	    .top-tips{
			background: #fff;
			padding-left: 0;
			span{
				padding-left: 0.5rem;
			}
	    }
	    .btn{
	      button{
	        background: $fontColor;
	        color: #fff;
	        font-size: 18px;
	        font-weight:500;
	        border: 0;
	        box-shadow: 0 2px 8px $fontColor;
	        height: 44px;
	      }
	      .unableToAdd{
	        background: #D6D6D6;
	        color: #999999;
	        box-shadow: 0 4px 10px #D6D6D6;
	      }
	    }
	    .novoucher{
	      padding: 10px 0 0 0;
	    }
	    .voucher-tips{
	      color: #333333;
	      font-size: 0.75rem;
		  text-align: center;
	      span{
	        color: $fontColor;
	      }
	    }
	  }
	  .one-step-bind-card {
		  margin-top: .5rem;
		  margin-bottom: .5rem;
		  text-align: center;
		  padding: 0 .75rem;
		  color: #51A8EF;
		  font-size: 0.7rem;
	  }
</style>
