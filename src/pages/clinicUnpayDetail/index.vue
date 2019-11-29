<template>
  <div class="clinic">
    <ul class="field-list clinic-content">
      <li>
        <span>医院</span>
        <span>{{unpayInfo.hospitalName}}</span>
      </li>
      <li>
        <span>科室/医生</span>
        <span>{{unpayInfo.deptName}}/{{unpayInfo.doctName}}</span>
      </li>
      <li>
        <span>姓名</span>
        <span>{{unpayInfo.holderName}}</span>
      </li>
      <li>
        <span>卡号</span>
        <span>电子健康卡/{{unpayInfo.cardNo}}</span>
      </li>
      <li>
        <span>订单号</span>
        <span>{{unpayInfo.visitId}}</span>
      </li>
      <li>
        <span>开单时间</span>
        <span>{{unpayInfo.visitDate}}</span>
      </li>
    </ul>

    <div style="margin-bottom:55px;">
      <div class="unpay-detail" v-for="(item,index) in unpayList" :key="index">
        <div class="row row-center title" @click="item.showDetailInfo = !item.showDetailInfo">
          <div class="project">{{item.recipeName}}</div>
          <p class="price">{{item.recipeFee}}元</p>
          <div class="arrow">
            <img :class="{trans_arrow: item.showDetailInfo}" :src="baseSrc + 'more_gray_dwon.png'" alt="">
          </div>
        </div>
        <div class="content" v-show="item.showDetailInfo" v-for="(subItem,i) in item.items" :key="i">
          <p class="content-name">{{subItem.itemName}}<span v-if="subItem.specs" style="color: #DBDBDB;">/规格({{subItem.specs}})</span></p>
          <div class="content-detail row row-center">
            <div class="col">
              <p>单价</p>
              <p>{{subItem.copy_price}}元</p>
            </div>
            <div class="col">
              <p>数量</p>
              <p>{{subItem.qty}}</p>
            </div>
            <div class="col">
              <p>总价</p>
              <p>{{subItem.totalPrice}}元</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer" v-if="!noPay">
      <div class="row row-center">
        <div class="fee">总金额: <span>{{unpayInfo.payFee / 100}}元</span></div>
        <div class="btn">
          <button @click="toPay">缴费</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setItem } from '@/utils/store'
export default {
  data () {
    return {
      unpayInfo: {},
      unpayList: [],
      busiIds: [],
      noPay: false,
      baseSrc: this.constant.LOCAL_IMG
    }
  },
  onLoad () {
    this.busiIds = []
    let q = this.$root.$mp.query
    this.unpayInfo = q.unpayInfo ? JSON.parse(q.unpayInfo) : {}
    let data = q.unpayList ? JSON.parse(q.unpayList) : []
    this.noPay = !!q.noPay
    this.formatData(data)
  },
  methods: {
    //  因小程序不支持过滤器 所以需要对数据做一下处理
    formatData (data) {
      if (!!data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          data[i].recipeFee = this.$utils.formatFee(data[i].recipeFee)
          data[i].showDetailInfo = false
          for (let j = 0; j < data[i].items.length; j++) {
            data[i].items[j].totalPrice = this.$utils.formatFee(data[i].items[j].price * data[i].items[j].qty)
            data[i].items[j].copy_price = this.$utils.formatFee(data[i].items[j].price)
          }
          this.busiIds.push(data[i].recipeId)
        }
        this.unpayList = data
      }
    },
    toPay () {
      let data = {
        cardType: this.unpayInfo.cardType,
        cardNo: this.unpayInfo.cardNo,
        payFee: this.unpayInfo.payFee,
        busiType: this.constant.BUSI_TYPE.OUT_PATIENT_PAYMENT,
        busiIds: this.busiIds,
        hospitalId: this.unpayInfo.hospitalId,
        areaId: this.unpayInfo.areaId
      }
      setItem('payInfo', data)
      this.$utils.navigateTo('pay', {params: JSON.stringify(data)})
    }
  }
}
</script>

<style lang="scss" scoped>
.clinic-content{
  border-bottom: 10px solid #eff2f5;
}
.unpay-detail{
  .title{
    margin-top: 10px;
    justify-content: space-between;
    position: relative;
    padding: 0 15px;
    width: auto;
    height: 50px;
    background:rgba(254,255,255,1);
    box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
    .project{
      color: #51A8EC;
      font-size: 15px;
    }
    .price{
      color: #FF0000;
      font-size: 15px;
      position: absolute;
      right: 33px;
    }
    .arrow{
      img{
        width: 13px;
        height: 8px;
        display: block;
      }
    }
  }
  .content{
    background: #F8F8F8;
    .content-name{
      padding: 0 15px;
      height: 40px;
      line-height: 40px;
      color: #222222;
      font-size: 15px;
      border-bottom: 1px solid #DBDBDB;
      span{
        color: #999999;
        font-size: 15px;
      }
    }
    .content-detail{
      height: 60px;
      .col{
        text-align: center;
        p:nth-child(1){
          color: #999;
          font-size: 15px;
        }
        p:nth-child(2){
          color: #222;
          font-size: 15px;
        }
      }
    }
  }
  .trans_arrow{
    transform: rotate(180deg)
  }
}
.footer{
  height: 55px;
  background: #fff;
  box-shadow:0px -1px 2px 0px rgba(81,168,236,0.2);
  position: fixed;
  width: 100%;
  bottom: 0;
  .row{
    height: inherit;
    width: auto;
    padding: 0 15px;
    justify-content: space-between;
    .fee{
      color: #333333;
      font-size: 17px;
      span{
        font-size: 17px;
        color: #FF0101;
      }
    }
    .btn{
      button{
        height: 44px;
        width: 120px;
        background: #51A8EC;
        border-radius: 5px;
        color: #fff;
        font-size: 18px;
      }
    }
  }
}
</style>
