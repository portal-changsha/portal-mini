import Vue from 'vue'
import loadingComponent from './loading.vue'

const LoadingConstructor = Vue.extend(loadingComponent)

const instance = new LoadingConstructor({
  el: document.createElement('div')
})
 // 默认隐藏
instance.show = false
const loading = {
  // 显示方法
  show() { 
    instance.show = true
    document.body.appendChild(instance.$el)
  },
  // 隐藏方法
  hide() {
    instance.show = false
  }
}

export default {
  install() {
    if (!Vue.$loading) {
      Vue.$loading = loading
    }
    Vue.mixin({
      created() {
        this.$loading = Vue.$loading
      }
    })
  }
}