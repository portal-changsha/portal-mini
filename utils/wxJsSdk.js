import wechat from '@/static/js/jweixin-1.4.0.js'
import { wxSign } from '@/services/wechat.js'

/**
 * 获取微信配置
 * @param {Object} wxSignParams
 * @param {Object} callBack
 */
export async function wechatConfig(wxSignParams, callBack, appId) {
	const res = await wxSign(wxSignParams)
	if (res.resultCode !== '1') return
	const config = res.data
	const configObj = {
		debug: false,
		appId: config.appId, // 必填，公众号的唯一标识
		timestamp: config.timestamp, // 必填，生成签名的时间戳
		nonceStr: config.nonceStr, // 必填，生成签名的随机串
		signature: config.signature, // 必填，签名
		jsApiList: ['chooseImage', 'uploadImage', 'getLocalImgData', 'closeWindow', 'openLocation', 'getLocation', 'chooseWXPay'],
	}
	wechat.config(configObj)
	wechat.ready(() => {
		if (callBack) {
			callBack.call(this)
			return
		}
		wechat.closeWindow()
	})
} 

/**
 * 获取位置
 */
export function getLocation(type = 'gcj02'){
	return new Promise((resolve, reject) => {
		wechat.getLocation({
		  type: type, // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
		  success: (res) => {
			resolve(res)
		  },
		  fail: (error) => {
			reject(error)
		  },
		  cancel: () => {
			 reject('cancel')
		  }
		})
	})
}
/**
 * 使用微信内置地图查看位置接口
 */
export function openLocation(latitude, longitude, name, address, scale = 13, infoUrl = '' ){
	wechat.openLocation({
	  latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
	  longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
	  name: name, // 位置名
	  address: address, // 地址详情说明
	  scale: scale, // 地图缩放级别,整形值,范围从1~28。默认为最大
	  infoUrl: infoUrl // 在查看位置界面底部显示的超链接,可点击跳转
	})
}
/**
 * 微信支付
 * @param {Object} params
 */
export function payByWechat(params){
	alert(JSON.stringify(params))
	return new Promise((resolve, reject) => {
		wechat.chooseWXPay({
		  timestamp: params.timeStamp,
		  nonceStr: params.nonceStr, 
		  package: params.package, 
		  signType: params.signType,
		  paySign: params.sign, 
		  success: (res) => {
			// 支付成功后的回调函数
			resolve(res)
		  },
		  cancel: () => {
			reject('cancel')  
		  },
		  fail: (error) => {
			reject(error)
		  }
		})
	})
}
/**
 * 选择图片/相机
 */
export function chooseImage(){
	return new Promise((resolve, reject) => {
		wechat.chooseImage({
		  count: 1,
		  sizeType: ['original', 'compressed'],
		  sourceType: ['album', 'camera'],
		  success: (res) => {
			resolve(res)
		  }
		})
	})
}
/**
 * 预览图片
 * @param {String} current 当前显示图片的http链接
 * @param {Array} urls 需要预览的图片http链接列表
 */
export function previewImage(current, urls){
	wechat.previewImage({
	  current: current,
	  urls: urls
	})
}
/**
 * 上传图片
 * @param {Object} localId
 */
export function uploadImage(localId){
	return new Promise((resolve, reject) => {
		wechat.uploadImage({
		  localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
		  isShowProgressTips: 1, // 默认为1，显示进度提示
		  success: (res) => {
			  // 返回图片的服务器端ID
		    // var serverId = res.serverId;
			 resolve(res)
		  },
		  fail: (error) => {
			  reject(error)
		  }
		})
	})
}
/**
 * 获取本地图片
 * @param {Object} localId
 */
export function getLocalImage(localId){
	return new Promise((resolve, reject) => {
		wechat.getLocalImgData({
		  localId: localId, // 图片的localID
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
 * 微信支付~WeixinJSBridge
 * @param {Object} payInfo
 */
export function payWithWxJSBridge(payInfo){
	console.log(payInfo)
	return new Promise((resolve, reject) => {
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest',
			{
				appId: payInfo.appId,     // 公众号名称，由商户传入
				timeStamp: payInfo.timeStamp, // 时间戳，自1970年以来的秒数
				nonceStr: payInfo.nonceStr, // 随机串
				package: payInfo.package,
				signType: payInfo.signType, // 微信签名方式：
				paySign: payInfo.sign, // 微信签名
			},
			function (res) {
				// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
				if (res.err_msg === 'get_brand_wcpay_request:ok') {
					resolve(true)
				}
				reject(false)
			}
		)
	})
}