<template>
    <div class="triageList">
        <ul class="dept-scroll triage-left-list list " v-scroll="{y:(selectedBodyItem.partId - 1)* 50}">
            <li @click="onSelectedBody(item)" v-for="(item,index) in bodyItmes"
                :id="'triagelist-select-organ-' + index" :key="item.partId" class="dept-item list-item"
                :class="{active: item.partName == selectedBodyItem.partName }">
                {{item.partName}}
            </li>
        </ul>
        <ul class="dept-scroll triage-right-list list">
            <li @click="onSelectedDiseases(item)" v-for="(item,index) in diseasesItems"
                :id="'triagelist-select-symptom-' + index" :key="item.symptomId" class="dept-item list-item"
                :class="{active: item.symptomName == selectedDiseaseItem.symptomName }">
                {{item.symptomName}}
            </li>
        </ul>
    </div>
</template>
<script>
    import triageList from '@/config/triage.js'
	import { loadTriageDiseaseList } from '@/services/register.js'
	import { setItem } from '@/utils/localStore.js'

    export default {
        props: {
            crowdId: {
                type: String,
                default() {
                    return '1'
                }
            },
            bodyId: {
                type: String,
                default() {
                    return '1'
                }
            }
        },

        mounted() {
            this.init()
        },
        data() {
            return {
                bodyItmes: [],
                diseasesItems: [],
                sexItems: [],
                selectedSex: {},
                selectedBodyItem: {},
                selectedDiseaseItem: {}
            }
        },
        methods: {
            init() {
				console.log('dfds')
                this.bodyItmes = []
                this.diseasesItems = []
                this.loadSex()
                // this.loadOrgan()
            },
            loadSex() {
                const sexItems = triageList
                this.sexItems = sexItems
                this.selectedSex = sexItems[this.crowdId - 1]
                this.loadOrgan()
            },
            loadOrgan() {
                const bodyItmes = this.selectedSex.parts
                this.bodyItmes = bodyItmes
                if (bodyItmes.length === 0) {
                    this.bodyItmes = []
                    return
                }
                const bodyIndex = this.bodyId < 1 ? 0 : this.bodyId - 1
                this.selectedBodyItem = bodyItmes[bodyIndex]

                this.loadDiseaseList(this.selectedSex, this.selectedBodyItem);
            },

            onSelectedBody(item) {
				console.log(item)
                this.diseasesItems = item.parts
                this.selectedBodyItem = item
                //保存当前 crowdId bodyId
                this.$emit("tab-change", {crowdId: this.crowdId, bodyId: item.partId})
                this.loadDiseaseList(this.selectedSex, this.selectedBodyItem);
            },

            onSelectedDiseases(item) {
                this.selectedDiseaseItem = item
                this.go(item)
            },

            go(item) {
                this.$store.dispatch('paramStore/updateParam', {
                    namespace: 'recommend',
                    crowdName: this.selectedSex.groupsName,
                    bodyName: this.selectedBodyItem.partName,
                    diseaseName: item.symptomName,
                    diseaseId: item.symptomId,
                })
                let data = {
                    crowdName: this.selectedSex.groupsName,
                    bodyName: this.selectedBodyItem.partName,
                    diseaseName: item.symptomName,
                    diseaseId: item.symptomId
                }
                //  将数据保存在本地,防止ios按返回键数据丢失
                setItem('recodeSelectRecommend', data)

                //如果用户关闭定位功能，此处重新获取
                // if (!localStorage.locationPoint) {
                //     //跳转获取当前位置界面
                //     this.$store.commit('updateParam', {
                //         namespace: 'getLocation',
                //         url: 'Recommend',
                //     });
                //     this.$router.push({name: 'getLocation'});
                //     return;
                // }

                this.$Router.push({name: 'recommend'});
            },
            loadDiseaseList(group, part) {
                const requestParams = {
                    orgId: this.$consts.ORG_ID,
                    groupsId: group.groupsId,
                    partId: part.partId,
                }
                loadTriageDiseaseList(requestParams).then((res) => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
                    this.diseasesItems = res.data || []
                })
            },
        },
    }
</script>
<style lang="scss" scoped>
    .triageList {
        ul {
            position: absolute;
            width: 50%;
            bottom: 0;
            top: 2.5rem;
            overflow-y: auto;
            border-top: 1px solid #EFF2F5;
        }

        .triage-left-list {
            background: #E8EBED;

            li {
                border-bottom: 1px solid #DADBDD;
            }
        }

        .triage-right-list {
            background: #fff;
            right: 0;

            li {
                border: 0;
            }
        }

        .active {
            color: #51A8EC;
            background: #fff;
        }
    }

    .hasHisRegister {
        .dept-scroll {
            top: 6rem !important;
        }
    }
</style>
