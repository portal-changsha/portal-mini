<template>
  <div class="time-container">
    <!--选中的日期-->
    <p class="header-time">{{selectedDay.mounth}}月{{selectedDay.day}}日</p>
    <div class="time-table">
      <!--左箭头-->
      <div @click="onRollPage(-1)" class="item">
        <span class="arrow left" :class="{'arrow disabled-left' : page === 1}"></span>
      </div>
      <div v-for="(day, index) in currentShowList" class="item" :key="index">
        <p class="week" :class="{'text-selected':selectedDay.value === day.value}">{{day.weekDay}}</p>
        <label
          @click="select(day)"
          :class="{selected:selectedDay.value === day.value}"
          :id="'time-table-select-'+index"
        >
          <div :class="day.isToday ? 'today' : ''" class="day">{{day.monthDay}}</div>
        </label>
      </div>
      <!--右箭头-->
      <div @click="onRollPage(1)" class="item">
        <span class="arrow right" :class="{'arrow disabled-right': page === 2}"></span>
      </div>
    </div>
  </div>
</template>
<script>
// import { getTimeTable } from '@/service/api.service'
// import { getItem } from '@/utils/store'
// const commitDate = function (vm, dateObj) {
// vm.$store.commit('updateParam', {
//     namespace: 'register',
//     date: dateObj
// });
// }
export default {
  props: {
    areaId: String,
    deptId: String
  },
  onLoad () {
    this.refresh()
  },
  onShow () {
    this.refresh()
  },
  data () {
    return {
      selectedDay: { value: '', weekDay: '' },
      page: 1,
      dateList: [],
      isInCity: false
    }
  },
  computed: {
    currentShowList () {
      const page = this.page
      return this.dateList.slice((page - 1) * 5, page * 5)
    }
  },
  methods: {
    refresh () {
      var params = this.$store.getters.getRegDate
      if (params) {
        this.selectedDay = params
      } else {
        let curDate = new Date().format('yyyy-MM-dd')
        this.selectedDay = {
          value: curDate,
          weekDay: this.$utils.getWeekDay(new Date()),
          mounth: curDate.substring(5, 7),
          day: curDate.substring(8, 10)
        }
      }
      this.loadTimeTable()
    },
    // 加载可用时段
    loadTimeTable () {
      // let data = getItem('selectedHospital')
      let current = new Date().getTime()
      let tables = []
      for (let i = 0; i < 7; i++) {
        let obj = {
          date: current + 24 * 3600 * 1000 * i
        }
        tables.push(obj)
      }
      console.log(tables)
      // var requestParams = {
      //   orgId: data.orgId,
      //   hospitalId: data.id,
      //   areaId: this.areaId,
      //   deptId: this.deptId
      // }
      // getTimeTable(requestParams).then(res => {
      //   if (res.resultCode !== '1') {
      //     this.$utils.alert(res.resultMsg)
      //     return
      //   }
      //   var tables = res.data || []

      //   // 判断数组不为空
      //   if (tables.length === 0) {
      //     return
      //   }

      const utils = this.$utils
      const today = new Date()
      for (let i = 0; i < tables.length; i++) {
        const dateStr = tables[i].date
        const date = new Date(parseInt(dateStr))
        const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth()
        const tempDate = date.format('yyyy-MM-dd')
        const timeObj = {
          weekDay: utils.getWeekDay(date),
          isToday: isToday,
          monthDay: isToday ? '今' : date.getDate(),
          value: tempDate,
          mounth: tempDate.substring(5, 7),
          day: tempDate.substring(8, 10)
        }
        this.dateList.push(timeObj)
        if (this.selectedDay.value === date.format('yyyy-MM-dd')) {
          // this.isInCity = true
          this.$emit('change', timeObj)
        }
      }

      // 判断市内、市外挂号
      // if (this.isInCity === false) {
      //     this.selectedDay = this.dateList[0];
      //     commitDate(this, this.dateList[0]);
      //     this.$emit('change', this.dateList[0]);
      // }
      // })
    },
    // 翻页
    onRollPage (next) {
      const totalPage = Math.ceil(this.dateList.length / 5)
      if (this.page + next > totalPage || this.page + next === 0) {
        return
      }
      this.page += next
      const nextPageTemp = this.dateList[(this.page - 1) * 5]
      this.selectedDay = nextPageTemp
      // commitDate(this, nextPageTemp)
      this.$emit('change', nextPageTemp)
    },
    // 选择日期
    select: function (day) {
      this.selectedDay = day

      // commitDate(this, day);
      this.$emit('change', day)
    }
  }
}
</script>
<style lang="scss" scoped>
$main-blue: #51a8ec;
.time-container {
  width: 100%;
  background-color: #ffffff;
  .day {
    text-align: center;
    color: #222;
  }
  .header-time {
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-left: 15px;
    margin-right: 15px;
    border-bottom: 1px solid #e9e9e9;
    color: $main-blue;
    font-size: 15px;
  }
  .week {
    font-size: 13px;
    text-align: center;
    color: #777;
    margin-bottom: 10px;
  }
  .today {
    color: red;
  }
  .arrow {
    height: 30px;
    width: 30px;
    display: inline-block;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    &.left {
      background-image: url($main-img-url + 'btn-left.png');
    }
    &.disabled-left {
      background-image: url($main-img-url + 'btn-left-m.png');
    }
    &.right {
      background-image: url($main-img-url + 'btn-right.png');
    }
    &.disabled-right {
      background-image: url($main-img-url + 'btn-right-m.png');
    }
  }
}

.time-table {
  height: 80px;
  width: 100%;
  display: table;
  padding-bottom: 10px;
  .item {
    position: relative;
    display: table-cell;
    width: 14.2%;
    text-align: center;
    vertical-align: bottom;
  }
  label {
    height: 30px;
    width: 30px;
    line-height: 30px;
    padding: 5px;
    display: inline-block;
  }
  .selected {
    background-color: $main-blue;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    color: #fff;
    .day {
      font-size: 18px;
      color: #fff;
    }
    .week {
      color: #fff;
    }
  }
  .text-selected {
    color: $main-blue;
  }
}
</style>
