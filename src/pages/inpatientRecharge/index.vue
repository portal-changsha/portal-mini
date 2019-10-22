<template>
  <div class="myreport">
    <Hos-Voucher-Select v-on:select="select" ></Hos-Voucher-Select>
    <div v-if="inpatientInfoList.length > 0">
      <section class="thick">
        <div class="content charge-list">
          <span class="f-minor">住院号</span><span class="fr">{{inpatientInfo.inPatientNo}}</span>
        </div>
        <div class="content charge-list">
          <span class="f-minor">院区科室</span><span class="fr">{{inpatientInfo.deptName}}</span>
        </div>
        <div class="content charge-list">
          <span class="f-minor">床位号</span><span class="fr">{{inpatientInfo.bedNo}}</span>
        </div>
        <div class="content charge-list">
          <span class="f-minor">入院时间</span><span class="fr">{{inpatientInfo.inDate  | formatDate}}</span>
        </div>
      </section>
      <section class="thick">
        <div class="content charge-list">
          <span class="f-minor">住院预缴金总额</span><span class="fr f-strongest">{{inpatientInfo.total  | formatFee}}</span>
        </div>
        <div class="content charge-list">
                        <span class="f-minor">住院预缴金余额
                            <span class="f-strongest" v-show="inpatientInfo.balance < 0">(余额不足)</span>
                        </span>
          <span class="fr f-strongest">{{inpatientInfo.balance  | formatFee}}</span>
        </div>
      </section>
      <div class="money-input" v-if="inpatientInfo.status === '2'">
        <input type="number" name= "price" id = 'price' placeholder="请输入金额..." v-model="payFee" @input="oninput" @change="oninput(payFee)"><span>元</span>
      </div>
      <div class="inpatient-pay-btn" v-if="inpatientInfo.status === '2'">
        <button @click="goPay">确认支付</button>
      </div>
    </div>
    <no-record :condition="inpatientInfoList.length <= 0" :tips="'抱歉,没有查到您的住院信息!'"></no-record>
  </div>
</template>
<script>
  import NoRecord from '@/components/NoRecord'
  import HosVoucherSelect from '@/components/hos-voucher-select'
  import TimeSelect from '@/components/TimeSelect'
  import { getInpatientInfo } from '@/service/inpatient.service.js'
  import { setItem, getItem } from '@/utils/store'
  export default {
    data: function () {
      return {
        inpatientInfoList: [],
        inpatientInfo: {},
        voucher: {},
        hosInfo: {},
        areaInfo: {}
      }
    },
    computed: {
      originImgUrl () {
        return this.constant.LOCAL_IMG
      }
    },
    components: {
      NoRecord,
      HosVoucherSelect,
      TimeSelect
    },
    onLoad () {
    },
    onShow () {
      this.voucher = getItem('selectedVoucher')
      this.voucher = {
        cardType: '3',
        cardNo: '430922198711228911'
      }
      if (!this.voucher) {
        this.$utils.showToast('请先绑定电子健康卡')
        return
      }
      this.hosInfo = getItem('selectedHospital')
      this.loadInpatientInfo()
    },
    methods: {
      async loadInpatientInfo () {
        this.registerList = []
        let params = {
          hospitalId: this.hosInfo.hospitald,
          areaId: this.hosInfo.areaId,
          cardType: this.voucher.cardType,
          cardNo: this.voucher.cardNo
        }
        let res = await getInpatientInfo(params)
        if (res.result === this.constant.RESULT_SUCCESS) {
          this.forMatData(res.data)
        } else {
          this.$utils.showToast(res.resultMsg)
        }
      },
      forMatData (data) {
        if (data.length === 0 || data[0].status === '1') {
          return
        }
        // 防止数组越界
        this.inpatientInfoList = data
        this.inpatientInfo = this.inpatientInfoList[0]

        if (this.inpatientInfo.status !== '2') {
          this.$utils.showToast('您不是在院患者，无法充值')
        }
      },
      oninput (e) {
        if (e === undefined || e.target === undefined) {
          return
        }

        if ((e.inputType === 'insertText' && (e.target._value.indexOf('.') !== -1 && e.data.indexOf('.') === 0)) || (parseFloat(e.target.value) > 3000 || parseFloat(e.target.value) < 0) || (e.target.value.indexOf('.') >= 0 && e.target.value.split('.')[1].length > 2)) {
          const a = '-1'
          e.target.value = (a.match(/^\d*(\.?\d{0,2})/g)[0]) || null
          this.payFee = e.target._value
          e.target.value = this.payFee
          this.$utils.showToast('请输入0-3000内的金额')
          return
        }
        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        if (e.inputType !== 'deleteContentBackward') {
          this.payFee = e.target.value ? e.target.value : e.target._value
        }
      },
      goPay () {
        //  判断金额是否正确
        if (this.payFee === '' || parseFloat(this.payFee) <= 0 || parseFloat(this.payFee) > 3000) {
          this.$utils.showToast('请输入0-3000内的金额')
          return
        }
        var totalFee = parseFloat(this.payFee).toFixed(2)
        // 将数据存入本地
        setItem('payInfo', {
          hospitalId: this.hosInfo.hospitald,
          areaId: this.hosInfo.areaId,
          cardType: this.voucher.cardType,
          cardNo: this.voucher.cardNo,
          payFee: totalFee * 100,
          busiType: this.constant.BUSI_TYPE.IN_PATIENT_RECHARGE_PAYMENT,
          busiIds: [this.inpatientInfo.inPatientNo]
        })

        // 跳转界面
        this.$utils.navigateTo('pay')
      },
      select (e) {
        // 防止数组越界
        this.inpatientInfoList = []
        this.inpatientInfo = null
        this.$utils.navigateTo(e, { waitUrl: 'noredirect' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .charge-list {
    border-bottom: 1px solid #e9e9e9;
    .fr {
      float: right;
    }
  }
  .thick {
    margin-bottom: 5px;
  }
  .content {
    padding: .5rem .75rem;
  }
  .f-minor {
    color: #999999;;
  }
  .f-strongest{
    color: #ff0000;
  }
  .money-input{
    height: 45px;
    line-height: 45px;
    padding: 0 .75rem;
    background: #fff;
    input{
      float:left;
      border: 0px;
    }
    span{
      float: right;
    }
  }
  .inpatient-pay-btn{
    padding: 0 .65rem 0 .75rem;
    margin: 45px 0px 10px 0px;
    button{
      background: #51A8EC;
      border-radius: 5px;
      color: #ffffff;
      height: 44px;
      width: 100%;
    }
  }
  .myreport{
    .tips{
      text-align: center;
      height: 40px;
      line-height: 40px;
      color: #333;
      font-size: 15px;
    }
    .clinic-info{
      background: #fff;
      margin-bottom: 10px;
      h3{
        height: 45px;
        line-height: 45px;
        padding: 0 15px;
        border-bottom: 1px solid #DBDBDB;
      }
      .content{
        width: auto;
        padding: 0 15px;
        position: relative;
        justify-content: space-between;
        height: 70px;
        .left{
          font-size: 15px;
          p{
            color: #999999;
          }
        }
        .arrow{
          img{
            width: 8px;
            height: 13px;
          }
        }
      }
      .reg-status{
        height: 50px;
        padding:0 15px;
        width:auto;
        border-top: 1px solid #DBDBDB;
        justify-content: space-between;
        p{
          color: #51A8EC;
          font-size: 15px;
        }
        .right{
          text-align: right;
        }
        button{
          color: #fff;
          font-size: 15px;
          display: inline-block;
          width: 70px;
          height: 35px;

          border-radius: 5px;
          border: 0;

          margin-left: 10px;
          &:nth-child(1){
            background: #DBDBDB;
            box-shadow: 0 2px 4px #DBDBDB;
          }
          &:nth-child(2){
            background: #51A8EC;
            box-shadow: 0 2px 4px #51A8EC;
          }
          &:nth-child(3){
            background: #FF0000;
            box-shadow: 0 2px 4px #FF0000;
          }
        }
      }
    }
  }
</style>

