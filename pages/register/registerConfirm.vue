<template>
  <div class="schedule">

    <div class="doc-info row row-center">
      <div class="row">
        <div class="doc-logo">
          <img v-if="docInfo.doctAvatar || originImgUrl" :src="docInfo.doctAvatar? docInfo.doctAvatar : originImgUrl + 'ico-doctor.png'" alt="">
		  <!-- 门诊类型标签 -->
		  <span v-if="docInfo.typeId === '849772'" class="type-tag tag-putong">{{docInfo.typeName}}</span>
		  <span v-if="docInfo.typeId === '643075'" class="type-tag tag-zhuanjia">{{docInfo.typeName}}</span>
        </div>
        <div class="doc-detail">
          <p>{{docInfo.doctName || docInfo.name}}  {{docInfo.rankName || docInfo.rank}} </p>
          <p class="doc-dept">{{docInfo.deptName || docInfo.dept}}</p>
        </div>
      </div>
    </div>

    <ul class="field-list">
      <li>
        <span>预约科室</span>
        <span>{{registerData.deptName}}</span>
      </li>
      <li>
        <span>医院</span>
        <span>{{hosInfo.name}}</span>
      </li>
      <li>
        <span>预约时间</span>
        <span>{{registerData.regDate | formatDate('myRegister')}} {{registerData.phaseDesc}}</span>
      </li>
      <li>
        <span>挂号金额</span>
        <span><label style="color: #FF0000;">{{registerData.regFee | formatFee}}</label></span>
      </li>
    </ul>
    <div class="voucher-info" >
      <div class="info-title row row-center">
        <p>选择电子健康卡</p>
        <button @click="toAddVoucher">+绑定电子健康卡</button>
      </div>
      
      <div class="tips row row-center" v-if="vouchers.length===0">
        <div class="tips-img" v-if="originImgUrl">
          <img  :src="originImgUrl + 'voucher-add.png'" alt="">
        </div>
        <div>暂无电子健康卡,请先<span @click="toAddVoucher">绑定电子健康卡</span></div>
      </div>
    </div>
	<div class="voucher-area">
		<div style="padding: 0 0.75rem;">
			<voucher-item ref="voucherItem" @selected="selectVoucher($event)" :canChoose="true" @getVoucherList="getVoucherList"></voucher-item>
		</div>
	</div>
    <div class="confirm-btn">
      <button :disabled="vouchers.length === 0" @click="confirm()" :class="{disabled: vouchers.length === 0}">确认挂号</button>
    </div>
  </div>
</template>
<script>
import { getItem, setItem } from '@/utils/localStore.js'
import voucherItem from '@/components/voucher-item-small/voucher-item-small.vue'
import config from '@/config/index.js'
import { registerLock } from '@/services/register.js'
import payMixin from '@/mixins/payMixin.js'
export default {
  mixins: [payMixin],
  data() {
    return {
      vouchers: [],
      docInfo: {},
	  registerParams: {},
	  registerData: {}
    }
  },
  components: {
    voucherItem
  },
  onLoad () {
	  //	获取需要的参数
	  const store = this.$store.getters.param
	  if(store.registerConfirm){
		  this.registerParams = store.registerConfirm.registerParams
		  this.registerData = store.registerConfirm.registerData
	  }
	  //	获取医生信息
	  if(store.doctorInfo && store.doctorInfo.doctorInfo){
		  this.docInfo = store.doctorInfo.doctorInfo
		  console.log(this.docInfo)
	  }  
	  this.hosInfo = getItem('selectedHospital')
	  this.areaInfo = getItem('selectedArea')
	  // this.voucher = getItem('selectedVoucher')
  },
  computed: {
    originImgUrl () {
      return config.VUE_APP_IMG_URL
    }
  },
  methods: {
	getVoucherList(e){
		this.vouchers = e  
	},
    toAddVoucher () {
      
    },
    async confirm () {
      // 确认挂号,锁号成功后跳转到支付页面,并将当前挂号时间存入vuex中
	  const params = {
		  orgId: this.hosInfo.orgId,
		  hospitalId: this.hosInfo.id,
		  areaId: this.areaInfo.areaId,
		  cardType: this.voucher.cardType,
		  cardNo: this.voucher.cardNo
	  }
	  const requestParams = {...params, ...this.registerParams, regDate: this.registerData.regDate }
	  console.log(requestParams)
	  registerLock(requestParams).then(res => {
		  if(res.resultCode !== this.$consts.RESULT_SUCCESS){
			  const errorCode = res.errorCode;
			  // 通过errorCode区分挂号失败原因，和后台约定重复挂号的错误码
			  if (errorCode === this.$consts.REPEAT_REGISTER_ERROR_CODE) {
				  // 由于重复挂号导致失败，弹窗引导用户跳转到挂号列表
				  showModal('请勿重复预约', '请前往我的挂号进行缴费或取消预约', true, '前往').then(result => {
					  if(result.confirm){
						  //	跳转至我的挂号界面
						  this.$Router.push({name: 'myRegister'})
					  }
				  })
			  }
			return
		  }
		  const data = res.data
		  console.log(res)
		  const item = { ...data, orderId: data.orderNo, deptName: this.registerData.deptName }
		  console.log(item)
		  const busiType = this.$consts.BUSI_TYPE.REGISTRATION_PAYMENT
		  //判断是否0元需求
		  if (parseFloat(res.payFee) <= 0) {
			this.createOrderId(item, busiType).then(() => {
				this.$Router.push({name: 'payResult'})
			})
		  	return
		  }
		  //挂号不缴费，取号缴费
		  if (item.takeType === '2') {
		  	this.bookingPay(item, busiType)
		  	return
		  }
		  this.getPayConfig(item, busiType).then(() => {
          this.$Router.push({name: 'pay'})
      })
	  })
    },
    //  选择电子健康卡
    selectVoucher (e) {
      this.voucher = e
	  console.log(this.voucher)
      setItem('selectedVoucher', e)
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule{
  height: inherit;
  background: #EFF2F5;
}
.row{
  padding: 0;
  @include align-items(center);
}
.doc-info{
  height: 4rem;
  background:#fff;
  margin-bottom: 0.4rem;
  .doc-logo{
	position: relative;
    img{
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 100%;
      display:block;
      padding:0.25rem 0.75rem;
    }
	span{
		position: absolute;
		bottom: 0.1rem;
		right: 1rem;
		left: auto;
		top: auto;
	}
  }
  .doc-detail{
    p:nth-child(1){
      color: #111;
      font-size: 0.9rem;
      font-weight:500;

    }
    .doc-dept{
      color: #999;
      font-size: 0.65rem;
    }

  }
}
.field-list{
  margin: 0.5rem 0;
}
.confirm-btn{
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 3rem;
  box-shadow:0px -1px 2px 0px rgba(81,168,236,0.2);
  background:#fff;
  button{
    height: 2.2rem;
    background: #51A8EC;
    color: #FFFFFF;
    font-size: 0.9rem;
    border-radius: 5px;
    margin:0.35rem 0.75rem;
  }
  .disabled{
    background: #999;
  }
}
.voucher-info{
  background: #fff;
  padding: 0 0.75rem 0.5rem 0.75rem;
  .info-title{
    justify-content: space-between;
  }
  p{
    height: 2.5rem;
    line-height: 2.5rem;
    color: #111;
    font-size: 0.75rem;
  }
  button{
    border: 1px solid #51A8EC;
    height: 1.75rem;
    background: #fff;
    color: #51A8EC;
    font-size: .75rem;
    line-height: 1.75rem;
    margin: 0;
  }
  .tips {
    height: 5rem;
    background: #fff;
    font-size: 0.65rem;
    border: 1px dashed #51A8EC;
	color: #111;
    .tips-img{
      padding-right: 0.75rem;
      img{
        width: 3.2rem;
        height: 3.6rem;
        display: block;
      }

    }
    span{
      color: #51A8EC;
      font-size: 0.65rem;
    }
  }
}
.voucher-area{
	position: absolute;
	top: 17rem;
	bottom: 3rem;
	width: 100%;
	overflow-y: auto;
	overflow-x: hidden;
}
</style>

