# 部署指南 - 健康健身助手

## 方案A: Gitee Pages（推荐国内用户）

### 前提条件
- Gitee 账号需要实名认证才能开启 Pages 服务

### 部署步骤

1. **访问 Gitee 仓库**
   - 打开 https://gitee.com/care_art/health-fitness-app

2. **创建 gh-pages 分支**
   - 点击「分支」下拉菜单
   - 点击「新建分支」
   - 分支名：`gh-pages`
   - 基于：`main`
   - 点击「创建分支」

3. **上传构建文件**
   - 切换到 `gh-pages` 分支
   - 删除所有文件（除了 .git）
   - 上传 `dist` 文件夹中的所有文件到根目录
   - 提交更改

4. **开启 Pages 服务**
   - 点击「服务」→「Gitee Pages」
   - 部署分支：选择 `gh-pages`
   - 部署目录：`/`（根目录）
   - 点击「启动」

5. **等待部署**
   - 等待 2-5 分钟
   - 访问地址：`https://care_art.gitee.io/health-fitness-app`

---

## 方案B: Cloudflare Pages（无需实名）

1. 访问 https://dash.cloudflare.com
2. 注册/登录账号
3. 点击「Pages」→「创建项目」
4. 上传 `dist` 文件夹
5. 自动获得访问地址

---

## 方案C: Netlify（最简单）

1. 访问 https://www.netlify.com
2. 用邮箱注册
3. 拖拽 `dist` 文件夹到部署区域
4. 自动获得访问地址

---

## 方案D: 阿里云 OSS（国内最快）

1. 购买阿里云 OSS 存储包
2. 创建 Bucket，开启静态网站托管
3. 上传 `dist` 文件夹内容
4. 绑定自定义域名（可选）

---

## 文件说明

- `dist/` - 构建后的静态文件
- `dist/index.html` - 入口文件
- `dist/assets/` - JS/CSS/图片等资源

## 注意事项

1. 确保所有文件都上传到根目录
2. 不要修改文件结构
3. 开启 HTTPS（推荐）
4. 配置正确的 MIME 类型

## 需要帮助？

如果以上方案都无法使用，可以考虑：
- 购买虚拟主机（如阿里云虚拟主机）
- 使用 CDN 加速
- 部署到自己的服务器
