<template>
  <div class="waitDoctor">
    <Hos-Voucher-Select v-on:select="select"></Hos-Voucher-Select>
    <div class="waitDoctor-tab">
      <tabs :tabArr="tab" v-on:changeTab="changeTab"></tabs>
    </div>
    
    <div class="waitDoctor-content" v-if="waitInfo.length > 0">
      <ul class="field-list" v-for="(item, index) in waitInfo" :key="index">
        <li>
          <span>科室/诊室</span>
          <span>{{item.deptName}}/{{item.location}}</span>
        </li>
        <li>
          <span>就诊医生</span>
          <span>{{item.doctName}}</span>
        </li>
        <li>
          <span>正在就诊号</span>
          <span>{{item.currentNo}}</span>
        </li>
        <li>
          <span>我的就诊号</span>
          <span>{{item.waitNo}}
             <!-- <lable>(等待中)</lable>  -->
          </span>
        </li>
      </ul>
    </div>
    <no-record :condition="waitInfo.length === 0" :tips="'暂无记录!'"></no-record>
  </div>
</template>
<script>
import NoRecord from '@/components/NoRecord'
import HosVoucherSelect from '@/components/hos-voucher-select'
import tabs from '@/components/tabs'
import { getClinicQueueInfo } from '@/service/clinic.service'
import { getItem } from '@/utils/store'
import eventLister from '@/service/eventListener'
export default {
  data: function () {
    return {
      tab: [{name: '门诊'}, {name: '检查'}, {name: '检验'}],
      waitInfo: [],
      checkType: 1
    }
  },
  components: {
    NoRecord,
    HosVoucherSelect,
    tabs
  },
  onLoad () {
    eventLister.$on('backEvent', () => {
      this.getWaitDoctorInfo(this.checkType)
    })
    this.getWaitDoctorInfo(this.checkType)
  },

  methods: {
    changeTab (type) {
      this.checkType = type + 1
      this.getWaitDoctorInfo(this.checkType)
    },
    getWaitDoctorInfo (type) {
      this.waitInfo = []
      let hosInfo = getItem('selectedHospital')
      let voucher = getItem('selectedVoucher')
      let params = {
        'hospitalId': hosInfo.hospitald,
        'areaId': hosInfo.areaId,
        'cardType': voucher.cardType,
        'cardNo': voucher.cardNo,
        'type': type + ''
      }
      getClinicQueueInfo(params).then(res => {
        if (res.result === this.constant.RESULT_SUCCESS) {
          this.waitInfo = res.data
        }
      })
    },
    select (e) {
      this.$utils.navigateTo(e, { waitUrl: 'noredirect' })
    }
  }
}
</script>
<style lang="scss" scoped>
.waitDoctor{
  height: inherit;
  background: #eff2f5;
  &-tab{
    margin: 10px 0 7px 0;
  }
  &-content{
    ul{
      margin-bottom: 7px;
    }
  }
}
</style>

