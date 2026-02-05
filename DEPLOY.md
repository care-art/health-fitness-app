# 部署指南 - Gitee Pages（推荐国内访问）

## 为什么选择 Gitee Pages？

- ✅ **国内访问最快** - 服务器在国内，无需翻墙
- ✅ **国产浏览器适配最好** - 华为、小米、OPPO、vivo等完美支持
- ✅ **微信内置浏览器友好** - 分享和打开无障碍
- ✅ **免费且稳定** - 与 GitHub Pages 类似的服务

---

## 部署步骤

### 第一步：注册 Gitee 账号

1. 访问 https://gitee.com
2. 点击右上角"注册"
3. 使用手机号或邮箱注册

### 第二步：创建仓库

1. 登录后点击右上角 "+" → "新建仓库"
2. 仓库名称：`health-fitness-app`
3. 仓库介绍：健康健身助手 - BMI计算器、体脂率计算等工具
4. 选择"公开"（私有仓库无法开启 Pages）
5. 勾选"使用Readme文件初始化这个仓库"
6. 点击"创建"

### 第三步：上传代码

#### 方式A：通过 Git 命令行

```bash
# 进入项目目录
cd d:\ceshi\health-fitness-app

# 添加 Gitee 远程仓库（替换 YOUR_USERNAME 为你的 Gitee 用户名）
git remote add gitee https://gitee.com/YOUR_USERNAME/health-fitness-app.git

# 推送到 Gitee
git push -u gitee main
```

#### 方式B：通过网页上传

1. 进入刚创建的仓库
2. 点击"上传文件"
3. 拖拽或选择项目所有文件
4. 填写提交信息："初始提交"
5. 点击"提交"

### 第四步：开启 Gitee Pages

1. 进入仓库 → 点击"服务" → "Gitee Pages"
2. 部署分支：选择 `master` 或 `main`
3. 部署目录：留空（根目录）
4. 点击"启动"
5. 等待 1-5 分钟部署完成

### 第五步：访问网站

部署完成后，你会获得一个类似这样的地址：

```
https://YOUR_USERNAME.gitee.io/health-fitness-app
```

---

## 国产浏览器适配特性

本项目已针对以下浏览器进行优化：

### 华为手机
- ✅ 华为浏览器（内置）
- ✅ 微信内置浏览器
- ✅ QQ浏览器

### 小米手机
- ✅ 小米浏览器
- ✅ 微信内置浏览器
- ✅ MIUI系统浏览器

### OPPO / vivo / 一加
- ✅ ColorOS浏览器
- ✅ OriginOS浏览器
- ✅ 微信内置浏览器

### 其他
- ✅ UC浏览器
- ✅ QQ浏览器
- ✅ 夸克浏览器
- ✅ 百度浏览器

---

## 已做的优化

### 1. CSS 兼容性
- 添加 `-webkit-` 前缀支持
- 适配华为、小米等浏览器的特殊样式
- 优化触摸反馈效果
- 禁用默认高亮，添加自定义点击效果

### 2. 移动端适配
- 安全区域适配（刘海屏、圆角屏）
- 禁止页面缩放，优化双击体验
- 防止 iOS 橡皮筋效果
- 适配动态视口高度（dvh）

### 3. 字体优化
- 优先使用系统字体：
  - 苹方（iOS）
  - 思源黑体（Android）
  - 微软雅黑（Windows）

### 4. Meta 标签
- X5 内核适配（腾讯浏览器）
- UC 浏览器适配
- 禁止自动识别电话号码
- 启用全屏模式

---

## 更新部署

每次修改代码后：

```bash
# 提交更改
git add .
git commit -m "更新内容"

# 推送到 Gitee
git push gitee main

# 然后进入 Gitee 仓库 → 服务 → Gitee Pages → 点击"更新"
```

或者开启"自动部署"：
- Gitee Pages 设置中勾选"自动部署"
- 每次 push 后会自动更新

---

## 自定义域名（可选）

1. 购买域名（推荐阿里云、腾讯云）
2. 添加 DNS 解析：
   - 记录类型：CNAME
   - 主机记录：www
   - 记录值：YOUR_USERNAME.gitee.io
3. 在 Gitee Pages 设置中添加自定义域名
4. 等待 DNS 生效（通常 10 分钟 - 24 小时）

---

## 常见问题

### Q: 部署后页面空白？
A: 检查浏览器控制台，可能是路径问题。确保 vite.config.ts 中 `base: './'`

### Q: 样式显示不正常？
A: 清除浏览器缓存，或尝试无痕模式访问

### Q: 微信中打不开？
A: Gitee Pages 域名可能被微信拦截，建议绑定自定义域名

### Q: 如何加速访问？
A: 绑定自定义域名并开启 CDN（阿里云/腾讯云 CDN）

---

## 需要帮助？

- Gitee 官方文档：https://gitee.com/help
- Pages 服务文档：https://gitee.com/help/articles/4136
