<template>
    <div class="menu-list">
        <div class="menu-item">
            <div v-if="menuName !== ''" class="munu-title">
                <img :src="menuIcon" alt="">
                <p>{{menuName}}</p>
            </div>
            <div >
                <div v-if="type === 'hospitalService'" style="width: 100%;" class="menu-item-content">
                    <div class="hospital-menu">
                        <div class="hospital-menu-left" @click="toPage(menuInfo[0])">
                            <img :src="menuInfo[0].icon" alt="">
                            <p>{{menuInfo[0].name}}</p>
                        </div>
                        <div class="hospital-menu-rigth">
                            <div v-for="(item,index) in hosMenuInfo" :key="index" class="hospital-menu-rigth-content" @click="toPage(item)">
                              <img :src="item.icon" alt="">
                              <p>{{item.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="type !== 'hospitalService'" class="menu-item-content">
                  <div class="menu-wrap"  v-for="(item, index) in menuInfo" :key="index" @click="toPage(item)">
                    <div class="menu-content" :class="{noPaddingTop: index > 3}">
                        <img :src="item.icon" alt="">
                        <p :class="{fontweightbold: type === 'mainService'}">{{item.name}}</p>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { getItem } from '@/utils/store'
const REDIRECT_URL = process.env.REDIRECT_URL
const IMG_FILE_PATH = process.env.IMG_FILE_PATH
    export default {
      props: {
        type: String
      },
      data: function () {
        return {
          menuName: '',
          menuIcon: '',
          menuList: {
            'mainService': {
              'name': '',
              'icon': '',
              'lists': [
                { name: '挂 号', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon1_guahao.png', url: 'departDoctor', openUrl: '', isDeveloping: false, isNeedCard: false, isNeedSelectHos: true },
                { name: '门诊缴费', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon2_jiaofei.png', url: 'clinicUnpayList', openUrl: '', isDeveloping: false, isNeedCard: true, isNeedSelectHos: true },
                { name: '报告查询', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon3_baogao.png', url: 'myreport', openUrl: '', isDeveloping: false, isNeedCard: true, isNeedSelectHos: true },
                { name: '排队候诊', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon4_paidui.png', url: 'WaitDoctor', openUrl: '', isDeveloping: false, isNeedCard: true, isNeedSelectHos: true }
              ]
            },
            'multipleService':
                        {
                          'name': '综合服务',
                          'icon': REDIRECT_URL + IMG_FILE_PATH + 'icon0_title1.png',
                          'lists': [
                            { name: '挂号记录', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon5_guahaojilu.png', url: 'myRegister', openUrl: '', isDeveloping: false, isNeedCard: true },
                            { name: '缴费记录', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon6_jiaofeijilu.png', url: 'mypay', openUrl: '', isDeveloping: false, isNeedCard: true },
                            { name: '电子处方', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon7_chufang.png', url: '', openUrl: '', isDeveloping: true, isNeedCard: true },
                            { name: '满意度调查', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon8_manyidu.png', url: 'SurveyDoctorList', openUrl: '', isDeveloping: false, isNeedCard: true },
                            { name: '来院导航', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon10_yuannei.png', url: 'hospitalNavigation', openUrl: '', isDeveloping: false, isNeedCard: false },
                            { name: '院内导航', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon9_laiyuan.png', url: '', openUrl: '', isDeveloping: true, isNeedCard: false },
                            { name: '名医名科', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon11_mingyimingke.png', url: '', openUrl: 'http://www.mybmall.comindex.php?g=Wap&m=Index&a=lists&classid=1175&token=ajrbpx1458269639&diymenu=1', isDeveloping: false, isNeedCard: false },
                            { name: '长沙名医', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon12_changshamingyi.png', url: 'csmy', openUrl: '', isDeveloping: false, isNeedCard: false }
                          ]
                        },
            'hospitalService':
                        {
                          'name': '住院服务',
                          'icon': REDIRECT_URL + IMG_FILE_PATH + 'icon0_title2.png',
                          'lists': [
                            { name: '住院预缴金充值', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon21_zyfw.png', url: 'InpatientRecharge', openUrl: '', isDeveloping: false, isNeedCard: true },
                            { name: '住院费用查询', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon19_zyfycx.png', url: 'HospitalCostList', openUrl: '', isDeveloping: false, isNeedCard: true },
                            { name: '住院预缴金充值查询', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon20_zyczcx.png', url: 'MyRecharge', openUrl: '', isDeveloping: false, isNeedCard: true }
                          ]
                        },
            'otherService':
                        {
                          'name': '其它服务',
                          'icon': REDIRECT_URL + IMG_FILE_PATH + 'icon0_title3.png',
                          'lists': [
                            { name: '健康档案', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon13_jiankangdangan.png', url: '', openUrl: '', isDeveloping: true, isNeedCard: true },
                            { name: '家庭医生', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon14_jiatingyisheng.png', url: '', openUrl: '', isDeveloping: true, isNeedCard: true },
                            { name: '健康体检', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon15_yimiaojiezhong.png', url: 'HealthCheck', openUrl: '', isDeveloping: true, isNeedCard: false },
                            { name: '出生证明', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon16_chushengzhengming.png', url: '', openUrl: '', isDeveloping: true, isNeedCard: true },
                            { name: '医师资格', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon17_yishizige.png', url: '', openUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?response_type=code&appid=wx563314d21c5f5cbd&connect_redirect=1&redirect_uri=http://www.csylfw.com.cn/ratchet/centerCsyl.html&scope=snsapi_base&state=%E5%8C%BB%E6%8A%A4%E4%BA%BA%E5%91%98!~10!11!module/medical/p_person.html!!271632!0!11~0~6~10#wechat_redirect', isDeveloping: false, isNeedCard: false },
                            { name: '育儿知识', icon: REDIRECT_URL + IMG_FILE_PATH + 'icon18_yuerzhishi.png', url: '', openUrl: 'http://www.mybmall.com/index.php?g=Wap&m=Index&a=lists&classid=1187&token=ajrbpx1458269639&wecha_id=0', isDeveloping: false, isNeedCard: false }
                          ]
                        }
          }
        }
      },
      computed: {
        hosMenuInfo () {
          return this.menuList[this.type].lists.slice(1)
        },
        menuInfo () {
          return this.menuList[this.type].lists
        },
        menuName () {
          return this.menuList[this.type].name
        },
        menuIcon () {
          return this.menuList[this.type].icon
        }
      },
      methods: {
        toPage (item) {
          if (item.isDeveloping) {
            this.$utils.navigateTo('developing')
          } else if ((item.isNeedSelectHos && getItem('selectedHospital') === undefined) || item.url === 'departDoctor') {
            this.$utils.navigateTo('hospitalSelect', { waitUrl: item.url })
          } else {
            this.$utils.navigateTo(item.url)
          }
        }
      }
    }
</script>

<style lang="scss" scoped>
    $title-color: #438dff;
    .menu-list{
        background: #fff;
        padding: 0 15px;
        margin-bottom: 10px;
        .munu-title{
            @include display-flex;
            @include align-items(center);
            padding:5px 0;
            img{
                width: 24px;
                height: 27px;
            }
            p{
                padding-left: 7px;
                color: $title-color;
                font-weight: bold;
                font-size: 16px;
                font-family: PingFangSC-Medium;
            }
        }
        .menu-item-content{
            @include display-flex;
            flex-wrap: wrap;
            .menu-wrap{
                @include flex(0,0,25%);
                text-align: center;
                .menu-content{
                    padding: 22px 0;
                    img{
                        width: 39px;
                        height: 34px;
                        padding-bottom: 6px;
                    }
                    p{
                        font-size: 14px;
                        color: #666;
                        font-family: PingFangSC-Medium;
                    }
                    .fontweightbold{
                        font-family: PingFangSC-Bold;
                        font-size: 16px;
                        font-weight:bold;
                        color: #333;
                    }
                }
                .noPaddingTop{
                    padding-top: 0;
                }
            }

            .hospital-menu{
                @include display-flex;
                @include align-items(center);
                padding: 10px 0;
                overflow: hidden;
                &-left{
                    flex: 0 0 50%;
                    @include display-flex;
                    @include flex-direction(column);
                    @include justify-content(center);
                    background: #F4F4F4;
                    border-radius: 5px;
                    height: 130px;
                    img{
                        width: 62px;
                        height: 60px;
                        padding-bottom: 16px;
                        padding-left: 15px;
                    }
                    p{
                        padding-left: 15px;
                        color: #333;
                    }
                }
                &-rigth{
                    margin-left: 10px;
                    @include flex(0,0,50%);
                    img{
                        width: 30px;
                        height: 34px;
                    }
                    p{
                        font-size: 14px;
                        padding: 0 20px 0 10px;
                        color: #333;
                    }
                    &-content{
                        @include display-flex;
                        @include align-items(center);
                        height: 60px;
                        padding-left: 12px;
                        &:nth-child(1){
                            margin-bottom: 10px;
                        }
                        background: #F4F4F4;
                        border-radius: 5px;
                    }
                }
            }
        }
    }
</style>


