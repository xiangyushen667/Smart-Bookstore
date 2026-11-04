/**
 * 生产环境发布脚本
 * 在 8080 端口托管前端构建产物 dist，并代理 /api 与 /upload 到后端 3000
 * 启动方式：node serve.js
 */
const express = require('express')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
const port = 8080
const BACKEND = 'http://localhost:3000'

// 代理 API 请求与封面图片到后端（http-proxy-middleware v4 写法，保留原路径前缀）
app.use(createProxyMiddleware({
  target: BACKEND,
  changeOrigin: true,
  pathFilter: ['/api', '/upload']
}))

// 托管前端构建产物
app.use(express.static(path.join(__dirname, 'dist')))

// Vue Router history 模式回退（Express 5 兼容写法）
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`图书销售网站已发布：http://localhost:${port}`)
})
