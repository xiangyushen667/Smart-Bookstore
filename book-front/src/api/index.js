/**
 * 后端接口封装
 * 开发环境：通过 /api 走 vue-cli 代理到 http://localhost:3000
 * 生产环境：直接请求 http://localhost:3000/api（后端已开启 CORS）
 */
import axios from 'axios'

const isDev = process.env.NODE_ENV === 'development'
const BASE_URL = isDev ? '/api' : 'http://localhost:3000/api'

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
})

// 请求拦截：自动携带 token
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截：统一处理 401
request.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const register = data => request.post('/register', data)
export const login = data => request.post('/login', data)
export const getBooks = params => request.get('/book', { params })
export const getBookDetail = id => request.get(`/book/${id}`)
export const getCategories = () => request.get('/categories')
export const getCart = () => request.get('/cart')
export const addCart = bookId => request.post('/cart', { book_id: bookId })
export const updateCart = (cartId, count) => request.put('/cart', { cartId, count })
export const deleteCart = cartId => request.delete(`/cart/${cartId}`)
