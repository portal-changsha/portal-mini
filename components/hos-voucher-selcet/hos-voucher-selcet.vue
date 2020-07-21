<template>
  <div>
	<hospital-name></hospital-name>
    <nav-list :navList="navList" v-on:toPage="toPage" :size="'medium'" :fontColor="'#51a8ec'"></nav-list>
  </div>
</template>
<script>
import navList from '@/components/nav-list/nav-list.vue'
import hospitalName from '@/components/hospital-name/hospital-name.vue'
import { getItem, setItem } from '@/utils/localStore.js'
import { getVoucherList } from '@/services/voucher.js'
import config from '@/config/index.js'
import { dotted } from '@/filters/index.js'
import { showToast } from '@/utils/uniApi.js'

const BASE_IMG_URL = config.VUE_APP_IMG_URL
export default {
  data: function () {
    return {
      navList: [
        {
          imgSrc: BASE_IMG_URL + 'hospital_icon.png',
          name: '',
          url: 'hospitalSelect'
        },
        {
          imgSrc: BASE_IMG_URL + 'card_icon.png',
          name: '无',
          url: 'voucherSelect'
        }
      ],
      hosInfo: {},
      voucherList: []
    }
  },
  mounted() {
	  uni.$on('backEvent', () => {
		  this.refresh()
	  })
    this.refresh()
  },
  destroyed(){
	  console.log('组件销毁了。。。')
	 uni.$off('backEvent') 
  },
  components: {
    navList,
	hospitalName
  },
  methods: {
    refresh () {
      this.hosInfo = getItem('selectedHospital')
	  console.log(this.hosInfo)
      this.navList[0].name = this.hosInfo.name
      let v = getItem('selectedVoucher')
      //  获取电子健康卡
      if (v) {
        this.navList[1].name = v.holderName + '/' + dotted(v.cardNo)
      } else {
        this.getVoucherInfo()
      }
    },
    toPage (e) {
		console.log(e)
      if (this.navList[1].name === '无' && e === 'voucherSelect') return
	  this.$emit('select', e)
    },
    getVoucherInfo () {
      getVoucherList().then((res) => {
        if (res.resultCode === this.$consts.RESULT_SUCCESS) {
          if (res.data.length > 0) {
            this.navList[1].name = '电子健康卡/' + res.data[0].holderName + dotted(res.data[0].cardNo)
            setItem('selectedVoucher', res.data[0])
          } else {
            this.navList[1].name = '无'
			showToast('请先绑定电子健康卡')
          }
        }
      })
    }
  }
}
</script>
