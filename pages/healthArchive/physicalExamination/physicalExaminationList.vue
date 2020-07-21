<template>
    <div id="gwi-healthExam" class="app my-app">
        <scroll @refresh="refresh" style="background: #F5F5F5">
            <section class="tab-thick" v-for="(healthExamItem, index) in examListData" :key="index">
                <div @click.stop="goDetail(healthExamItem)">
                    <flex-title :isShowContent="true" :direction="'right'">
                        <template v-slot:title>{{healthExamItem.checkDate}}</template>
                        <template v-slot:content>
                            <div>
                                <ul class="health-field-list">
                                    <li>
                                        <span>体检医院</span>
                                        <span>{{healthExamItem.checkOrganization}}</span>
                                    </li>
                                    <li>
                                        <span>体检编号</span>
                                        <span>{{healthExamItem.checkNo}}</span>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </flex-title>
                </div>
            </section>
            <no-record :condition="examListData.length === 0" :tips="'抱歉，没有体检记录！'"></no-record>
        </scroll>
    </div>
</template>

<script>
import { getPhysicalExaminationList } from '@/services/healthArchive.js'
import flexTitle from '@/components/flex-title/flex-title'
import { getItem } from '@/utils/localStore.js'
import { showToast } from '@/utils/uniApi.js'
export default{
    components: {
        flexTitle
    },
    data() {
        return {
            examListData: []
        };
    },
    mounted() {
        this.refresh();
    },
    methods: {
        refresh() {
            const requestParams = {
                globalId: getItem(this.$consts.HEALTH_ARCHIVE_GLOBLE_ID)
            }
            getPhysicalExaminationList(requestParams).then((res) => {
                if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
                    if (res.errorCode !== this.constant.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
                        showToast(res.resultMsg);
                    }
                    return;
                }
                this.examListData = res.data
            });
        },
        goDetail(healthExamItem) {
			this.$store.dispatch('paramStore/clearParam', 'healthExamDetail')
			this.$store.dispatch('paramStore/updateParam', {
				namespace: 'healthExamDetail',
				healthExamItem: healthExamItem
			})
            this.$Router.push({ name: 'physicalExaminationDetails' });
        }
    },
}
</script>

<style lang="scss" scoped>
    .f-size {
        font-size: 16px;
    }
    .tab-content {
        display: inline-block;
        width: 11rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: right;
    }
</style>