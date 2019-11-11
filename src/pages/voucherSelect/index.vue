<template>
  <div class="voucher">
    <voucher-item  @selected="selectVoucher($event)" :canChoose="true"></voucher-item>
    <no-record :condition="voucherList.length === 0" :tips="'没有电子健康卡,请先绑定'"></no-record>
  </div>
</template>

<script>
import VoucherItem from '@/components/VoucherItemSmall'
import { getVoucherList } from '@/service/voucher.service'
import NoRecord from '@/components/NoRecord'
import { setItem, getItem } from '@/utils/store'
import eventLister from '@/service/eventListener'
export default {
  data () {
    return {
      voucherList: [],
      waitUrl: ''
    }
  },
  components: {
    VoucherItem,
    NoRecord
  },
  onLoad () {
    let q = this.$root.$mp.query
    this.waitUrl = q.waitUrl
    this.getVoucherInfo()
  },
  methods: {
    getVoucherInfo () {
      getVoucherList().then((res) => {
        if (res.result === this.constant.RESULT_SUCCESS) {
          this.voucherList = getItem('selectedVoucher') ? [getItem('selectedVoucher')] : []
          // this.voucherList = res.data
        }
      })
    },
    selectVoucher (e) {
      setItem('selectedVoucher', e)
      eventLister.$emit('backEvent')
      this.$utils.back(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.voucher{
  margin-top: 15px;
  padding:0 15px;

}
</style>
