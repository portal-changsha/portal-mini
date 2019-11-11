<template>
    <div class="app">
      <div class="voucher-detail">
        <p class="f3s15">电子健康卡二维码</p>
        <div class="ercode">
          <canvas style="width: 135px;height: 135px;background:#f1f1f1;margin: 0 auto;" canvas-id="mycanvas" />
        </div>
      </div>

      <ul class="field-list">
        <li>
          <span>姓名</span>
          <span>{{voucherDetail.holderName}}</span>
        </li>
        <li>
          <span>电子健康卡号</span>
          <span>{{voucherDetail.cardNo}}</span>
        </li>
        <li>
          <span>手机号码</span>
          <span>{{voucherDetail.mobileNo}}</span>
        </li>
      </ul>
      <div class="fireCard">
        <div>
          <button @click="toFireCard">解绑</button>
        </div>
      </div>
    </div>
</template>
<script>
import { getVoucherUnbind, getVoucherQrcode } from '@/service/voucher.service'
import QRCode from 'weapp-qrcode'

export default {
  data () {
    return {
      voucherDetail: {},
      qrText: ''
    }
  },
  mounted () {
    let obj = this.$root.$mp.query
    if (obj.cardInfo) {
      //  获取电子健康卡二维码
      let voucher = JSON.parse(obj.cardInfo)
      let voucherCopy = this.$utils.deepClone(voucher)
      voucher.cardNo = this.$utils.doutted(voucher.cardNo)
      voucher.mobileNo = this.$utils.doutted(voucher.mobileNo)
      this.voucherDetail = voucher
      this.getReCode(voucherCopy.cardType, voucherCopy.cardNo)
    } else {
      this.$utils.back()
    }
  },
  methods: {
    async getReCode (cardType, cardNo) {
      let params = {
        cardType: cardType,
        cardNo: cardNo
      }
      let res = await getVoucherQrcode(params)
      if (res.result === this.constant.RESULT_SUCCESS) {
        this.createQrCode(res.data.qrcodeText, 'mycanvas', 135, 135)
      }
    },
    /**
   * 绘制二维码图片
   */
    createQrCode: function (url, canvasId, cavW, cavH) {
    // 调用插件方法，绘制二维码图片
      QRCode({
        width: cavW,
        height: cavH,
        canvasId: canvasId,
        text: url
      })
    },
    toFireCard () {
      //  弹出提示框是否确认解绑
      this.$utils.showModal('提示', '确认解绑该凭证？', async () => {
        let data = {
          cardType: this.voucherDetail.cardType,
          cardNo: this.voucherDetail.cardNo
        }
        let res = await getVoucherUnbind(data)
        if (res.resultCode === '1') {
          //  提示解绑成功并返回
          this.$utils.showToast('解绑成功')
          this.$utils.back()
        }
      }, () => {})
    }
  }
}
</script>
<style lang="scss" scoped>
  .app{
    background: #EFF2F5;
    position:absolute;
    width:100%;
    top:0;
    height: 100%;
  }
  .voucher-detail{
    padding: 0 15px 10px 15px;
    background: #fff;
    margin-bottom: 10px;

    p{
      padding: 20px 0;
    }
    .ercode{
      text-align: center;
    }
  }
  .fireCard{
    position: absolute;
    bottom: 15px;
    width:100%;
    button{
      background: #FB6464;
      height: 44px;
      box-shadow: 0 2px 4px #FB6464;
      color: #fff;
      font-size: 18px;
      width: 92%;
    }
  }
</style>
