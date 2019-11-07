<template>
    <div>
        <section v-show="step === 0">
            <div class="card-area">
                <ul>
                    <li>
                        <img v-if="originImgUrl" :src="originImgUrl + 'user.png'" alt="">
                        <input type="text" placeholder="请输入真实姓名" v-model="userInfo.name">
                    </li>
                    <li>
                        <img v-if="originImgUrl" :src="originImgUrl + 'ID.png'" alt="">
                        <input style="width: 75%;" type="text" placeholder="请输入身份证号" v-model="userInfo.idCardNo">
                        <div class="upload-card" >
                            <!-- @click="step = 1"  //todo 此处为点击拍照或者上传照片，图片识别用，暂时隐藏 -->
                            <img v-if="originImgUrl" :src="originImgUrl + 'camer.png'" alt="">
                        </div>
                    </li>
                    <li>
                        <img style="width: 16px;" v-if="originImgUrl" :src="originImgUrl + 'nationIcon.png'" alt="" >
                        <input type="text" placeholder="请输入民族" v-model="userInfo.nation">
                    </li>
                    <div class="card-btn">
                        <button @click="validInfo()">确 认</button>
                    </div>
                </ul>
            </div>
        </section>
        <!-- 上传身份证模式 -->
        <section v-show="step === 1">
            <div class="upload-btn">
                <button @click="uploadIdCard"></button>
            </div>
            <div class="require">
                <h5>拍摄要求: </h5>
                <div class="require-tip">
                    <p>1、垂直拍摄, 证件边框完整</p>
                </div>
                <div class="require-tip">
                    <p>2、避免证件反光, 模糊</p>
                </div>
            </div>
            <!-- <img :src="idCardImg" alt=""> -->
        </section>

        <!-- 身份识别 -->
        <section v-show="step === 2">
            <div class="ocr-content">
                <div class="card-img" id="idCardPhoto" @click="step = 1">
                    <img v-if="originImgUrl" :src="originImgUrl + 'uploadCardAgain.png'">
                </div>
                <div style="height:10px;background: #EFF2F5;"></div>
                <div class="ocr-list">
                    <ul>
                        <li>
                            <span>姓名</span>
                            <input type="text" v-model="userInfo.name">
                        </li>
                        <li>
                            <span>性别</span>
                            <input type="text" v-model="userInfo.sex">
                        </li>
                        <li>
                            <span>民族</span>
                            <input type="text" v-model="userInfo.nation">
                        </li>
                        <li>
                            <span>身份证号</span>
                            <input type="text" v-model="userInfo.idCardNo">
                        </li>
                        <li>
                            <span>身份证详情地址</span>
                            <input type="text" v-model="userInfo.address">
                        </li>
                    </ul>
                </div>
                <div class="register-btn">
                    <button @click="validInfo()">确认身份信息, 填写手机号</button>
                </div>
            </div>
        </section>

    </div>
</template>
<script>
// import { getOcrInfo } from '@/service/api.service'
const checkForm = function (data) {
  if (data.name === null || data.name.trim().length === 0) {
    return '输入姓名不能为空'
  }
  if (data.idCardNo.length === 0) {
    return '身份证号不能为空'
  }
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
  if (data.idCardNo === null || !(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(data.idCardNo.toUpperCase()))) {
    return '身份证号输入有误'
  }
  if (data.nation === null || data.nation === '') {
    return '民族不能为空'
  }
}

export default {
  data () {
    return {
      userInfo: {
        name: '',
        nation: '',
        idCardNo: ''
      },
      step: 0,
      idCardImg: '',
      wechatCode: ''
    }
  },
  computed: {
    originImgUrl () {
      return this.constant.LOCAL_IMG
    }
  },
  onUnload () {
    this.step = 0
  },
  methods: {
    async validInfo () {
      let obj = this.userInfo
      let errorMsg = checkForm(obj)
      if (errorMsg) {
        return this.$utils.showToast(errorMsg)
      }
      console.log(obj)
      //  保存用户信息
      // this.$store.commit('updateParam', {
      //   namespace: 'CompleteCard',
      //   ocrInfo: this.userInfo
      // })
      this.$utils.navigateTo('completeCard', {userInfo: this.userInfo}, 1)
      //  电子健康卡授权,授权成功后跳转到 completeCard界面
      // let wechatObj = await this.getWechatCode()
      // if (wechatObj.isok) {
      /// / this.wechatCode = wechatObj.result
      // this.$utils.navigateTo('completeCard', {wechatCode: this.wechatCode}, 1)
      // } else {
      // }

      // 配置回调地址
      // const redirect_uri = location.href.split('CheckInformation')[0] + 'CompleteCard';
      // window.location.href = 'https://health.tengmed.com/open/getUserCode?redirect_uri=' + redirect_uri
    },
    /**
             * 获取建卡code
             */
    getWechatCode () {
      var plugin = requirePlugin('healthCard')
      return new Promise((resolve, reject) => {
        // 手动调用登录接口
        plugin.login((isok, res) => {
          // isok 为是否登录成功，res为返回数据
          console.log(isok)
          console.log(res)
          let data = {
            isok: isok,
            result: res
          }
          resolve(data)
        }, {
          // 是否返回wechatcode
          wechatcode: true,
          // 是否返回healthcode
          healthcode: true
        })
      })
    },
    uploadIdCard () {
      let _this = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          console.log(res)
          // tempFilePath可以作为img标签的src属性显示图片
          _this.idCardImg = res.tempFilePaths[0]
          let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64')
          console.log(base64)
          //  上传base64编码到后台进行识别
        }
      })
    },
    // 4.OCR验证
    verifyOcrInfo (data) {
      // 5.调用后台OCR识别接口
    //   getOcrInfo({
    //     mediaId: data
    //   }).then((res) => {
    //     if (res.resultCode !== that.constant.RESULT_SUCCESS) {
    //       this.$utils.showToast(res.resultMsg)
    //       return
    //     }
    //     that.step = 2
    //     that.userInfo = res.data
    //   })
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-btn {
    padding: 0 32px 20px 32px;
    margin-top: 25px;
    height: 200px;
    button{
        background: url($main-img-url + 'cardIcon.png') no-repeat center;
        background-size: 100% 100%;
        height: inherit;
        width: 100%;
    }
}
.require{
    padding: 0 15px;
    h5{
        color: #51A8EC;
        font-size: 13px;
    }
    .require-tip {
        margin-top: 4px;
        p {
            color: #999;
            font-size: 13px;
        }
    }
}
.ocr-content {
    .card-img {
        height: 200px;
        position: relative;
        margin-top: 15px;
        padding: 0 30px 8px 30px;
        img {
            height: inherit;
            width: 100%;
            border-radius: 5px;
        }
    }
    .ocr-list {
        padding: 0 15px;
        li {
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #eaeaea;
            display: flex;
            position: relative;
            span {
                color: #666;
                font-size: 15px;
            }
            input {
                flex: 1;
                text-align: right;
                border: 0;
                padding: 0 20px;
            }
            &:after{
                content:'';
                background: url($main-img-url + 'writing.png') no-repeat center;
                background-size: 11px 12px;
                position: absolute;
                right: 0;
                width: 11px;
                height: 12px;
                padding: 16px 0;
            }
        }
    }
}
.register-btn{
    margin-top: 30px;
    padding: 0 15px;
    button{
        background: #51A8EC;
        width: 100%;
        color: #fff;
        font-size: 14px;
        height: 44px;
        // box-shadow: 0 4px 10px #51A8EC;
    }
}
.card-area{
    ul{
      li{
        height: 48px;
        line-height: 48px;
        position: relative;
        margin: 0 10px;
        border-bottom: 1px solid #eaeaea;
        img{
          width: 24px;
          height: 24px;
          margin: 14px 0 0 20px;
          position: absolute;
        }
        input{
          border: 0;
          height: 48px;
          width: 100%;
          padding-left: 60px;
          font-size: 15px;
        }
        .disabledColor{
            color: #eaeaea;
        }
      }
    }
    .card-btn{
      margin-top: 30px;
      text-align: center;
      padding: 0 15px;
      button{
        width: 100%;
        background: #51A8EF;
        box-shadow: 0 3px 6px #51A8EF;
        height: 44px;
        color: #fff;
        font-size: 18px;
      }
    }
    .upload-card {
        position: absolute;
        top: 0;
        right: 0;
        height: 48px;
        width:48px;
        img {
            padding-right: 5px;
            width: 20px !important;
            height: 15px !important;
            margin: 0;
            position: relative;
        }
        span {
            color: #51A8EF;
            font-size: 13px;
        }
    }
}
</style>

