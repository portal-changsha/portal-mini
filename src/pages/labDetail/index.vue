<template>
  <div class="report">
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
      <div class="area" v-for="(item,index) in reportList" :key="index">
        <p>{{item.itemName}}</p>
        <div class="row">
          <div class="col">
            <p>项目单位</p>
            <p>{{item.itemUnit}}</p>
          </div>
          <div class="col">
            <p>结果</p>
            <p>{{item.result}}
            <img v-if="~~(item.result) >  ~~(item.refRangeMax)" :src="baseSrc + 'biaoge-red.png'" alt="">
            <img v-if="~~(item.result) <  ~~(item.refRangeMin)" :src="baseSrc + 'biaoge-green.png'" alt="">
            </p>
          </div>
          <div class="col">
            <p>参考范围</p>
            <p>{{item.refRange}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="row row-center">
        <div class="col">
          <div><img :src="baseSrc + 'biaoge-red.png'" alt=""></div>
          <span>表示偏高</span>
        </div>
        <div class="col">
          <div><img :src="baseSrc + 'biaoge-green.png'" alt=""></div>
          <span>表示偏低</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getReportLabDetail } from '@/service/report.service'
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
    this.getLabDetailInfo()
  },
  methods: {
    async getLabDetailInfo () {
      let res = await getReportLabDetail(this.params)
      if (res.result === this.constant.RESULT_SUCCESS) {
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
    margin-bottom:40px;
    padding: 20px 25px;
    background: #fff;
    .area{
      padding-bottom: 10px;
      p{
        color: #222222;
        font-size: 15px;
      }
      .row{
        background: #F5F5F5;
        .col{
          text-align: center;
          padding:9px 0;
          p:nth-child(1){
            color: #999999;
            font-size: 15px;
            padding-bottom:3px;
          }
          p:nth-child(2){
            color: #222222;
            font-size: 15px;
          }
          img{
            display: inline-block;
            width: 11px;
            height: 15px;
          }
        }
      }
    }
  }
}
.footer{
  height: 40px;
  background: #fff;
  box-shadow:0px -1px 2px 0px rgba(81,168,236,0.2);
  position: fixed;
  width: 100%;
  bottom: 0;
  .row{
    height: inherit;
    .col{
      text-align: center;
      div{
        display:inline-block;
      }
      img{
        width: 11px;
        height: 15px;
      }
      span{
        color: #FD9C03;
        font-size: 15px;
        padding-left: 5px;
      }
    }
  }
}
</style>
