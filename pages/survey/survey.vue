<template>
  <div class="survey app">
   <ul class="field-list">
      <li>
        <span>就诊医院</span>
        <span>{{queryParams.hospitalName}}</span>
      </li>
      <li>
        <span>就诊科室</span>
        <span>{{medicalInfo.deptName | formatDeptName}}</span>
      </li>
      <li>
        <span>就诊时间</span>
        <span>{{medicalInfo.visitDate}}</span>
      </li>
    </ul>
    <div class="survey-name">您本次对我院提供的就医服务是否满意？</div>
    <div class="survey-content">
      <ul>
        <li v-for="(item,index) in level" @click="choose(item.degree)" :key="index" :class="{isChoose: current === item.degree}">
          <p>{{item.title}}</p>
          <div>
              <img v-for="(img, i) in item.degree" :src="current === item.degree ?item.activeSrc : item.src" alt="" :key="i">
          </div>
        </li>
      </ul>
    </div>
    <div style="background: #fff;" class="confirm" v-if="medicalInfo.isEvaluative ==='0'">
      <textarea class="input-area" @input="descInput" v-model="desc" maxlength="20" placeholder="请对医院的服务做出评价"></textarea>
      <div class="input-area-tips">{{txtVal}}/20</div>
    </div>
    <div class="reason" v-if="medicalInfo.isEvaluative !=='0' && medicalInfo.evaluation !==''">
        您的理由：{{medicalInfo.evaluation}}
    </div>
    <div class="ok-wrap" v-if="medicalInfo.isEvaluative ==='0'">
        <button @click="submitEvaluate">提交</button>
    </div>
  </div>
</template>
<script>
import { submitEvaluation } from '@/services/synthesis.js'
import config from '@/config/index.js'
import { showModal } from '@/utils/uniApi.js'
import pushMixin from '@/mixins/pushMixin.js'
const BASE_IMG_URL = config.VUE_APP_IMG_URL
export default {
  mixins:[pushMixin],
  data: function () {
    return {
      level: [{
        title: '满意',
        src: BASE_IMG_URL + 'grayStar.png',
        activeSrc: BASE_IMG_URL + 'whiteStar.png',
        degree: 3
      }, {
        title: '一般',
        src: BASE_IMG_URL + 'grayStar.png',
        activeSrc: BASE_IMG_URL + 'whiteStar.png',
        degree: 2
      }, {
        title: '不满意',
        src: BASE_IMG_URL + 'grayStar.png',
        activeSrc: BASE_IMG_URL + 'whiteStar.png',
        degree: 1
      }],
      current: 3,
      txtVal: 0,
      desc: '',
	  medicalInfo: {}
    }
  },
  onLoad () {
    this.$nextTick(() => {
		const url = '/app/satisfaction/query'
		this.initData(url, this.queryParams, 'get').then(res => {
			if(res.resultCode === this.$consts.RESULT_SUCCESS){
				this.medicalInfo = res.data[0]
				for(let i = 0; i < this.level.length; i++){
					if(this.level[i].degree === +this.medicalInfo.degree){
						this.current = this.level[i].degree
						break
					}
				}
			}
		})
	})
  },
  methods: {
    choose (degree) {
      if (this.medicalInfo.isEvaluative ==='0') {
        this.current = degree
      }
    },
    submitEvaluate () {
      if (this.current === 1 && this.desc === '') {
        showModal('提示', '请输入您对医院服务的评价', false)
        return
      }
      submitEvaluation({
		  orgId: this.queryParams.orgId,
		  hospitalId: this.queryParams.hospitalId,
		  areaId: this.queryParams.areaId,
		  deptId: this.medicalInfo.deptId,
		  deptName: this.medicalInfo.deptName,
		  doctId: this.medicalInfo.doctId,
		  doctName: this.medicalInfo.doctName,
		  regId: this.medicalInfo.regId,
		  cardNo: this.queryParams.cardNo,
		  cardType: this.queryParams.cardType,
		  name:this.medicalInfo.name,
		  degree:this.current,
		  evaluation:this.desc,
	  }).then((res) => {
		  if(res.resultCode === this.$consts.RESULT_SUCCESS){
			  this.$set(this.medicalInfo,'isEvaluative', '1' )
			  showModal('提示', '您的评价已提交,感谢您的配合与支持', false)
		  }else{
			  showModal('提示', '评价提交失败,请重新提交', false)
		  }
	  })
    },
    descInput () {
      this.txtVal = this.desc.length
    }
  }
}
</script>
<style lang="scss" scoped>
.app{
	background: $common-background-color;
}
.survey{
  height: inherit;
  background: #eff2f5;
  .survey-name {
    text-align: center;
    margin: 1rem 0.5rem 2rem 0.5rem;
    height: 2rem;
    line-height: 2rem;
    border-bottom: 1px solid #d7d7d7;
    color:#808080;
    font-size: 0.75rem;
  }
  .survey-content{
    padding: 0 0.75rem;
    ul{
      display: flex;
      justify-items: center;
      justify-content: space-between;
      li{
          width:5.25rem;
          height: 2.5rem;
          background: #fff;
          border: 1px solid #BEBEBE;
          border-radius: .2rem;
          text-align: center;
          flex: 1;
          &:nth-child(2){
            margin: 0 1rem;
          }
          p{
            color: #999999;
            font-size: 0.75rem;
            margin: 0.25rem 0 0.1rem 0;
          }
          img{
            width: 0.6rem;
            height: 0.55rem;
            margin-right: 0.1rem;
          }
      }
      .isChoose{
        background: #51A8EC;
        border: 0;
        color: #fff;
        p{
          color: #fff;
        }
      }
    }
    
  }

  .confirm {
    margin: 1.25rem 0.5rem;
    height: 9rem;
    border-radius:0.25rem;
    overflow: hidden;
    padding: 0.75rem;
    .input-area {
      letter-spacing:1px;
      height: 7rem;
      font-size: 0.75rem;
      width: 100%;
    }
    .input-area-tips {
      padding:0 0.5rem;
      letter-spacing:1px;
      color:#cccccc;
      text-align: right;
      font-size: 0.6rem;
    }
  }
  .reason {
    margin:1.25rem 0.5rem;
  }
  .ok-wrap{
    position: fixed;
    height: 2.5rem;
    bottom: 0.5rem;
    left: 0.5rem;
    right: 0.5rem;
    button {
        letter-spacing:1px;
        margin: 0;
        width: 100%;
        box-shadow: none;
        background: #51A8EC;
        color: #fff;
        font-size: 0.9rem;
    }
  }
}
</style>

