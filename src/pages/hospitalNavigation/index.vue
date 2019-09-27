<template>
  <div class="hospitalSelect">

   <div class="mask" v-if="showArea" @click="showArea = false">
      <div class="hosArea" >
        <div class="title">请选择您要导航去的院区</div>
        <ul class="hosList">
          <li v-for="(item,i) in hosAreaList" :key="i" @click="selectArea(item)">
            {{item.areaName}}
          </li>
        </ul>
      </div>
    </div>

    <div class="search-bar">
      <icon class="searchicon" type="search" size="16" />
      <input type="text" placeholder="请输入您要搜索的医院" confirm-type="search" placeholder-class="holderStyle" v-model="searchKey" v-on:input="search" @blur="inputBlur">
    </div>

    <hisHospital v-on:toPage="toContinue"></hisHospital>

    <div v-if="hospitalList.length >0" style="width:100%;">
      <div class="hos-list row row-center" v-for="(item,index) in hospitalList" :key="index" @click="selectHospital(item)">
        <div class="hos-logo"><img :src="item.hospitalLogo?item.hospitalLogo: originImgUrl + 'hos-def-logo.png'" alt=""></div>
        <div class="hos-info">
          <p>{{item.hospitalName}}({{item.areaName}})</p>
          <p>{{item.levelDesc}}</p>
          <p>{{item.areaAddress}}</p>
        </div>
        <div class="cut-line"/>
        <div class="hos-location"><img :src="originImgUrl + 'icon-navigation-b.png'" alt=""></div>
      </div>
    </div>
    <no-record :condition="hospitalList.length === 0" :tips="'抱歉，暂无医院列表信息'"></no-record>
  </div>
</template>
<script>
  import hisHospital from '@/components/hisHospital'
  import NavList from '@/components/NavList'
  import NoRecord from '@/components/NoRecord'
  import { getHospitalList } from '@/service/hospital.service'
  import { setItem } from '@/utils/store'
  export default {
    data: function () {
      return {
        waitUrl: 'navigationMap',
        hospitalList: [],
        searchKey: '',
        showArea: false,
        hosAreaList: [],
        tempHosInfo: {}
      }
    },
    components: {
      hisHospital,
      NavList,
      NoRecord
    },
    computed: {
      originImgUrl () {
        return this.constant.LOCAL_IMG
      }
    },
    onShow () {
      this.getHospitalLists()
    },
    methods: {
      inputBlur () {
        if (this.searchKey !== '' && this.searchKey.length > 0) {
          this.search()
        } else {
          this.hospitalList = this.$store.getters.getHospitalList
        }
      },
      search (e) {
        if (this.searchKey === '' || this.searchKey === undefined || this.searchKey.length === 0) {
          this.hospitalList = this.$store.getters.getHospitalList
          return
        }
        this.$utils.throttle(this.formatHosList, 1000, 1000)()
      },
      formatHosList () {
        // if(this.hospitalList.length === 0) return
        let temp = []
        let key = this.searchKey
        let lists = this.$store.getters.getHospitalList
        for (let i = 0; i < lists.length; i++) {
          if (lists[i].name.indexOf(key) >= 0) {
            temp.push(lists[i])
          }
        }
        this.hospitalList = temp
      },
      //  选择医院
      async selectHospital (item) {
        //  将选择的医院信息保存在本地
        setItem('selectedHospital', item)
        //  跳转到对应的页面
        this.go(item)
      },
      go (item) {
        if (this.waitUrl === 'noredirect') {
          this.$utils.back(1)
          return
        }
        // this.waitUrl += '?latitude=' + item.latitude + '&longitude=' + item.longitude
        this.$utils.navigateTo(this.waitUrl)
      },
      //  获取医院列表
      async getHospitalLists (id) {
        let data = {
          hospitalLevel: '2'
        }
        let res = await getHospitalList(data)
        if (res.result === this.constant.RESULT_SUCCESS) {
          this.hospitalList = res.data
          //  将数据保存在vuex中
          this.$store.commit('setHospitalList', res.data)
        }
      },
      toContinue (e) {
        this.go()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .hospitalSelect{
    .search-bar{
      height: 50px;
      background: #fff;
      input{
        height: 32px;
        margin: 9px 15px;
        border: 1px solid #D6D6D6;
        border-radius: 5px;
        background: #EFF2F5;
        display: inline-block;
        width: 315px;
        font-size: 13px;
        // text-align: center;
        padding-left: 30px;
      }
      .searchicon{
        position:absolute;
        margin:18px 0;
        left:25px;
      }
    }
    .holderStyle{
      color: #999;
      font-size: 13px;
    }
    .hos-list{
      background: #fff;
      height: 60px;
      width: 100%;
      position: relative;
      margin-bottom: 2px;
      box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
      align-items: center;
      .hos-logo{
        padding: 0 15px;
        img{
          width: 34px;
          height: 34px;
          display: block;
        }
      }
      .hos-info{
        width: 80%;
        p:nth-child(1){
          margin-right: 30px;
          color: #111;
          font-size: 15px;
          line-height: 16px;
        }
        p:nth-child(2),p:nth-child(3){
          color: #666666;
          font-size: 13px;
          line-height: 14px;
        }
      }
      .cut-line{
        float:left;width: 1px;height: 35px; background: #3ccfff;
      }
      .hos-location{
        width: 15%;
        right: 0;
        text-align: center;
        img{
          width: 20px;
          height: 20px;
          margin: 0 auto;
        }
      }
    }
    .mask{
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 998;
      background: #3b3b3b;
      opacity: .8;
    }
    .hosArea{
      background: #fff;
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 999;
      .title{
        color: #51A8EC;
        font-size: 15px;
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
      }
      .hosList{
        height: 180px;
        overflow: auto;
        padding: 0 15px;
        li{
          height: 60px;
          line-height: 60px;
          padding-left: 15px;
          margin-bottom: 10px;
          box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
          color: #333;
          font-size: 15px;
          border: 1px solid #eaeaea;
          border-radius: 5px;
        }
      }
    }
  }
</style>
