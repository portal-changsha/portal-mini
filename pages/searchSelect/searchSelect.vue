<template>
    <div class="app" id="hospital-select">
        <scroll @refresh="refresh">
            <section class="no-bottom">
                <div class="search-bar">
                    <label></label>
                    <input class="input-search" type="text" @keypress="contrastText" placeholder="请输入医院、科室或医生姓名" v-model="inputText" autofocus="autofocus">
                    <button @click="backHome()">取消</button>
                </div>
            </section>
            <section id="hospital-tree" v-if="hosList.length > 0">
                <dl class="search-select-title">
                    <dt>医院</dt>
                    <dd>查询到{{ searchData.hospitalList.length }}家医院</dd>
                </dl>
                <ul v-for="(v, i) of hosList" :key="i" class="list">
                    <li class="hos-list-item def"
                        :id="'hospitalSelect-li-hospital-' + v.id" @click="onSelectedHos(v)">
                        <div class="hospital-info">
                            <div class="logo hosLogo" v-if="v.logo"
                                 v-bind:style="{backgroundImage: 'url(' +v.logo+ ')'}"></div>
                            <div class="logo hosLogo" v-if="!v.logo"></div>
                            <div class="info hosInfo">
                                <p class="f-large f-normal ellipsis min-top">{{v.hospitalName}}{{v.areaName}}</p>
                                <p class="f-small f-dark-gray ellipsis">{{v.levelDesc}}</p>
                                <dl class="hos-area-distance f-small f-dark-gray ellipsis">
                                    <dt>{{ v.address }}</dt>
                                    <dd>
                                        <span v-if="v.distance > 0">{{ v.distance | formateDistance }}</span>
                                        <span v-else ></span>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </li>
                </ul>
                <section v-show="hosList.length !== searchData.hospitalList.length">
                    <p class="load-more-data" @click="loadHosDeptDocArr(searchData.hospitalList, 'hosNumber', 'hosList')">加载更多 <span class="arr-gray-down"></span> </p>
                </section>
            </section>
            <section id="dept-tree" v-if="deptList.length > 0">
                <dl class="search-select-title">
                    <dt>科室</dt>
                    <dd>查询到{{ searchData.deptList.length }}个科室</dd>
                </dl>
                <div>
                    <ul v-for="(v, i) of deptList" :key="i" class="list">
                        <li class="hos-list-item def"
                            :id="'hospitalSelect-li-hospital-' + v.id" @click="onSelectedDept(v)">
                            <div class="hospital-info">
                                <div class="logo hosLogo" v-if="v.logo"
                                     v-bind:style="{backgroundImage: 'url(' +v.logo+ ')'}"></div>
                                <div class="logo hosLogo" v-if="!v.logo"></div>
                                <div class="info hosInfo">
                                    <p class="f-large f-normal ellipsis min-top">{{v.deptName}}  {{v.areaName}}</p>
                                    <p class="f-small f-dark-gray ellipsis">{{v.hospitalName}}</p>
                                    <dl class="hos-area-distance f-small f-dark-gray ellipsis">
                                        <dt>{{ v.address }}</dt>
                                        <dd>
                                            <span v-if="v.distance > 0">{{ v.distance | formateDistance }}</span>
                                            <span v-else ></span>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <section v-show="deptList.length !== searchData.deptList.length">
                        <p class="load-more-data" @click="loadHosDeptDocArr(searchData.deptList, 'deptNumber', 'deptList')">加载更多 <span class="arr-gray-down"></span> </p>
                    </section>
                </div>
            </section>
            <section id="doctor-tree" v-if="doctList.length > 0">
                <dl class="search-select-title">
                    <dt>医生</dt>
                    <dd>查询到{{ searchData.doctList.length }}名医生</dd>
                </dl>
                <ul class="list">
                    <li @click="onSelectedDoctor(item, index, $event)" v-for="(item, index) in doctList"
                        :id="'register-departDoctor-li-doct-'+index" :key="index">
                        <div class="doctor-info" style="padding: 0.4rem 0 0.4rem 0">
                            <div class="head doc-header"
                                 v-bind:style="{backgroundImage: 'url(' + (item.doctAvatar ? item.doctAvatar : $consts.LOCAL_DOC_IMG) + ')'}">
                            </div>
                            <div class="info">
                                <p class="f-large ellipsis"><span class="docName f-strong">{{item.rankName}}</span>&nbsp;{{ item.doctName
                                    }} {{ item.deptName}}</p>
                                <p class="f-minor ellipsis" style="margin-top:0.15rem"> {{ item.hospitalName}} {{ item.areaName}} </p>
                                <p class="f-minor ellipsis docIntroduce" style="margin-top:0.15rem">{{ item.doctDesc ?
                                    item.doctDesc :
                                    '暂无介绍'}}</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <section v-show="doctList.length !== searchData.doctList.length">
                    <p class="load-more-data" @click="loadHosDeptDocArr(searchData.doctList, 'doctNumber', 'doctList')">加载更多 <span class="arr-gray-down"></span> </p>
                </section>
            </section>
            <no-record :condition="showNoRecord" :tips='tips'></no-record>
        </scroll>
    </div>
</template>
<script>
	import { fuzzyHosDeptDoctor } from '@/services/hospitals.js'
	import { getItem, setItem  } from '@/utils/localStore.js'
	import { parseTime } from '@/utils/index.js'
	import { showToast } from '@/utils/uniApi.js'

    export default {
        data: function () {
            return {
                searchData: {
					deptList: [],
					doctList: [],
					hospitalList: []
				},
                hosList: [],
                deptList: [],
                doctList: [],
                hosNumber: 0,
                deptNumber: 0,
                doctNumber: 0,
                inputText: '',
                isChoose: false,
                showNoRecord: true,
                allRecords: [],
                tips: '请输入关键词'
            }
        },
        methods: {
            contrastText(event) {
                if (!this.inputText) {
					showToast('请输入关键词')
                    return
                }
                this.isChoose = true
                this.refresh();
            },
            backHome() {
                this.$Router.back()
            },
            refresh() {
                this.loadHosDeptDocList();
            },
            clearData() {
                /*初始化数据*/
                this.searchData = {
					deptList: [],
					doctList: [],
					hospitalList: []
				}
                this.doctList = [];
                this.deptList = [];
                this.hosList = [];
                this.doctNumber = 0
                this.hosNumber = 0
                this.deptNumber = 0
            },
            loadHosDeptDocList() {
                this.clearData()
                //界面加载友好提示
				const point = getItem('locationPoint')
                const areaParams = {
                    orgId: this.$consts.ORG_ID,
                    areaLevel: this.$consts.AREA_LEVEL,
                    longitude: point ? point.longitude : '',
                    latitude: point ? point.latitude : '',
                    keyword: this.inputText
                }
                fuzzyHosDeptDoctor(areaParams).then((res) => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
                    // this.searchData = res.data
					this.searchData.deptList = res.data.deptList || []
					this.searchData.hospitalList = res.data.hospitalList || []
					this.searchData.doctList = res.data.doctList || []
                    if (res.data.hospitalList.length === 0 && res.data.deptList.length === 0 && res.data.doctList.length === 0) {
                        this.showNoRecord = true
                        this.allRecords = []
                        this.tips = '当前关键词搜索无结果,请重新输入'
                        return;
                    }
                    this.showNoRecord =false
                    //加载医院、科室、医生列表数据
                    this.loadHosDeptDocArr(this.searchData.hospitalList, "hosNumber","hosList")
                    this.loadHosDeptDocArr(this.searchData.deptList, "deptNumber", "deptList")
                    this.loadHosDeptDocArr(this.searchData.doctList, "doctNumber", "doctList")
                });
            },
            loadHosDeptDocArr(allArr, num, subArr) {
                const newData = this.dealWithData(allArr,num)
                this[subArr] = newData.newArr
                this[num] = newData.newNum
            },
            //统一处理加载默认个数
            dealWithData(arr, num) {
                if (!arr || arr.length === 0) {
                    this[num] = 0
                    return {newArr: [], newNum: this[num]}
                }
                if (arr.length - this[num] > 6) {
                    this[num] = this[num] + 6
                    return {newArr: arr.slice(0, this[num]), newNum: this[num]}
                }
                this[num] = this[num] + arr.length
                return {newArr: arr, newNum: this[num]}
            },
            /*选择分院*/
            async onSelectedHos(v) {
                await this.saveHosInfo(v)
                this.$Router.push({name: 'departDoctor'})
            },
			saveHosInfo(v){
				return new Promise((resolve) => {
					//匹配科室排班节点的入参
					const hos = {
					    id: v.hospitalId,
					    name: v.hospitalName,
					    initials: '',
					    logo: v.logo,
					    address: v.address || '',
					    areaLevel: '',
					    levelDesc: '',
					    contact: '',
					    orgId: v.orgId || this.$consts.ORG_ID,
					    orgName: '',
					    extraMap: { },
					    moduleIdList: v.moduleIdList || []
					}
					
					const area = {
					    areaId: v.areaId,
					    areaName: v.areaName,
					    longitude: '',
					    latitude: '',
					    address: v.address,
					    distance: v.distance,
					    extraMap: { }
					}
					//缓存医院对象
					setItem('selectedHospital', hos)
					//缓存院区对象
					setItem('selectedArea', area)
					const hosInfo = {
						hos: hos,
						area: area
					}
					resolve(hosInfo)
				})
			},
            /*选择科室*/
            onSelectedDept(v) {
                const dept = {
                    deptId: v.deptId,
                    deptName: v.deptName
                }
				this.$Router.push({path: '/pages/register/dateDoctorSchedule', query: dept})
            },
            /*选择医生*/
            async onSelectedDoctor(v) {
				const hosInfo = await this.saveHosInfo(v)
                //匹配挂号医生排班节点的入参
                const doc = {
                    name: v.doctName,
                    rank: v.rankName,
                    rankId: v.rankId,
                    dept: v.deptName,
                    deptId: v.deptId,
                    doctId: v.doctId,
                    doctAvatar: v.doctAvatar,
                    doctDesc: v.doctDesc,
                    extraMap: { }
                }
				const params = {
				  orgId: v.orgId,
				  hospitalId: hosInfo.id,
				  areaId: v.areaId,
				  deptId: v.deptId,
				  regDate: parseTime(new Date(), '{y}-{m}-{d}'),
				  doctId: v.doctId
				}
				//	记录请求的数据
				this.$store.dispatch('paramStore/updateParam', {
				  namespace: 'timeSchedule',
				  requestParams: params
				})
				//	记录当前医生数据
				this.$store.dispatch('paramStore/updateParam', {
				  namespace: 'doctorInfo',
				  doctorInfo: doc
				})
				this.$Router.push({name: 'timeSchedule'})
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

            .input-search {
                height: .8rem;
                font-size: .8rem;
                width: 90%;
                padding: .8rem 2.1rem;
                display: block;
                margin: 0 auto;
                border-radius: 18px;
                align-self: center;
                outline: none;
                border: none;
            }
        }
        .list {
            .hos-list-item {
                &.def {
                    padding: 5px .75rem;
                    margin-bottom: 2px;
                    box-shadow: 0px 1px 2px 0px rgba(81, 168, 236, 0.2);
                }

                &.last {
                    padding-right: 3.25rem !important;
                    color: #3272C9;
                }
            }
        }
        .header {
            padding-top: 0.13rem;
            padding-bottom: 0.13rem;
            color: #999;
            font-size: 0.65rem !important;
            background-color: #eff2f5;
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
    }

    #hospital-select {
        background: #EFF2F5;
    }

    .search-bar {
        height: 2.5rem;
        background: #fff;
        box-shadow: 0px 1px 2px 0px rgba(81, 168, 236, 0.2);
        padding: .3rem .25rem .3rem .75rem;
        display: flex;
        margin-bottom: .25rem;

        input {
            height: 1.6rem;
            flex: 1;
            margin: .45rem 0;
            border: 1px solid white;
            border-radius: 1rem;
            padding-left: 1.5rem;
            background: #EFF2F5;
            text-align: left;
        }

        button {
            background: transparent;
            color: #51A8EC;
            width: 2.5rem;
            height: 1.6rem;
            margin: .45rem 0 .45rem 0;
        }

        label {
            background: url($redirect-url + $img-file-path + "icon-search.png") no-repeat center;
            background-size: 0.7rem;
            width: 1.6rem;
            height: 1.6rem;
            position: absolute;
            top: .75rem;
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
        dd{
            width: 1px;
            text-align: right;
            @include flex(1);
            @include ellipsis();
        }
    }
    .load-more-data {
        line-height: 2rem;
        text-align: center;
        height: 2rem;
        border-bottom: 1px solid rgb(233, 233, 233);
        padding: 0 0.75rem;
        font-weight: bolder;
        color: #51A8EC;
    }
</style>
