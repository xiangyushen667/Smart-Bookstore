<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">用户注册</h2>
      <div class="form-item">
        <label>用户名</label>
        <input v-model="form.username" type="text" placeholder="请输入用户名">
      </div>
      <div class="form-item">
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="请输入密码">
      </div>
      <div class="form-item">
        <label>确认密码</label>
        <input v-model="form.confirm" type="password" placeholder="请再次输入密码">
      </div>
      <button class="auth-btn" :disabled="submitting" @click="doRegister">
        {{ submitting ? '注册中...' : '注 册' }}
      </button>
      <p class="auth-tip">
        已有账号？
        <router-link to="/login" class="auth-link">去登录</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { register } from '../api'

export default {
  name: 'Register',
  data() {
    return {
      form: { username: '', password: '', confirm: '' },
      submitting: false
    }
  },
  methods: {
    async doRegister() {
      const { username, password, confirm } = this.form
      if (!username || !password) {
        alert('请输入用户名和密码')
        return
      }
      if (password !== confirm) {
        alert('两次输入的密码不一致')
        return
      }
      this.submitting = true
      try {
        const res = await register({ username, password })
        if (res.data.code === 200) {
          alert('注册成功，请登录')
          this.$router.push('/login')
        } else {
          alert(res.data.msg || '注册失败')
        }
      } catch (e) {
        console.error('注册失败', e)
        alert('注册失败，请检查网络或后端服务')
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
