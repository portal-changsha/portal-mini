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
import { getItem, setItem } from '@/utils/localStore.js'
import config from '@/config/index.js'
import { getVoucherList } from '@/services/voucher.js'
export default {
  props: {
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
  mounted () {
    this.refresh()
  },
  computed: {
    originImgUrl () {
      return config.VUE_APP_IMG_URL
    }
  },
  methods: {
    refresh () {
      let v = getItem('selectedVoucher')
      if (v === undefined || v === null) {
        this.flag = 0
      }
	  getVoucherList().then((res) => {
		if (res.resultCode === this.$consts.RESULT_SUCCESS) {
			this.voucherList = res.data
			this.$emit('getVoucherList', res.data)
			if (!!v && res.data.length > 0) {
			  for (let i = 0; i < res.data.length; i++) {
				if (res.data[i].cardNo === v.cardNo) {
				  this.flag = i
				  break
				}
			  }
			}
		  }
		})
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
    height: 4rem;
    border: 1px solid #B9E0FE;
    box-shadow: 0 2px 3px #B9E0FE;
    margin-bottom: .75rem;
    border-radius: 5px;
    position: relative;
	padding:0;
    .left-img{
      margin-left:-2px;
      img{
        width: 1.5rem;
        height: 4rem;
        display: block;
      }
    }
    .rigth-text{
      font-size: 0.75rem;
      margin-left: 1.5rem;
      p{
        color: #999;
        line-height: 1.25rem;
        span{
          color: #111;
        }
      }

    }
    .voucher-radio{
      position: absolute;
      background-image: url($redirect-url + $img-file-path + 'choice-define.png');
      background-size: 100%;
      right: 0.5rem;
      height: 1.15rem;
      width: 1.15rem;
      &.selected{
        background-image: url($redirect-url + $img-file-path + 'choice-success.png');
      }
    }

  }
  .no-voucher{
    text-align: center;
    padding-top: 3.5rem;
    img{
      width: 6.75rem;
      height: 6.75rem;
    }
    p{
      color: #333333;
      font-size: 0.75rem;
    }
  }
</style>
