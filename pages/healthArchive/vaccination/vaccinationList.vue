<template>
    <div id="gwi-vaccination" class="app my-app bg-gray">
        <scroll @refresh="refresh">
            <section class="thick" v-for="(vaccinationItem, index) in vaccinationListData" :key="index">
                <div class="row arr-row table-row" @click="goDetail(vaccinationItem)">
                    <div class="table-list-info">
                        <div class="info hosInfo">
                            <p class="f-large f-minor ellipsis min-top"><span
                                    class="f-minor min-right">接种日期</span>:<span
                                    class="f-normal min-left">{{vaccinationItem.vaccinateDate}}</span></p>
                            <p class="f-large f-minor ellipsis min-bottom"><span
                                    class="f-minor min-right">接种疫苗</span>:<span
                                    class="f-normal min-left">{{vaccinationItem.vaccinateName}}</span></p>
                            <p class="f-large f-minor ellipsis min-bottom"><span
                                    class="f-minor min-right">接种机构</span>:<span
                                    class="f-normal min-left">{{vaccinationItem.vaccinateOrganization}}</span></p>
                        </div>
                    </div>
                </div>
            </section>
            <no-record :condition="vaccinationListData.length === 0" :tips="'抱歉，没有预防接种记录！'"></no-record>
        </scroll>
    </div>
</template>
<script>
    import { getVaccinationList } from '@/services/healthArchive.js'
	import { showToast } from '@/utils/uniApi.js'
	import { getItem } from '@/utils/localStore.js'
    export default {
        data() {
            return {
                vaccinationListData: []
            };
        },
        mounted() {
            this.refresh();
        },
        methods: {
            refresh() {
				const voucher = getItem('selectedVoucher')
                const requestParams = {
                    idCardNo: voucher.cardNo,
                    name: voucher.holderName
                }
                getVaccinationList(requestParams).then((res) => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
                        if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
                            showToast(res.resultMsg);
                        }
                        return;
                    }
                    this.vaccinationListData = res.data
                });
            },
            goDetail(vaccinationItem) {
				this.$store.dispatch('paramStore/clearParam', 'vaccinationDetail')
				this.$store.dispatch('paramStore/updateParam', {
					namespace: 'vaccinationDetail',
					vaccinationItem: vaccinationItem
				})
                this.$Router.push({name: 'vaccinationDetails'});
            }
        },
    }
</script>