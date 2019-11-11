<template>
  <div class="survey">
   <ul class="field-list">
      <li>
        <span>就诊医院</span>
        <span>长沙市第八医院</span>
      </li>
      <li>
        <span>就诊科室</span>
        <span>内科门诊</span>
      </li>
      <li>
        <span>就诊时间</span>
        <span>2019-01-11 08:10</span>
      </li>
    </ul>
    <div class="survey-name">您本次对我院提供的就医服务是否满意？</div>
    <div class="survey-content">
      <ul>
        <li v-for="(item,index) in level" @click="choose(index)" :key="index" :class="{isChoose: current === index}">
          <p>{{item.title}}</p>
          <div>
              <img v-for="(img, i) in item.degree" :src="current === index ?item.activeSrc : item.src" alt="" :key="i">
          </div>
        </li>
      </ul>
    </div>
    <div style="background: #fff;" class="confirm" v-if="!isSubmit">
      <textarea class="input-area" v-if="!isSubmit" @input="descInput" v-model="desc" maxlength="20" placeholder="请对医院的服务做出评价"></textarea>
      <div class="input-area-tips" v-if="!isSubmit">{{txtVal}}/20</div>
    </div>
    <div class="reason" v-if="isSubmit && desc !== '' ">
        您的理由：{{desc}}
    </div>
    <div class="ok-wrap" v-if="!isSubmit">
        <button class="btn-ok" @click="submitEvaluate">提交</button>
    </div>
  </div>
</template>
<script>
// import { getItem, setItem } from '@/utils/store'
export default {
  data: function () {
    return {
      level: [{
        title: '满意',
        src: this.constant.LOCAL_IMG + 'grayStar.png',
        activeSrc: this.constant.LOCAL_IMG + 'whiteStar.png',
        degree: 3
      }, {
        title: '一般',
        src: this.constant.LOCAL_IMG + 'grayStar.png',
        activeSrc: this.constant.LOCAL_IMG + 'whiteStar.png',
        degree: 2
      }, {
        title: '不满意',
        src: this.constant.LOCAL_IMG + 'grayStar.png',
        activeSrc: this.constant.LOCAL_IMG + 'whiteStar.png',
        degree: 1
      }],
      satisfaction: '',
      current: 0,
      txtVal: 0,
      desc: '',
      isSubmit: false
    }
  },
  computed: {
    originImgUrl () {
      return this.constant.LOCAL_IMG
    }
  },
  onLoad () {
    let today = new Date()
    this.endDate = today.format('yyyy-MM-dd')
    today.setMonth(today.getMonth() - 3)
    this.startDate = today.format('yyyy-MM-dd')
  },
  methods: {
    choose (index) {
      if (!this.isSubmit) {
        this.current = index
      }
    },
    submitEvaluate () {
      if (this.current === 2 && this.desc === '') {
        this.tips = '请输入您对医院服务的评价'
        this.showTips = true
        return
      }
      if (this.satisfaction !== '') {
        this.tips = '您已评价过,无法重复评价'
        this.showTips = true
      }
      // surveyService.submitEvaluation({
      //   creatTime: this.currentTime,
      //   deptId: this.medicalInfo.deptId,
      //   deptName: this.medicalInfo.deptName,
      //   doctId: this.medicalInfo.doctId,
      //   doctName: this.medicalInfo.doctName,
      //   patientName: this.medicalInfo.patientName,
      //   visitId: this.medicalInfo.visitId,
      //   patientId: this.medicalInfo.patientId,
      //   degree: this.level[this.current].degree,
      //   evaluation: this.desc
      // }).then((res) => {
      //   if (res.resultCode == this.constant.RESULT_SUCCESS) {
      //     this.isSubmit = true
      //     this.tips = '您的评价已提交,感谢您的配合与支持'
      //     this.showTips = true
      //   } else {
      //     this.tips = '登记失败,请重新登记'
      //     this.showTips = true
      //   }
      // })
    },
    descInput () {
      this.txtVal = this.desc.length
    }
  }
}
</script>
<style lang="scss" scoped>
.survey{
  height: inherit;
  background: #eff2f5;
  .survey-name {
    text-align: center;
    margin: 20px 10px 40px 10px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #d7d7d7;
    color:#808080;
    font-size: 15px;
  }
  .survey-content{
    padding: 0 15px;
    ul{
      display: flex;
      justify-items: center;
      justify-content: space-between;
      li{
          width:105px;
          height: 50px;
          background: #fff;
          border: 1px solid #BEBEBE;
          border-radius: 4px;
          text-align: center;
          flex: 1;
          &:nth-child(2){
            margin: 0 20px;
          }
          p{
            color: #999999;
            font-size: 15px;
            margin: 5px 0 2px 0;
          }
          img{
            width: 12px;
            height: 11px;
            margin-right: 2px;
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
    margin: 25px 10px;
    height: 179px;
    border-radius:5px;
    overflow: hidden;
    padding: 15px 15px;
    .input-area {
      letter-spacing:1px;
      height: 140px;
      font-size: 15px;
      width: 100%;
    }
    .input-area-tips {
      padding:0 10px;
      letter-spacing:1px;
      color:#cccccc;
      text-align: right;
      font-size: 12px;
    }
  }
  .reason {
    margin:25px 10px;
  }
  .ok-wrap{
    position: fixed;
    height: 50px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    .btn-ok {
        letter-spacing:1px;
        margin: 0;
        width: 100%;
        box-shadow: none;
        background: #51A8EC;
        color: #fff;
        font-size: 18px;
    }
  }
}
</style>

