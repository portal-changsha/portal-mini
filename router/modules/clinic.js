// clinic模块相应路由
const clinic = [
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/waitDoctor/waitDoctor',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'waitDoctor',
		meta: {
			title: '排队候诊',
		}
    },
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/myPay/myPay',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'myPay',
		meta: {
			title: '缴费记录',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/clinic/clinicDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'clinicDetail',
		meta: {
			title: '缴费明细',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/clinic/clinicUnpayList',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'clinicUnpayList',
		meta: {
			title: '门诊缴费',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/myPrescription/myPrescription',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'myPrescription',
		meta: {
			title: '电子处方',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/myPrescription/prescriptionDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'prescriptionDetail',
		meta: {
			title: '处方明细',
		}
	},
	
	
]
export default clinic