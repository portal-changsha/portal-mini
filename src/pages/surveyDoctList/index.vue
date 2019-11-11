<template>
  <div class="my-register">
    <Hos-Voucher-Select v-on:select="select" ></Hos-Voucher-Select>
    <TimeSelect v-on:selectDate="selectDate"></TimeSelect>
    <div class="doc-info" v-for="(item, index) in regList" :key="index">
      <ul>
        <li>
          <span>{{item.typeName}}</span>
          <label>{{item.deptName}} <span>({{item.doctName}})</span></label>
        </li>
        <li class="time">
          <span>就诊时间</span>
          <label>{{item.regDate}} {{item.phaseDesc}}</label>
        </li>
      </ul>
      <div class="doc-btn">
        <button @click="toSurvey(item)">评价</button>
      </div>
    </div>
    <no-record :condition="registerList.length === 0" :tips="'暂无记录!'"></no-record>
  </div>
</template>
<script>
import NoRecord from '@/components/NoRecord'
import HosVoucherSelect from '@/components/hos-voucher-select'
import TimeSelect from '@/components/TimeSelect'
import { getRegisterList, getRegisterRefund, getRegisterUnlock } from '@/service/register.service'
import { getItem, setItem } from '@/utils/store'
export default {
  data: function () {
    return {
      regList: [{
        typeName: '普通门诊',
        deptName: '眼科',
        doctName: '王以上',
        regDate: '2019-10-09',
        phaseDesc: '09:00~09:30'
      }, {
        typeName: '普通门诊',
        deptName: '眼科',
        doctName: '王以上',
        regDate: '2019-10-09',
        phaseDesc: '09:00~09:30'
      }],
      endDate: '',
      startDate: '',
      registerList: [],
      voucher: {},
      hosInfo: {}
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
    this.loadList()
  },
  methods: {
    toSurvey (item) {
      //  跳转到评价详情界面
      this.$utils.navigateTo('survey')
    },
    selectDate (date) {
      if (date) {
        this.startDate = date.startDate
        this.endDate = date.endDate
        this.registerList = []
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
          if (res.result === '1') {
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
      this.registerList = []
      let params = {
        hospitalId: this.hosInfo.hospitald,
        areaId: this.hosInfo.areaId,
        cardType: this.voucher.cardType,
        cardNo: this.voucher.cardNo,
        startDate: this.startDate,
        endDate: this.endDate
      }
      let res = await getRegisterList(params)
      if (res.result === this.constant.RESULT_SUCCESS) {
        this.forMatData(res.data)
      }
    },
    forMatData (data) {
      if (!data || data.length === 0) return
      this.registerList = []
      for (let i = 0; i < data.length; i++) {
        data[i].orderTime = (this.$utils.formatTime(data[i].orderTime)).curDate + '     ' + (this.$utils.formatTime(data[i].orderTime)).curTime
        data[i].regDate = (this.$utils.formatTime(data[i].regDate)).curDate
        this.registerList.push(data[i])
      }
    },
    goDetail (item) {
      this.$utils.navigateTo('regDetails', {params: JSON.stringify(item)})
    },
    select (e) {
      this.$utils.navigateTo(e, { waitUrl: 'noredirect' })
    }
  }
}
</script>
<style lang="scss" scoped>
$main_color: #51A8EC;
.my-register {
  height: inherit;
  background: #eff2f5;
  .tips{
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 15px;
  }
}
.doc-info {
  background: #fff;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  border-bottom: 1px solid #DBDBDB;
  padding: 0 10px 0 15px;
  position: relative;
  box-shadow: 0px 1px 2px 0px rgba(81, 168, 236, 0.2);
        ul {
            background: #fff;
            li {
                span {
                    color: #999;
                }
                label {
                  padding-left: 20px;
                  color: #333;
                  span {
                      color: $main_color;
                  }
                }
            }
            .time {
                padding-top: 8px;
                .label{
                  color: #333;
                  font-size: 15px;
                }
            }
        }
        .doc-btn {
            button {
                width: 65px;
                height: 40px;
                background: #51A8EC;
                border-radius: 4px;
                font-size: 15px;
                color: #fff;
            }
        }

        .delete {
            position: absolute;
            width: 60px;
            height: 75px;
            right: -60px;
            top: 0;

            button {
                width: 60px;
                height: 75px;
                line-height: 75px;
                background: #FF3B2F;
                color: #fff;
                text-align: center;
                font-size: 15px;
                border-radius: 0;
            }

        }
    }
</style>

