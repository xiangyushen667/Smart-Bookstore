<template>
  <header class="navbar">
    <div class="navbar-inner">
      <div class="logo" @click="$router.push('/')">
        <img src="/logo.png" alt="智慧书城" class="logo-img">
        <span class="logo-text">智慧书城</span>
      </div>

      <nav class="nav-menu">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/list" class="nav-item">全部图书</router-link>
      </nav>

      <div class="search-box">
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索图书名称 / 作者"
          @keyup.enter="handleSearch"
        >
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>

      <div class="user-area">
        <div class="cart-link" @click="goCart">
          <span class="cart-icon">🛒</span>
          <span class="cart-text">购物车</span>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </div>

        <template v-if="isLogin">
          <span class="welcome">你好，{{ username }}</span>
          <button class="logout-btn" @click="logout">退出</button>
        </template>
        <template v-else>
          <router-link to="/login" class="login-link">登录</router-link>
          <router-link to="/register" class="register-link">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NavBar',
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    ...mapState(['cartCount']),
    isLogin() {
      return !!localStorage.getItem('token')
    },
    username() {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return user.username || ''
    }
  },
  methods: {
    handleSearch() {
      const kw = this.keyword.trim()
      this.$router.push({ path: '/list', query: kw ? { keyword: kw } : {} })
    },
    goCart() {
      if (!this.isLogin) {
        this.$router.push({ path: '/login', query: { redirect: '/cart' } })
      } else {
        this.$router.push('/cart')
      }
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$store.commit('SET_CART_COUNT', 0)
      this.$router.push('/')
    }
  },
  mounted() {
    if (this.isLogin) {
      this.$store.dispatch('fetchCart')
    }
  }
}
</script>

<style scoped>
.navbar {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 30px;
}
.logo { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.logo-img { height: 36px; }
.logo-text { font-size: 20px; font-weight: bold; color: #e74c3c; }
.nav-menu { display: flex; gap: 20px; }
.nav-item {
  font-size: 15px;
  color: #333;
  padding: 6px 2px;
}
.nav-item.router-link-active { color: #e74c3c; font-weight: bold; }
.search-box { flex: 1; max-width: 380px; display: flex; }
.search-input {
  flex: 1;
  height: 36px;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 4px 0 0 4px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
}
.search-btn {
  height: 36px;
  padding: 0 18px;
  border: none;
  background: #e74c3c;
  color: #fff;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 14px;
}
.user-area { display: flex; align-items: center; gap: 16px; }
.cart-link {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}
.cart-icon { font-size: 20px; }
.cart-badge {
  position: absolute;
  top: -6px;
  right: -14px;
  background: #e74c3c;
  color: #fff;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  font-size: 12px;
  padding: 0 4px;
}
.welcome { font-size: 14px; color: #555; }
.logout-btn, .login-link, .register-link {
  font-size: 14px;
  cursor: pointer;
  background: none;
  border: none;
  color: #e74c3c;
}
.register-link {
  border: 1px solid #e74c3c;
  border-radius: 4px;
  padding: 4px 12px;
}
</style>
