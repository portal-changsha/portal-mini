
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
import { getItem, setItem } from './localStore.js'
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return '周' + ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return timeStr;
}

export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * 获取微信授权的地址
 * @param {公众号的appid} appid 
 * @param {回调地址} url 
 */
export function getWxRedirectUrl(appid, url) {
  appid = appid || config.VUE_APP_APPID
  return "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + encodeURIComponent(url) + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
}
/**
 * 获取链接地址参数
 * @param {Object} variable
 * @param {Object} url
 */
export function getQueryVariable(variable, url) {
  let currentUrl = url || location.href
  let queryLists = currentUrl.split('?')[1]
  if(!queryLists) return ''
  let vars = queryLists.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return ''
}

/**
 * 获取iframe 的当前url
 * @param {Object} id iframe的id
 */
export function getIframUrl(){
	const iframes = parent.document.getElementsByTagName('iframe')
	if(iframes && iframes.length === 1){
		const url = iframes[0].getAttribute('src')
		return url
	}
}

export function devBack(){
	console.log('4444')
	let hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null
	let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')
	const onVisibilityChange = function() {
		if(document[hiddenProperty]){
			console.log('按了返回键了。。。')
		}
	}
	document.addEventListener(visibilityChangeEvent, onVisibilityChange)
}
export function setPageTitle(title = ''){
	uni.setNavigationBarTitle({
	    title: title
	});
}
  /**
   * 匹配本地缓存的健康卡,(修复推送后健康卡选择的bug)
   * @param {待匹配的健康卡id} cardNo
   * @param {健康卡列表} voucherList
   */
export function matchLocalStoreVoucher(voucherList) {
    //本地缓存卡信息
    const localCard = getItem('selectedVoucher')
    //本地无缓存卡
    if (!localCard) {
      setItem('selectedVoucher', voucherList[0]);
      return
    }
    //匹配本地卡信息是否存在于最新卡列表中，防止推送后写入的卡信息不存在导致异常
    for (let i = 0; i < voucherList.length; i++) {
      if (localCard.cardNo === voucherList[i].cardNo) {
        setItem('selectedVoucher', voucherList[i]);
        return
      }
    }
    //没有查到匹配卡，默认卡列表第一张卡缓存到本地
    setItem('selectedVoucher', voucherList[0]);
  }
  
  export function devIsIos() {
    return (/ipad|iphone|mac/i.test(navigator.userAgent))
  }