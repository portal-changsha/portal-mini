import { getArchiveHome, getRegFaceAuthOrder } from '@/services/healthArchive.js'
import { setItem } from '@/utils/localStore.js'
import { showModal } from '@/utils/uniApi.js'

export default {
  methods: {
    //  判断是否可以进入健康档案
    valideUser(voucher){
      return new Promise((resolve, reject) => {
        const requestParams = {
            orgId: this.$consts.ORG_ID,
            cardNo: voucher.cardNo,
            cardType: voucher.cardType,
            verifyData: voucher.faceOrderId || this.$consts.ORG_ID
        }
        getArchiveHome(requestParams).then((res) => {
          if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
              //判断人脸认证失败
            if (res.errorCode === this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED || res.errorCode === this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
                //  弹框提示进行人脸认证
                showModal('提示', '该功能仅对用户本人开放，请您进行人脸识别认证').then((res) => {
                  if(res.confirm){
                    this.facePictureVerify()
                  }
                  reject(res)
                  return
                })
              }
            reject(res)
          } else {
            resolve(res)
          }
        })
      })
    },
    // 开启人脸识别验证
    facePictureVerify() {
      const requestParams = {}
      // 注册人脸识别订单号
      getRegFaceAuthOrder(requestParams).then((res) => {
          if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
              if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
				showToast(res.resultMsg)
              }
              return;
          }
          const orderId = res.data.faceOrderId || ''
          setItem('faceOrderId', orderId)
          let redirect_uri = REDIRECT_URL + '/HealthArchive';
          redirect_uri = encodeURI(redirect_uri)
          const faceUrl = `https://health.tengmed.com/open/facePictureVerify?order_id=${orderId}&redirect_uri=${redirect_uri}`;
          window.location.href = faceUrl
      });
    }
  }
};
