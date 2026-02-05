# 健康健身助手 - 设计规范系统

## 概述

本文档定义了"健康健身助手"应用的完整设计规范，包括色彩系统、排版规范、组件设计、布局规则和图标系统。所有设计决策均遵循现代UI设计趋势，确保视觉一致性、交互友好性和代码可实现性。

---

## 一、色彩系统

### 1.1 主色调 (Primary)

| 色阶 | 色值 | 用途 |
|------|------|------|
| Primary-50 | `#ECFDF5` | 极浅背景、悬停状态 |
| Primary-100 | `#D1FAE5` | 浅色背景、标签背景 |
| Primary-200 | `#A7F3D0` | 边框、分隔线 |
| Primary-500 | `#10B981` | 主要按钮、链接、强调 |
| Primary-600 | `#059669` | 按钮悬停、主要操作 |
| Primary-700 | `#047857` | 按下状态、深强调 |
| Primary-800 | `#065F46` | 标题、重要文字 |
| Primary-900 | `#064E3B` | 最深强调、选中文字 |

### 1.2 辅助色 (Secondary)

| 色阶 | 色值 | 用途 |
|------|------|------|
| Secondary-500 | `#3B82F6` | 信息提示、次要按钮 |
| Secondary-600 | `#2563EB` | 信息悬停、链接 |

### 1.3 强调色 (Accent)

| 颜色 | 色值 | 用途 |
|------|------|------|
| 橙色 | `#F97316` | 热量、运动、BMR相关 |
| 蓝色 | `#0EA5E9` | 水分、健康提示 |
| 紫色 | `#8B5CF6` | 营养、报告、数据分析 |

### 1.4 中性色 (Neutral)

| 色阶 | 色值 | 用途 |
|------|------|------|
| Gray-50 | `#F9FAFB` | 页面背景 |
| Gray-100 | `#F3F4F6` | 卡片背景、输入框背景 |
| Gray-200 | `#E5E7EB` | 边框、分割线 |
| Gray-300 | `#D1D5DB` | 禁用状态边框 |
| Gray-400 | `#9CA3AF` | 占位符文字、次要图标 |
| Gray-500 | `#6B7280` | 次要文字、描述 |
| Gray-600 | `#4B5563` | 正文文字 |
| Gray-700 | `#374151` | 强调正文 |
| Gray-800 | `#1F2937` | 副标题 |
| Gray-900 | `#111827` | 标题、主要文字 |

### 1.5 语义色 (Semantic)

| 类型 | 色值 | 用途 |
|------|------|------|
| Success | `#10B981` | 成功状态、正常指标 |
| Warning | `#F59E0B` | 警告状态、注意指标 |
| Danger | `#EF4444` | 危险状态、异常指标 |
| Info | `#3B82F6` | 信息提示、帮助文字 |

### 1.6 渐变色

```css
/* 主渐变 */
gradient-primary: linear-gradient(135deg, #10B981 0%, #059669 100%)

/* 辅助渐变 */
gradient-secondary: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)

/* 强调渐变 */
gradient-accent: linear-gradient(135deg, #F97316 0%, #EA580C 100%)

/* 背景渐变 */
gradient-background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F0FDFA 100%)
```

---

## 二、排版规范

### 2.1 字体选择

- **主字体**: Inter (Google Fonts)
- **备用字体**: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **特点**: 现代、清晰、高可读性、优秀的数字显示

```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 2.2 字号层级

| 层级 | 大小 | 字重 | 行高 | 字间距 | 用途 |
|------|------|------|------|--------|------|
| H1 | 36px (2.25rem) | 700 (Bold) | 1.2 | -0.02em | 页面主标题 |
| H2 | 28px (1.75rem) | 600 (Semibold) | 1.3 | -0.01em | 区块标题 |
| H3 | 22px (1.375rem) | 600 (Semibold) | 1.4 | 0 | 卡片标题 |
| H4 | 18px (1.125rem) | 600 (Semibold) | 1.4 | 0 | 小标题 |
| Body | 16px (1rem) | 400 (Regular) | 1.6 | 0 | 正文 |
| Small | 14px (0.875rem) | 400 (Regular) | 1.5 | 0 | 辅助文字 |
| XSmall | 12px (0.75rem) | 400 (Regular) | 1.5 | 0 | 标签、注释 |

### 2.3 字体样式类

```css
/* 标题样式 */
.text-h1 { @apply text-4xl font-bold tracking-tight text-gray-900; line-height: 1.2; }
.text-h2 { @apply text-2xl font-semibold tracking-tight text-gray-900; line-height: 1.3; }
.text-h3 { @apply text-xl font-semibold text-gray-900; line-height: 1.4; }
.text-h4 { @apply text-lg font-semibold text-gray-900; line-height: 1.4; }

/* 正文样式 */
.text-body { @apply text-base font-normal text-gray-600; line-height: 1.6; }
.text-small { @apply text-sm font-normal text-gray-500; line-height: 1.5; }
.text-xs { @apply text-xs font-normal text-gray-400; line-height: 1.5; }
```

---

## 三、组件设计规范

### 3.1 按钮 (Button)

#### 主按钮 (Primary)
```
背景: bg-emerald-600
文字: text-white
圆角: rounded-xl (12px)
内边距: px-6 py-3
字体: font-medium
悬停: hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5
聚焦: focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
按下: active:bg-emerald-800 active:translate-y-0
过渡: transition-all duration-200
```

#### 次要按钮 (Secondary)
```
背景: bg-white
边框: border-2 border-gray-200
文字: text-gray-700
圆角: rounded-xl (12px)
内边距: px-6 py-3
悬停: hover:bg-gray-50 hover:border-gray-300
聚焦: focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
按下: active:bg-gray-100
```

#### 轮廓按钮 (Outline)
```
背景: bg-transparent
边框: border-2 border-emerald-600
文字: text-emerald-600
圆角: rounded-xl (12px)
悬停: hover:bg-emerald-50
聚焦: focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
```

#### 幽灵按钮 (Ghost)
```
背景: bg-transparent
文字: text-gray-600
圆角: rounded-xl (12px)
悬停: hover:bg-gray-100 hover:text-gray-900
```

#### 按钮尺寸
- **Small**: px-4 py-2 text-sm rounded-lg
- **Medium**: px-6 py-3 text-base rounded-xl (默认)
- **Large**: px-8 py-4 text-lg rounded-2xl

### 3.2 卡片 (Card)

#### 基础卡片
```
背景: bg-white
圆角: rounded-2xl (16px)
阴影: shadow-md
内边距: p-6 (24px)
过渡: transition-all duration-300
```

#### 交互卡片
```
继承基础卡片样式
悬停: hover:shadow-xl hover:-translate-y-1
按下: active:translate-y-0 active:shadow-md
光标: cursor-pointer
```

#### 渐变卡片
```
背景: bg-gradient-to-br from-emerald-50 to-teal-50
边框: border border-emerald-100
圆角: rounded-2xl (16px)
```

### 3.3 输入框 (Input)

#### 文本输入框
```
宽度: w-full
背景: bg-white
边框: border border-gray-200
圆角: rounded-xl (12px)
内边距: px-4 py-3
文字: text-gray-900
占位符: placeholder-gray-400
聚焦: focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
悬停: hover:border-gray-300
禁用: disabled:bg-gray-50 disabled:text-gray-400
过渡: transition-all duration-200
```

#### 错误状态
```
边框: border-red-300
聚焦: focus:border-red-500 focus:ring-red-500/20
错误文字: text-red-600 text-sm
```

### 3.4 选择器 (Select)

```
继承输入框基础样式
外观: appearance-none
下拉图标: 右侧绝对定位
选项分组: 支持 disabled 分组标题
```

### 3.5 导航 (Navigation)

#### 侧边栏导航项
```
宽度: w-full
布局: flex items-center gap-4
内边距: px-4 py-3.5
圆角: rounded-xl (12px)
文字: text-left

默认状态:
  背景: bg-white
  边框: border border-gray-100
  文字: text-gray-700
  悬停: hover:bg-gray-50 hover:shadow-md

选中状态:
  背景: bg-emerald-600
  文字: text-white
  阴影: shadow-lg shadow-emerald-200
```

---

## 四、布局规范

### 4.1 响应式断点

| 断点 | 宽度 | 适配设备 | 类名前缀 |
|------|------|----------|----------|
| Mobile | < 640px | 手机 | 默认 |
| Tablet | 640px - 1024px | 平板 | sm: |
| Desktop | 1024px - 1280px | 桌面 | lg: |
| Large | > 1280px | 大屏 | xl: |

### 4.2 容器规范

```
最大宽度: max-w-7xl (1280px)
水平居中: mx-auto

水平内边距:
  Mobile: px-4 (16px)
  Tablet: sm:px-6 (24px)
  Desktop: lg:px-8 (32px)
```

### 4.3 间距系统

| 名称 | 值 | 用途 |
|------|-----|------|
| xs | 4px (0.25rem) | 紧凑间距、图标间隙 |
| sm | 8px (0.5rem) | 小间距、按钮内边距 |
| md | 16px (1rem) | 标准间距、卡片间隙 |
| lg | 24px (1.5rem) | 大间距、区块分隔 |
| xl | 32px (2rem) | 区块间距、标题下方 |
| 2xl | 48px (3rem) | 大区块分隔 |

### 4.4 网格系统

- 使用 Tailwind CSS 的网格系统
- 常用列数: 1, 2, 3, 4
- 间隙: gap-4 (16px) 或 gap-6 (24px)

---

## 五、图标系统

### 5.1 图标库

- **库名称**: Lucide React
- **安装**: `npm install lucide-react`
- **特点**: 轻量、现代、一致性高

### 5.2 图标风格

- **风格**: 线性图标 (Outline)
- **线条粗细**: 2px (默认 strokeWidth)
- **圆角**: 2px
- **尺寸规范**:
  - Small: 16px
  - Medium: 20px (默认)
  - Large: 24px
  - XLarge: 32px

### 5.3 应用图标映射

| 功能 | 图标名称 | 颜色 |
|------|----------|------|
| BMI计算器 | Scale | emerald |
| BMR/TDEE | Flame | orange |
| 体脂率 | Ruler | blue |
| 腰臀比 | Proportions | purple |
| 运动消耗 | Activity | red |
| 饮水量 | Droplets | cyan |
| 营养计划 | Salad | green |
| 健康报告 | ChartPie | indigo |
| 历史记录 | History | gray |

### 5.4 使用示例

```tsx
import { Icon, AppIcon } from './components/common';

// 使用通用图标
<Icon name="Heart" size="lg" className="text-red-500" />

// 使用应用预设图标
<AppIcon type="bmi" size="md" />
```

---

## 六、动效规范

### 6.1 过渡时间

| 速度 | 时间 | 用途 |
|------|------|------|
| Fast | 150ms | 按钮、图标反馈 |
| Normal | 200ms | 卡片、输入框状态变化 |
| Slow | 300ms | 页面切换、大元素动画 |

### 6.2 缓动函数

```css
--ease-default: ease
--ease-in: ease-in
--ease-out: ease-out
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)
```

### 6.3 常用动画

#### 悬停上浮
```css
transform: translateY(-2px);
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

#### 淡入动画
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
animation: fadeIn 0.3s ease-out;
```

#### 滑入动画
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
animation: slideIn 0.3s ease-out;
```

---

## 七、阴影系统

| 名称 | 值 | 用途 |
|------|-----|------|
| shadow-sm | 0 1px 2px 0 rgb(0 0 0 / 0.05) | 轻微阴影 |
| shadow-md | 0 4px 6px -1px rgb(0 0 0 / 0.1) | 卡片默认 |
| shadow-lg | 0 10px 15px -3px rgb(0 0 0 / 0.1) | 悬停状态 |
| shadow-xl | 0 20px 25px -5px rgb(0 0 0 / 0.1) | 弹窗、下拉 |

---

## 八、圆角系统

| 名称 | 值 | 用途 |
|------|-----|------|
| rounded-sm | 8px | 小元素、标签 |
| rounded-md | 12px | 按钮、输入框 |
| rounded-lg | 16px | 卡片、容器 |
| rounded-xl | 24px | 大卡片、模态框 |

---

## 九、可访问性规范

### 9.1 对比度要求

- 正文文字与背景对比度 ≥ 4.5:1
- 大文字与背景对比度 ≥ 3:1
- 交互元素对比度 ≥ 3:1

### 9.2 焦点状态

```css
/* 焦点环 */
focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-2
```

### 9.3 减少动画

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 十、文件结构

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx      # 按钮组件
│   │   ├── Card.tsx        # 卡片组件
│   │   ├── Input.tsx       # 输入框组件
│   │   ├── Select.tsx      # 选择器组件
│   │   ├── Icon.tsx        # 图标组件
│   │   └── index.ts        # 组件导出
│   └── calculators/        # 计算器组件
├── index.css               # 全局样式、CSS变量
├── App.tsx                 # 主应用组件
└── ...
```

---

## 十一、使用示例

### 11.1 按钮使用

```tsx
import { Button } from './components/common';

<Button variant="primary" size="lg" leftIcon={<Icon name="Calculator" />}>
  计算 BMI
</Button>
```

### 11.2 卡片使用

```tsx
import { Card } from './components/common';

<Card 
  title="BMI 结果" 
  icon={<Icon name="Scale" />}
  variant="gradient"
>
  <p>您的 BMI 指数为 22.5</p>
</Card>
```

### 11.3 输入框使用

```tsx
import { Input } from './components/common';

<Input
  label="身高"
  placeholder="170"
  unit="cm"
  helperText="请输入您的身高"
/>
```

---

## 十二、交付清单

- [x] 色彩系统定义
- [x] 排版规范
- [x] 组件设计规范
- [x] 布局规范
- [x] 图标系统
- [x] 动效规范
- [x] 可访问性规范
- [x] 代码实现
- [x] 文档编写

---

## 版本信息

- **版本**: 1.0.0
- **更新日期**: 2024年
- **设计工具**: Tailwind CSS + Lucide Icons
- **适用项目**: 健康健身助手 Web 应用
