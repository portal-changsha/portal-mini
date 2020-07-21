<template>
    <div class="app">
        <scroll :class="{'to-bottom-btn': toBottomBtn}" @refresh="refresh">
            <div>
                <section class="regDetail">
                    <dl class="field">
                        <dt>医院</dt>
                        <dd>{{regDetail.hospitalName}}</dd>
                    </dl>
                    <dl class="field">
                        <dt>院区</dt>
                        <dd>{{regDetail.areaName}}</dd>
                    </dl>
                    <dl class="field">
                        <dt>科室</dt>
                        <dd>{{regDetail.deptName}}</dd>
                    </dl>
                  
                    <div class="row border-bottom">
                        <span class="left">科室地址 </span>
						<span class="right">{{regDetail.location}}</span>
                    </div>
                    <dl class="field">
                        <dt>医生</dt>
                        <dd>{{regDetail.doctName}}</dd>
                    </dl>
                    <dl class="field last" v-if="regDetail.typeName">
                        <dt>门诊类型</dt>
                        <dd>{{regDetail.typeName}}</dd>
                    </dl>
                    <div class="status-img">
                        <p v-if="(regDetail.regStatus === '1'  || regDetail.regStatus === '2' || regDetail.regStatus === '3' || regDetail.regStatus === '5') && regDetail.busiStatus !== '5' "
                           class="status-cancel"></p>
                        <p v-if="regDetail.regStatus === '4' && (regDetail.takeType === '2' || regDetail.busiStatus !== '2') "
                           class="status-booked"></p>
                        <p v-if="regDetail.regStatus === '6' || regDetail.regStatus === '7' || regDetail.regStatus === '8'"
                           class="status-over"></p>
                        <p v-if="(regDetail.busiStatus === '5' || regDetail.busiStatus === '6' ) && regDetail.regStatus === '9'"
                           class="status-retirednumber"></p>
                    </div>
                </section>
                <section>
                    <dl class="field">
                        <dt>就诊人</dt>
                        <dd>{{voucher.holderName}}/{{voucher.mobileNo}}</dd>
                    </dl>
                    <dl class="field">
                        <dt>就诊时间</dt>
                        <dd>{{regDetail.regDate | formatDate}} {{regDetail.phaseDesc}}</dd>
                    </dl>
                    <dl class="field" v-if="regDetail.waitNo">
                        <dt>就诊序号</dt>
                        <dd>{{regDetail.waitNo}}</dd>
                    </dl>
                    <dl class="field">
                        <dt>挂号时间</dt>
                        <dd>{{regDetail.orderTime | formatDate}}</dd>
                    </dl>
                    <dl class="field last" v-if="regDetail.clinicId">
                        <dt>门诊号</dt>
                        <dd>{{regDetail.clinicId}}</dd>
                    </dl>
                </section>
                <section>
                    <dl class="field">
                        <dt>订单号</dt>
                        <dd>{{regDetail.orderNo}}</dd>
                    </dl>
                    <dl class="field last">
                        <dt>挂号金额</dt>
                        <dd class="f-strongest">{{regDetail.payFee | formatFee}}</dd>
                    </dl>
                </section>
                <section v-if="hosInfo.hospitalId === '430105001' && regDetail.canTakeNo === '1'">
                    <dl class="field last">
                        <dt>是否需要取号</dt>
                        <dd>
                            <button id="take-no-online" class="take-no-btn" @click="takeNoClick(regDetail)" :disabled="canNotTakeNo"><span v-if="canNotTakeNo">已取号</span><span v-if="!canNotTakeNo">取号</span>
                            </button>
                        </dd>
                    </dl>
                </section>
            </div>
            <section class="tips my-tips" v-if="regDetail.regStatus === '4' && hosInfo.hospitalId !== $consts.HOSPITAL_ID.CSSDBRMYY">
                <span class="f-strong">提示信息：</span>
                <br> 1、请您在预约时间前30分钟到达医院。
                <br> 2、如您不能按时就诊，请提前一天（晚上凌晨以前）取消预约，多次爽约将被纳入黑名单。
                <br> 3、如果当天需要取消预约，请在门诊收费窗口办理。
            </section>
            <section class="tips my-tips" v-if="regDetail.regStatus === '4' && hosInfo.hospitalId === $consts.HOSPITAL_ID.CSSDBRMYY">
                <span class="f-strong">提示信息：</span>
                <br>1、请提前30分钟到门/急诊自助机，选择“挂号缴费凭条打印”打印挂号凭条后就诊，如过号请咨询分诊台。
                <br>2、点击“个人中心-电子健康卡”，选择就诊人的电子健康卡可以查看电子健康卡二维码。
            </section>
        </scroll>
        <footer>
            <div class="flex-row flex-align-center pay-btn total-fee center"
                 :class="{'left': (regDetail.regStatus === '4' && (regDetail.busiStatus === '1' || regDetail.busiStatus === '2')) || (regDetail.takeType !== '2' && regDetail.regStatus === '4' && regDetail.busiStatus === '2')}">
                <div class="flex-1 row" style="justify-content: center;">
                    <span class="total-fee">总金额</span>
                    <span class="f-strongest">{{regDetail.payFee | formatFee}}</span>
                </div>
                <button v-if="regDetail.regStatus === '4' && (regDetail.busiStatus === '1' || regDetail.busiStatus === '2')"
                        @click.stop="toActive(regDetail, 0, 'cancel')" class="btn-footer-right btn-footer-cancel">取消预约
                </button>
                <button v-if="regDetail.busiStatus === '4' && regDetail.regStatus === '4'"  @click.stop="toActive(regDetail, 0, 'fade')"
                        class="btn-footer-right btn-fund btn-footer-refund">退号
                </button>
                <button v-if="regDetail.takeType !== '2' && regDetail.regStatus === '4' && regDetail.busiStatus === '2'"
                        @click.stop="goPay(regDetail)"
                        class="btn-footer-right">立即缴费
                </button>
            </div>
        </footer>
    </div>
</template>
<script>
   import registerMixin from '@/mixins/registerMixin.js'
   import payMixin from '@/mixins/payMixin.js'
   import pushMixin from '@/mixins/pushMixin.js'
   import { getItem } from '@/utils/localStore.js'
   import { takeNo } from '@/services/register.js'
   import { showModal } from '@/utils/uniApi.js'
    export default {
		mixins: [registerMixin, payMixin, pushMixin],
        data() {
            return {
                regDetail: {},
				canNotTakeNo: false
            }
        },
        computed: {
            toBottomBtn() {
                return (this.regDetail.regStatus === '4') || this.regDetail.regStatus === '9';
            }
        },
        
        onLoad() {
			this.voucher = getItem('selectedVoucher')
			this.hosInfo = getItem('selectedHospital')
			this.areaInfo = getItem('selectedArea')
			
			console.log(this.regDetail)
            this.$nextTick(() => {
				this.regDetail = this.queryParams
			})
        },
        methods: {
            takenNoConfirm() {
                const takeNoParams = {
                    orgId: this.hosInfo.orgId,
                    hospitalId: this.hosInfo.id,
                    areaId: this.areaInfo.areaId,
                    cardType: this.voucher.cardType,
                    cardNo: this.voucher.cardNo,
                    regId: this.regDetail.regId,
                    orderNo: this.regDetail.orderNo
                }
                takeNo(takeNoParams).then(res => {
                    if (res.resultCode !== this.constant.RESULT_SUCCESS) return
                    //取号按钮置灰
                    this.canNotTakeNo = true;
                })
            },
            takeNoClick() {
				showModal('提示', '过号后需要重新排队，请确保到达医院后再取号。').then(res => {
					if(res.confirm){
						this.takenNoConfirm()
					}
				})
            },
            goPay(item) {
                //判断是否0元需求
                if (parseFloat(item.payFee) <= 0) {
                	this.zeroPay(item);
                	return;
                }
                //挂号不缴费，取号缴费
                if (item.takeType === '2') {
                	this.bookingPay(item)
                	return
                }
                this.getPayConfig(item, this.$consts.BUSI_TYPE.REGISTRATION_PAYMENT).then(() => {
                    this.$Router.push({name: 'pay'})
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .take-no-btn {
        line-height: 1.5rem;
		float: right;
        height: 1.5rem;
        width: 3.3rem;
        background: green;
        color: white;
    }
    .my-tips {
        font-size: 0.625rem;
        background: #eff2f5;
        color: #999;
        font-size: 0.65rem;
    }

    .total-fee {
        font-size: 0.9rem;
    }

    .center {
        text-align: center;
    }

    .left {
        text-align: left;
    }

    .regDetail {
        position: relative;
        .status-img {
            position: absolute;
            top: 2rem;
            right: 4rem;

            p {
                width: 4.6rem;
                height: 4.6rem;
            }

            .status-cancel {
                background: url($redirect-url + $img-file-path + "Cancelled.png") no-repeat center;
                background-size: 100%;
            }

            .status-booked {
                background: url($redirect-url + $img-file-path + "Booked.png") no-repeat center;
                background-size: 100%;
            }

            .status-paid {
                background: url($redirect-url + $img-file-path + "Paid.png") no-repeat center;
                background-size: 100%;
            }

            .status-retirednumber {
                background: url($redirect-url + $img-file-path + "Retirednumber.png") no-repeat center;
                background-size: 100%;
            }

            .status-over {
                background: url($redirect-url + $img-file-path + "registerOver.png") no-repeat center;
                background-size: 100%;
            }
        }
    }

    footer {
        button {
            margin: 0;
            width: 100%;
            background: #fff;
            color: #ff0000;
        }

        .btn-cancel {
            background: #FB6464;
            color: #fff;
            box-shadow: none;
        }

        .btn-fund {
            box-shadow: none;
        }
    }

    .pay-btn {
        height: 3rem;
        background: #fff;
        .btn-footer-right {
            border-radius: 0;
            width: 4.5rem;
            background: #51A8EC;
            color: #fff;
            height: inherit;
			line-height: 3rem;
        }

        .btn-footer-cancel {
            border-radius: 0;
            background: #D8EDFB;
            color: #888888;
            height: inherit;
        }

        .btn-footer-refund {
            border-radius: 0;
            background: #FB6464;
            color: #fff;
            height: inherit;
        }

        .f-strongest {
            font-size: 0.9rem;
        }
    }
	.row{
		padding: 0;
		align-items: center;
		min-height: 2rem;
		.left{
			flex: 0.3;
			padding-left: 0.75rem;
		}
		.right{
			flex: 0.7;
			padding: 0.75rem 0;
			margin-left: 0;
			text-align: right;
			margin-right: 0.75rem;
		}
	}
</style>
