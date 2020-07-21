<template>
    <div>
        <div v-show="step === 0">
            <div class="card-area">
                <ul>
                    <li>
                        <img :src="userIcon" alt="">
                        <input type="text" placeholder="请输入真实姓名" v-model="userInfo.name">
                    </li>
                    <li>
                        <img :src="idIcon" alt="">
                        <input style="width: 75%;" type="text" placeholder="请输入身份证号" v-model="userInfo.idCardNo">
                        <button class="upload-card" @click="step = 1">
                            <img :src="cameraIcon" alt="">
                        </button>
                    </li>
                    <li @click="showNationWindow = true">
                        <img style="width: .8rem;margin: .75rem 0 0 1.2rem;" :src="nationIcon" alt="">
						<div style="padding-left:3rem;">
							<picker @change="selectNation" :value="userInfo.nation" :range="nationList">
								<view class="uni-input">{{userInfo.nation}}</view>
							</picker>
						</div>
                    </li>
                    <div class="card-btn">
                        <button @click="validInfo()">确 认</button>
                    </div>
                    <div class="one-step-bind-card" type="button" @click="goBindMoreCard">已有健康卡，一键快速关联</div>
                </ul>
            </div>
        </div>
        <!-- 上传身份证模式 -->
        <div v-show="step === 1">
            <div class="upload-btn">
                <button @click="uploadIdCard"></button>
            </div>
            <div class="require">
                <h5>拍摄要求: </h5>
                <div class="require-tip">
                    <p>1、垂直拍摄, 证件边框完整</p>
                </div>
                <div class="require-tip">
                    <p>2、避免证件反光, 模糊</p>
                </div>
            </div>
        </div>

        <!-- 身份识别 -->
        <div v-show="step === 2">
            <div class="ocr-content">
                <div class="card-img" id="idCardPhoto" @click="step = 1">
                    <img :src="cardIcon">
                </div>
                <div style="height:10px;background: #EFF2F5;"></div>
                <div class="ocr-list">
                    <ul>
                        <li>
                            <span>姓名</span>
                            <input type="text" v-model="userInfo.name">
                        </li>
                        <li>
                            <span>性别</span>
                            <input type="text" v-model="userInfo.sex">
                        </li>
                        <li>
                            <span>民族</span>
                            <input type="text" v-model="userInfo.nation">
                        </li>
                        <li>
                            <span>身份证号</span>
                            <input type="text" v-model="userInfo.idCardNo">
                        </li>
                        <li>
                            <span>身份证地址</span>
                            <input type="text" v-model="userInfo.address">
                        </li>
                    </ul>
                </div>
                <div class="register-btn">
                    <button @click="validInfo()">确认身份信息, 填写手机号</button>
                </div>
            </div>
        </div>
		
        <div class="note">
            <p style="margin-bottom: 2px">注意事项：</p>
            <p>1、必须要有身份证的用户才能建立健康卡；</p>
            <p>2、支持本人及家属办卡；</p>
            <p>3、1张身份证最多只能在三个微信号上绑定；</p>
            <p>4、用户一旦绑定，必须绑定7天后才能删除健康卡；</p>
            <p>5、每个微信号 “我的健康卡” 列表中最多展示10张健康卡信息；</p>
            <p>6、只有首次绑定电子健康卡的微信号才能在 “我的健康卡” 列表中展现并删除电子健康卡。</p>
        </div>
    </div>
</template>
<script>
	import assert from '@/mixins/assign.js'
	import config from '@/config/index.js'
	import national from '@/common/national.js'
	import { showToast } from '@/utils/uniApi.js'
	import { wechatConfig, chooseImage, uploadImage, getLocalImage } from '@/utils/wxJsSdk.js'
	import { getOcrInfo } from '@/services/voucher.js'
    const checkForm = function (data) {
        if (data.name === null || data.name.trim().length === 0) {
            return '输入姓名不能为空';
        }
        if (data.name.trim().length > 50) {
            return '输入姓名不能过长';
        }
        if (data.idCardNo.length === 0) {
            return '身份证号不能为空';
        }
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (data.idCardNo === null || !(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(data.idCardNo.toUpperCase()))) {
            return '身份证号输入有误';
        }
        if (data.nation === null || data.nation === '') {
            return '民族不能为空';
        }
    }

    export default {
		mixins:[assert],
        data() {
            return {
                userInfo: {
                    name: '',
                    nation: '汉族',
                    idCardNo: ''
                },
                step: 0,
                idCardImg: '',
                userIcon: config.VUE_APP_IMG_URL + 'user.png',
                idIcon: config.VUE_APP_IMG_URL + 'ID.png',
                nationIcon: config.VUE_APP_IMG_URL + 'nationIcon.png',
                cameraIcon: config.VUE_APP_IMG_URL + 'camer.png',
                cardIcon: config.VUE_APP_IMG_URL + 'uploadCardAgain.png',
                nationList: national
            }
        },
        methods: {
            selectNation(e) {
				console.log(e.target.value)
                this.userInfo.nation = national[e.target.value]
            },
            validInfo() {
                let obj = this.userInfo
                let errorMsg = checkForm(obj);
                if (errorMsg) {
					showToast(errorMsg)
                    return
                }
                //  保存用户信息
				this.$store.dispatch('paramStore/updateParam', {
					namespace: 'completeCard',
					ocrInfo: this.userInfo
				})

                //配置回调地址
                const redirect_uri = location.href.split('checkInfomation')[0] + 'completeCard';
				// const redirect_uri = 'https://csmh.hngwmt.com/base'
                const src = 'https://health.tengmed.com/open/getUserCode?redirect_uri=' +  encodeURIComponent(redirect_uri)
				// #ifdef H5
				// window.location.href = src
				window.open(src)
				// #endif
                // if (this.$utils.devIsIos()) {
                //     window.location.href = src
                // } else {
                //     this.$router.push({name: 'tempJump', params: {src: src}})
                // }
            },
            uploadIdCard() {
                //  1.先调用签名接口
                const wxSignParams = {
                    orgId: this.$consts.ORG_ID,
                    url: location.href.split("#")[0]
                }
				wechatConfig(wxSignParams, () => {
					chooseImage().then(res => {
						this.uploadImg(res.localIds[0])
					})
				})
            },
            //2.上传图片
            uploadImg(localId) {
				console.log(localId)
				uploadImage(localId).then(res => {
					//缓存默认上传图片Id
					if (res.serverId) {
						this.getLocalImgData(localId, res.serverId)
					}else {
						showToast('图片上传失败')
					}
				}).catch(e => {
					showToast('图片上传失败')
				})
            },
            //3.获取本地图片
            getLocalImgData(localId, serverId) {
				getLocalImage(localId).then(res => {
					const localData = res.localData;
					if (localData.indexOf('data:image') !== 0) {
					    //判断是否有这样的头部
					    this.cardIcon = 'data:image/jpeg;base64,' + localData
					} else {
						this.cardIcon = localData
					}
					console.log('ocr...')
					this.verifyOcrInfo(serverId)
				}).catch(() => {
					showToast('获取失败')
				})
            },

            //4.OCR验证
            verifyOcrInfo(serverId) {
				console.log(serverId)
                //5.调用后台OCR识别接口
                getOcrInfo({
                    mediaId: serverId
                }).then((res) => {
                    if (res.resultCode !== this.$consts.RESULT_SUCCESS) return
                    this.idCardImg = res.localData; // localData是图片的base64数据，可以用img标签显示
                    this.step = 2
                    this.userInfo = res.data
                })
            },

            goBindMoreCard() {
                //配置回调地址
                const redirect_uri = location.href.split('checkInfomation')[0] + 'completeCard';
				// const redirect_uri = 'https://csmh.hngwmt.com/base'
                const src = 'https://health.tengmed.com/open/getHealthCardList?redirect_uri=' + encodeURIComponent(redirect_uri)
				// #ifdef H5
				// window.open(src)
				location.href = src
				// #endif
                // if (this.$utils.devIsIos()) {
                //     window.location.href = src
                // } else {
                //     this.$router.push({name: 'tempJump', params: {src: src}})
                // }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .upload-btn {
        padding: 0 1.6rem 1rem 1.6rem;
        margin-top: 1.25rem;
        height: 10rem;

        button {
            background: url($redirect-url + $img-file-path + "cardIcon.png") no-repeat center;
            background-size: 100% 100%;
            height: inherit;
            width: 100%;
        }
    }

    .require {
        padding: 0 .75rem;

        h5 {
            color: #51A8EC;
            font-size: 0.65rem;
        }

        .require-tip {
            margin-top: .2rem;

            p {
                color: #999;
                font-size: 0.65rem;
            }
        }
    }

    .ocr-content {
        .card-img {
            height: 10rem;
            position: relative;
            margin-top: .75rem;
            padding: 0 1.5rem .4rem 1.5rem;

            img {
                height: inherit;
                width: 100%;
                border-radius: 0.25rem;
            }
        }

        .ocr-list {
            padding: 0 0.75rem;

            li {
                height: 2.25rem;
                line-height: 2.25rem;
                border-bottom: 1px solid #eaeaea;
                display: flex;
                position: relative;

                span {
                    color: #666;
                    font-size: 0.75rem;
                }

                input {
                    flex: 1;
                    text-align: right;
                    border: 0;
                    padding: 0 1rem;
                }

                &:after {
                    content: '';
                    background: url($redirect-url + $img-file-path + "writing.png") no-repeat center;
                    background-size: 0.6rem 0.6rem;
                    position: absolute;
                    right: 0;
                    width: 0.55rem;
                    height: 0.6rem;
                    padding: .8rem 0;
                }
            }
        }
    }

    .register-btn {
        margin-top: 1.5rem;
        padding: 0 .75rem;

        button {
            background: #51A8EC;
            width: 100%;
            color: #fff;
            font-size: .9rem;
            height: 2.2rem;
            // box-shadow: 0 4px 10px #51A8EC;
        }
    }

    .card-area {
        ul {
            li {
                height: 2.4rem;
                line-height: 2.4rem;
                position: relative;
                margin: 0 .5rem;
                border-bottom: 1px solid #eaeaea;

                img {
                    width: 1.2rem;
                    margin: .7rem 0 0 1rem;
                    position: absolute;
                }

                input {
                    border: 0;
                    height: 2.4rem;
                    width: 100%;
                    padding-left: 3rem;
                }

                .disabledColor {
                    color: #eaeaea;
                }
            }
        }

        .card-btn {
            margin-top: 1.5rem;
            text-align: center;
            padding: 0 .75rem;

            button {
                width: 100%;
                background: #51A8EF;
                box-shadow: 0 0.15rem 0.3rem #51A8EF;
                height: 2.2rem;
            }
        }

        .upload-card {
            display: flex;
            align-items: center;
            background: transparent;
            border: 0;
            position: absolute;
            top: 0;
            right: 0;
            height: 2.4rem;

            img {
                padding-right: 0.25rem;
                width: 1rem;
                height: .75rem;
                margin: 0;
                position: relative;
            }

            span {
                color: #51A8EF;
                font-size: 0.65rem;
            }
        }
    }

    .one-step-bind-card {
        margin-top: 1.5rem;
        text-align: center;
        padding: 0 .75rem;
        color: #51A8EF;

    }

    .select-nation-title {
        display: flex;
        justify-content: space-between;
    }

    .select-nation-list {
        height: 100%;

    }
    .note {
        padding: 0.5rem;
        font-size: 0.65rem;
        color: #8e8f92;
    }
</style>

