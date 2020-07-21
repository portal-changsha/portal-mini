<template>
  <div class="report app">
    <div class="title row row-center">
      <div><img v-if="baseSrc" :src="baseSrc + 'presentation.png'" alt=""></div>
      <p>{{queryParams.examItem}}</p>
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
        <span>{{queryParams.examId}}</span>
      </li>
      <li>
        <span>出单时间</span>
        <span>{{queryParams.examTime | formatDate}}</span>
      </li>
    </ul>

    <div class="content">
      <div class="area" v-for="(item,i) in reportList" :key="i">
		  <uni-collapse accordion="true">
			  <uni-collapse-item :title="item.checkPart">
				  <ul class="detail">
				    <li class="row row-center">检查部位：</li>
				    <li class="row row-center">{{item.checkPart}}</li>
				    <li class="row row-center">检查所见：</li>
				    <li class="row row-center">{{item.discription}}</li>
				    <li class="row row-center">诊疗意见及建议：</li>
				    <li class="row row-center">{{item.diagnosis}}</li>
				  </ul>
			  </uni-collapse-item>
		  </uni-collapse>
      </div>
    </div>

  </div>
</template>

<script>
import config from '@/config/index.js'
import pushMixin from '@/mixins/pushMixin.js'
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
export default {
  mixins:[pushMixin],
  data () {
    return {
      reportList: [],
      baseSrc: config.VUE_APP_IMG_URL
    }
  },
  components:{
	uniCollapse,
	uniCollapseItem
  },
  onLoad () {
		console.log(this.queryParams)
		this.$nextTick(() => {
			const url = '/app/report/exam/detail'
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
  .title{
    height: 2.75rem;
    width: auto;
    padding: 0 0.75rem;
    background: #fff;
    img{
      width: 1.65rem;
      height: 1.65rem;
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
    .area{
      margin-top:0.5rem;
      .list{
        height: 2.25rem;
        background:rgba(254,255,255,1);
        box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
        padding: 0 0.75rem;
        justify-content: space-between;
        width: auto;
        p{
          color: #51A8EC;
          font-size: 0.75rem;
        }
      }
      .detail{
        padding: 0 0.75rem;
        background:#F8F8F8;
        box-shadow:0px 1px 2px 0px rgba(81,168,236,0.2);
        li{
          min-height: 2rem;
          font-size: 0.75rem;
		  padding: 0;
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
