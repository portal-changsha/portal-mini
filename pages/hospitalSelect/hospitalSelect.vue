<template>
	<view>
		<div class="app">
		    <div>
		      <div v-if="toOutMap" class="search-bar">
		        <input class="input-search" type="text" placeholder="请输入您想要搜索的医院" v-model="inputText" @input="contrastText">
		        <!-- <button @click="contrastText"></button> -->
		      </div>
		      <div class="input-hospital" v-else v-show="showAllHospital">
		        <i class="icon-search"></i>
		        <input class="input-search" type="text" placeholder="请输入您想要搜索的医院" v-model.trim="inputText" @input="contrastText">
		      </div>
		      <ul v-if="selectedHospital.name && selectedArea.areaName" class="list list-header"
		          v-show="showAllHospital">
		        <li @click="continueSelect(selectedHospital)" class="hos-list-item last ellipsis" id="hospitalSelect-li-continue">
		          上次选择：{{selectedHospital.name}}
		          <span class="continue">继续</span>
		        </li>
		      </ul>
		    </div>
		    <scroll @refresh="refresh" style="margin-top: 2.5rem" :style="{'margin-top': haveRecommendHos}">
		      <div>
		        <uni-collapse accordion="true" v-show="!this.isChoose" >
		          <uni-collapse-item v-for="(v, i) of orgAreaList" :key="i" :name="i.toString()" :title="v.orgName" :open="i === 0" @collapseChange="vanCollapseChange(v, i)">
		            <!-- v：医院信息数组（相同字母索引），k：字母索引，i：数组下标 -->
		            <ul v-for="(vv, i) of v.hosList" :key="i" class="list">
		              <li class="hos-list-item def loc-arr-row" @click.stop="select(vv)">
		                <div class="hospital-info">
		                  <div class="logo hosLogo" v-if="vv.logo"
		                       v-bind:style="{backgroundImage: 'url(' +vv.logo+ ')'}"></div>
		                  <div class="logo hosLogo" v-if="!vv.logo"></div>
		                  <div class="info hosInfo">
		                    <p class="f-large f-normal ellipsis min-top">{{vv.name}}</p>
		                    <p class="f-small f-dark-gray ellipsis">{{vv.levelDesc}}</p>
		                    <dl class="hos-area-distance f-small f-dark-gray ellipsis">
		                      <dt>{{ vv.address }}</dt>
		                      <dd>
		                        <span v-if="vv.distance > 0">{{ vv.distance | formateDistance }}</span>
		                      </dd>
		                    </dl>
		                  </div>
		                </div>
		              </li>
		            </ul>
		          </uni-collapse-item>
		        </uni-collapse>
		        <div v-show="this.isChoose">
		          <!-- v：医院信息数组（相同字母索引），k：字母索引，i：数组下标 -->
		          <ul class="list">
		            <li class="hos-list-item def loc-arr-row" v-for="(vv, ii) of tempList" :key="ii"
		                :id="'hospitalSelect-li-hospital-' + vv.id" @click="select(vv)">
		              <div class="hospital-info">
		                <div class="logo hosLogo" v-if="vv.logo"
		                     v-bind:style="{backgroundImage: 'url(' +vv.logo+ ')'}"></div>
		                <div class="logo hosLogo" v-if="!vv.logo"></div>
		                <div class="info hosInfo">
		                  <p class="f-large f-normal ellipsis min-top">{{vv.name}}</p>
		                  <p class="f-small f-dark-gray ellipsis">{{vv.levelDesc}}</p>
		                  <dl class="hos-area-distance f-small f-dark-gray ellipsis">
		                    <dt>{{ vv.address }}</dt>
		                    <dd>
		                      <span v-if="vv.distance > 0">{{ vv.distance | formateDistance }}</span>
		                      <span v-else></span>
		                    </dd>
		                  </dl>
		                </div>
		              </div>
		            </li>
		          </ul>
		          <no-record id="hospital-list-norecord" :condition="tempList.length === 0" :isLoading="isLoading"
		                     tips='抱歉，暂无医院列表信息'></no-record>
		        </div>
		        <no-record id="orgarea-list-norecord" :condition="orgAreaList.length === 0" :isLoading="isLoading"
		                   tips='抱歉，暂无医院列表信息'></no-record>
		      </div>
		    </scroll>
			<uni-popup ref="popup" type="bottom">
				<div class="time-range-title flex-row flex-align-center">
					<div @click.stop=""><slot name="title"></slot></div>
					<span><span class="f-strong">{{localHos}}<span v-if="fromMenuUrl === 'outMap'"></span></span></span>
				</div>
				<ul class="list" style="padding: 1.5% 3% 1.5% 3%;">
				  <li v-for="(item, index) in areaList" :key="index" class="list-item guide-bg newLocation"
				      @click="selectArea(item)">
				    <p class="f-large f-normal ellipsis min-top">{{item.areaName}}</p>
				    <dl class="hos-area-distance f-small f-dark-gray ellipsis">
				      <dt>{{ item.areaAddr }}</dt>
				      <dd>
				        <span v-if="item.distance > 0">{{ item.distance | formateDistance }}</span>
				      </dd>
				    </dl>
				  </li>
				</ul>
			</uni-popup>
		  </div>
	</view>
</template>

<script>
	import config from '@/config/index.js'
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import { getItem, removeItem, setItem } from '@/utils/localStore.js'
	import { loadArea, loadHosByName, loadHosByOrg, loadHosByNear } from '@/services/hospitals.js'
	import { showToast } from '@/utils/uniApi.js'

	import { openLocation } from '@/utils/wxJsSdk.js'
	const isSearchModel = ['regList', 'paidList', 'reportList', 'myRecharge', 'inpatientRecharge', 'hospitalCostList', 'waitDoctor', 'surveyDoctorList', 'inMap', 'myPrescription', 'myReport', 'myPay', 'clinicUnpayList', 'myRegister']
	// const moduleIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
	const moduleUrls = {
		'departDoctor': '1',
		'clinicUnpayList': '2',
		'myReport': '3',
		'waitDoctor': '4',
		'myRegister': '5',
		'myPay': '6',
		'myPrescription': '7',
		'surveyDoctorList': '8',
		'outMap': '9',
		'inMap': '10',
		'inpatientRecharge': '11',
		'hospitalCostList': '12',
		'myRecharge': '13',
		'healthCheck': '14',
	}
	export default {
		
		components:{
			uniCollapse,
			uniCollapseItem,
			uniPopup
		},
		data() {
			return {
				moduleId: '',
				activeNames: ['0'],
				toOutMap: false,
				orgAreaList: [],
				hospitalList: [],
				selectedHospital: getItem('selectedHospital') ? getItem('selectedHospital') : {},
				selectedArea: getItem('selectedArea') ? getItem('selectedArea') : {},
				localHos: '',
				inputText: '',
				isChoose: false,
				areaList: [],
				showAreasWindow: false,
				fromMenuUrl: '',
				isLoading: false,
				selectHospital: {},
				locationImg: config.VUE_APP_IMG_URL + 'location.png',
				showAllHospital: true,
				otherPlatformModules: '',
				otherPlatformHosId: '',
				latitude: getItem('locationPoint') ? getItem('locationPoint').latitude : '',
				longitude: getItem('locationPoint') ? getItem('locationPoint').longitude : '',
				redirectModel: this.$store.getters.param.DistrictSelect,
				tempList: [],
				searchTime: null
			};
		},
		computed: {
		  haveRecommendHos() {
			if (this.selectedHospital.name && this.selectedArea.areaName && this.showAllHospital) {
			  return 4.5 + "rem"
			}
			return 2.5 + "rem"
		  }
		},
		watch: {
		  inputText(val) {
			this.isChoose = !!val;
		  },
		},
		async onShow(){
			//判断是否来源于查询类模块
			 //  const locationPoint = getItem('locationPoint')
			 //  if (!locationPoint || this.redirectModel && isSearchModel.includes(this.redirectModel.target)) {
				// this.latitude = ''
				// this.longitude = ''
			 //  } else {
				// this.latitude = locationPoint ? locationPoint.latitude : ''
				// this.longitude = locationPoint ? locationPoint.longitude : ''
			 //  }
			  //  判断是否是跳转到来院导航页
				let query = this.$Route.query
				const param = this.$store.getters.param
				if (!query.goToModules && param && param.menu && param.menu.url) {
				  this.toOutMap = param.menu.url === 'outMap'
				  console.log(this.toOutMap)
				  //	如果是来院导航，直接打开微信内置地图
				  this.fromMenuUrl = param.menu.url
				}
				//  统一判断是否来自外部链接
				if (query && query.goToModules || !param || !param.menu || !param.menu.url) {
				  //判断是否单个医院入口
				  if (query.hosId) {
					this.showAllHospital = false
					this.otherPlatformHosId = query.hosId || ''
				  }
				  //判断需要跳转的模块
				  if (query.goToModules) {
					this.otherPlatformModules = query.goToModules || ''
				  }
				}
				this.checkModuleId()
		},
		methods: {
			checkModuleId() {
				//首页模块
				const homeModule = this.$store.getters.param.menu.url || getItem[this.$consts.SELECTED_MODULE]
				removeItem(this.$consts.SELECTED_MODULE)
				setItem(this.$consts.SELECTED_MODULE, this.$store.getters.param.menu.url)
				if (!homeModule) {
				  this.loadHospitalList()
				  return
				}
				this.loadHospitalList(moduleUrls[homeModule])
			 },
			loadHospitalList(moduleId) {
				 this.moduleId = moduleId
				 // //界面加载友好提示
				 // this.isLoading = true;
				 this.hospitalList = [];
		 
				 //删除缓存的医院列表
				 this.$store.dispatch('paramStore/clearParam', 'hospitalSelect')
				 let areaParams = {
				   moduleId: moduleId || '',
				   areaLevel: '2',
				   orgId: this.$consts.ORG_ID,
				   latitude: this.latitude,
				   longitude: this.longitude
				 }
				 loadHosByNear(areaParams).then((res) => {
				   //结束加载提示
				   // this.isLoading = false;
				   if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
					 return
				   }
				   let newOrgList = []
				   let newHosList = []
				   if (res.data[0] && res.data[0].hosList.length === 0) {
					 newOrgList = res.data.slice(1);
					 this.vanCollapseChange(newOrgList[0], 0)
				   } else {
					 newOrgList = res.data
				   }
				   this.orgAreaList = newOrgList
				   for (let i = 1; i < res.data.length; i++) {
					 let hosList = res.data[i].hosList
					 if (hosList.length > 0) {
					   for (let j = 0; j < hosList.length; j++) {
						 newHosList.push(hosList[j])
					   }
					 }
				   }
				   this.hospitalList = newHosList
				   //  判断是否来自外部链接单个医院入口
				   if (this.hospitalList.length > 0 && this.otherPlatformHosId !== '') {
					 let newData = []
					 this.orgAreaList = []
					 for (let i = 0; i < this.hospitalList.length; i++) {
					   if (this.hospitalList[i].id === this.otherPlatformHosId) {
						 newData = [{
						   "orgName": "推荐医院",
						   "hosList": [this.hospitalList[i]]
						 }]
						 this.orgAreaList = newData;
						 return;
					   }
					 }
				   }
				 })
			},
			//继续选择
		  continueSelect(selectedHospital) {
			//Todo 临时演示加载基层医院
			if (selectedHospital.openUrl) {
			  //直接打开链接
			  window.open(selectedHospital.openUrl)
			  return
			}
			if (selectedHospital.openUrl === '') {
			  showToast('正在建设中')
			  return;
			}
	
			if (getItem('selectedArea')) {
			  this.selectArea(this.selectedArea, 'continue')
			} else {
			  this.loadArea(selectedHospital)
			}
		  },
		  stopClink(e) {
			 e.preventDefault()
		  },
		  contrastText(e) {
			  console.log(e.detail.value)
			this.isChoose = !!e.detail.value;
			console.log(e.detail.value)
			console.log(this.isChoose)
			if(this.isChoose){
			  if(this.searchTime){
				clearTimeout(this.searchTime)
			  } 
			  this.searchTime = setTimeout(() => {
				this.getHosInfoByName(e.detail.value)
			  }, 800)
			}
		  },
		  //医院选择
			select(v) {
			  this.localHos = v.name
			  //Todo 临时演示加载基层医院
			  if (v.openUrl) {
				//直接打开链接
				window.open(v.openUrl)
				return
			  }
			  if (v.openUrl === '') {
				  showToast('正在建设中')
				return;
			  }
			  //缓存当前选择医院信息，清空院区缓存
			  this.selectHospital = v
			  //加载院区列表
			  this.loadArea(v)
			},
			//院区加载
		  loadArea(params) {
			loadArea({
			  orgId: params.orgId,
			  hospitalId: params.id,
			  latitude: this.latitude,
			  longitude: this.longitude
			}).then((res) => {
				console.log(res)
			  if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
			  this.areaList = res.data || [];
			  if (this.areaList.length === 0) {
				showToast('没有获取到医院院区')
				return
			  }
			  if (this.areaList.length > 1) {
				// this.showAreasWindow = true
				this.$refs.popup.open()
				return
			  }
			  /*默认只有一个院区情况，直接跳转*/
			  this.pushToModule(this.areaList[0]);
			});
		  },
		  //院区选择
			selectArea(area, type) {
			  // this.$store.commit('togglePopup', false);
			  // sessionStorage.setItem('directFromPopup', 1)
			  this.pushToModule(area, type);
			},
			/*统一跳转方法*/
		  pushToModule(area, type) {
			//缓存医院对象
			const hosObj = type === 'continue' ? this.selectedHospital : this.selectHospital
			console.log(hosObj)
			setItem('selectedHospital', hosObj)
			//缓存院区对象
			setItem('selectedArea', area)
			this.$refs.popup.close()
			if (this.toOutMap) {
				openLocation(+area.latitude, +area.longitude, area.name + area.areaName, area.areaAddr)
				return
			}
			//判断是否来源于查询类模块 直接回到模块界面
			if (type !== 'continue' && this.redirectModel && isSearchModel.includes(this.redirectModel.target)){
				this.$Router.back(1)
				uni.$emit('backEvent')
				return
			}
			//判断是否存在moduleIdList
			const modelLists = getItem('selectedHospital').moduleIdList
			if (modelLists && (modelLists.length === 0 || !modelLists.includes(this.moduleId)) ) {
			  showToast('当前所选医院暂不支持该功能')
			  return
			}
			//  判断是否来自外部链接
			if (this.otherPlatformModules !== '') {
			  //跳转业务模块
			  this.$Router.push({name: this.otherPlatformModules});
			  return;
			}
			//跳转获取当前位置界面
			const vuexMenuUrl = this.$store.getters.param.menu.url
			//判断是否来自健康体检
			if (vuexMenuUrl === 'healthCheck' && getItem('selectedHospital').id !== this.$consts.HOSPITAL_ID.CSSDBRMYY) {
			  //跳转业务模块
			  showToast('当前医院暂未开通体检功能')
			  return;
			}
			//跳转业务模块
			this.$Router.push({name: vuexMenuUrl})
		  },
		  getHosInfoByName(keyword){
			  this.isLoading = true
			  this.tempList = []
			  const params = {
				latitude: this.latitude,
				longitude: this.longitude,
				keyword: keyword,
				moduleId: this.moduleId
			  }
			  loadHosByName(params).then(res => {
				this.isLoading = false
				if(res.resultCode !== this.$consts.RESULT_SUCCESS){
				  showToast(res.resultMsg)
				  return
				}
				if(res.data && res.data.length > 0){
				  this.tempList = res.data[0].hosList
				}
			  })
			},
			vanCollapseChange(list, index){
				if(list.hosList.length > 0) return
				//  请求接口
				const params = {
				  latitude: this.latitude,
				  longitude: this.longitude,
				  orgId: list.orgId, 
				  moduleId: this.moduleId
				}
				loadHosByOrg(params).then(res => {
				  if(res.resultCode !== this.$consts.RESULT_SUCCESS){
					showToast(res.resultMsg)
					return
				  }
				  const copyList = { ...list }
				  copyList.hosList = res.data[0].hosList
				  this.$set(this.orgAreaList, index, copyList)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.app {
    .input-hospital {
      position: relative;
      height: 2.5rem;
      background-color: #51a8ec;
      display: flex;
      align-items: center;
      .icon-search {
        position: absolute;
        background: url($redirect-url + $img-file-path + "icon-search.png") no-repeat;
        background-size: 100% 100%;
        left: 1.7rem;
        top: 0.75rem;
        width: 1.0rem;
        height: 1.0rem;
      }

      .input-search {
        height: 1.6rem;
        font-size: .8rem;
        width: 90%;
        padding: 0 2.1rem;
        display: block;
        margin: 0 auto;
        border-radius: 18px;
        align-self: center;
        outline: none;
        border: none;
		background: #fff;
		}
	}

    .guide-bg {
      margin-bottom: 5px;
      border-radius: 5px;
      background: #51a8ec;
      box-shadow: inset 0 0 0 0 hsla(0, 0%, 100%, 0.1),
      inset 0 0 0 hsla(0, 0%, 82%, 0.1),
      inset 0 0 0 hsla(0, 0%, 100%, 0.01),
      inset 0 -0.03em 0 hsla(0, 0%, 100%, 0.17),
      inset 0 -0.3em 0 hsla(216, 73%, 32%, 0.19)
    }

    .list {
      .newLocation {
        background: #fff;
        box-shadow: 0 1px 3px #51a8ec;
        border: 1px solid #eaeaea;
        margin-bottom: .6rem;

        &::after {
          //院区定位图标，暂时隐藏
          width: 1rem !important;
        }
      }

      .hos-list-item {
        &.def {
          padding: 5px .75rem;
          margin-bottom: 2px;
        }

        &.last {
          padding-right: 3.25rem !important;
          color: #3272C9;

          .continue {
            position: absolute;
            right: 0.75rem;
            padding-right: 0.75rem;
            color: #3272C9;
            background: url($redirect-url + $img-file-path + "more-right-blue.png") right center no-repeat;
            background-size: 0.375rem 0.675rem;
          }
        }
      }
    }

    .list-header {
      background-color: #F0F7FF;
      box-shadow: 0px 1px 2px 0px rgba(81, 168, 236, 0.2);

      #hospitalSelect-li-continue {
        padding: 0 .75rem;
        height: 2rem;
        line-height: 2rem;
      }
    }

    .header {
      padding-top: 0.13rem;
      padding-bottom: 0.13rem;
      color: #999;
      font-size: 0.65rem !important;
      background-color: #eff2f5;
    }

    .border-none {
      li:first-child, li:last-child {
        border-bottom: none;
      }
    }
    .hospital-info {
      @include display-flex();
      @include align-items(center);
      position: relative;

      .logo {
        width: 2rem;
        height: 2rem;
        background-image: url($redirect-url + $img-file-path + "hos-def-logo.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      .info {
        @include flex(1);
        @include ellipsis();
        width: 1px;
        padding-left: .75rem;
        .min-bottom {
          margin-bottom: .1rem;
        }
        .min-top {
          margin-top: .1rem;
        }
        p {
          font-size: .6rem;
          color: #666;
        }
        p:nth-child(1) {
          font-size: .9rem;
          color: #111;
        }
      }
      .hosLogo {
        width: 2rem;
      }
      .hosInfo {
        p:nth-child(1) {
          font-size: .75rem;
        }
      }
    }
    .newLocation {
      &::after {
        background-image: none;
      }
    }
    .location {
      padding-right: .8rem;
      img {
        height: 25px;
        width: 20px;
        display: block;
      }
    }
  }
  .van-collapse-item__content {
    padding: 0 16px 0 16px;
    color: #969799;
    font-size: 13px;
    line-height: 1.5;
    background-color: #fff;
  }
</style>
<style lang="scss" scoped>
  #hospital-select {
    background: #EFF2F5;
  }

  .search-bar {
    height: 2.5rem;
    background: #fff;
    box-shadow: 0px 1px 2px 0px rgba(81, 168, 236, 0.2);
    padding: 0 .75rem;
    display: flex;
    margin-bottom: .25rem;

    input {
      height: 1.6rem;
      flex: 1;
      margin: .45rem 0;
      border: 1px solid #D6D6D6;
      border-radius: 5px 0 0 5px;
      padding-left: .5rem;
      background: #EFF2F5;
    }

    button {
      background: #51A8EC url($redirect-url + $img-file-path + "search.png") no-repeat center;
      background-size: 14px;
      width: 2.5rem;
      height: 1.6rem;
      border-radius: 0px 5px 5px 0px;
      margin: .45rem 0;
    }
  }

  .hos-area-distance {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-align: center;

    dt {
      text-align: left;
      width: 80%;
      @include ellipsis();
    }

    dd {
      width: 1px;
      text-align: right;
      @include flex(1);
      @include ellipsis();
    }
  }
  .time-range-title {
	  margin-top: -2.22rem;
	  background-color: white;
	  height: 2.25rem;
	  line-height: 2.25rem;
	  padding-left: 0.75rem;
	  padding-right: 0.75rem;
  }
</style>
