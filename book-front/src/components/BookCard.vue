<template>
  <div class="book-card" @click="$router.push(`/book/${book.id}`)">
    <div class="cover-wrap">
      <img v-if="book.cover" :src="book.cover" class="cover" :alt="book.name">
      <div v-else class="cover-placeholder">暂无封面</div>
    </div>
    <div class="info">
      <h3 class="name">{{ book.name }}</h3>
      <p class="author">{{ book.author }}</p>
      <div class="price-row">
        <span class="price">¥{{ Number(book.price).toFixed(2) }}</span>
        <span class="category">{{ book.category }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    book: { type: Object, required: true }
  }
}
</script>

<style scoped>
.book-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}
.cover-wrap { height: 250px; background: #f0f0f0; }
.cover { width: 100%; height: 100%; object-fit: cover; }
.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
.info { padding: 12px 14px; }
.name {
  font-size: 14px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 6px;
}
.author { font-size: 12px; color: #999; margin-bottom: 8px; }
.price-row { display: flex; justify-content: space-between; align-items: center; }
.price { font-size: 16px; color: #e74c3c; font-weight: bold; }
.category { font-size: 12px; color: #999; }
</style>
