import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rolesList:[],
  },
  mutations: {
    setRolesList(state, list) {
      state.rolesList = list;
    },
    updateRoleRights(state,payload){
      let index = state.rolesList.findIndex(item => item.id === payload.id);
      state.rolesList[index].children = payload.data;
    }
  },
  actions: {
    setRolesList({commit},list){
      commit('setRolesList',list)
    },
    updateRoleRights({commit},payload){
      commit('updateRoleRights',payload)
    }
  },
  modules: {
  }
})
