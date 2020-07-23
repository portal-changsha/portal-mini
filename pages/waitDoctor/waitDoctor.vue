<template>
  <div class="waitDoctor app">
    <hos-voucher-select v-on:select="select"></hos-voucher-select>
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
			 <em v-if="item.status =='1'" :class="{green: item.status =='1'}" >(排队中)</em>
			 <em v-if="item.status =='2'" :class="{green: item.status =='2'}" >(已呼叫)</em>
			 <em v-if="item.status =='3'" :class="{gray: item.status =='3'}" >(已过号)</em>
          </span>
        </li>
      </ul>
    </div>
    <no-record :condition="waitInfo.length === 0" :tips="'抱歉，没有查到您的候诊记录!'"></no-record>
  </div>
</template>
<script>
import hosVoucherSelect from '@/components/hos-voucher-selcet/hos-voucher-selcet.vue'
import tabs from '@/components/tabs/tabs.vue'
import { getWaitInfo } from '@/services/clinic.js'
import { getItem } from '@/utils/localStore.js'
export default {
  data: function () {
    return {
      tab: [{name: '门诊'}, {name: '检查'}, {name: '检验'}],
      waitInfo: [],
      checkType: 1
    }
  },
  components: {
    hosVoucherSelect,
    tabs
  },
  onLoad () {
    uni.$on('backEvent', () => {
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
      let areaInfo = getItem('selectedArea')
      let params = {
		'orgId': hosInfo.orgId,
        'hospitalId': hosInfo.id,
        'areaId': areaInfo.areaId,
        'cardType': voucher.cardType,
        'cardNo': voucher.cardNo,
        'type': type + ''
      }
      getWaitInfo(params).then(res => {
        if (res.resultCode === this.$consts.RESULT_SUCCESS) {
          this.waitInfo = res.data
        }
      })
    },
    select (e) {
		this.$store.dispatch('paramStore/updateParam', {
			namespace: 'DistrictSelect',
			target: 'waitDoctor',
		})
		this.$Router.push({name: e});
    }
  }
}
</script>
<style lang="scss" scoped>
	.app{
		background: $common-background-color;
	}
.waitDoctor{
  height: inherit;
  background: #eff2f5;
  &-tab{
    margin: 0.5rem 0 0.35rem 0;
  }
  &-content{
    ul{
      margin-bottom: 0.35rem;
	  span{
		.green {
			color: #57D690;
		}
		.gray {
			color: #808080;
		}
	  }
    }
  }
}
</style>

