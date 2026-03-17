# 固定电话和邮箱生成器实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 添加固定电话号码生成器和电子邮箱生成器到测试数据生成器应用

**Architecture:** 遵循现有模式，为每个生成器创建独立的 Vue 组件和 TypeScript 工具函数。组件包含输入框和生成按钮，生成后自动复制到剪贴板。

**Tech Stack:** Vue 3.5, TypeScript 5.9, Element Plus 2.13

---

## Task 1: 创建固定电话工具函数

**Files:**
- Create: `src/utils/telephone.ts`

**Step 1: 创建工具函数文件**

创建 `src/utils/telephone.ts` 文件，包含生成固定电话号码的函数：

```typescript
// src/utils/telephone.ts

/**
 * 生成固定电话号码
 * @returns 8位固定电话号码，第1位为1-9
 */
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

**Step 2: 验证函数逻辑**

在浏览器控制台或临时测试文件中验证：
- 生成的号码是8位数字
- 第1位不是0

**Step 3: 提交**

```bash
git add src/utils/telephone.ts
git commit -m "feat: 添加固定电话号码生成工具函数"
```

---

## Task 2: 创建固定电话生成器组件

**Files:**
- Create: `src/components/TelephoneGenerator.vue`

**Step 1: 创建组件文件**

创建 `src/components/TelephoneGenerator.vue` 文件：

```vue
<template>
  <el-card shadow="hover">
    <template #header>
      <div class="card-header">固定电话</div>
    </template>
    <div class="generator-content">
      <el-input
        v-model="telephone"
        placeholder="点击生成按钮或手动输入"
        size="large"
      />
      <div class="button-group">
        <el-button type="success" :loading="generating" @click="handleGenerate">
          随机生成
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateTelephone } from '../utils/telephone'
import { copyToClipboard } from '../utils/clipboard'

const telephone = ref('')
const generating = ref(false)

async function handleGenerate() {
  generating.value = true
  try {
    telephone.value = generateTelephone()
    const copied = await copyToClipboard(telephone.value)
    if (copied) {
      ElMessage.success('已生成并复制到剪贴板')
    } else {
      ElMessage.warning('已生成，但复制失败，请手动复制')
    }
  } catch (error) {
    ElMessage.error('生成失败，请重试')
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
.card-header {
  font-weight: 600;
  font-size: 16px;
}

.generator-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.button-group {
  display: flex;
  gap: 12px;
}
</style>
```

**Step 2: 提交**

```bash
git add src/components/TelephoneGenerator.vue
git commit -m "feat: 添加固定电话生成器组件"
```

---

## Task 3: 创建邮箱工具函数

**Files:**
- Create: `src/utils/email.ts`

**Step 1: 创建工具函数文件**

创建 `src/utils/email.ts` 文件：

```typescript
// src/utils/email.ts

/**
 * 生成电子邮箱地址
 * @returns 随机邮箱地址，格式为 xxx@gmail.com
 */
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

**Step 2: 验证函数逻辑**

在浏览器控制台或临时测试文件中验证：
- 生成的邮箱格式为 `xxx@gmail.com`
- 用户名长度在5-10位之间
- 用户名只包含小写字母和数字

**Step 3: 提交**

```bash
git add src/utils/email.ts
git commit -m "feat: 添加电子邮箱生成工具函数"
```

---

## Task 4: 创建邮箱生成器组件

**Files:**
- Create: `src/components/EmailGenerator.vue`

**Step 1: 创建组件文件**

创建 `src/components/EmailGenerator.vue` 文件：

```vue
<template>
  <el-card shadow="hover">
    <template #header>
      <div class="card-header">电子邮箱</div>
    </template>
    <div class="generator-content">
      <el-input
        v-model="email"
        placeholder="点击生成按钮或手动输入"
        size="large"
      />
      <div class="button-group">
        <el-button type="success" :loading="generating" @click="handleGenerate">
          随机生成
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateEmail } from '../utils/email'
import { copyToClipboard } from '../utils/clipboard'

const email = ref('')
const generating = ref(false)

async function handleGenerate() {
  generating.value = true
  try {
    email.value = generateEmail()
    const copied = await copyToClipboard(email.value)
    if (copied) {
      ElMessage.success('已生成并复制到剪贴板')
    } else {
      ElMessage.warning('已生成，但复制失败，请手动复制')
    }
  } catch (error) {
    ElMessage.error('生成失败，请重试')
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
.card-header {
  font-weight: 600;
  font-size: 16px;
}

.generator-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.button-group {
  display: flex;
  gap: 12px;
}
</style>
```

**Step 2: 提交**

```bash
git add src/components/EmailGenerator.vue
git commit -m "feat: 添加电子邮箱生成器组件"
```

---

## Task 5: 在 App.vue 中集成新组件

**Files:**
- Modify: `src/App.vue`

**Step 1: 导入新组件**

在 `src/App.vue` 的 `<script setup>` 部分添加导入：

```typescript
import TelephoneGenerator from './components/TelephoneGenerator.vue'
import EmailGenerator from './components/EmailGenerator.vue'
```

**Step 2: 在模板中添加组件**

在 `<el-row>` 中添加两个新的 `<el-col>`：

```vue
<el-col :span="12">
  <TelephoneGenerator />
</el-col>
<el-col :span="12">
  <EmailGenerator />
</el-col>
```

完整的 `<template>` 部分应该是：

```vue
<template>
  <div class="app-container">
    <h1>测试数据生成器</h1>
    <el-row :gutter="16">
      <el-col :span="12">
        <IdCardGenerator />
      </el-col>
      <el-col :span="12">
        <CreditCodeGenerator />
      </el-col>
      <el-col :span="12">
        <PhoneGenerator />
      </el-col>
      <el-col :span="12">
        <BankCardGenerator />
      </el-col>
      <el-col :span="12">
        <TelephoneGenerator />
      </el-col>
      <el-col :span="12">
        <EmailGenerator />
      </el-col>
    </el-row>
  </div>
</template>
```

**Step 3: 提交**

```bash
git add src/App.vue
git commit -m "feat: 在主应用中集成固定电话和邮箱生成器"
```

---

## Task 6: 手动测试

**Step 1: 启动开发服务器**

```bash
npm run dev
```

**Step 2: 测试固定电话生成器**

在浏览器中：
1. 找到"固定电话"卡片
2. 点击"随机生成"按钮
3. 验证生成的号码是8位数字
4. 验证第1位不是0（多次点击测试）
5. 验证自动复制功能（粘贴到其他地方确认）
6. 验证可以手动输入

**Step 3: 测试邮箱生成器**

在浏览器中：
1. 找到"电子邮箱"卡片
2. 点击"随机生成"按钮
3. 验证生成的邮箱格式为 `xxx@gmail.com`
4. 验证用户名长度在5-10位之间（多次点击测试）
5. 验证用户名只包含小写字母和数字
6. 验证自动复制功能
7. 验证可以手动输入

**Step 4: 测试整体布局**

验证：
- 6个生成器卡片布局合理
- 响应式布局正常
- 所有现有功能未受影响

**Step 5: 如果测试通过，创建最终提交**

```bash
git add -A
git commit -m "test: 验证固定电话和邮箱生成器功能"
```

---

## 完成标准

- [ ] 固定电话生成器生成8位数字，第1位为1-9
- [ ] 邮箱生成器生成格式为 `xxx@gmail.com` 的邮箱
- [ ] 邮箱用户名长度在5-10位之间，只包含小写字母和数字
- [ ] 两个生成器都能自动复制到剪贴板
- [ ] 两个生成器都能手动输入
- [ ] 页面布局正常，所有现有功能正常工作
- [ ] 所有代码已提交到 feature 分支
