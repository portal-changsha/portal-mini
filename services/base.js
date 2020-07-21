import fly from '@/utils/request.js'
import { mockXHR } from '@/utils/mockjs.js'
import config from '@/config/index.js'

export function get(url, data){
	return new Promise((resolve, reject) => {
		if(config.VUE_APP_MOCK){
			resolve(mockXHR(url))
			return
		}
		fly.get(`${url}?t=${+new Date()}`, data).then(res => {
			resolve(res)
		}).catch((error) => {
			reject(error)
		})
	})
}

export function post(url, data){
	return new Promise((resolve, reject) => {
		if(config.VUE_APP_MOCK){
			resolve(mockXHR(url))
			return
		}
		fly.post(`${url}?t=${+new Date()}`, data).then(res => {
			resolve(res)
		}).catch((error) => {
			reject(error)
		})
	})
}
export function request(url, data, method = 'post'){
	return new Promise((resolve, reject) => {
		if(config.VUE_APP_MOCK){
			resolve(mockXHR(url))
			return
		}
		fly[method](`${url}?t=${+new Date()}`, data).then(res => {
			resolve(res)
		}).catch((error) => {
			reject(error)
		})
	})
}