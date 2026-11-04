<template>
  <div class="container">
    <h2 class="page-title">我的购物车</h2>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="cartList.length === 0" class="empty">
      <p>购物车还是空的</p>
      <router-link to="/list" class="go-list">去逛逛图书 →</router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-table">
        <div class="cart-row cart-head">
          <div class="col-book">图书</div>
          <div class="col-price">单价</div>
          <div class="col-count">数量</div>
          <div class="col-subtotal">小计</div>
          <div class="col-action">操作</div>
        </div>

        <div class="cart-row" v-for="item in cartList" :key="item.cartId">
          <div class="col-book">
            <img v-if="item.cover" :src="item.cover" class="item-cover">
            <span class="item-name">{{ item.name }}</span>
          </div>
          <div class="col-price">¥{{ Number(item.price).toFixed(2) }}</div>
          <div class="col-count">
            <button class="count-btn" @click="changeCount(item, -1)">-</button>
            <span class="count-num">{{ item.count }}</span>
            <button class="count-btn" @click="changeCount(item, 1)">+</button>
          </div>
          <div class="col-subtotal">¥{{ (Number(item.price) * item.count).toFixed(2) }}</div>
          <div class="col-action">
            <button class="del-btn" @click="removeItem(item)">删除</button>
          </div>
        </div>
      </div>

      <div class="cart-footer">
        <span class="total-label">合计：</span>
        <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
        <button class="checkout-btn" @click="checkout">去结算</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCart, updateCart, deleteCart } from '../api'

export default {
  name: 'Cart',
  data() {
    return {
      cartList: [],
      loading: true
    }
  },
  computed: {
    totalPrice() {
      return this.cartList.reduce((sum, item) => sum + Number(item.price) * item.count, 0)
    }
  },
  created() {
    this.loadCart()
  },
  methods: {
    async loadCart() {
      this.loading = true
      try {
        const res = await getCart()
        if (res.data.code === 200) {
          this.cartList = res.data.data
          this.$store.commit('SET_CART_LIST', this.cartList)
        }
      } catch (e) {
        console.error('加载购物车失败', e)
      } finally {
        this.loading = false
      }
    },
    async changeCount(item, delta) {
      const newCount = item.count + delta
      if (newCount < 1) {
        alert('数量不能小于1')
        return
      }
      try {
        const res = await updateCart(item.cartId, newCount)
        if (res.data.code === 200) {
          item.count = newCount
          this.$store.commit('SET_CART_LIST', this.cartList)
        }
      } catch (e) {
        console.error('修改数量失败', e)
      }
    },
    async removeItem(item) {
      if (!confirm(`确定删除《${item.name}》吗？`)) return
      try {
        const res = await deleteCart(item.cartId)
        if (res.data.code === 200) {
          this.cartList = this.cartList.filter(c => c.cartId !== item.cartId)
          this.$store.commit('SET_CART_LIST', this.cartList)
        }
      } catch (e) {
        console.error('删除失败', e)
      }
    },
    checkout() {
      alert('结算功能开发中，当前为课程演示项目')
    }
  }
}
</script>

<style scoped>
.loading, .empty { text-align: center; padding: 80px 0; color: #999; }
.empty p { font-size: 18px; margin-bottom: 16px; }
.go-list { color: #e74c3c; font-size: 14px; }
.cart-content { background: #fff; border-radius: 12px; padding: 20px; }
.cart-row {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}
.cart-head { font-size: 13px; color: #999; }
.col-book { flex: 3; display: flex; align-items: center; gap: 12px; }
.col-price { flex: 1; }
.col-count { flex: 1; display: flex; align-items: center; gap: 8px; }
.col-subtotal { flex: 1; color: #e74c3c; font-weight: bold; }
.col-action { flex: 1; }
.item-cover { width: 46px; height: 60px; object-fit: cover; border-radius: 4px; }
.item-name { font-size: 14px; }
.count-btn {
  width: 26px;
  height: 26px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.count-num { min-width: 28px; text-align: center; font-size: 14px; }
.del-btn {
  border: none;
  background: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 14px;
}
.cart-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
}
.total-label { font-size: 15px; }
.total-price { font-size: 24px; color: #e74c3c; font-weight: bold; }
.checkout-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 30px;
  font-size: 15px;
  cursor: pointer;
}
.checkout-btn:hover { background: #c0392b; }
</style>
