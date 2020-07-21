<template>
    <div class="app">
        <scroll class="pay-result-view">
            <section class="pay-result-title">
                <dl class="field pay-title-height">
                    <span class="f-strong f-middle">订单号：{{ payResultInfo.orderId }}</span>
                    <dd class="right-item f-strongest f-largest">{{ payResultInfo.payFee | formatFee }}</dd>
                </dl>
            </section>
			<!-- 异常 -->
			<section v-if="payOvertime" class="pay-success-bg">
				<div class="failed-photo"></div>
				<label class="f-largest" v-if="parseFloat(payResultInfo.payFee) > 0">缴费异常，请到窗口办理退费</label>
				<label class="f-largest" v-if="parseFloat(payResultInfo.payFee) <= 0">缴费异常，请到窗口咨询或重新办理该业务</label>
				<div class="pay-btn">
					<button @click="backHome()">完成</button>
				</div>
			</section>
			<!-- 失败 -->
			<section v-if="payFailed" class="pay-success-bg">
				<div class="failed-photo"></div>
				<label class="f-largest">{{ resultInfo }}</label>
				<div class="pay-btn">
					<button @click="goModule()">{{ busiName }}列表</button>
					<button @click="backHome()">完成</button>
				</div>
			</section>
			<!-- 成功 -->
			<section v-if="paySuccess" class="pay-success-bg">
				<div class="success-photo"></div>
				<label class="f-largest">支付成功</label>
				<div class="pay-btn">
					<button @click="goModule()">{{busiName}}{{payResultInfo.busiType === '1006' ? '详情':'列表'}}</button>
					<button @click="backHome()">完成</button>
				</div>
			</section>
           
        </scroll>
    </div>
</template>
<script>
    import { syncOrder } from '@/services/pay.js'
	import { setItem, getItem } from '@/utils/localStore.js'
	const action = {
		'1006': {
			name: '挂号',
			handler: () => {
				console.log(this)
				const self = this
				if(self.paySuccess){
					//	去挂号详情
					setItem('pushUrl', 'regDetail')
					this.$store.dispatch('paramStore/updateParam', {
						namespace: 'reportDetail',
						queryParams: this.busiInfo
					})
					this.$Router.push({name: 'regDetail'})
				} else {
					setItem('pushUrl', 'myRegister')
					this.$Router.replace({name: 'index'})
				}
			}
		},
		'1301': {
			name: '缴费',
			handler: () => {
				setItem('pushUrl', 'clinicUnpayList')
				this.$Router.replace({name: 'index'})
			}
		},
		'1502': {
			name: '充值',
			handler: () => {
				setItem('pushUrl', 'myRecharge')
				this.$Router.replace({name: 'index'})
			}
		}
	}
    export default {
        data() {
            return {
                payResultInfo: {},
				timeOutCount: 0,
				maxTimeOutCount: 30,
				interval: null,
				busiInfo: {},
				paySuccess: false,
				payFailed: false,
				payOvertime: false,
				resultInfo: ''
            }
        },
        onLoad() {
            //	获取参数
			this.payResultInfo = this.$store.getters.param.payResult.payResultInfo
			//开启定时器
			this.interval = setInterval(() => {
			    // 某些定时器操作
			    this.timeOutCount++
			    if (this.timeOutCount >= this.maxTimeOutCount + 1) {
			        clearInterval(this.interval)
			    }
			}, 1000);
			this.loadsyncOrder()
        },
        onUnload(){
			this.interval && clearInterval(this.interval)
		},
		computed:{
			busiName(){
				return action[this.payResultInfo.busiType].name
			}
		},
        methods: {
			loadsyncOrder(){
				if(this.timeOutCount >= this.maxTimeOutCount){
					//	轮询超时，直接显示失败
					this.syncOrderResult('payOvertime')
					return
				}
				const areaInfo = getItem('selectedArea')
				const data = this.payResultInfo
				const params = {
					orgId: data.orgId,
					hospitalId: data.hospitalId,
					areaId: areaInfo.areaId,
					orderId: data.orderId,
					extraMap: data.extraMap || {}
				}
				syncOrder(params).then(res => {
					console.log(res)
					if(res.resultCode !== this.$consts.RESULT_SUCCESS){
						// 异常
						this.syncOrderResult('payOvertime')
						return
					}
					const HIS_NOTIFY_STATUS = this.$consts.HIS_NOTIFY_STATUS
					const ORDER_STATUS = this.$consts.ORDER_STATUS
					const orderStatus = res.data.orderStatus
					const notifyStatus = res.data.notifyStatus
					// his未通知1，订单状态1未支付/2支付中/3已支付，需要轮询
					// his通知失败3，订单状态已支付3/支付中5，需要轮询
					const needSync = (notifyStatus === HIS_NOTIFY_STATUS.NOTIFY_WITHOUT && (orderStatus === ORDER_STATUS.UN_PAYMENT || orderStatus === ORDER_STATUS.PAYING || orderStatus ===ORDER_STATUS.ALREADY_PAYMENT)) ||
						(notifyStatus === HIS_NOTIFY_STATUS.NOTIFY_RETURNED_FEE && (orderStatus === ORDER_STATUS.ALREADY_PAYMENT || orderStatus === ORDER_STATUS.RETUNING_FEE))
					if(needSync){
						this.loadsyncOrder()
						return
					}
					/*
					* 结束轮询，根据业务状态展示不同结果页面
					* */
					if (notifyStatus === HIS_NOTIFY_STATUS.NOTIFY_SUCCESS) {
					    //结束轮询  同步成功
					    this.syncOrderResult('paySuccess', res)
					    return
					}
					if(orderStatus !== ORDER_STATUS.ALREADY_PAYMENT){
						//同步失败界面需要使用订单状态展示不同文案
						// setItem('orderStatus', orderStatus)
						//结束轮询  失败
						this.getFailedMessage(this.payResultInfo.payFee, orderStatus)
						this.syncOrderResult('payFailed')
						return
					}
					if(orderStatus === ORDER_STATUS.ALREADY_PAYMENT && notifyStatus !== HIS_NOTIFY_STATUS.NOTIFY_SUCCESS){
						//结束轮询 异常
						this.syncOrderResult('payOvertime')
					}
					
				}).catch(() => {
					this.syncOrderResult('payOvertime')
				})
			},
			syncOrderResult(model, item){
				this[model] = true
				clearInterval(this.interval)
				item && (this.busiInfo = item)
			},
			getFailedMessage(payFee,orderStatus){
				// 通过订单状态提示对应的信息给用户
				if (parseFloat(payFee) > 0 && orderStatus === this.$consts.ORDER_STATUS.ALREADY_RETUNEED) {
					// 支付成功，业务失败，已退费
					this.resultInfo = '缴费失败，费用已退回原账户'
				} else if (parseFloat(payFee) > 0 && orderStatus === this.$consts.ORDER_STATUS.RETUNED_FAILED || orderStatus === this.$consts.ORDER_STATUS.RETUNED_EXCEPTION) {
					// 支付成功，业务失败，退费成功或者退费异常
					this.resultInfo = '退费异常，请到窗口办理退费'
				} else {
					// 其他支付失败情况
					this.resultInfo = '缴费失败，请到窗口咨询或重新办理该业务'
				}
			},
			// 回首页
			backHome() {
				this.$Router.replace({name: 'index'})
			},
			//根据业务流程busiType，跳转对应业务模块
			goModule() {
				console.log(this)
				action[this.payResultInfo.busiType].handler.call(this)
			}
        }
    }

</script>
<style lang="scss" scoped>
	.pay-result-title{
		margin-bottom: 0;
	}
	.pay-title-height{
		height: 3.75rem;
	}
	.pay-success-bg {
		top: 3.8rem;
		right: 0rem;
		bottom: 0rem;
		left: 0rem;
		background-color: white;
		position: absolute;
		text-align: center
	}
	.failed-photo {
		background: url($redirect-url + $img-file-path + "fail.png");
		background-size: contain;
	}
	.success-photo {
		background: url($redirect-url + $img-file-path + "success-pay.png");
		background-size: contain;
	}
	.pay-btn {
		margin-top: 1.5rem;
		@include display-flex;
		button {
			margin: 0 auto;
			background: #51A8EC;
			border-radius: .25rem;
			width: 6rem;
			height: 2.2rem;
			font-size: .9rem;
			box-shadow: 0 0.2rem 0.5rem #51A8EC;
		}
	}
</style>