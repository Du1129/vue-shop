import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    breadcrumpList:[],
    rolesList:[],
  },
  mutations: {
    updateBreadcrumpList(state, list) {
      state.breadcrumpList = list;
    },
    setRolesList(state, list) {
      state.rolesList = list;
    }
  },
  actions: {
    setRolesList({commit},list){
      commit('setRolesList',list)
    },
  },
  modules: {
  }
})
