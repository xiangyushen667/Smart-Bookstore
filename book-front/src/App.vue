<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: { NavBar }
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  background-color: #f5f6fa;
  color: #333;
}
a { text-decoration: none; color: inherit; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.page-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #2c3e50;
}
</style>
