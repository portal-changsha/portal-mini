
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let devInfo = mpvue.getSystemInfoSync()
const extend = function (target, param) {
  for (var key in param) {
    if (param.hasOwnProperty(key)) {
      const targetValue = target[key]
      const paramValue = param[key]
      if (typeof targetValue === 'object' && typeof paramValue === 'object') {
        extend(targetValue, paramValue)
      } else {
        target[key] = param[key]
      }
    }
  }
}
const store = new Vuex.Store({
  state: {
    mapHeight: devInfo.windowHeight - 42,
    travelName: '',
    travelDate: [],
    tabIndex: 0,
    fromIndex: false,
    regDate: {} //  选择的挂号日期
  },
  mutations: {
    updateParam (state, payload) {
      if (!payload || !payload.namespace) {
        return
      }
      var namespace = payload.namespace
      state.param[namespace] = state.param[namespace] || {}
      extend(state.param[payload.namespace], payload)
    },
    clearParam (state, namespace) {
      if (!namespace) {
        return
      }
      state.param[namespace] = null
      if (namespace === 'all') {
        state.param = {}
      }
    },
    calHeight: (state, value = 42) => {
      const obj = state
      obj.mapHeight = devInfo.windowHeight - value
    },
    setTabIndex: (state, value) => {
      state.tabIndex = value
    },
    setFromIndex: (state, value) => {
      state.fromIndex = value
    },
    setHospitalList: (state, value) => {
      const obj = state
      obj.hospitalList = value
    },
    setRegDate: (state, value) => {
      const obj = state
      obj.regDate = value
    }
  },
  getters: {
    getTabIndex: (state) => {
      return state.tabIndex
    },
    getFromIndex: (state) => {
      return state.fromIndex
    },
    getHospitalList: (state) => {
      return state.hospitalList
    },
    getRegDate: (state) => {
      return state.regDate
    }
  }
})

export default store
