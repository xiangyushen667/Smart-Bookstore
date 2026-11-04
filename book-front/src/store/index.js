import Vue from 'vue'
import Vuex from 'vuex'
import { getCart } from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartCount: 0,
    cartList: []
  },
  mutations: {
    SET_CART_COUNT(state, n) {
      state.cartCount = n
    },
    SET_CART_LIST(state, list) {
      state.cartList = list
      state.cartCount = list.reduce((sum, item) => sum + item.count, 0)
    }
  },
  actions: {
    // 登录后从数据库同步购物车
    async fetchCart({ commit }) {
      try {
        const res = await getCart()
        if (res.data.code === 200) {
          commit('SET_CART_LIST', res.data.data)
        }
      } catch (e) {
        // 未登录时静默忽略
      }
    }
  }
})
