<template>
  <div class="clinic app">
    <ul class="field-list clinic-content">
      <li>
        <span>医院</span>
        <span>{{queryParams.hospitalName}}</span>
      </li>
      <li>
        <span>科室/医生</span>
        <span>{{queryParams.deptName}}/{{queryParams.doctName}}</span>
      </li>
	  <li v-if="queryParams.execDept">
	    <span>执行科室</span>
	    <span>{{queryParams.execDept}}</span>
	  </li>
	  <li v-if="queryParams.execLoaction">
	    <span>执行位置</span>
	    <span>{{queryParams.execLoaction}}</span>
	  </li>
      <li>
        <span>姓名</span>
        <span>{{queryParams.holderName}}</span>
      </li>
      <li>
        <span>卡号</span>
        <span>电子健康卡/{{queryParams.cardNo | dotted}}</span>
      </li>
      <li>
        <span>订单号</span>
        <span>{{queryParams.visitId}}</span>
      </li>
      <li>
        <span>开单时间</span>
        <span>{{queryParams.recipeTime | formatDate}}</span>
      </li>
    </ul>

    <div style="margin-bottom:2.75rem;">
      <div class="unpay-detail" v-for="(item,index) in payList" :key="index">
        <div class="row row-center title" @click="item.showDetailInfo = !item.showDetailInfo">
          <div class="project">{{item.recipeName}}</div>
          <p class="price">{{item.recipeFee | formatFee}}</p>
          <div class="arrow">
            <img :class="{trans_arrow: item.showDetailInfo}" :src="baseSrc + 'more_gray_dwon.png'" alt="">
          </div>
        </div>
        <div class="content" v-show="item.showDetailInfo" v-for="(subItem,i) in item.items" :key="i">
          <p class="content-name">{{subItem.itemName}}<span v-if="subItem.specs" style="color: #DBDBDB;">/规格({{subItem.specs}})</span></p>
          <div class="content-detail row row-center">
            <div class="col">
              <p>单价</p>
              <p>{{subItem.price | formatFee}}</p>
            </div>
            <div class="col">
              <p>数量</p>
              <p>{{subItem.qty}}</p>
            </div>
            <div class="col">
              <p>总价</p>
              <p>{{subItem.itemFee | formatFee}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer" v-if="queryParams.canPay">
      <div class="row row-center">
        <div class="fee">总金额: <span>{{queryParams.payFee| formatFee}}</span></div>
        <div class="btn">
          <button @click="toPay">缴费</button>
        </div>
      </div>
    </div>
	<div class="footer" v-else>
		<div class="pay-fee-info">
			<span>总金额</span>
			<span class="f-strongest">{{queryParams.payFee | formatFee}}</span>
		</div>
	</div>
			
  </div>
</template>

<script>
import { setItem, getItem } from '@/utils/localStore.js'
import config from '@/config/index.js'
import pushMixin from '@/mixins/pushMixin.js'
export default {
  mixins:[pushMixin],
  data () {
    return {
      unpayInfo: {},
      payList: [],
      busiIds: [],
      baseSrc: config.VUE_APP_IMG_URL
    }
  },
  onLoad () {
      this.busiIds = []
	  this.payList = []
	  this.busiIds = []
	  this.$nextTick(() => {
		  const queryParams = this.queryParams
		   const url = this.queryParams.canPay ? '/app/clinic/unpay' : '/app/clinic/paid'
		   console.log(getItem('selectedArea'))
		   const params = {
			   orgId: queryParams.orgId,
			   hospitalId: queryParams.hospitalId,
			   cardType: queryParams.cardType,
			   cardNo: queryParams.cardNo,
			   visitId: queryParams.visitId,
			   areaId: getItem('selectedArea').areaId
		   }
		   this.initData(url, params, 'get').then(res => {
			   let datas = res.data
			   if(datas && datas.length > 0){
				   datas[0].recipes.forEach((item, index) => {
					    // item.showDetailInfo = index === 0
						this.busiIds.push(item.recipeId)
						this.$set(item, 'showDetailInfo', index === 0)
						this.payList.push(item)
					})
			   }
		   }).catch((err) => {
			   
		   })
	  })
  },
  methods: {
    toPay () {
		const queryParams = this.queryParams
		let data = {
		  cardType: queryParams.cardType,
		  cardNo:queryParams.cardNo,
		  payFee: queryParams.payFee,
		  busiType: this.$consts.BUSI_TYPE.OUT_PATIENT_PAYMENT,
		  busiIds: this.busiIds,
		}
		this.$store.dispatch('paramStore/updateParam', {
			namespace: 'pay',
			payInfo: data
		})
		this.$Router.push({name: 'pay'})
    }
  }
}
</script>

<style lang="scss" scoped>
.app{
	background: $common-background-color;
}
.clinic-content{
  border-bottom: 0.5rem solid #eff2f5;
}
.unpay-detail{
  .title{
    justify-content: space-between;
    position: relative;
    padding: 0 0.75rem;
    width: auto;
    height: 2.5rem;
    background:rgba(254,255,255,1);
    box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
    .project{
      color: #51A8EC;
      font-size: 0.75rem;
    }
    .price{
      color: #FF0000;
      font-size: 0.75rem;
      position: absolute;
      right: 1.65rem;
    }
    .arrow{
      img{
        width: 0.65rem;
        height: 0.4rem;
        display: block;
      }
    }
  }
  .content{
    background: #F8F8F8;
    .content-name{
      padding: 0 0.75rem;
      height: 2rem;
      line-height: 2rem;
      color: #222222;
      font-size: 0.75rem;
      border-bottom: 1px solid #DBDBDB;
      span{
        color: #999999;
        font-size: 0.75rem;
      }
    }
    .content-detail{
      height: 3rem;
	  padding: 0;
      .col{
        text-align: center;
        p:nth-child(1){
          color: #999;
          font-size: 0.75rem;
        }
        p:nth-child(2){
          color: #222;
          font-size: 0.75rem;
        }
      }
    }
  }
  .trans_arrow{
    transform: rotate(180deg)
  }
}
.footer{
  height: 2.75rem;
  background: #fff;
  box-shadow:0px -1px 2px 0px rgba(81,168,236,0.2);
  position: fixed;
  width: 100%;
  bottom: 0;
  .row{
    height: inherit;
    width: auto;
    padding: 0 0.75rem;
    justify-content: space-between;
    .fee{
      color: #333333;
      font-size: 0.85rem;
      span{
        font-size: 0.85rem;
        color: #FF0101;
      }
    }
    .btn{
      button{
        height: 2.2rem;
        width: 6rem;
        background: #51A8EC;
        border-radius: 0.25rem;
        color: #fff;
        font-size: 0.9rem;
      }
    }
  }
}
.pay-fee-info {
	height: 2.75rem;
	background-color: #fff;
	width: 100%;
	line-height: 2.75rem;
	text-align: center;
	span{
		padding-right: 0.15rem;
		font-size: 0.9rem;
	}
}
</style>
