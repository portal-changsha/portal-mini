<template>
  <div class="schedule">

    <div class="doc-info row row-center">
      <div class="row">
        <div class="doc-logo">
          <img v-if="docInfo.doctAvatar || originImgUrl" :src="docInfo.doctAvatar? docInfo.doctAvatar : originImgUrl + 'ico-doctor.png'" alt="">
        </div>
        <div class="doc-detail">
          <p>{{docInfo.doctName}}  {{docInfo.rankName}} </p>
          <p class="doc-dept">{{docInfo.deptName}}</p>
          <p class="doc-dept">{{docInfo.doctDesc ? docInfo.doctDesc : "暂无医生介绍"}}</p>
        </div>
      </div>
    </div>

    <ul class="field-list">
      <li>
        <span>预约科室</span>
        <span>{{docInfo.deptName}}</span>
      </li>
      <li>
        <span>医院</span>
        <span>{{hosInfo.hospitalName}}</span>
      </li>
      <li>
        <span>预约时间</span>
        <span>{{regDate}} {{phaseDesc}}</span>
      </li>
      <li>
        <span>挂号金额</span>
        <span><label style="color: #FF0000;">{{price}}元</label></span>
      </li>
    </ul>
    <div class="voucher-info" >
      <div class="info-title row row-center">
        <p>选择电子健康卡</p>
        <button @click="toAddVoucher">+绑定电子健康卡</button>
      </div>
      <div >
        <voucherItem :voucherList="vouchers" v-if="vouchers.length>0" @selected="selectVoucher($event)" :canChoose="true"></voucherItem>
      </div>
      <div class="tips row row-center" v-if="vouchers.length===0">
        <div class="tips-img" v-if="originImgUrl">
          <img  :src="originImgUrl + 'voucher-add.png'" alt="">
        </div>
        <div>暂无电子健康卡,请先<span @click="toAddVoucher">绑定电子健康卡</span></div>
      </div>
      <!-- <div class="register-des">
        <h5 class="reminder">挂号须知</h5>
        <p>1.取消预约至少提前一天，当天不可取消且无法退款。</p>
        <p>2.预约挂号为实名制绑定电子健康卡使用，就诊时请出示电子健康卡，若未办理电子健康卡请及时办理</p>
      </div> -->
    </div>
    <div class="confirm-btn">
      <button :disabled="vouchers.length === 0" @click="confirm()" :class="{disabled: vouchers.length === 0}">确认挂号</button>
    </div>
  </div>
</template>
<script>
// import { getVoucherList } from '@/service/voucher.service'
import { getRegisterLock } from '@/service/register.service'
import { getItem, setItem } from '@/utils/store'
import voucherItem from '@/components/VoucherItemSmall'
export default {
  data: function () {
    return {
      vouchers: [],
      voucherInfo: {},
      params: {},
      regDate: '',
      price: '',
      docInfo: {},
      hosInfo: {},
      phaseDesc: '',
      regInfo: {}
    }
  },
  components: {
    voucherItem
  },
  onLoad () {
    let q = this.$root.$mp.query
    if (q.params === undefined) {
      this.$utils.back()
      return
    }
    this.params = JSON.parse(q.params)
    console.log(this.params)
    this.docInfo = JSON.parse(q.docInfo)
    this.regInfo = JSON.parse(q.item)
    console.log(this.regInfo)
    this.price = (this.regInfo.totalFee / 100).toFixed(2)
    this.regDate = this.formatDate(this.params.regDate)
    this.phaseDesc = this.$utils.formateDesc(this.regInfo.phaseDesc)
    this.hosInfo = getItem('selectedHospital')
    console.log('医院信息...:', this.hosInfo)
    // this.getVoucherInfo()
  },
  onShow () {
    this.getVoucherInfo()
  },
  computed: {
    originImgUrl () {
      return this.constant.LOCAL_IMG
    }
  },
  methods: {
    toAddVoucher () {
      mpvue.navigateTo({
        url: '../voucherAdd/main?isBack=' + true
      })
    },
    async confirm () {
      // 确认挂号,锁号成功后跳转到支付页面,并将当前挂号时间存入vuex中
      let requestParams = {
        deviceType: '3',
        cardType: this.voucherInfo.cardType,
        cardNo: this.voucherInfo.cardNo,
        orgId: this.hosInfo.orgId,
        hospitalId: this.hosInfo.hospitald,
        areaId: this.params.areaId,
        regDate: this.params.regDate,
        regId: this.regInfo.regId,
        phaseId: this.regInfo.phaseId,
        bookType: this.regInfo.bookType,
        deptId: this.params.deptId,
        doctId: this.params.doctId
      }
      let res = await getRegisterLock(requestParams)
      if (res.result === this.constant.RESULT_SUCCESS) {
        let data = {
          cardType: this.voucherInfo.cardType,
          cardNo: this.voucherInfo.cardNo,
          payFee: res.data.payFee,
          busiType: this.constant.BUSI_TYPE.REGISTRATION_PAYMENT,
          busiIds: [res.data.orderNo],
          totalFee: res.data.totalFee,
          hospitalId: this.hosInfo.hospitald,
          areaId: this.params.areaId
        }
        setItem('payInfo', data)
        // this.$store.commit('setRegisterDate', new Date().getTime())
        this.$utils.navigateTo('pay', { params: JSON.stringify(data) })
      } else if (res.result === 11070028) {
        // 由于重复挂号导致失败，弹窗引导用户跳转到挂号列表
        mpvue.reLaunch({
          url: '../index/main'
        })
      }
    },
    //  选择电子健康卡
    selectVoucher (e) {
      this.voucherInfo = e
      setItem('selectedVoucher')
    },
    formatDate (date) {
      let res = this.$utils.formatTime(this.params.regDate)
      return res.curDate + ' ' + this.$utils.getWeekDay(this.params.regDate)
    },
    loadDocSchedules (e) {
      this.params.regDate = e.value
      this.regDate = this.formatDate(e.value)
      this.getDocTimeSchedules(this.params)
    },
    async getVoucherInfo () {
      this.vouchers = getItem('selectedVoucher') ? [getItem('selectedVoucher')] : []
      // this.vouchers = []
      // let res = await getVoucherList()
      // if (res.result === this.constant.RESULT_SUCCESS) {
      //   this.vouchers = res.data || []
      //   //  如果有电子健康卡 默认为第一张
      //   if (res.data.length > 0) {
      //     this.voucherInfo = res.data[0]
      //   }
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule{
  height: inherit;
  background: #EFF2F5;
}
.doc-info{
  height: 85px;
  background:#fff;
  margin-bottom: 8px;
  .doc-logo{
    img{
      width: 50px;
      height: 50px;
      border-radius: 100%;
      display:block;
      padding:5px 15px;
    }
  }
  .doc-detail{
    p:nth-child(1){
      color: #111;
      font-size: 18px;
      font-weight:500;

    }
    .doc-dept{
      color: #999;
      font-size: 13px;
    }

  }
}
.field-list{
  margin: 10px 0;
}
.confirm-btn{
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 60px;
  box-shadow:0px -1px 2px 0px rgba(81,168,236,0.2);
  background:#fff;
  button{
    height: 44px;
    background: #51A8EC;
    color: #FFFFFF;
    font-size: 18px;
    border-radius: 5px;
    margin:7px 15px;
  }
  .disabled{
    background: #999;
  }
}
.voucher-info{
  background: #fff;
  padding: 0 15px 10px 15px;
  margin-bottom:60px;
  .info-title{
    justify-content: space-between;
  }
  p{
    height: 50px;
    line-height: 50px;
    color: #111;
    font-size: 15px;
  }
  button{
    border: 1px solid #51A8EC;
    height: 35px;
    background: #fff;
    color: #51A8EC;
    font-size: 15px;
    line-height: 35px;
    margin: 0;
  }
  .tips {
    height: 100px;
    background: #fff;
    font-size: 13px;
    border: 1px dashed #51A8EC;
    .tips-img{
      padding-right: 15px;
      img{
        width: 64px;
        height: 73px;
        display: block;
      }

    }
    span{
      color: #51A8EC;
      font-size: 13px;
    }
  }
  // .register-des {
  //   color: #f24141;
  //   background: #eff2f5;
  //   margin: 10px 10px;
  //   padding: 4px;
  //   .reminder {
  //       width: 80px;
  //       background: url("../../../static/img/reminder.png") center left no-repeat;
  //       background-size: 17px 17px;
  //       padding-left: 1rem;
  //   }

  //   p {
  //       padding-left: 1rem;
  //   }
  // }
}
</style>

