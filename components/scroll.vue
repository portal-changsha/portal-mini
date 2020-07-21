<template>
    <div class="scroll">
        <slot v-if="!hasError"></slot>
        <div v-if="hasError" class="net-warning-pic" @click="refresh()" :key="hasError">
            <p class="net-warning-text">网络连接失败</p>
            <p class="net-warning-tips">请检查网络连接是否正常</p>
        </div>
    </div>
</template>
<script>
    export default{
        methods:{
            refresh(){
                navigator.onLine && window.location.reload()
            }
        },
        data(){
            return {
                hasError: false
            }
        },
        mounted(){
            uni.$on('net-error',() => {
                this.hasError = true;
            })
        },
		beforeDestroy(){
			uni.$off('net-error')
		}
    }
</script>
<style lang="scss">
;
.scroll {
    position: absolute;
    bottom: 0;
    width: 100%;
    overflow-y: auto;
    top: 0;
    padding-bottom: 0.5rem;
    background: $common-bg-color;
    //顶部有查询框
    &.from-query {
        top: $queryline-height;
    }
    &.to-tab {
        bottom: $tab-height;
    }
    &.to-bottom-btn {
        bottom: $btn-bottom-height;
    }
    &.bg-white {
        background-color: white;
    }
    //顶部有更多按钮
    &.from-query-more {
        top: $query-more-height;
    }
}

.net-warning-pic {
    background: url($redirect-url + $img-file-path + "net-error.png") no-repeat top center;
    background-size: 111px 111px;
    margin: 3rem auto 0 auto;
    width: 100%;
}

.net-warning-text {
    font-size: 18px;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    padding-top: 6rem;
}

.net-warning-tips {
    font-size: 13px;
    text-align: center;
    color: $main-gray;
}
</style>