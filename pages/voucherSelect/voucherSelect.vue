<template>
  <div class="voucher">
    <voucher-item  @selected="selectVoucher($event)" :canChoose="true"></voucher-item>
    <no-record :condition="voucherList.length === 0" :tips="'没有电子健康卡,请先绑定'"></no-record>
  </div>
</template>

<script>
import voucherItem from '@/components/voucher-item-small/voucher-item-small.vue'
import { getVoucherList } from '@/services/voucher.js'
import { setItem, getItem } from '@/utils/localStore.js'
export default {
  data () {
    return {
      voucherList: []
    }
  },
  components: {
    voucherItem
  },
  onShow () {
    this.getVoucherInfo()
  },
  methods: {
    getVoucherInfo () {
      getVoucherList().then((res) => {
        if (res.resultCode === this.$consts.RESULT_SUCCESS) {
          this.voucherList = getItem('selectedVoucher') ? [getItem('selectedVoucher')] : []
        }
      })
    },
    selectVoucher (e) {
      setItem('selectedVoucher', e)
      uni.$emit('backEvent')
	  this.$Router.back(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.voucher{
  margin-top: 0.75rem;
  padding:0 0.75rem;

}
</style>

