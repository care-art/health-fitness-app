# 🏃 Health & Fitness Assistant

> 您的个人健康管理专家 - 全面的健康计算器和身体指标追踪工具

[🌐 访问我们的网站](https://health-fitness-app.pages.dev) · [📖 English](./README.md)

---

## ✨ 功能特点

### 🔢 健康计算器套件

| 计算器 | 功能描述 |
|--------|----------|
| **BMI 计算器** | 身体质量指数计算，评估体重健康状况 |
| **BMR 计算器** | 基础代谢率计算，了解静息状态热量消耗 |
| **体脂率计算** | US Navy 方法计算体脂百分比 |
| **腰臀比 (WHR)** | 评估腹部脂肪分布和健康风险 |
| **运动消耗计算** | 计算各种运动的卡路里消耗 |
| **饮水量计算** | 个性化每日饮水建议 |
| **营养计划** | 根据目标生成个性化饮食方案 |

### 🌍 全球化支持

- **10 种语言支持**：简体中文、繁体中文、英语、日语、韩语、西班牙语、法语、德语、俄语、阿拉伯语
- **智能语言检测**：基于 IP 地理位置自动检测语言
- **手动切换**：用户可随时手动选择偏好的语言
- **跨设备同步**：语言偏好自动保存

### 📱 用户体验

- 🎨 现代扁平化设计，Tailwind CSS 驱动的响应式界面
- 🌙 优化的暗色主题适配
- ⚡ 流畅的动画过渡效果
- 📊 直观的数据可视化展示
- 📱 完美的移动端适配

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 9+ 或 pnpm 8+

### 安装

```bash
# 克隆仓库
git clone https://github.com/care-art/health-fitness-app.git

# 进入目录
cd health-fitness-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

---

## 🏗️ 技术栈

| 技术 | 用途 |
|------|------|
| **React 18** | UI 框架 |
| **TypeScript** | 类型安全 |
| **Vite** | 构建工具 |
| **Tailwind CSS** | 样式框架 |
| **React Router** | 路由管理 |
| **Cloudflare Pages** | 部署平台 |

---

## 📂 项目结构

```
health-fitness-app/
├── public/                 # 静态资源
│   ├── sitemap.xml        # SEO sitemap
│   └── robots.txt         # 爬虫配置
├── src/
│   ├── components/        # React 组件
│   │   ├── calculators/   # 健康计算器组件
│   │   ├── common/        # 通用 UI 组件
│   │   └── HistoryView.tsx # 历史记录视图
│   ├── hooks/             # 自定义 React Hooks
│   ├── i18n/             # 国际化配置
│   │   └── translations/  # 语言翻译文件
│   ├── services/         # 业务服务
│   │   └── ipDetection.ts # IP 地理位置检测
│   ├── types/            # TypeScript 类型定义
│   └── utils/            # 工具函数
│       └── calculations.ts # 健康计算公式
├── index.html            # 入口 HTML
├── package.json
├── vite.config.ts
└── wrangler.jsonc        # Cloudflare Pages 配置
```

---

## 🌐 部署

### Cloudflare Pages (推荐)

本项目使用 Cloudflare Pages 进行部署，支持全球 CDN 加速。

[![Deploy to Cloudflare Pages](https://deploy.pages.dev/badge.svg)](https://deploy.pages.dev/github.com/care-art/health-fitness-app)

1. Fork 本仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 Pages 页面，选择 "Create a project"
4. 选择 GitHub 仓库并配置构建设置
5. 构建命令: `npm run build`
6. 输出目录: `dist`

### Vercel

```bash
npm i -g vercel
vercel
```

### 手动部署

```bash
npm run build
# 将 dist 目录下的文件上传到您的服务器
```

---

## 📊 SEO 优化

本项目针对健康相关关键词进行了 SEO 优化：

- **目标关键词**：BMI 计算器、身体质量指数、健康体重计算、体脂率计算
- **结构化数据**：支持 Schema.org 标记
- **Sitemap**：包含所有重要页面的完整 sitemap
- **Meta 标签**：优化的标题和描述

---

## 🔒 隐私声明

- 🔐 所有数据存储在用户本地浏览器
- 🌐 IP 地理位置检测仅用于语言自动切换
- 📊 不收集任何个人健康数据
- 🚫 无第三方追踪

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com) - 极快的样式开发
- [Heroicons](https://heroicons.com) - 精美的图标库
- [Cloudflare](https://cloudflare.com) - 全球 CDN 加速

---

## 📬 联系方式

- **Website**: [https://health-fitness-app.pages.dev](https://health-fitness-app.pages.dev)
- **GitHub**: [https://github.com/care-art/health-fitness-app](https://github.com/care-art/health-fitness-app)

---

<p align="center">
  <strong>保持健康，从了解自己的身体开始 💪</strong>
</p>
