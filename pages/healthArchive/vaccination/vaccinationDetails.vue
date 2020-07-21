<template>
    <div class="app">
        <scroll @refresh="refresh">
            <div>
                <section>
                    <dl class="field title">
                        <dt class="title-color">接种记录</dt>
                    </dl>
                    <dl class="table-detail-field">
                        <span class="title-info-left f-minor">接种人</span>:
                        <span class="title-info-right">{{ vaccinationDetailData.inoculator }}</span>
                    </dl>
                    <dl class="table-detail-field">
                        <span class="title-info-left f-minor">接种时间</span>:
                        <span class="title-info-right">{{ vaccinationDetailData.vaccinateDate }}</span>
                    </dl>
                    <dl class="table-detail-field">
                        <span class="title-info-left f-minor">接种机构</span>:
                        <span class="title-info-right">{{ vaccinationDetailData.vaccinateOrganization }}</span>
                    </dl>
                    <dl class="table-detail-field">
                        <span class="title-info-left f-minor">疫苗名称</span>:
                        <span class="title-info-right">{{ vaccinationDetailData.vaccinateName }}</span>
                    </dl>
                    <dl class="table-detail-field">
                        <span class="title-info-left f-minor">疫苗编号</span>:
                        <span class="title-info-right">{{ vaccinationDetailData.inoculationNum }}</span>
                    </dl>
                    <dl class="table-detail-field">
                        <span class="title-info-left f-minor">疫苗生产厂家</span>:
                        <span class="title-info-right">{{ vaccinationDetailData.inoculationManufacturer }}</span>
                    </dl>
                    <dl class="table-detail-field">
                        <span class="title-info-left f-minor">接种部位</span>:
                        <span class="title-info-right">{{ vaccinationDetailData.inoculationSite }}</span>
                    </dl>
                    <dl class="table-detail-field">
                        <span class="title-info-left f-minor">剂次</span>:
                        <span class="title-info-right">{{ vaccinationDetailData.inoculatorDose }}</span>
                    </dl>
                    <dl class="table-detail-field">
                        <span class="title-info-left f-minor">接种医生</span>:
                        <span class="title-info-right">{{ vaccinationDetailData.inoculatorDoctor }}</span>
                    </dl>
                    <dl class="field title">
                        <dt class="title-color">副反应记录</dt>
                    </dl>
                    <div v-for="(sideReactionRecord, index) in vaccinationDetailData.sideReactionRecords" :key="index">
                        <dl class="table-detail-field">
                            <span class="title-info-left f-minor">副反应名称</span>:
                            <span class="title-info-right">{{ sideReactionRecord.sideReactionName }}</span>
                        </dl>
                        <dl class="table-detail-field">
                            <span class="title-info-left f-minor">副反应日期</span>:
                            <span class="title-info-right">{{ sideReactionRecord.sideReactionDate }}</span>
                        </dl>
                    </div>
                </section>
            </div>
        </scroll>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                vaccinationDetailData: {}
            }
        },
        created() {
            this.refresh();
        },
        methods: {
            refresh() {
                this.vaccinationDetailData = this.$store.getters.param.vaccinationDetail.vaccinationItem || {};
            }
        }
    }
</script>
<style lang="scss">
    .field {
        @include display-flex();
        @include align-items(center);
        height: 2rem;
        @include border(all);
        padding: 0 $common-padding;
        &.title{
            height: 2.5rem;
         }
        .title-color {
            color: #51A8EC;
         }
        &.last{
            @include border(none);
         }
        dt {
            text-align: left;
            width: 6.5rem;
            color: $main-gray;
        }
        dd{
            width: 1px;
            text-align: right;
            @include flex(1);
            @include ellipsis();
        }
    }
</style>
