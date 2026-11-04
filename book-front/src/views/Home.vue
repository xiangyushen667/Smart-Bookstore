<template>
  <div class="home">
    <!-- 顶部横幅 -->
    <div class="banner">
      <div class="banner-content">
        <h1>欢迎来到智慧书城</h1>
        <p>精选计算机教材 · 一站式购书体验</p>
      </div>
    </div>

    <div class="container">
      <div class="section-head">
        <h2 class="section-title">热门推荐</h2>
        <router-link to="/list" class="more-link">查看全部 →</router-link>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else class="book-grid">
        <BookCard v-for="book in hotBooks" :key="book.id" :book="book" />
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from '../components/BookCard.vue'
import { getBooks } from '../api'

export default {
  name: 'Home',
  components: { BookCard },
  data() {
    return {
      hotBooks: [],
      loading: true
    }
  },
  created() {
    this.loadHotBooks()
  },
  methods: {
    async loadHotBooks() {
      try {
        const res = await getBooks()
        if (res.data.code === 200) {
          this.hotBooks = res.data.data.slice(0, 8)
        }
      } catch (e) {
        console.error('加载首页图书失败', e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.banner {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: #fff;
  padding: 60px 20px;
  text-align: center;
}
.banner h1 { font-size: 32px; margin-bottom: 12px; }
.banner p { font-size: 16px; opacity: 0.9; }
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 20px;
}
.section-title { font-size: 22px; color: #2c3e50; border-left: 4px solid #e74c3c; padding-left: 10px; }
.more-link { color: #e74c3c; font-size: 14px; }
.book-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.loading { text-align: center; padding: 60px 0; color: #999; }
</style>
