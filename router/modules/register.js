
// 挂号模块相应路由
const register = [
	{
        //注意：path必须跟pages.json中的地址对应
        path: '/pages/hospitalSelect/hospitalSelect',
        name: 'hospitalSelect',
	    meta: {
			title: '选择医院'
		}
    },
	{
	    //注意：path必须跟pages.json中的地址对应
	    path: '/pages/voucherSelect/voucherSelect',
	    name: 'voucherSelect',
	    meta: {
			title: '选择电子健康卡'
		}
	},
	{
	    //注意：path必须跟pages.json中的地址对应
	    path: '/pages/myRegister/myRegister',
	    name: 'myRegister',
	    meta: {
			title: '挂号记录'
		}
	},
	{
	    //注意：path必须跟pages.json中的地址对应
	    path: '/pages/myRegister/regDetail',
	    name: 'regDetail',
	    meta: {
			title: '订单详情'
		}
	},
	{
	    //注意：path必须跟pages.json中的地址对应
	    path: '/pages/triage/triage',
	    name: 'triage',
	    meta: {
			title: '智能导诊'
		}
	},
	{
	    //注意：path必须跟pages.json中的地址对应
	    path: '/pages/triage/recommend',
	    name: 'recommend',
	    meta: {
			title: '推荐科室'
		}
	},
	{
	    //注意：path必须跟pages.json中的地址对应
	    path: '/pages/register/departDoctor',
	    name: 'departDoctor',
	    meta: {
			title: '选择科室或医生'
		}
	},
	{
	    //注意：path必须跟pages.json中的地址对应
	    path: '/pages/register/dateDoctorSchedule',
	    name: 'dateDoctorSchedule',
	    meta: {
			title: ''
		}
	},
	{
	    //注意：path必须跟pages.json中的地址对应
	    path: '/pages/register/timeSchedule',
	    name: 'timeSchedule',
	    meta: {
			title: '号源详情'
		}
	},
	{
	    //注意：path必须跟pages.json中的地址对应
	    path: '/pages/register/registerConfirm',
	    name: 'registerConfirm',
	    meta: {
			title: '确认挂号'
		}
	},
	{
	    //注意：path必须跟pages.json中的地址对应
	    path: '/pages/searchSelect/departSearch',
	    name: 'departSearch',
	    meta: {
			title: '搜索'
		}
	}
	
]
export default register