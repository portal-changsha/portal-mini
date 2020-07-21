// 获取位置，公众号的定位采用微信js-sdk的定位api

/**
 * 获取位置
 * @param {type} 坐标类型  
 */
export function getLocation(type = 'gcj02'){
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: type,
			success: (res) => {
				resolve(res)
			},
			fail: (error) => {
				reject(error)
			}
		})
	})
}

/**
 * 使用应用内置地图查看位置。
 * @param {Object} latitude 纬度
 * @param {Object} longitude 经度
 */
export function openLocation(latitude, longitude){
	return new Promise((resolve, reject) => {
		uni.openLocation({
			latitude: latitude,
			longitude: longitude,
			success: (res) => {
				resolve(res)
			},
			fail: (error) => {
				reject(error)
			}
		})
	})
}
/**
 * 从本地相册选择图片或使用相机拍照
 * 适用于小程序端，h5端使用js-sdk
 */
export function chooseImage(count = 1, sourceType = ['album']){
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: count,
			sizeType: ['original', 'compressed'],
			sourceType: sourceType,
			success: (res) => {
				resolve(res)
			},
			fail: (error) => {
				reject(error)
			}
		})
	})
}

/**
 * 监听网络状态
 * 返回值：
 * isConnected Boolean 当前是否有网络连接
 * networkType String 网络类型
 */
export function onNetworkStatusChange(){
	return new Promise((resolve) => {
		uni.onNetworkStatusChange((res) =>{
			resolve(res)
		})
	})
}

/**
 * 显示消息提示框
 * position该属性文档里提示只有在app有效
 */
export function showToast(title, duration = 1800, icon = 'none', mask = false, position = 'bottom'){
	uni.showToast({
		title: title,
		icon: icon,
		duration: duration
	})
}
/**
 * 隐藏消息提示框
 */
export function hideToast(){
	uni.hideToast()
}
/**
 * 显示 loading 提示框
 * 需主动调用 uni.hideLoading 才能关闭提示框。
 */
export function showLoading(title = '加载中', mask = true){
	uni.showLoading({
	    title: title,
		mask: mask
	})
}
/**
 * 关闭loading 提示框
 */
export function hideLoading(){
	uni.hideLoading()
}

/**
 * 显示模块弹框
 * @param {String} title 提示的标题
 * @param {String} content 提示的内容
 * @param {String} confirmText 确定按钮文字，默认确定
 * @param {String} cancelText 取消按钮文字，默认取消
 * @param {Boolean} showCancel 是否显示取消按钮
 */
export function showModal(title = '提示', content = '', showCancel = true, confirmText = '确定', cancelText = '取消'){
	return new Promise((resolve, reject) => {
		uni.showModal({
		    title: title,
		    content: content,
			showCancel: showCancel,
			confirmText: confirmText,
			cancelText: cancelText,
		    success: (res) => {
		        resolve(res)
		    },
			fail: (error) => {
				reject(error)
			}
		})
	})
}

/**
 * 显示菜单操作
 * @param {Array} itemList 按钮的文字数组 (微信、百度、字节跳动小程序数组长度最大为6个)  
 * @param {HexColor}  itemColor 按钮的文字颜色，字符串格式，默认为"#000000"(字节跳动小程序不支持)
 */
export function showActionSheet(itemList, itemColor = '#000000'){
	return new Promise((resolve, reject) => {
		uni.showActionSheet({
			itemList: itemList,
			success: (res) => {
				resolve(res)
			},
			fail: (error) => {
				reject(error)
			}
		})
	})
}
/**
 * 动态设置标题
 * @param {Object} title 标题
 */
export function setTitle(title){
	uni.setNavigationBarTitle({
		title: title || '健康长沙'
	})
}