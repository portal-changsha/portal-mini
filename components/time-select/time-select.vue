<template>
  <div>
    <div class="query-more" v-show="isChoose">
        <span>{{tips}}</span>
        <button class="btn-ok recharge-more-btn" @click="loadMore()">更多</button>
    </div>
    <div class="query-history" v-show="!isChoose">
        <div class="time">请选择查询时间段</div>

        <div class="history-more">
            <picker class="option" mode="date" :value="startDate" start="2015-01-01" end="2029-01-01" @change="setStartDate">{{startDate}}</picker>
            <span></span>
            <picker class="option" mode="date" :value="endDate" start="2015-01-01" end="2029-01-01" @change="setEndDate">{{endDate}}</picker>
            <button class="btn-ok" @click="chooseNewDate()">确定</button>
        </div>
    </div>
  </div>
</template>
<script>
	import { parseTime } from '@/utils/index.js'
export default {
  props: {
    showMore: {
      type: Boolean,
      default: function () {
        return true
      }
    },
	tips: {
		type: String,
		default: () => {
			return '此处展示近三个月的历史记录'
		}
	}
  },
  data() {
    return {
      isChoose: true,
      startDate: '',
      endDate: ''
    }
  },
  onLoad () {
    this.isChoose = this.showMore
    if (!this.showMore) {
      this.formatDatePicker()
    }
  },
  methods: {
    loadMore () {
      this.isChoose = !this.isChoose
      // 初始化日期控件
      this.formatDatePicker()
    },
    // 默认初始化日历控件
    formatDatePicker () {
      const today = new Date()
      this.endDate = parseTime(today, '{y}-{m}-{d}')
      today.setMonth(today.getMonth() - 3)
      this.startDate = parseTime(today, '{y}-{m}-{d}')
    },
    setStartDate (e) {
		console.log(e)
      this.startDate = e.detail.value
    },
    setEndDate (e) {
		console.log(e)
      this.endDate = e.detail.value
    },
    // 判断日期是否合法
    checkDate (sDate, eDate) {
      var formate = new RegExp(/-/g)
      sDate = sDate.replace(formate, '')
      eDate = eDate.replace(formate, '')
      // 判断日期大小及合法性
      if ((sDate > eDate) || (sDate === '') || (eDate === '')) {
        this.$utils.alert('日期输入格式不正确，请重新输入')
        return false
      }
      return true
    },
    chooseNewDate () {
      if (this.checkDate(this.startDate, this.endDate)) {
        let dateObj = {
          startDate: this.startDate,
          endDate: this.endDate
        }
        this.$emit('selectDate', dateObj)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
button::after {
  border: none
}
.query-more {
  background-color: $common-background-color;
  position: relative;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  font-size: 0.65rem;
  padding-top: 0;
  span{
	  font-size: 0.65rem;
  }
  .btn-ok {
    position: absolute;
    height: 1.5rem;
    right: 4px;
    font-size: 0.65rem;
    top: 0;
	margin: 0
  }
}

.query-history {
  height: 3.4rem;
  margin-bottom: 0.5rem;
  .time {
    height: 1.7rem;
    line-height: 1.7rem;
    padding-left: 0.5rem;
    border-top: 1px solid #E2E6E9;
    font-size: 0.65rem;
  }
  .history-more {
    position: relative;
    .option {
      text-align: right;
      width: 28%;
      float: left;
      height: 1.5rem;
      line-height: 1.5rem;
      border: 0.5px solid #92B7FB;
      border-radius: 0.3rem;
      padding-right: 1.2rem;
      color: #92B7FB;
      position: relative;
      font-size: 0.55rem;
      &:before {
        position: absolute;
        content: '';
        height: 0.8rem;
        width: 0.75rem;
        top: 0.35rem;
        left: 0.5rem;
        background-image: url($redirect-url + $img-file-path + 'icon-calendar.png');
        background-size: 100% 100%;
      }
      &:after {
        position: absolute;
        content: '';
        height: 0.4rem;
        width: 0.75rem;
        right: 0.2rem;
        top: 0.6rem;
        background-image: url($redirect-url + $img-file-path + 'more_gray_dwon.png');
        background-size: 100% 100%;
      }
      &:nth-child(1) {
        margin-left: 0.5rem;
      }
    }
    span {
      float: left;
      width: 0.3rem;
      border: 1px solid #92B7FB;
      margin: 0.75rem 2px 0 2px;
    }
    .btn-ok {
      width: 16%;
      top: 0;
      font-size: 0.65rem;
      float: right;
      margin-right: 2.5%;
      color: #fff;
      background: #51A8EC;
	  margin: 0 0.75rem;
	  line-height: 1.5rem;
    }
  }
}
.recharge-more-btn{
    background: transparent;
    box-shadow: none;
    color: #51A8EC;
    margin: 0.3rem 0;
    font-size: 0.65rem;
    text-decoration: underline;
    margin: 0.3rem 0;
	height: 2rem !important;
	line-height: 2rem !important;
}
.query-history{
  .time{
    color: #999;
    font-size: 0.65rem;
  }
}
</style>

