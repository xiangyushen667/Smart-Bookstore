-- ============================================================
-- 图书销售网站数据库初始化脚本
-- 使用方法：在 MySQL 中执行本脚本（或执行下面的初始化命令）
-- mysql -u root -p < init.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS book_db DEFAULT CHARACTER SET utf8mb4;
USE book_db;

-- ---------- 用户表 ----------
DROP TABLE IF EXISTS user;
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  create_time DATETIME DEFAULT NOW()
);

-- ---------- 图书表 ----------
DROP TABLE IF EXISTS book;
CREATE TABLE book (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  author VARCHAR(100),
  cover VARCHAR(300),
  price DECIMAL(10,2),
  category VARCHAR(50),
  press VARCHAR(100),
  isbn VARCHAR(50),
  pub_date VARCHAR(20),
  info TEXT
);

-- ---------- 购物车表 ----------
DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  count INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (book_id) REFERENCES book(id)
);

-- ---------- 示例测试账号 ----------
-- 密码均为 123456（bcrypt加密）
INSERT INTO user (username, password) VALUES
('admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlY.fh9fr0Uu'),
('test',  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlY.fh9fr0Uu');
