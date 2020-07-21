<template>
    <div class="app">
        <div class="head">
            <ul class="health-field-list">
                <li>
                    <span>体检医院</span>
                    <span>{{physicalExaminationOrganization}}</span>
                </li>
                <li>
                    <span>体检编号</span>
                    <span>{{physicalExaminationNo}}</span>
                </li>
                <li>
                    <span>体检时间</span>
                    <span>{{physicalExaminationDate}}</span>
                </li>
            </ul>
        </div>
        <flex-title :isShowContent="true" :showArrow="false">
            <template v-slot:title>体检结论</template>
            <template v-slot:content>
                <p class="result-area">{{ healthExamInfo.evaluation}}</p>
            </template>
        </flex-title>
        <flex-title :isShowContent="true" :showArrow="false">
            <template v-slot:title>综述建议</template>
            <template v-slot:content>
                <p class="result-area">{{healthExamInfo.advice}}</p>
            </template>
        </flex-title>
        <flex-title :isShowContent="true" :showArrow="false">
            <template v-slot:title>体检详情</template>
            <template v-slot:content>
                <div class="f-Light title-name">【症状】</div>
                <p class="result-area result-area-bottom">{{healthExamInfo.symptom}}</p>
                <div class="f-Light title-name">【一般状况】</div>
                <div v-if="healthExamInfo.normal">
                    <div class="tab-details f-Regular" v-for="(item,index) in healthExamInfo.normal" style="border-top: 1px solid #E8E8E8" :key="index">
                        <span class="f-Light min-right">{{item.name}}</span>
                        <span>{{item.value | formatEmptyData}}</span>
                    </div>
                </div>
                <div class="f-Light title-name">【生活方式】</div>
                <div v-if="healthExamInfo.lifeStyle">
                    <div v-for="(item,index) in healthExamInfo.lifeStyle" :key="index">
                        <div class="f-Light title-name">{{item.name}}</div>
                        <p class="result-area">{{item.value}}</p>
                    </div>
                </div>
            </template>
        </flex-title>
    </div>
</template>
<script>

import { getPhysicalExaminationDetail } from '@/services/healthArchive.js'
import flexTitle from '@/components/flex-title/flex-title'
import { showToast } from '@/utils/uniApi.js'
export default {
    components: {
        flexTitle
    },
    /*eslint-disable*/
    data() {
        return {
            healthExamInfo:{},
            physicalExaminationDate:'',
            physicalExaminationNo:'',
            physicalExaminationOrganization:''
        }
    },
    mounted() {
        this.refresh();
    },
    methods: {
        refresh: function() {
            var healthExamDetail = this.$store.getters.param.healthExamDetail.healthExamItem
            this.physicalExaminationNo = healthExamDetail.checkNo
            this.physicalExaminationOrganization = healthExamDetail.checkOrganization
            this.physicalExaminationDate = healthExamDetail.checkDate

            if (!healthExamDetail) {
                return
            }
            const requestParams = {
                directoryCode: healthExamDetail.directoryCode,
                extId: healthExamDetail.checkNo
            }
            getPhysicalExaminationDetail(requestParams).then((res) => {
                if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
                    if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
                        showToast(res.resultMsg);
                    }
                    return;
                }
                this.healthExamInfo = res.data
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.app{
    background-color: #F5F5F5;
    .head {
        background-color: #fff;
        margin-top: 0.6rem;
        padding: 0 1.2rem 0.6rem 1.2rem;
        .tab-item {
            height: 2.4rem;
            line-height: 2.4rem;
            margin-left: 0.6rem;
            border-bottom: 1px solid #E8E8E8;
            display: flex;
            justify-content: space-between;
        }
    }
    .tab-body {
        margin-top: 0.6rem;
        background-color: #fff;
        padding: 0 1.2rem;
        overflow: hidden;
    }
    .tab-crumb {
        position: relative;
        width: 0.2rem;
        height: 0.9rem;
        top: 0.7rem;
        left: -1.2rem;
        background-color: #2A8DFF;
    }
    .tab-head {
        position: relative;
        right: 0.2rem;
        height: 2.3rem;
        line-height: 2.3rem;
        font-weight: bold;
    }
    .tab-details {
        height: 2.4rem;
        line-height: 2.4rem;
        border-bottom: 1px solid #E8E8E8;
        display: flex;
        justify-content: space-between;
    }
    .title-name {
        padding: 0.4rem 0;
    }
    textarea {
        background-color: #E9F3FF;
        border: 1px solid #E8E8E8;
        border-width: 1px 0;
    }
    .result-area{
        min-height: 1.3rem;
        display: flex;
        align-items: center;
        background:rgba(233,243,255,0.3);
        padding: 0.4rem;
        border-width: 1px 0 1px 0;
        border-color: #E8E8E8;
        border-style: solid;
        // margin-bottom: 0.6rem;
    }
    .result-area-bottom{
        margin-bottom: 0.2rem;
    }
}
</style>
