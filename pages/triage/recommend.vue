<template>
    <div class="app">
        <scroll>
            <section class="recommend-triage flex-row">
                <div class="title-img"></div>
                <div class="title-msg flex-item">
                    <p>{{sexName}} {{bodyName}}</p>
                    <p class="f-minor">{{symptomName}}</p>
                </div>
            </section>

            <div class="panel-title-large icon-msg-h" style="background-color: #fff;">
                <span class="icon img-hisp"></span>
                <p>向您推荐(该信息仅供参考)</p>
            </div>
            <section class="thick" style="margin-top: 0.5rem">
                <tab :tabs="tabs" :tabIndex="tabIndex" v-on:changeTab="onSelectedTab"></tab>
            </section>
            <section class="thick" style="margin-bottom: 10px;margin-top: 10px;" @click="onSelected(item, index, $event)" v-for="(item, index) in recommendDeparts">
                <div class="panel ellipsis">
                    <span>{{item.hospitalName.split('（')[0]}}（{{item.areaName.split('(')[0]}}）</span>
                    <span class="arr-right" v-show="tabIndex === 1">{{item.distance | formateDistance}}</span>
                </div>
                <div class="content arr-row f-minor">
                    <span>推荐科室</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.deptName | formatDeptName}}</span>
                </div>
            </section>
            <no-record :condition="recommendDeparts.length === 0" tips='没有查到推荐科室，请选择其他症状'></no-record>
        </scroll>
    </div>
</template>
<script>

	import { loadTriageDeptList } from '@/services/register.js'
    import tab from '@/components/tabs/tabs.vue'
	import { getItem, setItem } from '@/utils/localStore.js'

    export default {
        data() {
            let params = this.$store.getters.param.recommend;
            if(params === undefined) {
                params = getItem('recodeSelectRecommend') 
            }
            return {
                recommendDeparts: [],
                sexName: params.crowdName,
                bodyName: params.bodyName,
                symptomName: params.diseaseName,
                symptomId: params.diseaseId,
                tabs: [
					{
						name: '离我最近'
					}, {
						name: '挂号人次'
					}
                ],
				tabIndex: 1,
                localPoint: getItem('locationPoint') || {},
            }
        },
        components: {
            tab
        },
        mounted() {
            //默认加载按距离排序
            // if (!localStorage.locationPoint) {
            //     this.$utils.alert('定位失败，默认按挂号人次展示');
            // }
            const params = {
                sortType: this.$consts.DEPT_SORT_TYPE.DISTANCE,
                longitude: this.localPoint ? this.localPoint.longitude : '',
                latitude: this.localPoint ? this.localPoint.latitude : ''
            }
            this.loadTriageDepts(params)
        },
        methods: {
            onSelectedTab(sortType) {
                this.tabIndex = sortType

                //按距离查询推荐科室
                if (sortType + 1 === this.$consts.DEPT_SORT_TYPE.DISTANCE) {
                    // if (!localStorage.locationPoint) {
                    //     this.$utils.alert('获取当前用户定位失败,请返回上一个界面重新获取');
                    //     return;
                    // }
                    const params = {
                        sortType: sortType,
                        longitude: this.localPoint.longitude,
                        latitude: this.localPoint.latitude,
                    }
                    this.loadTriageDepts(params)
                    return
                }

                const params = {
                    sortType: sortType,
                    longitude: '',
                    latitude: '',
                }
                this.loadTriageDepts(params)
            },
            loadTriageDepts(params) {
                this.recommendDeparts = [];

                var requestParams = {
                    orgId: this.$consts.ORG_ID,
                    symptomId: this.symptomId,
                    sortType: params.sortType ? params.sortType : '2',
                    longitude: params.longitude ? params.longitude : '',
                    latitude: params.latitude ? params.latitude : '',
                }
                loadTriageDeptList(requestParams).then((res) => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
                    if (res.data.length === 0) {
                        return;
                    }
                    const resDatas = res.data || [];
                    //处理统一科室数据
                    this.dealWithDatas(resDatas)
                })
            },
            // 处理数据，得到医院为单位的对象
            dealWithDatas(resDatas) {
                //所有科室汇总
                let newAllDatas = []
                // 遍历数据中科室信息,组装所有科室信息
                for (let i = 0; i < resDatas.length; i++) {
                    /*统一科室中医院科室数组*/
                    const depts = resDatas[i].depts
                    for (let j = 0; j < depts.length; j++) {
                        newAllDatas.push(depts[j])
                    }
                }
                //筛选处理科室信息，按照医院 hospitalId hospitalName areaId areaName 四个字段分类
                this.recommendDeparts = newAllDatas
            },
            onSelected(item) {
                const selectedHospital = {
                    id: item.hospitalId,
                    name: item.hospitalName,
                    initials: '',
                    logo: '',
                    address: '',
                    areaLevel: '',
                    levelDesc: '',
                    contact: '',
                    orgId: this.$consts.ORG_ID,
                    orgName: '',
                    extraMap: {},
                    moduleIdList: item.moduleIdList || []
                }

                const selectedArea = {
                    areaId: item.areaId,
                    areaName: item.areaName,
                    longitude: '',
                    latitude: '',
                    address: '',
                    distance: '',
                    extraMap: {}
                }

                const dept = {
                    deptId: item.deptId,
                    deptName: item.deptName
                }
				setItem('selectedHospital', selectedHospital)
				setItem('selectedArea', selectedArea)

                this.$store.dispatch('paramStore/updateParam', {
                    namespace: 'register',
                    depart: dept,
                    area: selectedArea
                })
				console.log('dateDoctorSchedule')
                this.$Router.push({path: '/pages/register/dateDoctorSchedule'});
            }
        },
    }
</script>
<style lang="scss">

    .recommend-triage {
        padding: 0.5rem 0.75rem;

        .title-img {
            width: 3.5rem;
            height: 3.5rem;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url($redirect-url + $img-file-path + "doctor-photo.png");
        }

        .title-msg {
            padding: 0.25rem 0.5rem;
        }
    }

    .img-hisp {
        background-image: url($redirect-url + $img-file-path + "hospital-icon.png");
    }
</style>
