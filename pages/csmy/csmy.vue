<template>
    <div class="app">
        <scroll @refresh="refresh">
            <ul class="list">
                <li v-for="(item, index) in items" class="list-item arr-row def" @click="selectItem(item)" :key="index">
                    <div class="item-info">
                        <img :src="item.itemIcon" class="logo">
                        <div class="info">
                            <p class="f-large f-normal ellipsis">{{ item.itemTitle }}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </scroll>
    </div>
</template>
<script>
	import config from '@/config/index.js'
    export default {
        data() {
            return {
                items: [
                    {
                        itemTitle: '名医名科',
                        itemId: '1',
                        itemInfo: '名医名科',
                        itemIcon: config.VUE_APP_IMG_URL + 'mymk.png',
                        itemUrl: 'http://www.mybmall.com/index.php?g=Wap&m=Index&a=lists&classid=1175&token=ajrbpx1458269639&diymenu=1'
                    },
                    {
                        itemTitle: '健康长沙医路有你',
                        itemId: '2',
                        itemInfo: '健康长沙医路有你',
                        itemIcon: config.VUE_APP_IMG_URL + 'ylyn.png',
                        itemUrl: 'https://mp.weixin.qq.com/mp/homepage?__biz=MzU0NjAxOTUzOQ%3D%3D&hid=1&sn=4f0abd1e7a1cbfba7fed488d7f9f4545&scene=18'
                    }
                ]
            }
        },
        methods: {
            selectItem(item) {
				// #ifdef H5
				window.location.href = item.itemUrl
				// #endif
            },
        },
    }
</script>

<style lang="scss">

    .list {
        .list-item {
            &.def {
                padding-top: 0.25rem;
                padding-bottom: 0.25rem;
            }
            &.last {
                padding-right: 3.25rem !important;
                color: white;
                .continue {
                    position: absolute;
                    right: 0.75rem;
                    padding-right: 0.75rem;
                    color: white;
                    background: url($redirect-url + $img-file-path + "btn-big-right.png") right center no-repeat;
                    background-size: 0.375rem 0.675rem;
                }
            }
        }
    }

    .list-header {
        background-color: $main-blue;
    }

    .header {
        padding-top: 0.13rem;
        padding-bottom: 0.13rem;
        color: #999;
        font-size: 0.65rem !important;
        background-color: #eff2f5;
    }

    .border-none {
        li:first-child, li:last-child {
            border-bottom: none;
        }
    }

    .item-info {
        @include display-flex();
        @include align-items(center);
        height: 2.5rem;
        img {
            width: 10%;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
        .info {
            @include flex(1);
            @include ellipsis();
            width: 1px;
            padding-left: 0.5rem;
        }
    }
</style>