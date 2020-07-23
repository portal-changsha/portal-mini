<template>
<div class="triage-body">
    <div class="body-bg f-small" :class="[bodyBg, judgePhone]">
        <!-- 男/女正面身体 -->
		<div style="height: 100%;" v-if="crowdId != $consts.TRIAGE.CROWD.CHILDREN && isHead== $consts.TRIAGE.HEAD.NO && direct == $consts.TRIAGE.DIRECT.FRONT">
			<body-item sex="m" :bodyId="[0,7,8,9,10,11,15,16,17]" @show-head="onShowHead($consts.TRIAGE.HEAD.YES)"></body-item>
		</div>
        <!-- 男/女反面身体 -->
		<div style="height: 100%;" v-if="crowdId != $consts.TRIAGE.CROWD.CHILDREN && isHead== $consts.TRIAGE.HEAD.NO && direct ==$consts.TRIAGE.DIRECT.BACK">
			<body-item sex="m" :bodyId="[12,13,14]"></body-item>
		</div>
        <!-- 男/女头部 -->
		<div style="height: 100%;" v-if="crowdId != $consts.TRIAGE.CROWD.CHILDREN && isHead== $consts.TRIAGE.HEAD.YES">
			<body-item sex="m" :bodyId="[1,2,3,4,5,6]"></body-item>
		</div>
        <!--275-->
        <!-- 儿童正面身体 -->
		<div style="height: 100%;" v-if="crowdId == $consts.TRIAGE.CROWD.CHILDREN && isHead== $consts.TRIAGE.HEAD.NO && direct == $consts.TRIAGE.DIRECT.FRONT">
			<body-item sex="c" :bodyId="[0,7,8,9,10,16,11,15,17]"  @show-head="onShowHead($consts.TRIAGE.HEAD.YES)"></body-item>
		</div>
        <!-- 儿童反面身体 -->
		<div style="height: 100%;" v-if="crowdId == $consts.TRIAGE.CROWD.CHILDREN && isHead== $consts.TRIAGE.HEAD.NO && direct == $consts.TRIAGE.DIRECT.BACK">
			<body-item sex="c" :bodyId="[12,13,14]"></body-item>
		</div>
        <!-- 儿童头部 -->
		<div style="height: 100%;" v-if="crowdId == $consts.TRIAGE.CROWD.CHILDREN && isHead== $consts.TRIAGE.HEAD.YES">
			<body-item sex="c" :bodyId="[1,2,3,4,5,6]"></body-item>
		</div>
    </div>
    <div class="sex-menu">
        <div id="triagebody-menu-sex0" class="sex-icon icon-nan" :class="{active: crowdId == $consts.TRIAGE.CROWD.MAN}" @click="onSelectedSex($consts.TRIAGE.CROWD.MAN)"></div>
        <div id="triagebody-menu-sex1" class="sex-icon icon-nv" :class="{active: crowdId == $consts.TRIAGE.CROWD.WOMAN}" @click="onSelectedSex($consts.TRIAGE.CROWD.WOMAN)"></div>
        <div id="triagebody-menu-sex2" class="sex-icon icon-er" :class="{active: crowdId == $consts.TRIAGE.CROWD.CHILDREN}" @click="onSelectedSex($consts.TRIAGE.CROWD.CHILDREN)"></div>
    </div>
    <div id="triagebody-direct-change" class="direct-menu f-strong"><span @click="onDirectChanged()">{{directText}}</span></div>
</div>
</template>
<script>
import bodyItem from './bodyItem.vue'

export default {
    provide() {
        return {
            triageBody: this
        };
    },
    props: {
        crowdId:  {
            type: String,
            default(){
                return '1'
            }
        },
        bodyId:  {
            type: String,
            default(){
                return '1'
            }
        },
        direct:  {
            type: String,
            default(){
                return this.$consts.TRIAGE.DIRECT.FRONT
            }
        },
        isHead:  {
            type: String,
            default(){
                return this.$consts.TRIAGE.HEAD.NO
            }
        }
    },
    components: {
        bodyItem
    },
    computed: {
        directText() {
            let directText = ''
            if (this.isHead === this.$consts.TRIAGE.HEAD.YES) {
                directText = '显示全身图'
            } else {
                this.direct === this.$consts.TRIAGE.DIRECT.FRONT ? directText = '显示背面' : directText = '显示正面'
            }
            return directText
        },
        bodyBg() {
            let bodyBgClass = ''
            if (this.isHead === this.$consts.TRIAGE.HEAD.YES) {
                bodyBgClass = `bg${this.crowdId-1}${this.isHead}`
            } else {
                bodyBgClass = `bg${this.crowdId-1}${this.isHead}${this.direct}`
            }
            return bodyBgClass
        },
        judgePhone(){
            if (/ipad|iphone|mac/i.test(navigator.userAgent) && this.isHead === this.$consts.TRIAGE.HEAD.YES){
                return 'iosbg'
            }
        }
    },
    methods: {
        onSelectedSex(crowdId) {
            //人群切换 身体部分默认为头部
            this.$emit("tab-change",{crowdId,bodyId:'1'})
        },
        onDirectChanged() {
            if (this.isHead === this.$consts.TRIAGE.HEAD.YES) {
                this.$emit("save-head",this.$consts.TRIAGE.HEAD.NO)
            } else {
                let direct
                this.direct === this.$consts.TRIAGE.DIRECT.FRONT ? direct = this.$consts.TRIAGE.DIRECT.BACK : direct = this.$consts.TRIAGE.DIRECT.FRONT
                this.$emit("save-direct",direct)
            }
        },
        onShowHead(isHead){
            this.$emit("save-head",isHead)
        }
    },
}
</script>
<style lang="scss">
.triage-body {
    position: absolute;
    left: 0.75rem;
    right: 0.75rem;
    top: 3rem;
    bottom: 2.5rem;
    .sex-menu {
        position: absolute;
        left: 0;
        bottom: 2.3rem;
        width: 1.95rem;
        height: 6.85rem;
        .sex-icon {
            width: 1.95rem;
            height: 1.95rem;
            margin-bottom: 0.5rem;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
        .icon-nan {
            background-image: url($redirect-url + $img-file-path + "big-nan-button.png");
            &.active {
                background-image: url($redirect-url + $img-file-path + "big-nan-button-active.png");
            }
        }
        .icon-nv {
            background-image: url($redirect-url + $img-file-path + "big-nv-button.png");
            &.active {
                background-image: url($redirect-url + $img-file-path + "big-nv-button-active.png");
            }
        }
        .icon-er {
            background-image: url($redirect-url + $img-file-path + "big-er-button.png");
            &.active {
                background-image: url($redirect-url + $img-file-path + "big-er-button-active.png");
            }
        }
    }
    .direct-menu {
        position: absolute;
        left: 0;
        bottom: 0.8rem;
        text-align: center;
        width: 100%;
        height: 1.5rem;
        line-height: 1.5rem;
    }
    .body-bg {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 2.3rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    .bg01 {
        background-size: 60%;
        background-image: url($redirect-url + $img-file-path + "bg-nantou.png");
    }
    .bg000 {
        background-image: url($redirect-url + $img-file-path + "bg-nanbei.png");
    }
    .bg001 {
        background-image: url($redirect-url + $img-file-path + "bg-nanzheng.png");
    }
    .bg11 {
        background-size: 65%;
        background-image: url($redirect-url + $img-file-path + "bg-nvtou.png");
    }
    .bg100 {
        background-image: url($redirect-url + $img-file-path + "bg-nvbei.png");
    }
    .bg101 {
        background-image: url($redirect-url + $img-file-path + "bg-nvzheng.png");
    }
    .bg21 {
        background-size: 50%;
        background-image: url($redirect-url + $img-file-path + "bg-childtou.png");
    }
    .bg200 {
        background-size: 50%;
        background-image: url($redirect-url + $img-file-path + "bg-childbei.png");
    }
    .bg201 {
        background-size: 50%;
        background-image: url($redirect-url + $img-file-path + "bg-childzheng.png");
    }
    .iosbg{
        background-size: 50%;
    }
}
</style>
