// 支付模块相应路由
const pay = [
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/pay/pay',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'pay',
		meta: {
			title: '选择支付方式',
		}
    },
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/pay/wechatPay',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'wechatPay',
		meta: {
			title: '微信支付',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/pay/payResult',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'payResult',
		meta: {
			title: '支付状态',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/pay/bookingResult',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'bookingResult',
		meta: {
			title: '预约结果',
		}
	}
]
export default pay