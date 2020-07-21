<template>
    <div class="app">
        <scroll @refresh="refresh" class="report-detail">
            <section class="head">
                <ul class="health-field-list">
                    <li>
                        <span>随访类型</span>
                        <span>{{visitType}}</span>
                    </li>
                    <li v-if="visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_GXY || visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_TNB">
                        <span>随访方式</span>
                        <span>{{visitInfo.followUpWay}}</span>
                    </li>
                    <li v-if="visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_GWTJ">
                        <span>体检时间</span>
                        <span>{{visitInfo.examTime}}</span>
                    </li>
                    <li v-if="visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_GWTJ">
                        <span>体检医生</span>
                        <span>{{visitInfo.doctor}}</span>
                    </li>
                    <li v-if="visitDirectoryCode !== $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_GWTJ">
                        <span>随访时间</span>
                        <span>{{visitDate}}</span>
                    </li>
                </ul>
            </section>
            <section class="report-wrapper">
                <div v-if="visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_GXY || visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_TNB">
                    <section class="section-bg" v-if="visitInfo.signs">
                        <flex-title :isShowContent="true" :showArrow="false">
                            <template v-slot:title>体征</template>
                            <template v-slot:content>
                                <div>
                                    <ul class="health-field-list">
                                        <li>
                                            <span>收缩压</span>
                                            <span>{{visitInfo.signs.systolicPressure| formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>舒张压</span>
                                            <span>{{visitInfo.signs.diastolicPressure | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>体重(kg)</span>
                                            <span>{{visitInfo.signs.weight | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>体质指数</span>
                                            <span>{{visitInfo.signs.bodyMassIndex | formatEmptyData}}</span>
                                        </li>
                                        <li v-if="visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_GXY">
                                            <span>心率</span>
                                            <span>{{visitInfo.signs.diastolicPressure | formatEmptyData}}</span>
                                        </li>
                                        <li v-if="visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_TNB">
                                            <span>足背动脉搏动</span>
                                            <span>{{visitInfo.signs.diastolicPressure | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>其他</span>
                                            <span>{{visitInfo.signs.other | formatEmptyData}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </flex-title>
                    </section>
                    <section class="section-bg" style="margin-top: 0.6rem;">
                        <flex-title :isShowContent="true" :showArrow="false">
                            <template v-slot:title>生活方式指导</template>
                            <template v-slot:content>
                                <div>
                                    <ul class="health-field-list">
                                        <li>
                                            <span>日吸烟量</span>
                                            <span>{{visitInfo.lifeStyleGuides.dairySmokeAmount | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>日喝酒量</span>
                                            <span>{{visitInfo.lifeStyleGuides.dairyDrinkAmount | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>主食(克/天)</span>
                                            <span>{{visitInfo.lifeStyleGuides.dailyFoodAmount | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>运动</span>
                                            <span>{{visitInfo.lifeStyleGuides.sport}}</span>
                                        </li>
                                        <li v-if="visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_GXY">
                                            <span>摄盐情况</span>
                                            <span>{{visitInfo.signs.diastolicPressure | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>心理调整</span>
                                            <span>{{visitInfo.lifeStyleGuides.mindAdjust | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>遵医行为</span>
                                            <span>{{visitInfo.lifeStyleGuides.accordingBehavior | formatEmptyData}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </flex-title>
                    </section>
                    <section class="section-bg" style="margin-top: 0.6rem;">
                        <flex-title :isShowContent="true" :showArrow="false">
                            <template v-slot:title>辅助检查</template>
                            <template v-slot:content>
                                <div>
                                    <ul class="health-field-list">
                                        <li>
                                            <span>辅助检查项目</span>
                                            <span>-</span>
                                        </li>
                                        <li>
                                            <span>辅助检查结果</span>
                                            <span>-</span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </flex-title>
                    </section>
                    <section class="section-bg" style="margin-top: 0.6rem;">
                        <flex-title :isShowContent="true" :showArrow="false">
                            <template v-slot:title>转诊</template>
                            <template v-slot:content>
                                <div>
                                    <ul class="health-field-list">
                                        <li>
                                            <span>原因</span>
                                            <span>{{visitInfo.transfer.reason | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>机构及级别</span>
                                        </li>
                                         <p class="result-area">{{visitInfo.transfer.organizationAndRank | formatEmptyData}}</p>
                                    </ul>
                                </div>
                            </template>
                        </flex-title>

                    </section>
                    <section class="section-bg" style="margin-top: 0.6rem;">
                        <flex-title :isShowContent="true" :showArrow="false">
                            <template v-slot:title>其他</template>
                            <template v-slot:content>
                                <div>
                                    <ul class="health-field-list">
                                        <li>
                                            <span>服药依从性</span>
                                            <span>{{visitInfo.other.medicationCompliance | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>药物不良反应</span>
                                            <span>{{visitInfo.other.adverseReaction | formatEmptyData}}</span>
                                        </li>
                                        <li v-if="visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_TNB">
                                            <span>低血糖反应</span>
                                            <span>{{visitInfo.other.hypoglycemia | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>此次随访分类</span>
                                            <span>{{visitInfo.other.followUpClassification | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>用药情况</span>
                                            <span>{{visitInfo.other.drugUsage | formatEmptyData}}</span>
                                        </li>

                                    </ul>
                                </div>
                            </template>
                        </flex-title>
                    </section>
                </div>
                <div v-if="visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_ZYYJKFW && visitInfo.constitutions">
                   <section class="section-bg" style="margin-top: 0.6rem;" v-for="(item,index) in visitInfo.constitutions" :key="index">
                       <flex-title :isShowContent="true" :showArrow="false">
                            <template v-slot:title>{{item.constitutionName}}情况</template>
                            <template v-slot:content>
                                <div>
                                    <ul class="health-field-list">
                                        <li>
                                            <span>得分</span>
                                            <span>{{item.constitutionScore | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>体质辨识</span>
                                            <span>{{item.constitutionName | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>中医药保健指导</span>
                                            <span>{{item.HealthGuidance | formatEmptyData}}</span>
                                        </li>
                                        <li>
                                            <span>其他</span>
                                            <span>{{item.other | formatEmptyData}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </flex-title>
                   </section>
                </div>
                <div v-if="visitDirectoryCode === $consts.HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_GWTJ">
                    <section class="section-bg" style="margin-top: 0.6rem;">
                        <flex-title :isShowContent="true" :showArrow="false">
                            <template v-slot:title>体检结论</template>
                            <template v-slot:content>
                                <p class="result-area">{{visitInfo.evaluation}}</p>
                            </template>
                        </flex-title>
                    </section>
                    <section class="section-bg" style="margin-top: 0.6rem;">
                        <flex-title :isShowContent="true" :showArrow="false">
                            <template v-slot:title>综述建议</template>
                            <template v-slot:content>
                                <p class="result-area">{{visitInfo.advice}}</p>
                            </template>
                        </flex-title>
                    </section>
                    <section class="section-bg" style="margin-top: 0.6rem;">
                        <flex-title :isShowContent="true" :showArrow="false">
                            <template v-slot:title>体检详情</template>
                            <template v-slot:content>
                                <div class="section-bottom">
                                    <div class="f-Light title-name">【症状】</div>
                                    <p class="result-area">{{visitInfo.symptom}}</p>
                                    <div class="f-Light title-name">【一般状况】</div>
                                    <div v-if="visitInfo.normal">
                                        <div  v-for="(item,index) in visitInfo.normal" :key="index">
                                            <dl class="table-detail-field"> 
                                                <span class="title-info-left f-Light">{{item.name}}</span>
                                                <span class="title-info-right f-Regular">{{item.value | formatEmptyData}}</span>
                                            </dl>
                                        </div>
                                    </div>
                                    <div class="f-Light title-name">【生活方式】</div>
                                    <div v-if="visitInfo.lifeStyle">
                                        <div v-for="(item,index) in visitInfo.lifeStyle" :key="index">
                                            <div class="f-Light title-name">{{item.name}}</div>
                                            <p class="result-area">{{item.value}}</p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </flex-title>
                    </section>
                </div>
            </section>
        </scroll>
    </div>
</template>
<script>
    import { getHealthVisitDetail } from '@/services/healthArchive.js'
    import flexTitle from '@/components/flex-title/flex-title'
	import { showToast } from '@/utils/uniApi.js'
    export default {
        components: {
            flexTitle
        },
        data() {
            return {
                visitInfo: {},
                visitDate: '',
                visitType: '',
                visitDirectoryCode: '',
            }
        },
        created() {
            this.refresh();
        },
        methods: {
            refresh() {
                this.loadLabDetail();
            },
            loadLabDetail() {
                const queryParams = this.$store.getters.param.healthVisitDetail.visitInfo;
                this.visitDate = queryParams.followUpDate
                this.visitType = queryParams.followUpType
                this.visitDirectoryCode = queryParams.directoryCode
                if (!queryParams) {
                    return
                }
                getHealthVisitDetail(queryParams).then((res) => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
                        if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
                            showToast(res.resultMsg);
                        }
                        return
                    }
                    this.visitInfo = res.data
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .head {
        background-color: #fff;
        margin-top: 0.6rem;
        padding: 0 1.2rem 0.6rem 1.2rem;
    }
    .section-bg {
        background: #fff;
        margin-bottom: 0px;
    }

    .section-bottom {
        margin-bottom: 0.5rem;
        overflow: hidden;
    }
    .title-name {
        padding: 0.4rem 0;
    }
    .result-area{
        min-height: 1.3rem;
        display: flex;
        align-items: center;
        background:rgba(233,243,255,0.3);
        padding: 0.4rem;
        border-color: #E8E8E8;
        border-style: solid;
        // margin-bottom: 0.6rem;
    }
    .result-area-bottom{
        margin-bottom: 0.2rem;
    }
    .field{
        margin: .6rem 1.2rem 0 1.2rem;
    }
</style>
