// 综合服务模块相应路由
const synthesis = [
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/survey/surveyDoctorList',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'surveyDoctorList',
		meta: {
			title: '满意度调查',
		}
    },
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/survey/survey',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'survey',
		meta: {
			title: '满意度评价',
		}
	}
	
]
export default synthesis