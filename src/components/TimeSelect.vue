<template>
  <div>
    <div class="query-more" v-show="isChoose">
        <span>此处展示近三个月的历史记录</span>
        <button class="btn-ok recharge-more-btn" @click="loadMore()">更多</button>
    </div>
    <div class="query-history" v-show="!isChoose">
        <div class="time">请选择查询时间段</div>

        <div class="history-more">
            <picker class="option" mode="date" :value="startDate" start="2010-01-01" end="2099-01-01" @change="setStartDate">{{startDate}}</picker>
            <span></span>
            <picker class="option" mode="date" :value="endDate" start="2010-01-01" end="2099-01-01" @change="setEndDate">{{endDate}}</picker>
            <button class="btn-ok" @click="chooseNewDate()">确定</button>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showMore: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  data: function () {
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
      this.endDate = today.format('yyyy-MM-dd')
      today.setMonth(today.getMonth() - 3)
      this.startDate = today.format('yyyy-MM-dd')
    },
    setStartDate (e) {
      this.startDate = e.mp.detail.value
    },
    setEndDate (e) {
      this.endDate = e.mp.detail.value
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
  background-color: #eff2f5;
  position: relative;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 13px;
  padding-top: 0;
  .btn-ok {
    position: absolute;
    // width: 50px;
    height: 30px;
    right: 4px;
    font-size: 13px;
    top: 0;
  }
}

.query-history {
  height: 77.5px;
  .time {
    height: 34px;
    line-height: 34px;
    padding-left: 10px;
    border-top: 1px solid #E2E6E9;
    font-size: 13px;
  }
  .history-more {
    position: relative;
    .option {
      text-align: right;
      width: 28%;
      float: left;
      height: 30px;
      line-height: 30px;
      border: 0.5px solid #92B7FB;
      border-radius: 5px;
      padding-right: 24px;
      color: #92B7FB;
      position: relative;
      font-size: 11px;
      &:before {
        position: absolute;
        content: '';
        height: 16px;
        width: 15px;
        top: 7px;
        left: 10px;
        background-image: url($main-img-url + 'icon-calendar.png');
        background-size: 100% 100%;
      }
      &:after {
        position: absolute;
        content: '';
        height: 7.5px;
        width: 15px;
        right: 4px;
        top: 12px;
        background-image: url($main-img-url + 'more_gray_dwon.png');
        background-size: 100% 100%;
      }
      &:nth-child(1) {
        margin-left: 10px;
      }
    }
    span {
      float: left;
      width: 6px;
      border: 1px solid #92B7FB;
      margin: 15px 2px 0 2px;
    }
    .btn-ok {
      width: 16%;
      height: 30px;
      top: 0;
      font-size: 13px;
      float: right;
      margin-right: 2.5%;
      color: #fff;
      background: #51A8EC;
    }
  }
}
.recharge-more-btn{
    background: transparent;
    box-shadow: none;
    color: #51A8EC;
    margin: 5px 0;
    font-size: 13px;
    text-decoration: underline;
    margin: 5px 0;
}
.query-history{
  .time{
    color: #999;
    font-size: 13px;
  }
}
</style>

