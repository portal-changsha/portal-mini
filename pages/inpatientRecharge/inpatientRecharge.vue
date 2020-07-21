<template>
	<view class="app">
		<div class="inpatient-recharge">
		    <hos-voucher-select v-on:select="select" ></hos-voucher-select>
		    <div v-if="inpatientInfoList.length > 0">
		      <ul class="field-list marginTop5">
		        <li>
		          <span>住院号</span>
		          <span>{{inpatientInfo.inPatientNo}}</span>
		        </li>
		        <li>
		          <span>院区科室</span>
		          <span>{{inpatientInfo.deptName}}</span>
		        </li>
		        <li>
		          <span>床位号</span>
		          <span>{{inpatientInfo.bedNo}}</span>
		        </li>
		        <li>
		          <span>入院时间</span>
		          <span>{{inpatientInfo.inDate  | formatDate}}</span>
		        </li>
		      </ul>
		      <ul class="field-list marginTop5">
		        <li>
		          <span>住院预缴金总额</span>
		          <span>{{inpatientInfo.total  | formatFee}}</span>
		        </li>
		        <li>
		          <span>{{inpatientTips(inpatientInfo.balance)}}</span>
		          <span>{{inpatientInfo.balance  | formatFee}}</span>
		        </li>
		      </ul>
		      <div class="money-input marginTop5" v-if="inpatientInfo.status === '2'">
		        <input type="number" name="price" id= 'price' placeholder="请输入金额..." v-model="payFee" @input="oninput" @change="oninput(payFee)"><span>元</span>
		      </div>
		      <div class="inpatient-pay-btn" v-if="inpatientInfo.status === '2'">
		        <button @click="goPay">确认支付</button>
		      </div>
		    </div>
		    <no-record :condition="inpatientInfoList.length <= 0" :tips="'抱歉,没有查到您的住院信息!'"></no-record>
		 </div>
	</view>
</template>

<script>
	import hosVoucherSelect from '@/components/hos-voucher-selcet/hos-voucher-selcet.vue'
	import { showToast } from '@/utils/uniApi.js'
	import { getItem, setItem } from '@/utils/localStore.js'
	import { getInpatientInfo } from '@/services/inpatient.js'
	import { getHosAppId } from '@/services/pay.js'
	export default {
		components:{
			hosVoucherSelect
		},
		data() {
			return {
				inpatientInfoList: [],
				inpatientInfo: {},
				voucher: {},
				hosInfo: {},
				areaInfo: {},
				payFee: ''
			};
		},
		computed:{
			inpatientTips(){
				return (balance) => {
					return balance < 0 ? '(余额不足)' : '住院预缴金余额'
				}
			}
		},
		onLoad(){
			this.initData()
			uni.$on('backEvent',() => {
				//	刷新数据
				this.initData()
			})
		},
		onUnload(){
			uni.$off('backEvent')
		},
		methods: {
			initData(){
				// 效验医院选择
				const selectHospital = getItem('selectedHospital')
				this.voucher = getItem('selectedVoucher')
				if (!selectHospital || !selectHospital.id) {
					showToast('请选择医院')
					return;
				}
				//处理未绑定就诊凭证
				if (!this.voucher.cardType || !this.voucher.cardNo) {
					return showToast('请先绑定电子健康卡')
				}

				let selectArea = getItem('selectedArea')
				const params = {
					orgId: selectHospital.orgId,
					hospitalId: selectHospital.id,
					areaId: selectArea.areaId,
					cardType: this.voucher.cardType,
					cardNo: this.voucher.cardNo,
				}
				this.loadInPatientInfo(params)
			},
			oninput (e) {
				if (e === undefined || e.target === undefined) {
				  return
				}
				if ((e.inputType === 'insertText' && (e.target._value.indexOf('.') !== -1 && e.data.indexOf('.') === 0)) || (parseFloat(e.target.value) > 3000 || parseFloat(e.target.value) < 0) || (e.target.value.indexOf('.') >= 0 && e.target.value.split('.')[1].length > 2)) {
				  const a = '-1'
				  e.target.value = (a.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				  this.payFee = e.target._value
				  e.target.value = this.payFee
				  showToast('请输入0-3000内的金额')
				  return
				}
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				if (e.inputType !== 'deleteContentBackward') {
				  this.payFee = e.target.value ? e.target.value : e.target._value
				}
			},
			select(e){
				this.$store.dispatch('paramStore/updateParam', {
					namespace: 'DistrictSelect',
					target: 'inpatientRecharge',
				})
				this.$Router.push({name: e});
			},
			loadInPatientInfo(params) {
				this.inpatientInfoList = [];
				getInpatientInfo(params).then((res) => {
					if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
					if (res.data.length === 0 || res.data[0].status === '1') return
					//防止数组越界
					this.inpatientInfoList= res.data;
					this.inpatientInfo = this.inpatientInfoList[0]
					if (this.inpatientInfo.status !== '2') {
						showToast('您不是在院患者，无法充值')
					}
				})
			},
			goPay() {
				//  判断金额是否正确
				if(this.payFee === '' || parseFloat(this.payFee) <= 0 || parseFloat(this.payFee) > 3000){
					showToast('请输入0-3000内的金额')
					return
				}
				const totalFee = parseFloat(this.payFee).toFixed(2)
				this.$store.dispatch('paramStore/clearParam', 'pay');
				this.$store.dispatch('paramStore/clearParam', 'WeChatPay');
				//将数据存入本地
				this.$store.dispatch('paramStore/updateParam', {
					namespace: 'pay',
					payInfo: {
						cardType: this.voucher.cardType,
						cardNo: this.voucher.cardNo,
						payFee: totalFee*100,
						busiType: this.$consts.BUSI_TYPE.IN_PATIENT_RECHARGE_PAYMENT,
						busiIds: [this.inpatientInfo.inPatientNo],
					},
				})
				this.getPayConfig();
			},
			/*获取医院code,回调支付方式界面*/
			getPayConfig() {
				const hosInfo = getItem('selectedHospital')
				const areaInfo = getItem('selectedArea')
				const params = {
					orgId: hosInfo.orgId,
					hospitalId: hosInfo.id,
					areaId: areaInfo.areaId,
					channelId: this.$consts.PAY_TYPE.WX_PAY,
					invokeType: this.$consts.INVOKE_TYPE.WAP_INVOKE,
				}
				//获取医院支付信息
				getHosAppId(params).then(res => {
					if(res.resultCode !== this.$consts.RESULT_SUCCESS) return
					setItem('wxPayAppId', res.data.appId)
					this.$Router.push({ name: 'pay' })
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app{
		background: #E9E9E9 ;
	}
.inpatient-pay-btn{
    margin: 2.25rem 0.65rem 0.5rem 0.8rem;
    button{
      background: #51A8EC;
      border-radius: 5px;
      height: 2.2rem;
      width: 100%;
      font-size:0.9rem;
      font-family:PingFang;
      font-weight:500;
      color:rgba(255,255,255,1);
    }
  }
  .inpatient-recharge{
    height: inherit;
    background: #E9E9E9;
    .tips{
      text-align: center;
      height: 2rem;
      line-height: 2rem;
      color: #333;
      font-size: 0.75rem;
    }
    .clinic-info{
      background: #fff;
      margin-bottom: 0.5rem;
      h3{
        height: 2.25rem;
        line-height: 2.25rem;
        padding: 0 0.75rem;
        border-bottom: 1px solid #DBDBDB;
      }
      .content{
        width: auto;
        padding: 0 0.75rem;
        position: relative;
        justify-content: space-between;
        height: 3.5rem;
        .left{
          font-size: 0.75rem;
          p{
            color: #999999;
          }
        }
        .arrow{
          img{
            width: 0.4rem;
            height: 0.65rem;
          }
        }
      }
      .reg-status{
        height: 2.5rem;
        padding:0 0.75rem;
        width:auto;
        border-top: 1px solid #DBDBDB;
        justify-content: space-between;
        p{
          color: #51A8EC;
          font-size: 0.75rem;
        }
        .right{
          text-align: right;
        }
        button{
          color: #fff;
          font-size: 0.75rem;
          display: inline-block;
          width: 3.5rem;
          height: 1.75rem;

          border-radius: 5px;
          border: 0;

          margin-left: 0.5rem;
          &:nth-child(1){
            background: #DBDBDB;
            box-shadow: 0 2px 4px #DBDBDB;
          }
          &:nth-child(2){
            background: #51A8EC;
            box-shadow: 0 2px 4px #51A8EC;
          }
          &:nth-child(3){
            background: #FF0000;
            box-shadow: 0 2px 4px #FF0000;
          }
        }
      }
    }
  }
  .money-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 0.75rem;
    input{
      height: 2.25rem;
      line-height: 2.25rem;
      font-size: 0.75rem;
    }
  }
  .marginTop5{
    margin-top: 5px;
    box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
  }
</style>
