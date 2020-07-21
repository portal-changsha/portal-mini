// 根据之前项目的profileStore.js改造
import { setItem, getItem } from '@/utils/localStore.js'
const extend = function(target, param){
    for(const key in param){
        if (Object.prototype.hasOwnProperty.call(param, key)) {
            const targetValue = target[key]
            const paramValue = param[key]
            if(typeof targetValue === 'object' && typeof paramValue === 'object'){
                extend (targetValue, paramValue)
            }else{
                target[key] = param[key]
            }
        }
    }
}

const state = {
  param: getItem('param') || {}
}

const mutations = {
  UPDATE_PARAM: (state, payload) => {
	  if(!payload || !payload.namespace){
		  return;
	  }
	  const namespace = payload.namespace
	  state.param[namespace] = {};
	  extend(state.param[namespace], payload)
	  setItem('param', state.param)
  },
  CLEAR_PARAM: (state, namespace) => {
	  if(!namespace){
		  return;
	  }
	  if('all' === namespace){
	  		state.param = {}
			return
	  }
	  state.param[namespace] = null;
  }
}
const actions = {
  updateParam({ commit }, data) {
    commit('UPDATE_PARAM', data)
  },
  clearParam({ commit }, namespace) {
    commit('CLEAR_PARAM', namespace)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
