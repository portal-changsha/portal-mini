<template>
    <div class="menu-list">
        <div class="menu-item">
            <div v-if="menuName !== ''" class="munu-title">
                <img :src="menuIcon" alt="">
                <p>{{menuName}}</p>
            </div>
            <div class="menu-item-content">
                <div v-if="type === 'hospitalService'" style="width: 100%;">
                    <div class="hospital-menu">
                        <div class="hospital-menu-left" @click="toPage(menuInfo[0])">
                            <img :src="menuInfo[0].icon" alt="">
                            <p>{{menuInfo[0].name}}</p>
                        </div>
                        <div class="hospital-menu-rigth">
                            <div v-for="(item,index) in menuInfos" :key="index" class="hospital-menu-rigth-content"
                                 @click="toPage(item)">
                                <img :src="item.icon" alt="">
                                <p>{{item.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="menu-wrap" :class="{ healthArchive: type === 'healthArchiveService'}"
                     v-for="(item,index) in menuInfo" :key="index" @click="toPage(item)" :id="item.url" v-show="item.isShow">
                    <div class="menu-content" :class="{noPaddingTop: index > 3}">
                        <img :src="item.icon" alt="">
                        <p :class="{fontweightbold: type === 'mainService'}">{{item.name}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
	import config from '../config/index.js'
	import { removeItem, setItem, getItem } from '@/utils/localStore.js'
	import { showToast } from '@/utils/uniApi.js'
    /*
    接口调用模块标识
     1.挂号
     2.缴费
     3.报告
     4.排队候诊
     5.挂号记录
     6.缴费记录
     7.电子处方
     8.满意度调查
     9.来院导航
     10.院内导航
     11.住院预缴金充值
     12.住院费用查询
     13.住院充值记录查询
     14.健康体检
  */
    const moduleIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
    const moduleUrls = [
        'departDoctor',
        'clinicUnpayList',
        'myReport',
        'waitDoctor',
        'myRegister',
        'myPay',
        'myPrescription',
        'surveyDoctorList',
        'outMap',
        'inMap',
        'inpatientRecharge',
        'hospitalCostList',
        'myRecharge',
        'healthCheck'
    ]
	const BASE_IMG_URL = config.VUE_APP_IMG_URL
    export default {
        props: {
            type: String
        },
        data() {
            return {
                menuName: '',
                menuIcon: '',
                menuList: {
                    'mainService': {
                        'name': '',
                        'icon': '',
                        'lists': [
                            {
                                name: '挂 号',
                                icon: BASE_IMG_URL + 'icon1_guahao.png',
                                url: 'triage',
                                openUrl: '',
                                isDeveloping: false,
                                isNeedCard: false,
                                isShow: true,
                            },
                            {
                                name: '门诊缴费',
                                icon: BASE_IMG_URL + 'icon2_jiaofei.png',
                                url: 'clinicUnpayList',
                                openUrl: '',
                                isDeveloping: false,
                                isNeedCard: true,
                                isShow: true,
                            },
                            {
                                name: '报告查询',
                                icon: BASE_IMG_URL + 'icon3_baogao.png',
                                url: 'myReport',
                                openUrl: '',
                                isDeveloping: false,
                                isNeedCard: true,
                                isShow: true,
                            },
                            {
                                name: '排队候诊',
                                icon: BASE_IMG_URL + 'icon4_paidui.png',
                                url: 'waitDoctor',
                                openUrl: '',
                                isDeveloping: false,
                                isNeedCard: true,
                                isShow: true,
                            }
                        ]
                    },
                    'multipleService':
                        {
                            'name': '综合服务',
                            'icon': BASE_IMG_URL + 'icon0_title1.png',
                            'lists': [
                                {
                                    name: '挂号记录',
                                    icon: BASE_IMG_URL + 'icon5_guahaojilu.png',
                                    url: 'myRegister',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true,
                                },
                                {
                                    name: '缴费记录',
                                    icon: BASE_IMG_URL + 'icon6_jiaofeijilu.png',
                                    url: 'myPay',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true,
                                },
                                {
                                    name: '电子处方',
                                    icon: BASE_IMG_URL + 'icon7_chufang.png',
                                    url: 'myPrescription',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true,
                                },
                                {
                                    name: '满意度调查',
                                    icon: BASE_IMG_URL + 'icon8_manyidu.png',
                                    url: 'surveyDoctorList',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true,
                                },
                                {
                                    name: '来院导航',
                                    icon: BASE_IMG_URL + 'icon10_yuannei.png',
                                    url: 'outMap',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: false,
                                    isShow: true,
                                },
                                {
                                    name: '院内导航',
                                    icon: BASE_IMG_URL + 'icon9_laiyuan.png',
                                    url: 'inMap',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: false,
                                    isShow: true,
                                },
                                {
                                    name: '名医名科',
                                    icon: BASE_IMG_URL + 'icon11_mingyimingke.png',
                                    url: '',
                                    openUrl: 'http://www.mybmall.com/index.php?g=Wap&m=Index&a=lists&classid=1175&token=ajrbpx1458269639&diymenu=1',
                                    isDeveloping: false,
                                    isNeedCard: false,
                                    isShow: true,
                                },
                                {
                                    name: '长沙名医',
                                    icon: BASE_IMG_URL + 'icon12_changshamingyi.png',
                                    url: 'csmy',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: false,
                                    isShow: true,
                                }
                            ]
                        },
                    'hospitalService':
                        {
                            'name': '住院服务',
                            'icon': BASE_IMG_URL + 'icon0_title2.png',
                            'lists': [
                                {
                                    name: '住院预缴金充值',
                                    icon: BASE_IMG_URL + 'icon21_zyfw.png',
                                    url: 'inpatientRecharge',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true,
                                },
                                {
                                    name: '住院费用查询',
                                    icon: BASE_IMG_URL + 'icon19_zyfycx.png',
                                    url: 'hospitalCostList',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true,
                                },
                                {
                                    name: '住院预缴金充值查询',
                                    icon: BASE_IMG_URL + 'icon20_zyczcx.png',
                                    url: 'myRecharge',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true,
                                }
                            ],
                        },
                    'otherService':
                        {
                            'name': '其它服务',
                            'icon': BASE_IMG_URL + 'icon0_title3.png',
                            'lists': [
                                {
                                    name: '健康档案',
                                    icon: BASE_IMG_URL + 'icon13_jiankangdangan.png',
                                    url: 'healthVoucherSelect',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true,
                                },
                                {
                                    name: '家庭医生',
                                    icon: BASE_IMG_URL + 'icon14_jiatingyisheng.png',
                                    url: '',
                                    openUrl: '',
                                    isDeveloping: true,
                                    isNeedCard: true,
                                    isShow: true,
                                },
                                {
                                    name: '健康体检',
                                    icon: BASE_IMG_URL + 'icon15_yimiaojiezhong.png',
                                    url: 'healthCheck',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true,
                                },
                                {
                                    name: '出生证明',
                                    icon: BASE_IMG_URL + 'icon16_chushengzhengming.png',
                                    url: '',
                                    openUrl: '',
                                    isDeveloping: true,
                                    isNeedCard: true,
                                    isShow: true,
                                },
                                {
                                    name: '医师资格',
                                    icon: BASE_IMG_URL + 'icon17_yishizige.png',
                                    url: '',
                                    openUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?response_type=code&appid=wx563314d21c5f5cbd&connect_redirect=1&redirect_uri=http://www.csylfw.com.cn/ratchet/centerCsyl.html&scope=snsapi_base&state=%E5%8C%BB%E6%8A%A4%E4%BA%BA%E5%91%98!~10!11!module/medical/p_person.html!!271632!0!11~0~6~10#wechat_redirect',
                                    isDeveloping: false,
                                    isNeedCard: false,
                                    isShow: true,
                                },
                                {
                                    name: '育儿知识',
                                    icon: BASE_IMG_URL + 'icon18_yuerzhishi.png',
                                    url: '',
                                    openUrl: 'http://www.mybmall.com/index.php?g=Wap&m=Index&a=lists&classid=1187&token=ajrbpx1458269639&wecha_id=0',
                                    isDeveloping: false,
                                    isNeedCard: false,
                                    isShow: true,
                                },
                                {
                                    name: '健康世界',
                                    icon: BASE_IMG_URL + 'icon_zixun.png',
                                    url: '',
                                    openUrl: 'http://qinghai.wukongyiliao.com/qh/#/pages/index/index?user_id=health_greatwall&user_key=jfidasjfioenfbsafhosjfojfa',
                                    isDeveloping: false,
                                    isNeedCard: false,
                                    isShow: true,
                                }
                            ]
                        },
                    'healthArchiveService':
                        {
                            'name': '',
                            'icon': '',
                            'lists': [
                                {
                                    name: '概要信息',
                                    icon: BASE_IMG_URL + 'health_archive_gyxx.png',
                                    url: 'summaryInfo',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true
                                },
                                {
                                    name: '门诊记录',
                                    icon: BASE_IMG_URL + 'health_archive_mzjl.png',
                                    url: 'healthClinicList',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true
                                },
                                {
                                    name: '住院记录',
                                    icon: BASE_IMG_URL + 'health_archive_zyjl.png',
                                    url: 'healthInpatientList',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true
                                },
                                {
                                    name: '体检记录',
                                    icon: BASE_IMG_URL + 'health_archive_tjjl.png',
                                    url: 'physicalExaminationList',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true
                                },
                                {
                                    name: '专项随访记录',
                                    icon: BASE_IMG_URL + 'health_archive_zxsf.png',
                                    url: 'healthVisitList',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true
                                },
                                {
                                    name: '预防接种',
                                    icon: BASE_IMG_URL + 'health_archive_yfjz.png',
                                    url: 'vaccinationList',
                                    openUrl: '',
                                    isDeveloping: false,
                                    isNeedCard: true,
                                    isShow: true
                                }
                            ]
                        }
                }
            }
        },
        created() {
            const menu = this.menuList[this.type]
            this.menuName = menu.name
            this.menuInfo = menu.lists
            this.menuIcon = menu.icon
        },
		computed:{
			menuInfos(){
				return this.menuInfo.filter((item, index) => index > 0)
			}
		},
		methods: {
			//匹配医院是否需要隐藏模块
			checkModuleId(url, hos) {
				//首页模块
				const homeModule = url
				setItem(this.$consts.SELECTED_MODULE, homeModule)
				for (let i=0; i<moduleUrls.length; i++) {
					if  (!hos.moduleIdList || (homeModule === moduleUrls[i] && hos.moduleIdList && !(hos.moduleIdList).includes(moduleIds[i]))) {
						this.$Router.push({name: 'hospitalSelect'});
						return;
					}
				}
				//跳转获取当前位置界面
				// if (homeModule === 'clinicUnpayList') {
				// 	this.$store.dispatch('paramStore/updateParam', {
				// 		namespace: 'getLocation',
				// 		url: 'clinicUnpayList',
				// 	})
				// 	this.$Router.push({name: 'getLocation'});
				// 	return;
				// }
				this.$Router.push({name: homeModule});
			},
			toPage(item) {
				/*过滤暂无开通的功能*/
				if (item.isDeveloping) {
					this.$Router.push({name: 'developing'});
					return;
				}
				/*过滤第三方页面功能*/
				if (!item.isDeveloping && item.url === '' && item.openUrl !== '') {
					window.open(item.openUrl)
					return;
				}
				/*过滤无卡状态*/
				if (item.isNeedCard && (!getItem('selectedVoucher') || !getItem('tokenId'))) {
					showToast('该功能需要先绑定电子健康卡')
					return
				}
				// 暂时沿用之前首页逻辑跳转  上线不影响功能模块  待优化细分逻辑
				/*非查询类模块*/
				if (item.url === 'outMap' || item.url === 'healthCheck') {
					this.$store.dispatch('paramStore/updateParam', {
						namespace: 'menu',
						url: item.url,
					})
					this.$Router.push({name: 'hospitalSelect'});
					return;
				}

				//跳转获取当前位置界面
				// if (item.url === 'triage') {
				// 	this.$store.dispatch('paramStore/updateParam', {
				// 		namespace: 'getLocation',
				// 		url: 'triage',
				// 	})
				// 	this.$Router.push({name: 'getLocation'});
				// 	return;
				// }

				/*切换医院及查询类模块*/
				const arr = ['clinicUnpayList', 'myReport', 'waitDoctor', 'myRegister', 'myPay', 'inpatientRecharge', 'hospitalCostList', 'myRecharge', 'surveyDoctorList', 'inMap', 'myPrescription']
				if(this.checkModuleInArray(item.url, arr)){
					/*过滤无卡状态*/
					if (item.url !== 'inMap' && (!getItem('selectedVoucher') || !getItem('tokenId'))) {
						showToast('该功能需要先绑定电子健康卡')
						return
					}
					/*缓存跳转参数*/
					this.$store.dispatch('paramStore/updateParam', {
						namespace: 'menu',
						url: item.url,
					})

					/*1、本地没有缓存医院和院区*/
					if (!(getItem('selectedHospital') && getItem('selectedArea'))) {
						//跳转获取当前位置界面
						if (item.url === 'clinicUnpayList') {
							this.$store.dispatch('paramStore/updateParam', {
								namespace: 'getLocation',
								url: 'hospitalSelect',
							})
							this.$Router.push({name: 'getLocation'});
							return;
						}
						this.$Router.push({name: 'hospitalSelect'});
						return
					}

					/*2、本地已经缓存医院和院区*/
					if (getItem('selectedHospital') && getItem('selectedArea')) {
						this.checkModuleId(item.url, getItem('selectedHospital'))
						return
					}
				}

				/*绑卡模块，缓存跳转来源界面信息*/
				if (item.url === 'checkInformation') {
					this.$store.dispatch('paramStore/updateParam', {
						namespace: 'voucherAdd',
						target: 'index',
					})
					//判断是否iOS设备，避免iOS微信签名失败，解决返回首页标题不变的情况
					if (this.$utils.devIsIos()) {
						window.open(config.VUE_APP_REDIRECT_URL + '/checkInformation')
						return;
					}
					this.$Router.push({name: item.url})
				}
				//  判断是否进入健康档案
				if(item.url === 'healthVoucherSelect'){
					this.$emit('toPage', 'healthVoucherSelect')
					return
				}
				/*其他模块直接跳转业务模块*/
				this.$Router.push({name: item.url})
			},
			/*判断点击模块是否属于对应需要的模块范围*/
			checkModuleInArray(stringToSearch, arrayToSearch) {
				for (let s = 0; s < arrayToSearch.length; s++) {
					const thisEntry = arrayToSearch[s].toString();
					if (thisEntry === stringToSearch) {
						return true;
					}
				}
				return false;
			}
		}
        
    }
</script>

<style lang="scss" scoped>
    $title-color: #438dff;
    .menu-list{
        background: #fff;
        padding: 0 .75rem;
        margin-bottom: .5rem;
        .munu-title{
            @include display-flex;
            @include align-items(center);
            padding-top: .5rem;
            img{
                width: 1.2rem;
                height: 1.35rem;
            }
            p{
                padding-left: .35rem;
                color: $title-color;
                font-weight: bold;
                font-size: .8rem;
                font-family: PingFangSC-Medium;
            }
        }
        .menu-item-content{
            @include display-flex;
            flex-wrap: wrap;
            .menu-wrap{
                @include flex(0,0,25%);
                text-align: center;
                .menu-content{
                    padding: 1.1rem 0;
                    img{
                        width: 1.95rem;
                        height: 1.7rem;
                        padding-bottom: .3rem;
                    }
                    p{
                        font-size: .7rem;
                        color: #666;
                        font-family: PingFangSC-Medium;
                    }
                    .fontweightbold{
                        font-family: PingFangSC-Bold;
                        font-size: .8rem;
                        font-weight:bold;
                        color: #333;
                    }
                }
                .noPaddingTop{
                    padding-top: 0;
                }
            }

            .healthArchive{
                @include flex(0,0,33%);
                text-align: center;
                .menu-content{
                        padding: 1.1rem 0;
                    img{
                        width: 3rem;
                        height: 3rem;
                        padding-bottom: .3rem;
                    }
                    p{
                        font-size: .7rem;
                        color: #666;
                        font-family: PingFangSC-Medium;
                    }
                }
            }

            .hospital-menu{
                @include display-flex;
                @include align-items(center);
                padding: .5rem 0;
                overflow: hidden;
                &-left{
                    flex: 0 0 50%;
                    @include display-flex;
                    @include flex-direction(column);
                    @include justify-content(center);
                    background: #F4F4F4;
                    border-radius: .25rem;
                    height: 6.5rem;
                    img{
                        width: 3.1rem;
                        height: 3rem;
                        padding-bottom: .8rem;
                        padding-left: .75rem;
                    }
                    p{
                        padding-left: .75rem;
                        color: #333;
                    }
                }
                &-rigth{
                    margin-left: .5rem;
                    @include flex(0,0,50%);
                    img{
                        width: 1.5rem;
                        width: 1.7rem;
                    }
                    p{
                        font-size: .7rem;
                        padding: 0 1rem 0 .5rem;
                        color: #333;
                    }
                    &-content{
                        @include display-flex;
                        @include align-items(center);
                        height: 3rem;
                        padding-left: .6rem;
                        &:nth-child(1){
                            margin-bottom: .5rem;
                        }
                        background: #F4F4F4;
                        border-radius: .25rem;
                    }
                }
            }
        }
    }
</style>


