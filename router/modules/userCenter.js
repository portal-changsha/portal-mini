// 个人中心模块相应路由
const userCenter = [
	{
      //注意：path必须跟pages.json中的地址对应
      path: '/pages/userCenter/userCenter',
      name: 'userCenter',
        meta: {
	        title: '个人中心',
	    },
    },
	{
	    path: '/pages/userCenter/profile',
	    name: 'profile',
	    meta: {
			title: '电子健康卡'
		}
	},
	{
	    path: '/pages/userCenter/voucherDetail',
	    name: 'voucherDetail',
	    meta: {
			title: '电子健康卡详情'
		}
	},
	{
	    path: '/pages/healthCard/checkInfomation',
	    name: 'checkInfomation',
	    meta: {
			title: '电子健康卡办理(1/2)'
		}
	},
	{
	    path: '/pages/healthCard/completeCard',
	    name: 'completeCard',
	    meta: {
			title: '电子健康卡办理(2/2)'
		}
	}
]
export default userCenter