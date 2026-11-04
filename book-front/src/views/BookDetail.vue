<template>
  <div class="container" v-if="book">
    <div class="detail-card">
      <div class="cover-wrap">
        <img v-if="book.cover" :src="book.cover" class="cover" :alt="book.name">
        <div v-else class="cover-placeholder">暂无封面</div>
      </div>

      <div class="detail-info">
        <h1 class="book-name">{{ book.name }}</h1>
        <div class="meta-grid">
          <p><span class="label">作者：</span>{{ book.author || '未知' }}</p>
          <p><span class="label">出版社：</span>{{ book.press || '未知' }}</p>
          <p><span class="label">ISBN：</span>{{ book.isbn || '未知' }}</p>
          <p><span class="label">出版时间：</span>{{ book.pub_date || '未知' }}</p>
          <p><span class="label">分类：</span>{{ book.category }}</p>
        </div>
        <p class="price">¥{{ Number(book.price).toFixed(2) }}</p>
        <div class="actions">
          <button class="btn-primary" @click="addToCart">加入购物车</button>
          <button class="btn-secondary" @click="$router.push('/list')">继续逛逛</button>
        </div>
      </div>
    </div>

    <div class="intro-card">
      <h3 class="intro-title">图书简介</h3>
      <div class="intro-content" v-html="book.info || '暂无简介'"></div>
    </div>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<script>
import { getBookDetail, addCart } from '../api'

export default {
  name: 'BookDetail',
  data() {
    return {
      book: null
    }
  },
  created() {
    this.loadDetail()
  },
  watch: {
    '$route.params.id'() {
      this.loadDetail()
    }
  },
  methods: {
    async loadDetail() {
      try {
        const res = await getBookDetail(this.$route.params.id)
        if (res.data.code === 200) {
          this.book = res.data.data
        } else {
          alert(res.data.msg || '图书不存在')
          this.$router.push('/list')
        }
      } catch (e) {
        console.error('加载详情失败', e)
      }
    },
    async addToCart() {
      if (!localStorage.getItem('token')) {
        this.$router.push({ path: '/login', query: { redirect: this.$route.fullPath } })
        return
      }
      try {
        const res = await addCart(this.book.id)
        if (res.data.code === 200) {
          this.$store.dispatch('fetchCart')
          this.$message = '已加入购物车'
        }
      } catch (e) {
        console.error('加入购物车失败', e)
      }
    }
  }
}
</script>

<style scoped>
.detail-card {
  display: flex;
  gap: 40px;
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 24px;
}
.cover-wrap {
  width: 300px;
  height: 360px;
  flex-shrink: 0;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}
.cover { width: 100%; height: 100%; object-fit: cover; }
.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
.detail-info { flex: 1; }
.book-name { font-size: 24px; margin-bottom: 20px; }
.meta-grid { margin-bottom: 20px; }
.meta-grid p { font-size: 14px; color: #555; margin-bottom: 8px; }
.label { color: #999; }
.price { font-size: 28px; color: #e74c3c; font-weight: bold; margin-bottom: 24px; }
.actions { display: flex; gap: 14px; }
.btn-primary, .btn-secondary {
  padding: 10px 26px;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  border: none;
}
.btn-primary { background: #e74c3c; color: #fff; }
.btn-primary:hover { background: #c0392b; }
.btn-secondary { background: #fff; color: #333; border: 1px solid #ddd; }
.intro-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 30px;
}
.intro-title { font-size: 18px; margin-bottom: 14px; }
.intro-content { font-size: 14px; line-height: 1.8; color: #444; }
.intro-content p { margin-bottom: 10px; }
.loading { text-align: center; padding: 80px 0; color: #999; }
</style>
