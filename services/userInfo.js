
import { get, post } from './base.js'

/**
 * 获取用户信息
 */
export function getUserInfo() {
	return get('/app/user/info')
}
/**
 * 静默授权登录获取tokenId
 * @param {Object} params
 */
export function getTokenId(params) {
	return post('/app/user/login',params);
}