// 住院业务模块相应路由
const inPatient = [
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/inpatientRecharge/inpatientRecharge',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'inpatientRecharge',
		meta: {
			title: '住院预缴金充值',
		}
    },
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/inpatientCostList/inpatientCostList',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'hospitalCostList',
		meta: {
			title: '住院费用查询',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/myRecharge/myRecharge',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'myRecharge',
		meta: {
			title: '住院预缴金充值查询',
		}
	}
]
export default inPatient