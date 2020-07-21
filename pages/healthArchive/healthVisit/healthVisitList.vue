<template>
    <div id="gwi-myPay" class="app my-app">
        <scroll @refresh="refresh">
            <section class="tab-thick" v-for="(visitInfo, index) in healthVisitList" :key="index">
                <div @click="goDetail(visitInfo)">
                    <flex-title :isShowContent="true" :direction="'right'">
                        <template v-slot:title>{{visitInfo.followUpDate}}</template>
                        <template v-slot:content>
                            <ul class="health-field-list">
                                <li>
                                    <span>随访类型</span>
                                    <span>{{visitInfo.followUpType}}</span>
                                </li>
                            </ul>
                        </template>
                    </flex-title>
                </div>
            </section>
            <no-record :condition="healthVisitList.length === 0" :tips="'抱歉，没有随访记录！'"></no-record>
        </scroll>
    </div>
</template>
<script>
    import { getHealthVisitList } from '@/services/healthArchive.js'
    import flexTitle from '@/components/flex-title/flex-title'
	import { getItem } from '@/utils/localStore.js'
	import { showToast } from '@/utils/uniApi.js'
    export default {
        components: {
            flexTitle
        },
        data() {
            return {
                healthVisitList: []
            };
        },
        mounted() {
            this.refresh();
        },
        methods: {
            refresh() {
                const requestParams = {
                    globalId: getItem(this.$consts.HEALTH_ARCHIVE_GLOBLE_ID),
                }
                getHealthVisitList(requestParams).then((res) => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
                        if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
                            showToast(res.resultMsg);
                        }
                        return;
                    }
                    this.healthVisitList = res.data
                });
            },
            goDetail(visitInfo) {
				this.$store.dispatch('paramStore/clearParam', 'healthVisitDetail')
				this.$store.dispatch('paramStore/updateParam', {
					namespace: 'healthVisitDetail',
					visitInfo: visitInfo
				})
                this.$Router.push({name: 'healthVisitDetail'});
            }
        },
    }
</script>
<style scoped lang="scss">
	.health-field-list{
	  background: #fff;
	  li{
	    min-height: 2.4rem;
	    align-items: center;
	    border-bottom: 1px solid #E8E8E8;
	    @include display-flex;
	    @include justify-content(space-between);
	  
	    span{
	      font-size: 0.8rem;
	    }
	    span:nth-child(1){
	      color: #3C3C3C;
	      flex: 0.4;
	      font-weight: 300;
	    }
	    span:nth-child(2){
	      font-weight: 400;
	      color: #3C3C3C;
	      flex: 0.6;
	      display: inline-block;
	      overflow: hidden;
	      text-overflow: ellipsis;
	      text-align: right;
	    }
	  }
	}
</style>