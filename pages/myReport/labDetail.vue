<template>
  <div class="report app">
    <div class="title row row-center">
      <div><img v-if="baseSrc" :src="baseSrc + 'presentation.png'" alt=""></div>
      <p>{{queryParams.labItem}}</p>
    </div>
    <ul class="field-list">
      <li>
        <span>医院</span>
        <span>{{queryParams.hospitalName}}</span>
      </li>
      <li>
        <span>卡号</span>
        <span>电子健康卡/{{queryParams.cardNo | dotted}}</span>
      </li>
      <li>
        <span>报告单号</span>
        <span>{{queryParams.labId}}</span>
      </li>
      <li>
        <span>出单时间</span>
        <span>{{queryParams.labTime | formatDate}}</span>
      </li>
    </ul>

    <div class="content">
      <div class="area" v-for="(item,index) in reportList" :key="index">
        <p style="padding-bottom:.4rem;">{{item.itemName}}</p>
        <div class="row">
          <div class="col">
            <p>项目单位</p>
            <p>{{item.itemUnit}}</p>
          </div>
          <div class="col">
            <p>结果</p>
            <p>{{item.result}}
            <img v-if="~~(item.result) > ~~(item.refRangeMax)" :src="baseSrc + 'biaoge-red.png'" alt="">
            <img v-if="~~(item.result) < ~~(item.refRangeMin)" :src="baseSrc + 'biaoge-green.png'" alt="">
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
import config from '@/config/index.js'
import pushMixin from '@/mixins/pushMixin.js'
export default {
  mixins:[pushMixin],
  data () {
    return {
      reportList: [],
      baseSrc: config.VUE_APP_IMG_URL
    }
  },
  onLoad () {
	  this.$nextTick(() => {
	  	const url = '/app/report/lab/common'
	  	this.initData(url, this.queryParams, 'get').then(res => {
	  		this.reportList = res.data
	  	})
	  })
  }
}
</script>

<style lang="scss" scoped>
	.app{
		background: $common-background-color;
	}
.report{
  min-height: 100%;
  background: rgb(239, 242, 245);
  .title{
    height: 2.75rem;
    width: auto;
    padding: 0 0.75rem;
    background: #fff;
    img{
      width: 1.5rem;
      height: 1.5rem;
    }
    p{
      padding-left: 0.5rem;
      color: #333;
      font-size: 0.9rem;
    }
  }
  .field-list{
    margin: 0.5rem 0;
  }
  .content{
    margin-bottom:2rem;
    padding: 1rem 1.25rem;
    background: #fff;
    .area{
      padding-bottom: 0.5rem;
      p{
        color: #222222;
        font-size: 0.75rem;
      }
      .row{
        background: #F5F5F5;
		padding: 0;
        .col{
          text-align: center;
          padding:0.45rem 0;
          p:nth-child(1){
            color: #999999;
            font-size: 0.75rem;
            padding-bottom:0.15rem;
          }
          p:nth-child(2){
            color: #222222;
            font-size: 0.75rem;
          }
          img{
            display: inline-block;
            width: 0.55rem;
            height: 0.75rem;
          }
        }
      }
    }
  }
}
.footer{
  height: 2rem;
  background: #fff;
  box-shadow:0px -1px 2px 0px rgba(81,168,236,0.2);
  position: fixed;
  width: 100%;
  bottom: 0;
  .row{
    height: inherit;
	padding: 0;
    .col{
      text-align: center;
      div{
        display:inline-block;
      }
      img{
        width: 0.55rem;
        height: 0.75rem;
      }
      span{
        color: #FD9C03;
        font-size: 0.75rem;
        padding-left: 0.25rem;
      }
    }
  }
}
</style>
