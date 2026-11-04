/**
 * 图书销售网站 - 后端主服务
 * 接口列表：
 *   POST   /api/register            注册
 *   POST   /api/login               登录
 *   GET    /api/book                图书列表（支持?category=分类）
 *   GET    /api/book/:id            图书详情
 *   GET    /api/cart                购物车列表（需登录）
 *   POST   /api/cart                加入购物车（需登录）
 *   PUT    /api/cart                修改购物车数量（需登录）
 *   DELETE /api/cart/:cartId        删除购物车项（需登录）
 */
const express = require('express')
const cors = require('cors')
const path = require('path')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const pool = require('./db')

const app = express()
const port = 3000
const SECRET_KEY = 'bookshop_secret_2024'

app.use(cors())
app.use(express.json())
// 静态资源：图书封面图放在 public/upload 下，通过 /upload/xxx.png 访问
app.use(express.static(path.join(__dirname, 'public')))

// ---------- 通用：从请求头解析 token ----------
function getPayload(req) {
  const header = req.headers.authorization || ''
  const token = header.split(' ')[1]
  if (!token) return null
  try {
    return jwt.verify(token, SECRET_KEY)
  } catch (e) {
    return null
  }
}

// ---------- 注册 ----------
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.json({ code: 400, msg: '用户名和密码不能为空' })
  }
  try {
    const hash = bcrypt.hashSync(password, 10)
    await pool.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, hash])
    res.json({ code: 200, msg: '注册成功' })
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      res.json({ code: 400, msg: '用户名已存在' })
    } else {
      res.json({ code: 500, msg: '服务器错误' })
    }
  }
})

// ---------- 登录 ----------
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.json({ code: 400, msg: '用户名和密码不能为空' })
  }
  const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username])
  if (rows.length === 0) {
    return res.json({ code: 400, msg: '用户不存在' })
  }
  const user = rows[0]
  if (!bcrypt.compareSync(password, user.password)) {
    return res.json({ code: 400, msg: '密码错误' })
  }
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' })
  res.json({ code: 200, token, user: { id: user.id, username: user.username } })
})

// ---------- 图书列表（支持分类筛选、关键词搜索） ----------
app.get('/api/book', async (req, res) => {
  const { category, keyword } = req.query
  let sql = 'SELECT * FROM book WHERE 1=1'
  const params = []
  if (category) {
    sql += ' AND category = ?'
    params.push(category)
  }
  if (keyword) {
    sql += ' AND (name LIKE ? OR author LIKE ?)'
    const kw = `%${keyword}%`
    params.push(kw, kw)
  }
  const [list] = await pool.query(sql, params)
  res.json({ code: 200, data: list })
})

// ---------- 图书详情 ----------
app.get('/api/book/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM book WHERE id = ?', [req.params.id])
  if (rows.length === 0) {
    return res.json({ code: 404, msg: '图书不存在' })
  }
  res.json({ code: 200, data: rows[0] })
})

// ---------- 图书分类列表 ----------
app.get('/api/categories', async (req, res) => {
  const [rows] = await pool.query('SELECT DISTINCT category FROM book')
  res.json({ code: 200, data: rows.map(r => r.category) })
})

// ---------- 购物车：列表 ----------
app.get('/api/cart', async (req, res) => {
  const payload = getPayload(req)
  if (!payload) return res.json({ code: 401, msg: '未登录或登录已过期' })
  const [list] = await pool.query(
    `SELECT c.id AS cartId, c.book_id, c.count, b.name, b.cover, b.price, b.author
     FROM cart c LEFT JOIN book b ON c.book_id = b.id
     WHERE c.user_id = ?`, [payload.id])
  res.json({ code: 200, data: list })
})

// ---------- 购物车：加入 ----------
app.post('/api/cart', async (req, res) => {
  const payload = getPayload(req)
  if (!payload) return res.json({ code: 401, msg: '未登录或登录已过期' })
  const { book_id } = req.body
  const [has] = await pool.query(
    'SELECT * FROM cart WHERE user_id = ? AND book_id = ?', [payload.id, book_id])
  if (has.length > 0) {
    await pool.query(
      'UPDATE cart SET count = count + 1 WHERE user_id = ? AND book_id = ?', [payload.id, book_id])
  } else {
    await pool.query(
      'INSERT INTO cart (user_id, book_id, count) VALUES (?, ?, 1)', [payload.id, book_id])
  }
  res.json({ code: 200, msg: '加入购物车成功' })
})

// ---------- 购物车：修改数量 ----------
app.put('/api/cart', async (req, res) => {
  const payload = getPayload(req)
  if (!payload) return res.json({ code: 401, msg: '未登录或登录已过期' })
  const { cartId, count } = req.body
  if (!cartId || !count || count < 1) {
    return res.json({ code: 400, msg: '参数错误' })
  }
  await pool.query('UPDATE cart SET count = ? WHERE id = ? AND user_id = ?', [count, cartId, payload.id])
  res.json({ code: 200, msg: '修改成功' })
})

// ---------- 购物车：删除 ----------
app.delete('/api/cart/:cartId', async (req, res) => {
  const payload = getPayload(req)
  if (!payload) return res.json({ code: 401, msg: '未登录或登录已过期' })
  await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.cartId, payload.id])
  res.json({ code: 200, msg: '删除成功' })
})

// ---------- 启动 ----------
app.listen(port, () => {
  console.log(`后端服务已启动：http://localhost:${port}`)
  console.log('图书封面地址示例：http://localhost:3000/upload/xxx.png')
})
