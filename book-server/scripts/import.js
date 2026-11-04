/**
 * 图书数据导入脚本
 * 读取课程素材 books.json 和 menu.json，将图书数据导入 book 表
 * 使用方法：node scripts/import.js
 */
const fs = require('fs')
const path = require('path')
const pool = require('../db')

// 素材路径（可自行修改）
const MATERIALS_DIR = 'C:/Users/详宇/Downloads/项目8素材/项目8素材/json'

async function main() {
  const booksJson = JSON.parse(fs.readFileSync(path.join(MATERIALS_DIR, 'books.json'), 'utf8'))
  const menuJson = JSON.parse(fs.readFileSync(path.join(MATERIALS_DIR, 'menu.json'), 'utf8'))

  // type -> 分类名 映射
  const typeMap = {}
  menuJson.forEach(m => { typeMap[m.id] = m.name })

  // 清空图书表
  await pool.query('DELETE FROM book')
  await pool.query('ALTER TABLE book AUTO_INCREMENT = 1')

  let count = 0
  for (const b of booksJson) {
    // 封面图：只取文件名，图片已复制到 public/upload 目录
    const imageName = path.basename(b.image || '')
    const cover = imageName ? `/upload/${imageName}` : ''
    await pool.query(
      `INSERT INTO book (name, author, cover, price, category, press, isbn, pub_date, info)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.title || '',
        b.editor || '',
        cover,
        b.price ? parseFloat(b.price) : null,
        typeMap[b.type] || '其他',
        b.press || '',
        b.isbn || '',
        b.date || '',
        b.info || ''
      ]
    )
    count++
  }
  console.log(`导入完成，共导入 ${count} 本图书`)
  process.exit(0)
}

main().catch(e => {
  console.error('导入失败：', e.message)
  process.exit(1)
})
