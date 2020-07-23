<template>
<div class="app gray-app" >
    <div class="history-register" v-if="hasHisRegister && historyRegisterList.length > 0">
        <div class="doc-logo" v-bind:style="{backgroundImage: 'url(' + (historyRegisterInfo.doctAvatar ? historyRegisterInfo.doctAvatar : $consts.LOCAL_DOC_IMG) + ')'}">
            <!-- 门诊类型标签 -->
            <span v-if="historyRegisterInfo.typeId === '849772'" class="doc-rank tag-putong">{{historyRegisterInfo.typeName}}</span>
            <span v-if="historyRegisterInfo.typeId === '643075'" class="doc-rank tag-zhuanjia">{{historyRegisterInfo.typeName}}</span>
        </div>
        <p>您上次就诊的是<span>{{historyRegisterInfo.hospitalName}}{{historyRegisterInfo.areaName}}{{historyRegisterInfo.deptName}}{{historyRegisterInfo.doctName}}</span>，本次是否挂该医生的号？</p>
		 <!-- | formatDeptName(historyRegisterInfo.hospitalId) -->
        <div class="register-btn">
            <button @click="toPage('dateTimeSchedule')">挂号</button>
        </div>
    </div>
    <div class="tab" :class="{'tab-in-triageList': currentViewName === 'triageList'}">
        <ul>
            <li :class="{'tab-active': currentViewName === 'triageBody'}" @click="activate('triageBody')">人体</li>
            <li :class="{'tab-active': currentViewName === 'triageList'}" @click="activate('triageList')">列表</li>
        </ul>
    </div>
    <component v-if="showTriage" :class="{'hasHisRegister': hasHisRegister && historyRegisterList.length > 0}" :is="currentView" @tab-change="onChange" @save-head="onSaveHead" @save-direct="onSaveDirect" :crowd-id="crowdId" :body-id="bodyId" :direct="direct" :is-head="isHead"></component>
    
    <div class="select-hospital" @click="toPage('departDoctor')" v-if="hasGoDeptDoctor">
        <p>选择医院进行挂号</p> 
    </div>
</div>
</template>
<script>
import triageBody from './triageBody.vue'
import triageList from './triageList.vue'
import { getRegisterHistory } from '@/services/register.js'

const config = {
    triageBody,
    triageList,
}
export default {
    beforeRouteLeave (to, from, next) {
        if(this.currentViewName === 'triageList' && to.name === 'index') {
            this.currentViewName = 'triageBody'
            this.hasHisRegister = true
            this.hasGoDeptDoctor = true
            this.currentView = config[this.currentViewName]
            return next(false)
        } else {
            next()
        }
    },
    data() {
        return {
            currentView: triageBody,
            currentViewName: 'triageBody',
            crowdId: '',//默认 男；  1男 2女 3儿童
            bodyId:'',//默认身体部分 头部
            direct:'',//正面反面 1正面 0返面
            isHead:'',//是否头部 1头部 0非头部
            hasHisRegister: true,
            historyRegisterList: [],
            historyRegisterInfo: {},
            hasGoDeptDoctor: true,
            showTriage: false
        }
    },
    onLoad(){
        this.crowdId = this.$consts.TRIAGE.CROWD.MAN
        this.bodyId = '1'
        this.direct = this.$consts.TRIAGE.DIRECT.FRONT
        this.isHead = this.$consts.TRIAGE.HEAD.NO
		this.$nextTick(() => {
			this.showTriage = true
		})	
    },
	onShow(){
		//加载历史挂号
		this.loadHistoryRegisterInfo();
	},
    methods: {
        toPage(name){
            //复诊挂号
            if (name === 'dateTimeSchedule') {
                //匹配挂号医生排班节点的入参
				const hisInfo = this.historyRegisterInfo
                const doc = {
                    name: hisInfo.doctName,
                    rank: hisInfo.rankName,
                    rankId: hisInfo.rankId,
                    dept: hisInfo.deptName,
                    deptId: hisInfo.deptId,
                    doctId: hisInfo.doctId,
                    doctAvatar: hisInfo.doctAvatar,
                    doctDesc: hisInfo.doctDesc
                }
                const selectedHospital = {
                    id: hisInfo.hospitalId,
                    name: hisInfo.hospitalName,
                    initials: '',
                    logo: '',
                    address: '',
                    areaLevel: '',
                    levelDesc: '',
                    contact: '',
                    orgId: this.$consts.ORG_ID,
                    orgName: '',
                    extraMap: { },
                    moduleIdList: history.moduleIdList || []
                }

                const selectedArea = {
                    areaId: history.areaId,
                    areaName: history.areaName,
                    longitude: '',
                    latitude: '',
                    address: '',
                    distance: '',
                    extraMap: { }
                }
				setItem('selectedHospital', selectedHospital)
				setItem('selectedArea', selectedArea)
				
                // this.$store.commit('updateParam', {
                //     namespace: 'register',
                //     doc: doc,
                //     area: selectedArea
                // })
                this.$Router.push({name: 'dateTimeSchedule'});
            }

            //常规挂号
            if (name === 'departDoctor') {
				this.$store.dispatch('paramStore/clearParam', 'DistrictSelect')
                this.$store.dispatch('paramStore/updateParam', {
                    namespace: 'menu',
                    url: name
                });
                this.$Router.push({name: 'hospitalSelect'});
            }
        },

        loadHistoryRegisterInfo () {
            const requestParams = {
                orgId: this.$consts.ORG_ID,
            }
            getRegisterHistory(requestParams).then((res) => {
                if(res.resultCode !== this.$consts.RESULT_SUCCESS) return
                this.historyRegisterList = res.data || [];
                if (this.historyRegisterList.length === 0) {
                    this.hasHisRegister = false
                }
                this.historyRegisterInfo = this.historyRegisterList[0];
            })
        },
        onSaveHead(isHead){
            this.isHead = isHead
        },
        onSaveDirect(direct){
            this.direct = direct
        },
        onChange(triageInfo,changeFlag){
            this.crowdId = triageInfo.crowdId
            this.bodyId = triageInfo.bodyId
            if(changeFlag){
                this.activate('triageList')
            }
        },
        activate(name) {
            if (name === 'triageList') {
                this.hasHisRegister = false
                this.hasGoDeptDoctor = false
            }
            if (name === 'triageBody') {
                this.hasHisRegister = true
                this.hasGoDeptDoctor = true
            }
            this.currentViewName = name
            this.currentView = config[name]
        },
    },
}
</script>
<style lang="scss" scoped>
.gray-app{
    background: #e8ebed;
}
.triage-tab-panel {
    position: relative;
    text-align: center;
    height: $tab-top-height;
    background-color: #fff;
    padding: 0;
    .top-tab {
        @include display-flex();
        height: $tab-top-height;
        color: $main-blue;
        .tab-left {
            @include flex(2);
            font-size: 0.8rem;
            text-align: center;
            color: black;
            line-height: $tab-top-height - 0.1rem;
            margin: 0.05rem auto;
            &.active {
                color: #51a8ec;
                border-bottom: 0.2rem solid #51a8ec;
            }
        }
        .tab-right {
            @include flex(2);
            font-size: 0.8rem;
            text-align: center;
            color: black;
            border-left: 1px solid #eff3f6;
            line-height: $tab-top-height - 0.1rem;
            margin: 0.05rem auto;
            &.active {
                color: #51a8ec;
                border-bottom: 0.2rem solid #51a8ec;
            }
        }
        .tab-empty {
            @include flex(1);
        }
        .tab-sex {
            @include flex(1);
            position: relative;
            .icon {
                position: absolute;
                left: 1rem;
                width: 1.6rem;
                height: 1.6rem;
                background-size: contain;
                background-repeat: no-repeat;
            }
            .sex-1 {
                background-image: url($redirect-url + $img-file-path + "big-nan-button.png");
            }
            .sex-2 {
                background-image: url($redirect-url + $img-file-path + "choice-nv.png");
            }
            .sex-3 {
                background-image: url($redirect-url + $img-file-path + "choice-er.png");
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.history-register{
    color: white;
    padding: 0 0.5rem 0 0.75rem;
    height: 3.75rem;
    display: flex;
    background: #fff;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    .doc-logo{
        width: 4.5rem;
        height: 4.2rem;
        background-image: url($redirect-url + $img-file-path + "ico-doctor.png");
        background-size:contain;
        background-repeat: no-repeat;
        background-position: center;
        .doc-rank {
            border-radius: 3px;
            font-size: .35rem;
            padding-left: 2px;
            padding-right: 2px;
            color: #fff;
            position: relative;
            left: 1.3rem;
            top: 2.3rem;
        }
    }
    p{
        padding: 0 0.75rem 0 0.65rem;
        color: #999;
        font-size: 0.65rem;
        span{
            color: #51A8EC;
            font-size: 0.65rem;
        }
    }
    .register-btn{
        button{
            width: 3rem;
            height: 1.9rem;
            background: #51A8EC;
            border-radius: 0.2rem;
        }
    }
}
.tab{
    text-align: center;
    padding: .5rem 0;
    
    ul{
        width: 7.5rem;
        height: 1.5rem;
        margin: 0 auto;
        display: flex;
        background: #fff;
        border: 1px solid #ADDDFE;
        border-radius: 0.25rem;
        li{
            width: 3.75rem;
            flex: 1;
            height: inherit;
            line-height: 1.5rem;
            color: #51A8EC;
            &:nth-child(1){
                border-radius: .25rem 0 0 .25rem;
            }
            &:nth-child(2){
                border-radius: 0 .25rem .25rem 0;
            }
        }
        .tab-active{
            background: #51A8EC;
            color: #fff;
        }
    }
}
.tab-in-triageList{
    background: #fff;
}
.select-hospital{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    background: #fff;
    color: #222222;
    font-size: 20px;
    p{
        padding: 0 0.5rem;
        position: relative;
        &:after{
            content: '';
            position: absolute;
            background: url($redirect-url + $img-file-path + "more-right-blue.png") no-repeat center;
            right: 0;
            width: 0.75rem;
            height: 0.75rem;
            margin: 0.85rem 0.5rem 0.85rem 0;
        }
    }
}
.hasHisRegister{
    top: 6rem !important;
}
</style>

