import { getItem, setItem } from './store'
import { systemAuthorize } from '@/service/user.service'
import util from './index'
var Fly = require('flyio/dist/npm/wx')
var fly = new Fly()
fly.config.baseURL = 'http://114.115.204.39:8167/'
// fly.config.baseURL = 'http://148.70.16.29:7003/api'
fly.config.headers = {
  'Content-Type': 'application/json;charset=UTF-8'
}
export function get (url, options) {
  return new Promise((resolve, reject) => {
    fly.get(url, options)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
export function post (url, options) {
  return new Promise((resolve, reject) => {
    fly.post(url, options)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

//  添加请求拦截器
fly.interceptors.request.use(request => {
  mpvue.showLoading({
    title: '加载中',
    icon: 'loading',
    mask: true
  })
  if (getItem('accessToken')) {
    request.headers['Access-Token'] = getItem('accessToken')
  }
  let t = getItem('token') || ''
  t && (request.body['tokenId'] = t)
  if (request.url.indexOf('login') >= 0) {
    delete request.body.tokenId
  }
  request.body['channel'] = '7'
  return request
})
//  添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  async response => {
    let isNormalRequest = false
    setTimeout(() => {
      mpvue.hideLoading()
    }, 300)
    if (response.data.result === '8' || response.data.result === '10000018') {
      isNormalRequest = true
      //  记录前一次的请求
      let callback = async function () {
        post(response.request.baseURL + response.request.url, response.request.body).then(data => {
          isNormalRequest = false
          console.log('data...')
          console.log(data)
          return data
        }).catch(() => {
          isNormalRequest = false
        })
      }

      if (response.data.result === '8') {
      //  accessToken 过期,重新请求授权
        let authInfo = await systemAuthorize()
        if (authInfo.result === '1') {
          setItem('accessToken', authInfo.data.accessToken)
          callback()
        } else {
          return false
        }
      } else {
        let loginStatus = await util.toLogin()
        console.log('request..login')
        console.log(loginStatus)
        if (loginStatus) {
          callback()
        }
      }
    }

    if (response.data.result !== '1') {
      mpvue.showToast({
        title: response.data != null ? response.data.message : '' || '服务异常,请稍后再试',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    //  只将请求结果的data字段返回
    if (!isNormalRequest) return response.data
  },
  () => {
    mpvue.hideLoading()
    // mpvue.showModal('提示', '服务错误，请稍后再试', () => {}, () => {}, false)
    mpvue.showModal({
      title: '提示',
      content: '服务错误，请稍后再试',
      showCancel: false,
      success (res) {

      }
    })
  }
)
