// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cardInfo: {}
  },
  mutations: {
    chooseCard: (state,value) => {
      const obj = state
      obj.cardInfo = value
    }
  },
  getters: {
    getCard: (state) => {
      return state.cardInfo
    }
  }
})

export default store
