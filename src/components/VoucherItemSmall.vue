<template>
    <div>
      <div class="voucher-item row row-center" @click="selectVoucher(item,index)" v-for="(item,index) in voucherList" :key="index">
        <div class="left-img">
          <img :src="originImgUrl + 'voucher-label.png'" alt="">
        </div>
        <div class="rigth-text">
          <p>姓名: <span>{{item.holderName}}</span> </p>
          <p>卡号: <span>{{item.cardNo}}</span> </p>
        </div>
        <div v-if="canChoose" class="voucher-radio" :class="{selected: index === flag}"></div>
      </div>

      <div class="no-voucher" v-if="voucherList.length === 0 && !canChoose">
          <img :src="originImgUrl + 'Norecord.png'" alt="">
          <p>暂无电子健康卡</p>
      </div>
    </div>
</template>
<script>
// import { getVoucherList } from '@/service/voucher.service'
import { getItem } from '@/utils/store'
export default {
  props: {
    // voucherList: {
    //   type: Array
    // },
    voucher: {
      type: Object
    },
    canChoose: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data: function () {
    return {
      flag: -1,
      voucherList: []
    }
  },
  onLoad () {
    this.refresh()
  },
  computed: {
    originImgUrl () {
      return this.constant.LOCAL_IMG
    }
  },
  // onShow(){
  //   this.refresh()
  // },
  methods: {
    refresh () {
      let v = getItem('selectedVoucher')
      if (v === undefined || v === null) {
        this.flag = 0
      }
      this.voucherList = [v]
      console.log(this.voucherList)
      // getVoucherList().then((res) => {
      //   if (res.result === this.constant.RESULT_SUCCESS) {
      //     this.voucherList = res.data
      //     if (!!v && res.data.length > 0) {
      //       for (let i = 0; i < res.data.length; i++) {
      //         if (res.data[i].cardNo === v.cardNo) {
      //           this.flag = i
      //           break
      //         }
      //       }
      //     }
      //   }
      // })
    },
    selectVoucher (voucher, index) {
      this.canChoose && (this.flag = index)
      this.$emit('selected', voucher, index)
    }
  }
}
</script>
<style lang="scss" scoped>
  .voucher-item{
    height: 80px;
    border: 1px solid #B9E0FE;
    box-shadow: 0 2px 3px #B9E0FE;
    margin-bottom: 15px;
    border-radius: 5px;
    position: relative;
    .left-img{
      margin-left:-2px;
      img{
        width: 30px;
        height: 80px;
        display: block;
      }
    }
    .rigth-text{
      font-size: 15px;
      margin-left: 30px;
      p{
        color: #999;
        line-height: 25px;
        span{
          color: #111;
        }
      }

    }
    .voucher-radio{
      position: absolute;
      background-image: url($main-img-url + 'choice-define.png');
      background-size: 100%;
      right: 10px;
      height: 23px;
      width: 23px;
      &.selected{
        background-image: url($main-img-url + 'choice-success.png');
      }
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
</style>
