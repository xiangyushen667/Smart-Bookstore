# 图书销售网站（Vue2 + Express + MySQL）完整项目

前后端分离的完整课程设计项目，数据存储在 MySQL 数据库，刷新页面数据不丢失。

## 项目结构
```
图书销售网站-完整项目/
├── start-all.bat        一键启动脚本（双击即可）
├── book-front/          前端 Vue2 项目（8080端口）
│   ├── src/             页面源码
│   ├── serve.js         生产发布脚本
│   └── package.json
├── book-server/         后端 Express 项目（3000端口）
│   ├── app.js           后端接口服务
│   ├── db.js            数据库连接（需修改为你本机MySQL密码）
│   ├── sql/init.sql     建库建表脚本
│   ├── scripts/import.js  图书数据导入脚本
│   └── public/upload/   图书封面图片（64张）
└── README.md
```

## 运行前准备（只需一次）
1. 安装 Node.js 18+：https://nodejs.org （安装时勾选 Add to PATH）
2. 安装 MySQL 8.0 并启动服务
3. 修改 `book-server/db.js` 中的数据库密码：
   ```js
   password: '123456'   // 改成你本机 MySQL 的 root 密码
   ```

## 首次启动（自动完成建库+导数据+装依赖）
双击 `start-all.bat`，脚本会自动：
1. 创建数据库 book_db、建表、导入54本图书
2. 安装前后端依赖
3. 构建前端生产版
4. 启动后端（3000端口）+ 前端（8080端口）

**如果数据库还没初始化**，先手动执行一次建库：
```
cd book-server
mysql -u root -p < sql/init.sql
node scripts/import.js
```

## 启动后
- 浏览器访问：http://localhost:8080
- 测试账号：admin / 123456（或 test / 123456，也可自己注册）

## 功能清单
- 首页热门推荐
- 图书列表 + 分类筛选 + 关键词搜索
- 图书详情（简介、价格、封面）
- 加入购物车 / 数量增减 / 删除 / 合计
- 注册 / 登录（JWT 鉴权，未登录不能进购物车）
- 数据全部存 MySQL，刷新不丢失

## 手动启动（不用脚本时）
```
窗口1：cd book-server && npm start
窗口2：cd book-front && node serve.js
```
