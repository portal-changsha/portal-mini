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
	import { getRegisterDate } from '@/services/register.js'
	import { parseTime } from '@/utils/index.js'
	import { getItem } from '@/utils/localStore.js'
	export default {
	  props: {
		areaId: String,
		deptId: String
	  },
	  mounted () {
		this.initData()
	  },
	  data () {
		return {
		  selectedDay: { value: '', weekDay: '' },
		  page: 1,
		  dateList: []
		}
	  },
	  computed: {
		currentShowList () {
		  const page = this.page
		  return this.dateList.slice((page - 1) * 5, page * 5)
		}
	  },
	  methods: {
		initData () {
		  const params = this.$store.getters.param.setRegDate
		  if (params && params.regDate) {
			this.selectedDay = params.regDate
		  } else {
			const curDate = parseTime(new Date(), '{y}-{m}-{d}')
			this.selectedDay = {
			  value: curDate,
			  weekDay: parseTime(new Date(), '{a}'),
			  mounth: parseTime(new Date(), '{y}'),
			  day: parseTime(new Date(), '{d}')
			}
		  }
		  this.loadTimeTable()
		},
		// 翻页
		onRollPage(next) {
		  const totalPage = Math.ceil(this.dateList.length / 5)
		  if (this.page + next > totalPage || this.page + next === 0) {
			return
		  }
		  this.page += next
		  const nextPageTemp = this.dateList[(this.page - 1) * 5]
		  this.selectedDay = nextPageTemp
		  this.$emit('change', nextPageTemp)
		},
		// 选择日期
		select(day) {
		  this.selectedDay = day
		  this.$emit('change', day)
		},
		// 加载可用时段
		loadTimeTable () {
		  const hosInfo = getItem('selectedHospital')
		  const areaInfo = getItem('selectedArea')
		  const params = {
		    orgId: hosInfo.orgId,
		    hospitalId: hosInfo.id,
		    areaId: areaInfo.areaId,
		    deptId: this.deptId
		  }
		  getRegisterDate(params).then(res => {
		    if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
			this.dateList = []
		    let tables = res.data || []
		    const today = new Date()
		    for (let i = 0; i < tables.length; i++) {
			  const dateStr = tables[i].date
			  const date = new Date(parseInt(dateStr))
			  const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth()
			  const tempDate = parseTime(date, '{y}-{m}-{d}')
			  const timeObj = {
				  weekDay: parseTime(date, '{a}'),
				  isToday: isToday,
				  monthDay: isToday ? '今' : date.getDate(),
				  value: tempDate,
				  mounth: parseTime(tempDate, '{m}'),
				  day: parseTime(tempDate, '{d}')
			  }
			  this.dateList.push(timeObj)
		    }
		  }
		)}
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
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-left: 0.75rem;
    margin-right: 0.75rem;
    border-bottom: 1px solid #e9e9e9;
    color: $main-blue;
    font-size: 0.75rem;
  }
  .week {
    font-size: 0.65rem;
    text-align: center;
    color: #777;
    margin-bottom: 0.5rem;
  }
  .today {
    color: red;
  }
  .arrow {
    height: 1.5rem;
    width: 1.5rem;
    display: inline-block;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    &.left {
      background-image: url($redirect-url + $img-file-path + 'btn-left.png');
    }
    &.disabled-left {
      background-image: url($redirect-url + $img-file-path + 'btn-left-m.png');
    }
    &.right {
      background-image: url($redirect-url + $img-file-path + 'btn-right.png');
    }
    &.disabled-right {
      background-image: url($redirect-url + $img-file-path + 'btn-right-m.png');
    }
  }
}

.time-table {
  height: 4rem;
  width: 100%;
  display: table;
  padding-bottom: 0.5rem;
  .item {
    position: relative;
    display: table-cell;
    width: 14.2%;
    text-align: center;
    vertical-align: bottom;
  }
  label {
    height: 1.5rem;
    width: 1.5rem;
    line-height: 1.5rem;
    padding: 0.25rem;
    display: inline-block;
  }
  .selected {
    background-color: $main-blue;
    border-radius: 50%;
    height: 1.5rem;
    width: 1.5rem;
    color: #fff;
    .day {
      font-size: 0.9rem;
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
