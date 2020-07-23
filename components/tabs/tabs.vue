<template>
  <div class="area">
    <div class="pro-tab">
      <div class="tab-item" :class="{'tab-active':flag === index}" v-for="(item,index) in tabArr" :key="index" @click="changeTab(index)">{{item.name}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tabArr: {
      type: Array,
      default: function () {
        return []
      }
    },
	tabIndex: {
	  type: Number,
	  default: function () {
		return 0
	  }
	}
  },
    watch: {
	  tabIndex (val) {
		this.flag = val
	  }
	},
  data: function () {
    return {
      flag: 0
    }
  },
  methods: {
    changeTab (index) {
      this.flag = index
      this.$emit('changeTab', index)
    }
  }
}
</script>
<style lang="scss" scoped>
.area{
  white-space: nowrap;
  box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
  background: #fff;
}
.pro-tab{
  display: flex;
  justify-content: center;
  position: relative;
  height: 2.5rem;
  align-items:center;

  .tab-item{
    position: relative;
    text-align: center;
    font-size: 0.9rem;
    color: rgb(102,102,102);
    flex: 1;
  }
  .tab-active{
    color: rgb(17,17,17);
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 3rem;
      bottom: -0.2rem;
      left: 0;
      right: 0;
      height: 0.15rem;
      background-color: rgb(81,168,236);
      z-index: 1;
      list-style: none;
      margin: 0 auto;
    }
  }

}

</style>

