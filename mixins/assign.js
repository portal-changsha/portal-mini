import { devIsIos } from '@/utils/index.js'

const location = global.location

export default {
  beforeRouteEnter(to, from, next) {
	  console.log(to)
	  console.log(devIsIos())
    // 修复iOS版微信HTML5 History兼容性问题
    if (devIsIos() && to.path !== location.pathname) {
      location.assign(to.fullPath)
    } else {
      next()
    }
  }
}