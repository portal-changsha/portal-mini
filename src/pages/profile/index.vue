<template>
    <div class="app">
      <div class="profile">
        <div class="top-tips" v-if="voucherList.length === 0">
          <img :src="baseSrc + 'tips.png'" alt="">
          <span>挂号、缴费、查报告前请先绑定电子健康卡。</span>
        </div>
        <div class="btn" :class="{novoucher:voucherList.length > 0}">
          <button :class="{unableToAdd: 5 === voucherList.length}" :disabled="5 === voucherList.length" @click="goAddVoucher">绑定电子健康卡</button>
        </div>
        <p class="voucher-tips" v-if="5 === voucherList.length">如需绑定新的电子健康卡,请先<span>解绑</span>一张</p>
        <p class="voucher-tips" v-if="voucherList.length>0 && voucherList.length<5">还能绑定<span> {{5 - voucherList.length}} </span>张电子健康卡</p>
        <div class="voucher-list">
          <voucher-item @selected="selectVoucher($event)"></voucher-item>
        </div>
        <!-- <div class="no-voucher" v-if="voucherList.length === 0">
            <img :src="baseSrc+'No record .png'" alt="">
            <p>暂无电子健康卡</p>
        </div> -->
        <no-record :condition="voucherList.length === 0" :tips="'暂无电子健康卡'"></no-record>
      </div>
      
    </div>
</template>
<script>
import { getVoucherList } from '@/service/voucher.service'
import VoucherItem from '@/components/VoucherItemSmall'
import NoRecord from '@/components/NoRecord'
// import store from './store'
export default {
  components: {
    VoucherItem,
    NoRecord
  },
  data () {
    return {
      baseSrc: this.constant.LOCAL_IMG,
      voucherList: []
    }
  },
  onLoad () {
    this.refresh()
  },
  methods: {
    refresh () {
      getVoucherList().then((res) => {
        if (res.result === this.constant.RESULT_SUCCESS) {
          this.voucherList = res.data
        }
      })
    },
    selectVoucher (voucher) {
      if (voucher) {
        this.$utils.navigateTo('voucherDetail', {cardInfo: JSON.stringify(voucher)})
      }
    },
    goAddVoucher () {
      this.$utils.navigateTo('voucherAdd')
    }
  }
}
</script>
<style lang="scss" scoped>
  $fontColor: #51A8EC;
  .profile{
    padding: 0 15px 0 15px;
    .top-tips{
      color: $fontColor;
      font-size: 13px;
      line-height: 40px;
      height: 40px;
      position: relative;
      img{
        width: 17px;
        height: 17px;
        position: absolute;
        top: 0;
        margin: 11px 0;
      }
      span{
        margin-left: 22px;
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
      font-size: 15px;
      padding: 25px 0 15px 0;
      span{
        color: $fontColor;
      }
    }
    .no-voucher{
      text-align: center;
      padding-top: 70px;
      img{
        width: 135px;
        height: 135px;
      }
      p{
        color: #333333;
        font-size: 15px;
      }
    }
  }
  .voucher-list{
    margin-top: 20px;
  }
</style>
