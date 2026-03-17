# 测试数据生成器现代化改造设计文档

## 项目概述

将现有的基于 jQuery + Bootstrap 3 的测试数据生成器改造为使用 Vue 3 + TypeScript + Vite + Naive UI 的现代化前端应用。

## 改造目标

1. 替换 jQuery，使用 Vue 3 现代框架
2. 引入 TypeScript 实现类型安全
3. 使用 Vite 构建工具提升开发体验
4. 采用 Naive UI 组件库实现现代化界面
5. 保持 GitHub Pages 自动部署能力
6. 优化桌面端使用体验（主要针对 MacBook Pro 14 寸）
7. 支持未来功能扩展

## 技术栈

- **框架**: Vue 3 (Composition API + `<script setup>`)
- **语言**: TypeScript
- **构建工具**: Vite
- **UI 库**: Naive UI
- **部署**: GitHub Actions + gh-pages 分支
- **状态管理**: Vue 3 内置 ref/reactive（不使用 Pinia）

## 功能范围

### 保留的生成器（4个）

1. 身份证号码生成器
2. 统一社会信用代码生成器
3. 手机号码生成器
4. 银行卡号生成器

### 移除的功能

- 组织机构代码生成器

### 预留扩展（未来实现）

- 电话号码生成器（8位数字）
- 电子邮箱生成器（Gmail）

## 项目结构

```
generator/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── src/
│   ├── components/
│   │   ├── GeneratorCard.vue   # 生成器卡片容器组件
│   │   ├── IdCardGenerator.vue # 身份证生成器
│   │   ├── CreditCodeGenerator.vue # 统一社会信用代码
│   │   ├── PhoneGenerator.vue  # 手机号码
│   │   └── BankCardGenerator.vue # 银行卡号
│   ├── utils/
│   │   ├── idCard.ts           # 身份证算法
│   │   ├── creditCode.ts       # 信用代码算法
│   │   ├── phone.ts            # 手机号算法
│   │   ├── bankCard.ts         # 银行卡算法
│   │   ├── areas.ts            # 行政区划数据
│   │   └── clipboard.ts        # 剪贴板工具
│   ├── config/
│   │   └── generators.ts       # 生成器配置（支持扩展）
│   ├── types/
│   │   └── index.ts            # TypeScript 类型定义
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── style.css               # 全局样式
├── public/
│   └── favicon.ico
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── CLAUDE.md
```

## 架构设计

### 组件架构

#### 1. App.vue（根组件）

- 使用 Naive UI 的 `n-config-provider` 提供全局配置
- 使用 `n-message-provider` 提供消息提示
- 使用 `n-grid` 实现响应式网格布局
- 动态渲染生成器组件

布局策略：
- 4个生成器：2x2 网格
- 6个生成器（未来）：3x2 网格
- 目标：在 MacBook Pro 14 寸（1512x982 有效分辨率）一屏内完全可见

#### 2. GeneratorCard.vue（容器组件）

- 接收 props：`title`（标题）
- 使用 `n-card` 组件提供统一样式
- 提供插槽机制供子组件自定义内容
- 卡片高度：160-180px（紧凑设计）

#### 3. 各生成器组件

每个生成器组件包含：
- 输入框：使用 `n-input` 显示生成结果
- 按钮组：
  - "生成"按钮（或"随机生成"）：调用算法生成数据
  - "校验"按钮：验证输入的数据格式
- 状态管理：使用 `ref` 存储生成的值
- 自动复制：生成后自动调用 clipboard API

**身份证生成器特殊设计**：
- 简化界面，只保留"随机生成"按钮
- 移除手动选择省市区、生日、性别的复杂表单
- 专注于快速生成，符合桌面端快捷操作需求

### 数据流

```
用户点击按钮
  ↓
组件事件处理函数
  ↓
调用 utils 中的算法函数
  ↓
更新组件 ref 状态
  ↓
自动复制到剪贴板
  ↓
显示 Naive UI 消息提示
```

### 算法模块设计

所有算法实现为纯函数，独立于 UI 层，便于测试和维护。

#### TypeScript 类型定义

```typescript
// types/index.ts

// 行政区划
export interface AreaMap {
  [key: string]: string | AreaMap;
}

// 校验结果
export interface ValidateResult {
  isValid: boolean;
  message: string;
}

// 身份证生成选项（预留，当前版本可能不使用）
export interface IdCardOptions {
  province?: string;
  city?: string;
  district?: string;
  birthday?: string;
  gender?: 1 | 2; // 1=男, 2=女
}
```

#### 算法函数接口

**1. idCard.ts**
```typescript
export function randomGenId(): string
export function validateIdCard(id: string): ValidateResult
```

**2. creditCode.ts**
```typescript
export function generateCreditCode(): string
export function validateCreditCode(code: string): ValidateResult
```

**3. phone.ts**
```typescript
export function generatePhone(): string
export function validatePhone(phone: string): ValidateResult
```

**4. bankCard.ts**
```typescript
export function generateBankCard(): string
export function validateBankCard(card: string): ValidateResult
```

**5. clipboard.ts**
```typescript
export async function copyToClipboard(text: string): Promise<boolean>
```

#### 算法迁移策略

1. 保留原有算法逻辑（加权因子、校验码映射等）
2. 移除 jQuery 和 DOM 操作
3. 移除 toastr 调用，改为返回结果对象
4. 添加完整的 TypeScript 类型注解
5. 改造为纯函数，便于单元测试

## UI 设计

### Naive UI 组件选择

- `n-grid` / `n-gi` - 响应式网格布局
- `n-card` - 卡片容器
- `n-input` - 输入框
- `n-button` - 按钮
- `n-space` - 间距布局
- `n-message` - 消息提示

### 布局设计

**桌面端布局（专注优化）**
- 固定 2x2 或 3x2 网格布局
- 最小宽度要求：1024px
- 卡片间距：16px
- 卡片内边距：16px
- 每个卡片高度：160-180px
- 总高度（2行）：约 360-400px

**不做移动端适配**
- 移除复杂的响应式 `@media` 查询
- 专注桌面端使用体验
- 简化 CSS 代码

### 样式策略

- 使用 Naive UI 默认主题
- 全局样式最小化
- 保持简洁现代的视觉风格
- 卡片式布局与原项目风格一致

## 可扩展性设计

### 生成器配置系统

创建 `src/config/generators.ts`：

```typescript
import type { Component } from 'vue'

export interface GeneratorConfig {
  id: string
  title: string
  component: Component
}

export const generators: GeneratorConfig[] = [
  { id: 'idCard', title: '身份证号码', component: IdCardGenerator },
  { id: 'creditCode', title: '统一社会信用代码', component: CreditCodeGenerator },
  { id: 'phone', title: '手机号码', component: PhoneGenerator },
  { id: 'bankCard', title: '银行卡号', component: BankCardGenerator },
  // 未来扩展：
  // { id: 'phoneNumber', title: '电话号码', component: PhoneNumberGenerator },
  // { id: 'email', title: '电子邮箱', component: EmailGenerator },
]
```

### 动态网格布局

```vue
<!-- App.vue -->
<n-grid :cols="gridCols" :x-gap="16" :y-gap="16">
  <n-gi v-for="gen in generators" :key="gen.id">
    <component :is="gen.component" :title="gen.title" />
  </n-gi>
</n-grid>

<script setup>
const gridCols = computed(() => {
  const count = generators.length
  if (count <= 4) return 2  // 2x2
  return 3  // 3x2
})
</script>
```

### 添加新生成器流程

1. 创建组件文件（如 `EmailGenerator.vue`）
2. 创建算法文件（如 `utils/email.ts`）
3. 在 `config/generators.ts` 中注册
4. 无需修改 App.vue

## 错误处理与用户体验

### 错误处理

1. **剪贴板权限处理**
   - 优先使用 `navigator.clipboard.writeText()`
   - 失败时降级到传统方法
   - 捕获异常并提示用户

2. **校验结果展示**
   - 成功：`message.success('校验通过')`
   - 失败：`message.warning('校验失败：格式不正确')`
   - 具体错误信息在 ValidateResult.message 中

3. **生成失败处理**
   - 捕获异常并提示用户重试
   - 记录错误日志（console.error）

### 用户体验优化

1. **自动复制反馈**
   - 生成成功：`message.success('已生成并复制到剪贴板')`
   - 复制失败：`message.warning('已生成，但复制失败，请手动复制')`

2. **按钮状态**
   - 使用 `loading` 属性显示加载状态
   - 防止重复点击

3. **键盘支持**
   - 输入框聚焦时按 Enter 触发校验
   - 支持 Vimium 等键盘导航工具

4. **输入框交互**
   - 输入框可编辑，支持手动输入后校验
   - 生成后自动选中文本，方便查看

## 构建与部署

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/generator/', // GitHub Pages 仓库名
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'naive-ui': ['naive-ui'],
          'vue': ['vue']
        }
      }
    }
  }
})
```

### GitHub Actions 配置

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 部署流程

1. 推送代码到 main 分支
2. GitHub Actions 自动触发构建
3. 构建产物推送到 gh-pages 分支
4. 在 GitHub 仓库设置中切换 Pages 源：
   - Settings → Pages
   - Source: gh-pages 分支
   - Directory: / (root)
5. 等待部署完成

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 迁移风险评估

### 低风险项

- 算法逻辑清晰，迁移直接
- 行政区划数据可直接复用
- UI 结构简单，组件化容易

### 需要注意的点

1. **算法正确性验证**
   - 迁移后需要完整测试所有生成和校验功能
   - 对比原版本确保结果一致

2. **剪贴板 API 兼容性**
   - 现代浏览器支持良好
   - 需要 HTTPS 或 localhost 环境
   - GitHub Pages 默认 HTTPS，无问题

3. **GitHub Pages 配置切换**
   - 需要手动切换 Pages 源到 gh-pages 分支
   - 第一次部署需要等待 Actions 完成

## 项目规模估算

- **组件文件**: 6-7 个
- **工具函数**: 6-7 个
- **配置文件**: 5-6 个
- **总代码量**: 约 1500-2000 行（含类型定义和注释）

## 开发时间估算

- 项目搭建与配置: 0.5 小时
- 算法迁移与测试: 2-3 小时
- 组件开发: 3-4 小时
- 集成测试与调试: 1-2 小时
- 文档更新: 0.5 小时
- **总计**: 约 7-10 小时

## 成功标准

1. 所有 4 个生成器功能正常
2. 生成的数据通过校验
3. 自动复制功能正常工作
4. 在 MacBook Pro 14 寸上一屏内完全可见
5. GitHub Actions 自动部署成功
6. 代码通过 TypeScript 类型检查
7. 支持 Vimium 等键盘导航工具

## 后续优化方向

1. 添加单元测试（Vitest）
2. 添加 E2E 测试（Playwright）
3. 性能优化（代码分割、懒加载）
4. 添加暗色主题支持
5. 国际化支持（i18n）
6. PWA 支持（离线使用）

---

**文档版本**: 1.0
**创建日期**: 2026-03-17
**作者**: Claude Code
**状态**: 已批准
