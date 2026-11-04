<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">用户登录</h2>
      <div class="form-item">
        <label>用户名</label>
        <input v-model="form.username" type="text" placeholder="请输入用户名" @keyup.enter="doLogin">
      </div>
      <div class="form-item">
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="请输入密码" @keyup.enter="doLogin">
      </div>
      <button class="auth-btn" :disabled="submitting" @click="doLogin">
        {{ submitting ? '登录中...' : '登 录' }}
      </button>
      <p class="auth-tip">
        还没有账号？
        <router-link to="/register" class="auth-link">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { login } from '../api'

export default {
  name: 'Login',
  data() {
    return {
      form: { username: '', password: '' },
      submitting: false
    }
  },
  methods: {
    async doLogin() {
      if (!this.form.username || !this.form.password) {
        alert('请输入用户名和密码')
        return
      }
      this.submitting = true
      try {
        const res = await login(this.form)
        if (res.data.code === 200) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', JSON.stringify(res.data.user))
          this.$store.dispatch('fetchCart')
          alert('登录成功')
          // 登录成功后回到之前想去的页面（如购物车）
          const redirect = this.$route.query.redirect || '/'
          this.$router.push(redirect)
        } else {
          alert(res.data.msg || '登录失败')
        }
      } catch (e) {
        console.error('登录失败', e)
        alert('登录失败，请检查网络或后端服务')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 380px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.auth-title { text-align: center; margin-bottom: 28px; color: #2c3e50; }
.form-item { margin-bottom: 18px; }
.form-item label { display: block; font-size: 14px; margin-bottom: 6px; color: #555; }
.form-item input {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
}
.form-item input:focus { border-color: #e74c3c; }
.auth-btn {
  width: 100%;
  height: 42px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  margin-top: 6px;
}
.auth-btn:hover { background: #c0392b; }
.auth-btn:disabled { background: #ccc; cursor: not-allowed; }
.auth-tip { text-align: center; margin-top: 16px; font-size: 13px; color: #999; }
.auth-link { color: #e74c3c; }
</style>
