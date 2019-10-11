
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let devInfo = mpvue.getSystemInfoSync()
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
