/**
 * 全局登录mixins
 * 
 */
import { getQueryVariable } from '@/utils/index.js'
import { getTokenId } from '@/services/userInfo.js'
import { getItem, setItem } from '@/utils/localStore.js'
export default {
	created(){
		console.log('loginMixins...')
		//	判断是否有tokenId
		//	判断地址是否有code，有的话调登录接口，再初始化页面数据
		const code = getQueryVariable('code')
		// if(code && getItem('pushName') === 'wechatPay') return
		setItem('code', code)
	}
}