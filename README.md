# e-commerce-list
电商平台商品列表页开发
一个基于 前端现代化开发工具 构建的电商商品列表页面，展示商品信息、分类筛选、分页与响应式布局，是一个清晰、易扩展的前端项目示例。
功能特性 Features
商品列表展示：产品卡片、图片、价格、描述

多维筛选：按类别、热度、价格等条件过滤

性能优化：轻量打包，模块化组件，快速加载

UI 设计：简洁现代风格，响应式布局，兼容 PC / 平板 / 手机

易于扩展：组件化结构、清晰目录，便于二次开发

项目结构 Project Structure

```text
e-commerce-list/
├── public/ # 静态资源
├── src/
│ ├── assets/ # 图片、图标等静态文件
│ ├── components/ # 可复用组件
│ ├── pages/ # 页面级组件
│ ├── styles/ # CSS / SCSS 样式文件
│ └── main.js # 入口文件
├── package.json # 项目依赖及脚本
├── README.md # 项目说明
└── .gitignore # 忽略上传文件
```


# 安装与运行 Installation & Run

确保你已经安装 Node.js >=14 和 npm >=6。

克隆仓库
git clone git@github.com:HCZLYY/e-commerce-list.git
cd e-commerce-list

安装依赖
npm install

本地启动开发环境
npm run dev

打包生产环境
npm run build

# 开发流程 Development Workflow
新建分支开发新功能：
git checkout -b feat/your-feature
完成功能后提交代码：
git add .
git commit -m "feat: 描述功能"
推送分支并发起 Pull Request：
git push origin feat/your-feature


# 常见问题 FAQ

样式不显示：请检查 styles 是否正确引入，或执行 npm run build

图片加载失败：请确认图片路径是否正确，或使用压缩后的图片

# 部署 Deployment

可使用 GitHub Pages、Netlify 或 Vercel：

GitHub Pages：构建产物推送到 gh-pages 分支

Vercel / Netlify：连接仓库，构建命令 npm run build，输出目录 dist 或 build

作者 Author
HCZLYY
