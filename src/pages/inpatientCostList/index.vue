<template>
  <div class="inpatient-cost">
    <Hos-Voucher-Select v-on:select="select" ></Hos-Voucher-Select>
    <TimeSelect v-on:selectDate="selectDate"></TimeSelect>

    <div style="margin-bottom:55px;">
      <div class="cost-detail" v-for="(item,index) in inpatientCostList" :key="index">
        <div class="row row-center title">
          <div class="project">费用发生时间：{{item.day}}</div>
          <p class="price">{{item.totalFee /100}}元</p>
        </div>
        <div class="content" v-for="(subItem,i) in item.rows" :key="i">
          <p class="content-name">{{subItem.itemName}}<span v-if="subItem.specs" style="color: #DBDBDB;">/规格({{subItem.specs}})</span></p>
          <div class="content-detail row row-center">
            <div class="col">
              <p>单价</p>
              <p>{{subItem.price /100}}元</p>
            </div>
            <div class="col">
              <p>数量</p>
              <p>{{subItem.qty}}</p>
            </div>
            <div class="col">
              <p>总价</p>
              <p>{{subItem.totalFee /100 }}元</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="inpatientInfoList.length === 0">
      <no-record :condition="inpatientInfoList.length === 0" :tips="'抱歉,没有查到您的住院信息!'"></no-record>
    </div>
    <div v-else>
      <no-record :condition="inpatientCostList.length === 0" :tips="'暂无费用记录'"></no-record>
    </div>
  </div>
</template>
<script>
  import NoRecord from '@/components/NoRecord'
  import HosVoucherSelect from '@/components/hos-voucher-select'
  import TimeSelect from '@/components/TimeSelect'
  import { getInpatientInfo, getInpatientBill } from '@/service/inpatient.service.js'
  import { getRegisterRefund, getRegisterUnlock } from '@/service/register.service'
  import { getItem, setItem } from '@/utils/store'
  export default {
    data: function () {
      return {
        endDate: '',
        startDate: '',
        inpatientCostList: [],
        inpatientInfoList: [],
        inpatientInfo: {},
        tips: '抱歉,没有查到您的住院信息!',
        voucher: {},
        hosInfo: {},
        areaInfo: {}
      }
    },
    components: {
      NoRecord,
      HosVoucherSelect,
      TimeSelect
    },
    computed: {
      originImgUrl () {
        return this.constant.LOCAL_IMG
      }
    },
    onLoad () {
      let today = new Date()
      this.endDate = today.format('yyyy-MM-dd')
      today.setMonth(today.getMonth() - 3)
      this.startDate = today.format('yyyy-MM-dd')
    },
    onShow () {
      this.voucher = getItem('selectedVoucher')
      if (!this.voucher) {
        this.$utils.showToast('请先绑定电子健康卡')
        return
      }
      this.hosInfo = getItem('selectedHospital')
      // this.areaInfo = getItem('selectedArea')
      this.loadInpatientInfo()
    },
    methods: {
      async loadInpatientInfo () {
        let params = {
          hospitalId: this.hosInfo.hospitald,
          areaId: this.hosInfo.areaId,
          cardType: this.voucher.cardType,
          cardNo: this.voucher.cardNo
        }
        let res = await getInpatientInfo(params)
        if (res.result === this.constant.RESULT_SUCCESS) {
          this.forMatInpatientInfoData(res.data)
          this.loadList()
        } else {
          this.$utils.showToast(res.resultMsg)
        }
      },
      forMatInpatientInfoData (data) {
        if (data.length === 0 || data[0].status === '1') {
          return
        }
        // 防止数组越界
        this.inpatientInfoList = data
        this.inpatientInfo = this.inpatientInfoList[0]
      },
      selectDate (date) {
        if (date) {
          this.startDate = date.startDate
          this.endDate = date.endDate
          this.inpatientCostList = []
          this.loadList()
        }
      },
      toActive (type, item, index, tips) {
        //  取消、退号
        if (type !== 2) {
          this.$utils.showModal('提示', tips, async () => {
            //  确认按钮
            let params = {
              orgId: this.hosInfo.orgId,
              hospitalId: this.hosInfo.hospitald,
              areaId: item.areaId,
              orderId: item.orderId
            }
            if (type === 1) {
              params.cardType = this.voucher.cardType
              params.cardNo = this.voucher.cardNo
              params.orderNo = item.orderNo
              params.regId = item.regId
            }
            let res = type === 1 ? await getRegisterUnlock(params) : await getRegisterRefund(params)
            if (res.result === this.constant.RESULT_SUCCESS) {
              // let title = type === 1 ? '取消成功' : '退号成功，退款到账时间以银行到账时间为准。'
              // this.$utils.showToast(title, 5000)
              this.loadList()
            }
          }, () => {
            //  取消
          })
        } else {
          //  去缴费
          let payInfo = {
            hospitalId: this.hosInfo.hospitald,
            areaId: item.areaId,
            cardType: this.voucher.cardType,
            cardNo: this.voucher.cardNo,
            payFee: item.totalFee,
            totalFee: item.totalFee,
            busiType: this.constant.BUSI_TYPE.REGISTRATION_PAYMENT,
            busiIds: [item.orderNo]
          }
          setItem('payInfo', payInfo)
          this.$utils.navigateTo('pay', { params: JSON.stringify(payInfo) })
        }
      },
      async loadList (type) {
        this.inpatientCostList = []

        let params = {
          hospitalId: this.hosInfo.hospitald,
          areaId: this.hosInfo.areaId,
          cardType: this.voucher.cardType,
          cardNo: this.voucher.cardNo,
          startDate: this.startDate,
          endDate: this.endDate,
          inPatientNo: this.inpatientInfo.inPatientNo,
          pageNo: 'null',
          pageRows: 'null'
        }

        let res = await getInpatientBill(params)
        if (res.result === this.constant.RESULT_SUCCESS) {
          this.inpatientCostList = res.data.rows
          console.log(JSON.stringify(this.inpatientCostList.length))
          this.forMatData(res.data.rows)
        }
      },
      forMatData (data) {
        if (!data || data.length === 0) return
        this.inpatientCostList = []
        for (let i = 0; i < data.length; i++) {
          data[i].operTime = this.formatTime(data[i].operTime)
        }

        let days = []
        for (let i = 0; i < data.length; i++) {
          let dayCostArr = []
          let dayTotalFee = 0

          if (days.indexOf(data[i].operTime) === -1) {
            for (let j = 0; j < data.length; j++) {
              if (data[i].operTime === data[j].operTime) {
                dayCostArr.push(data[j])
                dayTotalFee += parseInt(data[j].totalFee)
              }
            }
            days.push(data[i].operTime)
            let rowCost = { 'day': data[i].operTime, 'totalFee': dayTotalFee, 'rows': dayCostArr }
            this.inpatientCostList.push(rowCost)
          }
        }

        function compare (a, b) {
          return new Date(a.day).getTime() - new Date(b.day).getTime()
        }

        this.inpatientCostList.sort(compare)
        console.log(JSON.stringify(days))
        console.log(JSON.stringify(this.inpatientCostList))
      },
      goDetail (item) {
        this.$utils.navigateTo('regDetails', {params: JSON.stringify(item)})
      },
      formatTime (time) {
        let date = new Date(time)
        let month = (date.getMonth() + 1 + '').length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 + ''
        let day = (date.getDate() + '').length === 1 ? '0' + date.getDate() : date.getDate() + ''
        return date.getFullYear() + '-' + month + '-' + day
      },
      select (e) {
        this.$utils.navigateTo(e, { waitUrl: 'noredirect' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .inpatient-cost {
    .tips{
      text-align: center;
      height: 40px;
      line-height: 40px;
      color: #333;
      font-size: 15px;
    }
    .inpatient-info{
      background: #fff;
      border-bottom: 10px solid #eff2f5;
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
        height: 80px;
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
      .project{
        color: #51A8EC;
        font-size: 15px;
      }
      .price{
        color: #FF0000;
        font-size: 15px;
        position: absolute;
        right: 33px;
      }
    }
  }
  .cost-detail{
    // margin-bottom: 10px;
    .title{
      margin-bottom: 2px;
      justify-content: space-between;
      position: relative;
      padding: 0 15px;
      width: auto;
      height: 50px;
      background:rgba(254,255,255,1);
      box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
      .project{
        color: #51A8EC;
        font-size: 15px;
      }
      .price{
        color: #FF0000;
        font-size: 15px;
        position: absolute;
        right: 33px;
      }
      .arrow{
        img{
          width: 13px;
          height: 8px;
          display: block;
        }
      }
    }
    .content{
      background: #F8F8F8;
      .content-name{
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
        color: #222222;
        font-size: 15px;
        border-bottom: 1px solid #DBDBDB;
        span{
          color: #999999;
          font-size: 15px;
        }
      }
      .content-detail{
        height: 60px;
        .col{
          text-align: center;
          p:nth-child(1){
            color: #999;
            font-size: 15px;
          }
          p:nth-child(2){
            color: #222;
            font-size: 15px;
          }
        }
      }
    }
    .trans_arrow{
      transform: rotate(180deg)
    }
  }
</style>

