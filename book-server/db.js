/**
 * 数据库连接配置
 * 请将 password 修改为你本机 MySQL 的 root 密码
 */
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',      // TODO: 改成你的MySQL root密码
  database: 'book_db',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
})

module.exports = pool
