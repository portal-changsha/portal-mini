<template>
  <div style="padding: 10px 15px 0 15px;">
    <voucher-item-small v-for="(voucher, index) in voucherList" :key="index" :voucher="voucher" :canChoose="true" :index="index" :class="(selected == index) ? 'selected' : 'disabled'" @selected="selectVoucher"></voucher-item-small>
  </div>
</template>
<script>
import voucherItemSmall from '@/components/voucher-item-small/voucher-item-small.vue'
import { getVoucherList } from '@/services/voucher.js'
import healthArchiveMixin from '@/mixins/healthArchive.js'
import { showToast, showModal } from '@/utils/uniApi.js'
import { setItem } from '@/utils/localStore.js'


export default {
  mixins: [healthArchiveMixin],
  components: {
    voucherItemSmall
  },
  data() {
    return {
      voucherList: [],
      selected: 0,
	  dialogConfig: {
	    'notThreeHighs': `目前健康档案仅面向<span style="color: #2A8DFF;">老年人、糖尿病、高血压</span>居民提供查阅，后续将逐步向全民开放。如信息有误，请向该用户所在的社区服务卫生服务中心或乡镇卫生院进行反馈`,
	    'globalIdNull': `您还未建档，请联系居住地所在社区医院进行建档！`
	  }
    }
  },
  created(){
    this.getVoucherInfo()
  },
  methods: {
    getVoucherInfo(){
      getVoucherList().then(async res => {
        if(res.resultCode !== this.$consts.RESULT_SUCCESS){
          showToast(res.resultMsg)
          this.$router.back()
          return
        }
        this.voucherList = res.data
      })
    },
    async selectVoucher(voucher, index) {
      if (this.selected !== index) {
          this.selected = index;
      }
      this.valideUser(voucher).then(() => {
        setItem('selectedVoucher', voucher);
        this.$Router.replace({name: 'healthArchive'})
      }).catch(res => {
        if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
          if(res.errorCode === 'notThreeHighs' || res.errorCode ==='globalIdNull'){
            showModal('提示', this.dialogConfig[err.errorCode], false)
          }
        }
      })
    },
    toBack(){
      this.showTips = false
      this.$Router.back()
    }
  }
}
</script>
<style lang="scss" scoped>
.showTips-msg{
    color: #6C6C6C;
    font-size: .8rem;
    padding: 0.75rem;
    span{
        color: #2A8DFF;
    }
}
</style>