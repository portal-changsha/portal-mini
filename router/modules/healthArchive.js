// 健康档案模块相应路由
const healthArchive = [
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthArchive',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthArchive',
		meta: {
			title: '健康档案',
		}
    },
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/disclaimer',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'disclaimer',
		meta: {
			title: '免责声明',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/patientInfo',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'patientInfo',
		meta: {
			title: '个人信息',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/voucherSelect/voucherSelect',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthVoucherSelect',
		meta: {
			title: '选择电子健康卡',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthClinic/costList',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'costList',
		meta: {
			title: '门诊费用',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthClinic/examDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthExamDetail',
		meta: {
			title: '检查报告',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthClinic/healthClinicDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthClinicDetail',
		meta: {
			title: '门诊记录详情',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthClinic/healthClinicList',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthClinicList',
		meta: {
			title: '门诊记录',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthClinic/labDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthLabDetail',
		meta: {
			title: '检验报告',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthClinic/traditionalRecipe',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'traditionalRecipe',
		meta: {
			title: '中药处方',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthClinic/westernRecipe',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'westernRecipe',
		meta: {
			title: '药品处方',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthInpatient/examDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthIPExamDetail',
		meta: {
			title: '检查报告',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthInpatient/healthInpatientDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthInpatientDetail',
		meta: {
			title: '住院信息',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthInpatient/healthInpatientList',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthInpatientList',
		meta: {
			title: '住院记录',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthInpatient/inHosRecord',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'inHosRecord',
		meta: {
			title: '入院记录',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthInpatient/labDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthIPLabDetail',
		meta: {
			title: '检验报告',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthInpatient/outHosCost',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'outHosCost',
		meta: {
			title: '出院结算',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthInpatient/outHosRecord',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'outHosRecord',
		meta: {
			title: '出院记录',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthVisit/healthVisitDetail',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthVisitDetail',
		meta: {
			title: '公卫详情',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/healthVisit/healthVisitList',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'healthVisitList',
		meta: {
			title: '公卫记录',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/physicalExamination/physicalExaminationDetails',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'physicalExaminationDetails',
		meta: {
			title: '体检记录详情',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/physicalExamination/physicalExaminationList',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'physicalExaminationList',
		meta: {
			title: '体检记录',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/vaccination/vaccinationDetails',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'vaccinationDetails',
		meta: {
			title: '预防接种详情',
		}
	},
	{
		//注意：path必须跟pages.json中的地址对应
		path: '/pages/healthArchive/vaccination/vaccinationList',
		// aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'vaccinationList',
		meta: {
			title: '预防接种',
		}
	}
]
export default healthArchive