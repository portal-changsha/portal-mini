<template>
  <div class="clinic app">
    <ul class="field-list clinic-content">
      <li>
        <span>医院</span>
        <span>{{hosInfo.name}}</span>
      </li>
      <li>
        <span>科室/医生</span>
        <span>{{prescriptionDetail.deptName}}/{{prescriptionDetail.doctName}}</span>
      </li>
      <li>
        <span>姓名/卡号</span>
        <span>{{voucher.holderName}} / {{voucher.cardNo | dotted}}</span>
      </li>
      <li>
        <span>就诊记录号</span>
        <span>{{prescriptionDetail.visitId}}</span>
      </li>
      <li>
        <span>开单时间</span>
        <span>{{prescriptionDetail.recipes[0].recipeTime | formatDate}}</span>
      </li>
	  <li>
	    <span>处方总价</span>
	    <span>{{prescriptionDetail.totalFee | formatFee}}</span>
	  </li>
	  <li class="diagnosis">
	    <span>临床诊断</span>
	    <span>{{prescriptionDetail.diagnosis}}</span>
	  </li>
    </ul>
	<tabs :tabArr="tab" v-on:changeTab="changeTab"></tabs>
    <div>
      <div class="unpay-detail" v-for="(item,index) in prescriptionDetail.recipes" :key="index">
		  <div v-show="item.recipeType - 1 === tabIndex" class="box-shadow">
			  <div class="row row-center title">
			    <div class="project">{{item.recipeName}}</div>
			    <p class="price">{{item.recipeFee | formatFee(false)}}</p>
			  </div>
			  <div class="content" v-for="(subItem,i) in item.items" :key="i">
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
			        <p>{{item.recipeType === '3' ? '用法' : '单位'}}</p>
			        <p v-if="item.recipeType === '3'">{{subItem.instructions}}</p>
					<p v-else>{{subItem.unit}}</p>
			      </div>
			    </div>
			  </div>
		  </div>
		  <!-- <no-record :condition="item.recipeType - 1 !== tabIndex" :tips="'暂无记录'"></no-record> -->
      </div>
	  </div>
	  <div class="footer" v-if="tabIndex === 2">
		  <div><span class="color-blue">提示信息:</span></div>
		  <span class="color-gray">按卫生部、国家中医药管理局卫医发[2002]24号文件规定:为保证患者用药安全，药品已经发出，不得退换。</span>
	  </div>
			
  </div>
</template>

<script>
import { setItem, getItem } from '@/utils/localStore.js'
import config from '@/config/index.js'
import tabs from '@/components/tabs/tabs.vue'
export default {
  components:{
	tabs  
  },
  data () {
    return {
	  tab: [{name: '检查项'}, {name: '检验项'}, {name: '药品项'}],
      prescriptionDetail: {},
      baseSrc: config.VUE_APP_IMG_URL,
	  tabIndex: 0,
	  hosInfo: {},
	  voucher: {}
    }
  },
  onLoad () {
      this.hosInfo = getItem('selectedHospital')
      this.voucher = getItem('selectedVoucher')
	  this.prescriptionDetail = this.$store.getters.param.prescriptionDetail.details
	  console.log(this.prescriptionDetail)
  },
  methods: {
	changeTab (e) {
	  if (this.tabIndex === e) return
	  this.tabIndex = e
	  // this.initData(e)
	}
  }
}
</script>

<style lang="scss" scoped>
.app{
	background: $common-background-color;
}
.color-blue{
	color:#52A8ED;
	font-size: 0.65rem;
}
.color-gray{
	color:#B6B6B6;
	font-size: 0.65rem;
}
.footer{
	padding:0 0.75rem;
	margin-top: 0.5rem;
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
      right: 0.75rem;
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
.diagnosis{
	min-height: 2.25rem;
	height: auto !important;
	span{
		padding: 0.75rem 0 0.75rem 0;
	}
}
.box-shadow{
	box-shadow: 0px 1px 2px 0px rgba(81, 168, 236, 0.2);
}


</style>
