// 挂号模块相应路由
const home = [
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/index/index',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'index',
		meta: {
			title: '首页',
		}
    },
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/searchSelect/searchSelect',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'searchSelect',
		meta: {
			title: '搜索医院、科室或医生',
		}
	}
]
export default home