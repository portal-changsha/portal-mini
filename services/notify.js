import { get, post } from './base.js'

/**
 * 通知回执
 * @param {Object} params
 */
export function postNotifyReceipt(params) {
	return post('/app/notify/receipt', params)
}