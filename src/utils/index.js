/* eslint no-extend-native: ["error", { "exceptions": ["Date"] }] */

import { setItem } from './store'
import { login } from '../service/user.service'
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

// export function formatTime (date) {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()

//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   const t1 = [year, month, day].map(formatNumber).join('/')
//   const t2 = [hour, minute, second].map(formatNumber).join(':')

//   return `${t1} ${t2}`
// }

// export default {
//   formatNumber,
//   formatTime
// }

const utils = {
  getWeekDay: function (date) {
    let temp = date
    // if(typeof b === 'string'){
    temp = new Date(date)
    // }
    var Week = ['日', '一', '二', '三', '四', '五', '六']
    return '周' + Week[temp.getDay()]
  },
  /**
   * 计算天数
   * @param {开始时间} startDate
   * @param {结束时间} endDate
   */
  formatDate (startDate, endDate, type = 1) {
    return new Promise(async (resolve, reject) => {
      let days = ((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + type
      let curTime = new Date(startDate).getTime()
      let arr = []
      for (let i = 0; i < days; i++) {
        let temp = await this.formatTime(new Date(curTime + i * 86400000))
        arr.push(temp.curDate)
      }
      resolve(arr)
    })
  },
  formateDesc (date) {
    if (date.length === 17) {
      return date.substring(0, 5) + '-' + date.substring(9, 14)
    }
    return date
  },
  /**
   * 转换时间
   * @param {当前时间} date
   */
  formatTime (time, mode) {
    // return new Promise((resolve) => {
    let date = new Date(time)
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    // const t1 = [year, month, day].map(formatNumber).join('/')
    // const t2 = [hour, minute, second].map(formatNumber).join(':')
    month = month < 10 ? ('0' + month) : month
    day = day < 10 ? ('0' + day) : day
    if (mode === 'picker') {
      const res = year + '-' + month + '-' + day
      // resolve(res)
      return res
    }
    const t1 = month + '月' + day + '日'
    const t2 = [hour, minute].map(formatNumber).join(':')
    const t3 = second
    let timeObj = {
      curDate: t1,
      curTime: t2,
      curSec: t3
    }
    return timeObj
    // resolve(timeObj)
    // })
  },
  /**
   * 模块弹框
   * @param {弹框标题} title
   * @param {弹框内容} content
   * @param {确认后回调函数} callback
   * @param {取消后回调函数} fail
   * @param {是否显示取消按钮} showCancel
   */
  showModal (title, content, callback, fail, showCancel = true) {
    mpvue.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      success (res) {
        if (res.confirm) {
          callback()
        } else if (res.cancel) {
          fail()
        }
      }
    })
  },
  /**
   * 显示提示
   * @param {提示的标题} title
   * @param {提示的icon 默认无} icon
   */
  showToast (title, icon = 'none') {
    mpvue.showToast({
      title: title,
      icon: icon,
      duration: 2000
    })
    setTimeout(() => {
      mpvue.hideToast()
    }, 2000)
  },
  throttle (func, wait, mustRun) {
    let timeout
    let startTime = new Date()
    return function () {
      let context = this
      let args = arguments
      let curTime = new Date()
      clearTimeout(timeout)
      if (curTime - startTime >= mustRun) {
        func.apply(context, args)
        startTime = curTime
      } else {
        timeout = setTimeout(func, wait)
      }
    }
  },
  /**
   * 返回
   * @param {返回的级数--默认为1级} delta
   */
  back (delta = 1) {
    mpvue.navigateBack({
      delta: delta
    })
  },
  /**
   * 页面导航
   * @param {页面名称} name
   * @param {参数} params
   * @param {是否关闭当前页面 1: 不关闭} type
   */
  navigateTo (name, params, type = 1) {
    let url = '/pages/' + name + '/main'
    let param = ''
    if (params) {
      for (let key in params) {
        param = param + key + '=' + params[key] + '&'
      }
      url = url + '?' + param.substr(0, param.length - 1)
    }
    if (type === 1) {
      mpvue.navigateTo({
        url: url
      })
    } else if (type === 2) {
      mpvue.redirectTo({
        url: url
      })
    } else {
      mpvue.switchTab({
        url: url
      })
    }
  },
  /**
   * 获取当前位置
   */
  getLocation () {
    return new Promise((resolve, reject) => {
      mpvue.getLocation({
        type: 'gcj02',
        success (res) {
          resolve(res)
        },
        fail (e) {
          reject(e)
        }
      })
    })
  },
  /**
   * 动态设置标题
   * @param {标题} title
   */
  setBarTitle (title) {
    wx.setNavigationBarTitle({
      title: title
    })
  },
  /**
   * 显示大图
   * @param {当前图片的地址} current
   * @param {图片数组} arrs
   */
  showBigImg (current = 1, arrs) {
    mpvue.previewImage({
      current: arrs[current],
      urls: arrs
    })
  },
  /**
   * 动态设置导航栏的颜色
   * @param {设置的颜色} color
   */
  setNavBarColor (color = '#C7E0EF') {
    mpvue.setNavigationBarColor({
      backgroundColor: color
    })
  },
  /**
   * 获取设备状态栏的高度
   */
  getStatusBarHeight () {
    return mpvue.getSystemInfoSync()['statusBarHeight']
  },
  getCustomeHeigth () {
    let sysInfo = mpvue.getSystemInfoSync()
    let isIos = sysInfo.system.indexOf('iOS') > -1
    let statusHeight = sysInfo['statusBarHeight']
    if (isIos) {
      return statusHeight + 42
    } else {
      return statusHeight + 46
    }
  },
  /**
   * 使用微信内置地图查看位置
   *  */
  openLocation (latitude, longitude, name, address, scale = 18) {
    mpvue.openLocation({
      latitude,
      longitude,
      scale: scale,
      name: name,
      address: address
    })
  },
  getLoginCode () {
    return new Promise((resolve, reject) => {
      mpvue.login({
        success (res) {
          if (res.code) {
            resolve(res.code)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  getUserInfo () {
    return new Promise((resolve, reject) => {
      mpvue.getUserInfo({
        success (res) {
          resolve(res)
        }
      })
    })
  },
  doutted (value) {
    if (value) {
      return value.substr(0, 3) + '****' + value.substr(-4)
    }
  },
  toLogin () {
    return new Promise((resolve, reject) => {
      mpvue.getUserInfo({
        success: function (u) {
          setItem('userInfo', u)
          let params = {
            code: '',
            loginType: '3',
            extraMap: {
              encryptedData: u.encryptedData,
              iv: u.iv,
              rawData: u.rawData,
              signature: u.signature
            }
          }
          mpvue.login({
            success (res) {
              if (res.code) {
                params.code = res.code
                login(params).then(result => {
                  setItem('token', result.data.tokenId)
                  resolve(result)
                })
              } else {
                console.log('登录失败！' + res.errMsg)
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(false)
              }
            }
          })
        }
      })
    })
  }
}
export default utils
