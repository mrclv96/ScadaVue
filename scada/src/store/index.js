import Vue, { shallowReactive } from 'vue';
import Vuex from 'vuex';
import decode from 'jwt-decode';
import router from '@/router/index';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    usuario: null,
    snackbars: [],
    dashmode: null,
  },
  getters: {
    getDashmode(state){
      return state.dashmode
    }
  },
  mutations: {
    setToken(state,token){
      state.token=token
    },
    setUsuario(state,usuario){
      state.usuario=usuario
    },
    SET_SNACKBAR(state, snackbar){
      state.snackbars = state.snackbars.concat(snackbar);
    },
    setDashmode(state, dashmode){
      state.dashmode = dashmode
    }
  },
  actions: {
    guardarToken({commit},token){
      commit("setToken",token)
      commit("setUsuario", decode(token))
      localStorage.setItem("token",token)
    },
    autoLogin({commit}){
      let token = localStorage.getItem("token")
      if(token){
        commit("setToken",token)
        commit("setUsuario", decode(token))
        router.push({name: 'home'})
      }
      //router.push({name: 'home'})
    },
    salir({commit}){
      commit("setToken",null)
      commit("setUsuario", null)
      //commit("exptime", null)
      localStorage.removeItem("token")
      router.push({name: 'Login'})
      },
    autologoff({commit}){
      if (Date.now() >= decode.exp * 1000) {
        salir;
      }
    },
    setSnackbar({commit}, snackbar) {
      snackbar.showing = true;
      snackbar.color = snackbar.color || 'success';
      snackbar.timeout = snackbar.timeout || 3000;
      commit('SET_SNACKBAR',snackbar);
    },
    setDashmode({commit}, dashmode){
      commit('setDashmode', dashmode)
    }
  },
  modules: {
  }
})
