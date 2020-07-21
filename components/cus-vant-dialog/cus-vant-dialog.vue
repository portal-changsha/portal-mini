<template>
  <div>
    <van-dialog v-model="showDialog" title="提示" show-confirm-button @confirm="toBack">
      <div class="showTips-msg" v-html="dialogConfig[errorCode]"></div>
    </van-dialog>
  </div>
</template>
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
export default {
  components: {
    uniPopup,
	uniPopupDialog
  },
  data(){
    return {
      dialogConfig: {
        'notThreeHighs': `目前健康档案仅面向<span style="color: #2A8DFF;">老年人、糖尿病、高血压</span>居民提供查阅，后续将逐步向全民开放。如信息有误，请向该用户所在的社区服务卫生服务中心或乡镇卫生院进行反馈`,
        'globalIdNull': `您还未建档，请联系居住地所在社区医院进行建档！`
      },
      showDialog: false
    }
  },
  mounted(){
    this.showDialog = this.showTips
  },
  watch: {
    showTips(newVal){
      this.showDialog = newVal
    }
  },
  props: {
    showTips: {
      type: Boolean,
      default: false
    },
    errorCode: {
      type: String
    }
  },
  methods: {
    toBack(){
      this.showDialog = false
      this.$emit('toBack')
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