const state = {
  voucherInfo: {}
}

const mutations = {
  ADD_VOUCHER_INFO: (state, data) => {
	  state.voucherInfo = data
  },
  DEL_VOUCHER_INFO: (state) => {
	  state.voucherInfo = {}
  }
}
const actions = {
  addVoucherInfo({ commit }, data) {
    commit('ADD_VOUCHER_INFO', data)
  },
  delVoucherInfo({ commit }) {
    commit('DEL_VOUCHER_INFO')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
