<template>
  <div class="container">
    <h2 class="page-title">全部图书</h2>

    <!-- 分类筛选栏 -->
    <div class="filter-bar">
      <span class="filter-label">分类：</span>
      <button
        :class="['filter-btn', activeCategory === '' && 'active']"
        @click="changeCategory('')"
      >全部</button>
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['filter-btn', activeCategory === cat && 'active']"
        @click="changeCategory(cat)"
      >{{ cat }}</button>
    </div>

    <!-- 图书列表 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="bookList.length === 0" class="empty">没有找到相关图书</div>
    <div v-else class="book-grid">
      <BookCard v-for="book in bookList" :key="book.id" :book="book" />
    </div>
  </div>
</template>

<script>
import BookCard from '../components/BookCard.vue'
import { getBooks, getCategories } from '../api'

export default {
  name: 'BookList',
  components: { BookCard },
  data() {
    return {
      bookList: [],
      categories: [],
      activeCategory: '',
      loading: true
    }
  },
  created() {
    this.loadCategories()
    this.loadBooks()
  },
  watch: {
    '$route.query.keyword'() {
      this.loadBooks()
    }
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getCategories()
        if (res.data.code === 200) this.categories = res.data.data
      } catch (e) {
        console.error('加载分类失败', e)
      }
    },
    async loadBooks() {
      this.loading = true
      try {
        const params = {}
        if (this.activeCategory) params.category = this.activeCategory
        const kw = this.$route.query.keyword
        if (kw) params.keyword = kw
        const res = await getBooks(params)
        if (res.data.code === 200) {
          this.bookList = res.data.data
        }
      } catch (e) {
        console.error('加载图书失败', e)
      } finally {
        this.loading = false
      }
    },
    changeCategory(cat) {
      this.activeCategory = cat
      this.loadBooks()
    }
  }
}
</script>

<style scoped>
.filter-bar {
  background: #fff;
  border-radius: 8px;
  padding: 14px 18px;
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.filter-label { font-size: 14px; color: #666; }
.filter-btn {
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 16px;
  padding: 5px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn:hover { border-color: #e74c3c; color: #e74c3c; }
.filter-btn.active {
  background: #e74c3c;
  color: #fff;
  border-color: #e74c3c;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.loading, .empty { text-align: center; padding: 60px 0; color: #999; font-size: 15px; }
</style>
