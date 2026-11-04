/**
 * 一键初始化：建库建表 + 导入图书数据
 * 用法：node scripts/db-init.js
 * 注意：此脚本中的 password 需与 db.js 中的密码保持一致
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const mysql = require('mysql2/promise')

const MYSQL_PASSWORD = '123456'  // TODO: 改成你本机 MySQL root 密码（与 db.js 一致）

async function main() {
  // 1. 执行 init.sql 建库建表
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: MYSQL_PASSWORD,
    multipleStatements: true
  })
  const sql = fs.readFileSync(path.join(__dirname, '../sql/init.sql'), 'utf8')
  await conn.query(sql)
  await conn.end()
  console.log('[1/2] 数据库 book_db 初始化完成')

  // 2. 导入图书数据
  execSync('node scripts/import.js', { cwd: path.join(__dirname, '..'), stdio: 'inherit' })
  console.log('[2/2] 图书数据导入完成')
}

main().catch(e => {
  console.error('初始化失败：', e.message)
  console.error('请检查 MySQL 服务是否启动、密码是否正确（book-server/db.js 和 scripts/db-init.js）')
  process.exit(1)
})
