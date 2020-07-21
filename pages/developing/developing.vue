<template>
    <div class="app" id="gwi-developing">
        <div class="developing">
            <p>正在建设中</p>
            <p class="small">功能正在进行建设中，敬请期待</p>
        </div>
    </div>
</template>
<script>
    module.exports = {
        data: function() {
            return {
            }
        }
    }
</script>
<style lang="scss">
    .developing {
        margin-top: 6rem;
        padding-top: 36%;
        color: #333333;
        font-size: 0.9rem;
        text-align: center;
        background: url($redirect-url + $img-file-path + "yemian-bg.png") top center no-repeat;
        background-size: 30%;
        .small {
            padding-top: 0.25rem;
            color: #666666;
            font-size: 0.65rem;
        }
    }
</style>