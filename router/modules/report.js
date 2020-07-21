// 我的报告模块相应路由
const home = [
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/myReport/myReport',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'myReport',
		meta: {
			title: '我的报告',
		}
    },
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/myReport/labDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'labDetail',
		meta: {
			title: '检验报告',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/myReport/examDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'examDetail',
		meta: {
			title: '检查报告',
		}
	}
]
export default home