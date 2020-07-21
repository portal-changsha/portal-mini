export default {
  /**
   * 页面导航
   * @param {页面名称} name
   * @param {参数} params
   * @param {是否关闭当前页面 1: 不关闭} type
   */
  navigateTo (name, params, type = 1) {
	let url = `/pages/${name}/${name}`
	let param = ''
	if (params) {
	  for (let key in params) {
		param = param + key + '=' + params[key] + '&'
	  }
	  url = url + '?' + param.substr(0, param.length - 1)
	}
	switch(type){
		case 2:
		uni.redirectTo({
			url: url
		})
		break
		case 3:
		uni.reLaunch({
			url: 'test?id=1'
		})
		break
		default:
		uni.navigateTo({
			url: url
		})
		break
	}
  },
  /**
   * 路由返回
   * @param {delta} 返回的层级数 
   */
  navigateBack(delta = 1){
	  uni.navigateBack({
	    delta: delta
	  })
  }
}