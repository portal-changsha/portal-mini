// 挂号模块相应路由
const otherService = [
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthCheck/healthCheck',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthCheck',
		meta: {
			title: '健康体检',
		}
    },
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/developing/developing',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'developing',
		meta: {
			title: '正在建设中',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/csmy/csmy',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'csmy',
		meta: {
			title: '长沙名医',
		}
	}
]
export default otherService