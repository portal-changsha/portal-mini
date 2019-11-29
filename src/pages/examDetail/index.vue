<template>
  <div class="report container">
    <div class="title row row-center">
      <div><img v-if="baseSrc" :src="baseSrc + 'presentation.png'" alt=""></div>
      <p>{{params.labItem}}</p>
    </div>
    <ul class="field-list">
      <li>
        <span>医院</span>
        <span>{{params.hospitalName}}</span>
      </li>
      <li>
        <span>卡号</span>
        <span>电子健康卡/{{labInfo.cardNo}}</span>
      </li>
      <li>
        <span>报告单号</span>
        <span>{{params.labId}}</span>
      </li>
      <li>
        <span>出单时间</span>
        <span>{{labInfo.labTime}}</span>
      </li>
    </ul>

    <div class="content">
      <div class="area" v-for="(item,i) in reportList" :key="i">
        <div class="list row row-center" @click="item.showDetailInfo = !item.showDetailInfo">
          <p>血管检查</p>
          <div class="arrow">
            <img :class="{trans_arrow: item.showDetailInfo}" :src="baseSrc + 'more_gray_dwon.png'" alt="">
          </div>
        </div>
        <ul class="detail" v-show="item.showDetailInfo">
          <li class="row row-center">检查部位：</li>
          <li class="row row-center">{{item.checkPart}}</li>
          <li class="row row-center">检查所见：</li>
          <li class="row row-center">{{item.discription}}</li>
          <li class="row row-center">诊疗意见及建议：</li>
          <li class="row row-center">{{item.diagnosis}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import { getReportExamDetail } from '@/service/report.service'
export default {
  data () {
    return {
      params: {},
      labInfo: {
        labTime: '',
        cardNo: ''
      },
      reportList: [],
      baseSrc: this.constant.LOCAL_IMG
    }
  },
  onLoad () {
    let q = this.$root.$mp.query
    this.params = q.params ? JSON.parse(q.params) : {}
    if (this.params.labTime) {
      this.labInfo.labTime = this.$utils.formatpayDate(this.params.labTime)
      this.labInfo.cardNo = this.$utils.doutted(this.params.cardNo)
    }
    this.getExamDetailInfo()
  },
  methods: {
    async getExamDetailInfo () {
      this.reportList = []
      let res = await getReportExamDetail(this.params)
      if (res.result === this.constant.RESULT_SUCCESS) {
        if (!res.data || res.data.length === 0) return
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].showDetailInfo = i === 0
        }
        this.reportList = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report{
  .title{
    height: 55px;
    width: auto;
    padding: 0 15px;
    background: #fff;
    img{
      width: 33px;
      height: 33px;
    }
    p{
      padding-left: 10px;
      color: #333;
      font-size: 18px;
    }
  }
  .field-list{
    margin: 10px 0;
  }
  .content{
    .area{
      margin-top:10px;
      .list{
        height: 45px;
        background:rgba(254,255,255,1);
        box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
        padding: 0 15px;
        justify-content: space-between;
        width: auto;
        p{
          color: #51A8EC;
          font-size: 15px;
        }
       .arrow{
          img{
            width: 13px;
            height: 8px;
          }
        }
      }
      .detail{
        padding: 0 15px;
        background:#F8F8F8;
        box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
        li{
          min-height: 40px;
          font-size: 15px;
          &:nth-child(2n){
            color: #333333;
          }
          &:nth-child(2n+1){
            color: #999;
          }
        }
      }
    }
  }
  .trans_arrow{
    transform: rotate(180deg)
  }

}
</style>
