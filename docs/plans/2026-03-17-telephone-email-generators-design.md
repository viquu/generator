# 固定电话和邮箱生成器设计文档

## 概述

为测试数据生成器添加两个新的生成器：固定电话号码生成器和电子邮箱生成器。

## 需求

### 固定电话生成器
- 生成8位数字的固定电话号码
- 第1位数字不能为0（1-9）
- 只需要生成功能，不需要校验功能
- 生成后自动复制到剪贴板

### 电子邮箱生成器
- 用户名：小写字母和数字混合，长度5-10位
- 域名：固定为 @gmail.com
- 只需要生成功能，不需要校验功能
- 生成后自动复制到剪贴板

## 架构设计

### 文件结构

```
src/
├── components/
│   ├── TelephoneGenerator.vue    # 固定电话生成器组件
│   └── EmailGenerator.vue         # 邮箱生成器组件
└── utils/
    ├── telephone.ts               # 固定电话生成逻辑
    └── email.ts                   # 邮箱生成逻辑
```

### 集成方式

在 `App.vue` 中添加两个新组件，保持现有的 12 列网格布局。页面将包含6个生成器：
- 身份证
- 统一社会信用代码
- 手机号
- 银行卡
- 固定电话（新增）
- 电子邮箱（新增）

## 组件设计

### TelephoneGenerator.vue

**UI结构**：
- 卡片标题："固定电话"
- 输入框：显示生成的8位号码
- 按钮：只有"随机生成"按钮

**交互逻辑**：
1. 点击"随机生成"按钮
2. 调用 `generateTelephone()` 生成8位号码
3. 自动复制到剪贴板
4. 显示成功提示

**与现有组件的差异**：
- 不包含校验按钮和校验逻辑
- 保留相同的样式和布局结构

### EmailGenerator.vue

**UI结构**：
- 卡片标题："电子邮箱"
- 输入框：显示生成的邮箱地址
- 按钮：只有"随机生成"按钮

**交互逻辑**：
1. 点击"随机生成"按钮
2. 调用 `generateEmail()` 生成邮箱地址
3. 自动复制到剪贴板
4. 显示成功提示

## 工具函数设计

### src/utils/telephone.ts

```typescript
export function generateTelephone(): string {
  // 第1位：1-9（不能是0）
  const firstDigit = Math.floor(Math.random() * 9) + 1

  // 后7位：0-9随机数字
  let remaining = ''
  for (let i = 0; i < 7; i++) {
    remaining += Math.floor(Math.random() * 10)
  }

  return firstDigit + remaining
}
```

**算法说明**：
- 第1位：使用 `Math.random() * 9 + 1` 生成 1-9
- 后7位：循环生成 0-9 的随机数字
- 返回8位字符串

### src/utils/email.ts

```typescript
export function generateEmail(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

  // 随机长度：5-10位
  const length = Math.floor(Math.random() * 6) + 5

  // 生成用户名
  let username = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    username += chars[randomIndex]
  }

  return username + '@gmail.com'
}
```

**算法说明**：
- 字符集：26个小写字母 + 10个数字
- 长度：`Math.random() * 6 + 5` 生成 5-10 之间的随机数
- 从字符集中随机选择字符拼接
- 固定添加 `@gmail.com` 后缀

## 错误处理

### 错误场景

**固定电话生成器**：
- 生成失败：显示"生成失败，请重试"
- 复制失败：显示"已生成，但复制失败，请手动复制"

**邮箱生成器**：
- 生成失败：显示"生成失败，请重试"
- 复制失败：显示"已生成，但复制失败，请手动复制"

**处理方式**：
- 使用 try-catch 包裹生成逻辑
- 使用 Element Plus 的 `ElMessage` 显示提示
- 与现有组件保持一致的错误处理模式

## 测试策略

### 手动测试

**固定电话**：
1. 点击生成按钮，验证生成8位数字
2. 验证第1位不是0（多次生成测试）
3. 验证自动复制功能
4. 验证手动输入功能

**邮箱**：
1. 点击生成按钮，验证格式为 `xxx@gmail.com`
2. 验证用户名长度在5-10位之间
3. 验证用户名只包含小写字母和数字
4. 验证自动复制功能

### 开发验证

运行 `npm run dev` 后在浏览器中测试所有功能。

## 实施计划

详见实施计划文档。
