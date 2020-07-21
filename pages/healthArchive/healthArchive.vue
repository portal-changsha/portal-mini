<template>
	<scroll class="scroll-style" @refresh="refresh">
        <div class="health-archive">
            <div class="health-archive-header">
                <div class="health-archive-area">
                    <div class="health-archive-user">
                        <div class="user-logo">
                            <img :src="homeInfo.avatar" />
                        </div>
                        <div class="user-info">
                            <div class="user-info-area">
                                <p>{{homeInfo.name}}</p>
                                <div class="user-tips">
                                    <img v-if="homeInfo.hypertension" :src="baseImgSrc + 'gao.png'" />
                                    <img v-if="homeInfo.diabetes" :src="baseImgSrc + 'tang.png'" />
                                    <img v-if="homeInfo.older" :src="baseImgSrc + 'old.png'" />
                                </div>
                            </div>
                            <div class="family-doc">家庭医生签约团队：{{homeInfo.familyDoctor | dotted }}</div>
                        </div>
                    </div>
                    <div class="archive-org">
                        <p>建档机构：<span>{{homeInfo.archivingOrg | formatEmptyData }}</span></p>
                    </div>
                </div>
            </div>
            <div class="health-archive-content">
                <div class="health-recorde">
                    <div class="health-recorde-col" @click="toPage('healthClinicList')">
                        <p>
                            {{homeInfo.outpatientRecords || 0}}
                            <span>条</span>
                        </p>
                        <p>门诊记录</p>
                    </div>
                    <div class="health-recorde-col health-recorde-col-border" @click="toPage('healthInpatientList')">
                        <p>
                            {{homeInfo.inpatientRecords || 0}}
                            <span>条</span>
                        </p>
                        <p>住院记录</p>
                    </div>
                    <div class="health-recorde-col" @click="toPage('healthVisitList')">
                        <p>
                            {{homeInfo.pubHealthRecords || 0}}
                            <span>条</span>
                        </p>
                        <p>公卫记录</p>
                    </div>
                </div>
                <div class="menu-info-row">
                    <div class="menu-info-col" v-for="(item, index) in menuInfo" :key="index" @click="toPage(item.url)">
                        <div class="menu-info-col-area">
                            <div class="menu-img" :class="item.class">
								<i class="iconfont" style="color: #fff;;" :class="item.icon"></i>
                                <!-- <svg-icon class-name="svg-class" :icon-class="item.icon"></svg-icon> -->
                            </div>
                            <div class="menu-title">
                                <p>{{item.title}}</p>
                                <p>{{item.subTitle}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="health-bottom" @click="toPage('disclaimer')">
                免责声明 >
            </div>
        </div>
    </scroll>
</template>

<script>
	import { getArchiveHome, verifyFaceIdentity } from '@/services/healthArchive.js'
	import { getItem, setItem, removeItem } from '@/utils/localStore.js'
    import config from '@/config/index.js'
    import { showToast } from '@/utils/uniApi.js'
	export default {
		data() {
			return {
				menuInfo: [
					{ title: '个人信息', subTitle: '过敏史 | 既往史', class: 'health-user', url: 'patientInfo', icon: 'iconehr-i1' },
					{ title: '门诊信息', subTitle: '门诊记录 | 用药记录', class: 'health-opc', url: 'healthClinicList', icon: 'iconehr-06' },
					{ title: '住院信息', subTitle: '住院记录 | 出院小结', class: 'health-hos', url: 'healthInpatientList', icon: 'iconehr-i3' },
					{ title: '体检信息', subTitle: '体检记录 | 体检详情', class: 'health-tijian', url: 'physicalExaminationList', icon: 'iconehr-i4' },
					{ title: '公卫信息', subTitle: '公卫记录 | 公卫详情', class: 'health-gongwei', url: 'healthVisitList', icon: 'iconehr-i5' }
				],
				homeInfo: {},
                baseImgSrc: config.VUE_APP_IMG_URL,
                voucher: {}
			}
		},
		onLoad(){
			this.initData()
		},
		methods: {
			initData(){
				const hosInfo = getItem('selectedHospital')
				this.voucher = getItem('selectedVoucher')
				const params = {
					orgId: this.$consts.orgId,
					cardType: this.voucher.cardType,
                    cardNo: this.voucher.cardNo,
                    verifyData: this.voucher.faceOrderId || this.$consts.ORG_ID
				}
				getArchiveHome(params).then(res => {
					if(res.resultCode !== this.$consts.RESULT_SUCCESS){
                        showToast('人脸认证校验失败')
                        this.$Router.back()
                        return;
                    }
                    localStorage.removeItem('needFaceVerify')
                    this.homeInfo = res.data || {}
                    localStorage.setItem(this.$consts.HEALTH_ARCHIVE_GLOBLE_ID, this.homeInfo.globalId);
				})
            },
            // 验证人脸识别结果
            verifyFaceId(verifyData) {
                const requestParams = {
                    orgId: this.$consts.orgId,
                    cardType: this.voucher.cardType,
                    cardNo: this.voucher.cardNo,
                    bindSession: this.$consts.BIND_USER_SESSION.NEED,
                    verifyData: verifyData
                }
                verifyFaceIdentity(requestParams).then((res) => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS || res.data.verifyStatus !== true) {
                        if (res.errorCode !== this.$consts.HEALTH_ARCHIVE_VERIFY_FAILED && res.errorCode !== this.$consts.HEALTH_ARCHIVE_SESSION_FAILED) {
                            this.$utils.alert('人脸认证校验失败');
                            this.$Router.back()
                            return
                        }
                    }
                    //  验证人脸成功后，手动保存faceOrderId到本地缓存的电子健康卡（因去掉了选择健康卡的入口）
                    const faceId = getItem('faceOrderId') || ''
                    const newVoucher = { ...this.voucher, faceOrderId: faceId }
                    setItem('selectedVoucher', newVoucher)
                    //  清除faceOrderId 本地数据
                    removeItem('faceOrderId')
                    //返回健康档案首页
                    // localStorage.setItem('pushUrl', 'HealthArchive')
                    // this.$router.replace({name: 'index'})
                });
            },
			toPage(url){
				this.$Router.push({ name: url })
			}
		}
	}
</script>

<style lang="scss" scoped>
.scroll{
    background: #fff;
}
.health-archive{
height: inherit;
&-header{
    height: 6.7rem;
    background:linear-gradient(90deg,rgba(71,184,255,1) 0%,rgba(42,141,255,1) 100%);
}
&-area{
    padding: 0.6rem;
    .archive-org{
        background:rgba(255,255,255,0.1);
        border-radius:0.7rem;
        color:rgba(255,255,255,1);
        p{
            font-size:0.6rem;
            font-weight:300;
            padding: 0.3rem 0.8rem;
        }
        span{
            font-size:0.6rem;
            font-weight:400;
        }
    }
}
&-user{
    @include display-flex;
    padding: 0 0 0.85rem 0.8rem;
    .user-logo{
        background: #fff;
        border-radius: 100%;
        width: 2.65rem;
        height: 2.65rem;
        margin-right: 0.8rem;
        padding: 0.175rem;
        img{
            width: 100%;
            height: 100%;
            border-radius: 100%;
        }
    }
    .user-info{
        @include display-flex;
        @include justify-content(space-between);
        flex-direction: column;
        color: #fff;
        flex: 1;
        &-area{
            @include display-flex;
            .user-tips{
                position: relative;
                img{
                    width: 1.3rem;
                    height: 1.3rem;
                    position: absolute;
                    bottom: 0;
                    &:nth-child(2){
                        left: 1.6rem;
                    }
                    &:nth-child(3){
                        left: 3.4rem;
                    }
                }
            }
        }
        p{
            font-size: 1.2rem;
            font-weight: 600;
            margin-right: 0.75rem;
            display: inline-block;
        }
        .family-doc{
            font-size: 0.6rem;
            font-weight: 300;
        }
    }
    
}
.health-archive-content{
    padding: 0.6rem;
}
.health-recorde{
    @include display-flex;
    @include align-items(center);
    height:4.55rem;
    background:rgba(255,255,255,1);
    box-shadow:0px 0.2rem 0.6rem 0px rgba(0,0,0,0.1);
    border-radius:0.8rem;
    &-col{
        @include flex(1);
        text-align: center;
        p:nth-child(1){
            font-size:1.4rem;
            font-weight:500;
            color:#2A8DFF;
        }
        p:nth-child(2){
            font-size:0.7rem;
            font-weight:500;
            color:rgba(108,108,108,1);
            padding-top: 0.25rem;
        }
        span{
            font-size:0.6rem;
            font-weight:400;
            color:rgba(108,108,108,1);
        }
        &-border{
            border-width: 0 1px 0 1px;
            border-color: #e1e1e1;
            border-style: solid;
        }
    }
}
.menu-info-row{
    @include display-flex;
    flex-wrap: wrap;
    padding-top: 0.6rem;
}
.menu-info-col{
    width: 50%;
    height: 3.4rem;
    margin-bottom: 0.6rem;
    &:nth-child(2n+1){
        .menu-info-col-area{
            margin: 0 0.375rem 0 0;
        }
    }
    &:nth-child(2n){
        .menu-info-col-area{
            margin: 0 0 0 0.375rem;
        }
    }
    &-area{
        @include display-flex;
        background:rgba(255,255,255,1);
        box-shadow:0px 0.2rem 0.6rem 0px rgba(0,0,0,0.1);
        border-radius:0.8rem;
        height: 100%;
        @include align-items(center);
        .menu-img{
            width: 1.8rem;
            height: 1.8rem;
            display: inline-block;
            margin-right: 0.4rem;
            border-radius: 0.4rem;
            text-align: center;
            line-height: 1.8rem;
            margin-left: 0.6rem;
            @include display-flex;
            @include align-items(center);
            @include justify-content(center);
            .svg-class{
                color: #fff;
                font-size: 1rem;
                width: 1rem;
                height: 1rem;
            }
        }
        .menu-title{
            @include display-flex;
            @include justify-content(space-between);
            flex-direction: column;
            flex: 1;
            p:nth-child(1){
                font-size:0.8rem;
                font-weight:500;
                color:rgba(60,60,60,1);
            }
            p:nth-child(2){
                font-size:0.6rem;
                font-weight:300;
                color:rgba(156,156,156,1);
            }
        }
    }
}
.health-bottom{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(156,156,156,1);
    text-align: center;
    position: fixed;
    bottom: 0.8rem;
    left: 0;
    right: 0;
}
}
.health-user{
  background:linear-gradient(180deg,rgba(71,184,255,1) 0%,rgba(42,141,255,1) 100%);
}
.health-opc{
  background:linear-gradient(360deg,rgba(0,202,204,1) 0%,rgba(11,179,241,1) 99%);
}
.health-hos{
  background:linear-gradient(360deg,rgba(107,106,253,1) 0%,rgba(122,121,255,1) 100%);
}
.health-tijian{
  background:rgba(35,184,153,1);
}
.health-gongwei{
  background:rgba(88,207,255,1);
}
</style>
