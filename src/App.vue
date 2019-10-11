<script>
// import { login } from '@/service/user.service'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
  },
  methods: {

  }
}
</script>

<style lang="scss">
page{
  height: inherit;
  background: #FEFEFE;
}
button::after{
  border: none;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  // padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.noRecord{
  font-size:16px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(69,75,87,1);
  line-height:22px;
  margin-top: 30px;
  text-align: center;
}
.row {
  display: flex;
  width: 100%;
}
.row-center{
  align-items: center;
}
.row-wrap {
  flex-wrap: wrap;
}
.row-jus-center {
  justify-content: center;
}
.col {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: block;
  width: 100%;
}
.row-top {
  -webkit-box-align: start;
  -ms-flex-align: start;
  -webkit-align-items: flex-start;
  -moz-align-items: flex-start;
  align-items: flex-start;
}
/* .col-* vertically aligns an individual .col */

.col-center {
  -webkit-align-self: center;
  -moz-align-self: center;
  -ms-flex-item-align: center;
  align-self: center;
}
.col-25 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 25%;
  -moz-box-flex: 0;
  -moz-flex: 0 0 25%;
  -ms-flex: 0 0 25%;
  flex: 0 0 25%;
  max-width: 25%;
}
.col-33 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 33%;
  -moz-box-flex: 0;
  -moz-flex: 0 0 33%;
  -ms-flex: 0 0 33%;
  flex: 0 0 33%;
  max-width: 33%;
}
.col-50 {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 50%;
  -moz-box-flex: 0;
  -moz-flex: 0 0 50%;
  -ms-flex: 0 0 50%;
  flex: 0 0 50%;
  max-width: 50%;
}
</style>
