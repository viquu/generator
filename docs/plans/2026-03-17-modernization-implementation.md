# 测试数据生成器现代化改造实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将基于 jQuery + Bootstrap 3 的测试数据生成器迁移到 Vue 3 + TypeScript + Vite + Naive UI

**Architecture:** 采用组件化架构，每个生成器独立封装为 Vue 组件。算法逻辑提取到 utils 模块作为纯函数实现。使用 Vite 构建，通过 GitHub Actions 自动部署到 gh-pages 分支。

**Tech Stack:** Vue 3, TypeScript, Vite, Naive UI, GitHub Actions

---

## 前置准备

### Task 1: 初始化 Vue 3 + TypeScript 项目

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/App.vue`

**Step 1: 创建 package.json**

在项目根目录运行：

```bash
npm init -y
```

**Step 2: 安装依赖**

```bash
npm install vue@^3.4.0
npm install -D vite@^5.0.0 @vitejs/plugin-vue@^5.0.0 typescript@^5.3.0 vue-tsc@^1.8.0
npm install naive-ui@^2.38.0
```

**Step 3: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/generator/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  }
})
```

**Step 4: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 5: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

**Step 6: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>编号生成器</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

**Step 7: 创建 src/main.ts**

```typescript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

**Step 8: 创建 src/App.vue**

```vue
<template>
  <div>
    <h1>测试数据生成器</h1>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
h1 {
  text-align: center;
  margin: 20px 0;
}
</style>
```

**Step 9: 更新 package.json scripts**

在 package.json 中添加：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  }
}
```

**Step 10: 验证项目启动**

```bash
npm run dev
```

预期：开发服务器启动成功，浏览器打开 http://localhost:5173 显示"测试数据生成器"标题。

**Step 11: 提交**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.node.json index.html src/
git commit -m "chore: 初始化 Vue 3 + TypeScript 项目"
```

---

### Task 2: 集成 Naive UI

**Files:**
- Modify: `src/main.ts`
- Modify: `src/App.vue`

**Step 1: 修改 src/main.ts 集成 Naive UI**

```typescript
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

**Step 2: 修改 src/App.vue 添加 Naive UI 配置**

```vue
<template>
  <n-config-provider>
    <n-message-provider>
      <div class="app-container">
        <h1>测试数据生成器</h1>
        <n-button type="primary" @click="handleClick">测试按钮</n-button>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NButton, useMessage } from 'naive-ui'

const message = useMessage()

function handleClick() {
  message.success('Naive UI 集成成功！')
}
</script>

<style scoped>
.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin: 20px 0 40px 0;
}
</style>
```

**Step 3: 验证 Naive UI**

```bash
npm run dev
```

预期：页面显示标题和按钮，点击按钮显示成功消息提示。

**Step 4: 提交**

```bash
git add src/main.ts src/App.vue
git commit -m "feat: 集成 Naive UI"
```

---

### Task 3: 创建 TypeScript 类型定义

**Files:**
- Create: `src/types/index.ts`

**Step 1: 创建类型定义文件**

```typescript
// src/types/index.ts

// 行政区划
export interface AreaMap {
  [key: string]: string | AreaMap
}

// 校验结果
export interface ValidateResult {
  isValid: boolean
  message: string
}

// 身份证生成选项（预留）
export interface IdCardOptions {
  province?: string
  city?: string
  district?: string
  birthday?: string
  gender?: 1 | 2 // 1=男, 2=女
}

// 生成器配置
export interface GeneratorConfig {
  id: string
  title: string
  component: any // 使用 any 避免循环依赖
}
```

**Step 2: 提交**

```bash
git add src/types/
git commit -m "feat: 添加 TypeScript 类型定义"
```

---

### Task 4: 创建剪贴板工具函数

**Files:**
- Create: `src/utils/clipboard.ts`

**Step 1: 创建剪贴板工具**

```typescript
// src/utils/clipboard.ts

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns 是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // 降级方案：使用传统方法
    return fallbackCopy(text)
  }
}

/**
 * 降级复制方法（兼容旧浏览器）
 */
function fallbackCopy(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    const successful = document.execCommand('copy')
    document.body.removeChild(textarea)
    return successful
  } catch (error) {
    document.body.removeChild(textarea)
    return false
  }
}
```

**Step 2: 提交**

```bash
git add src/utils/clipboard.ts
git commit -m "feat: 添加剪贴板工具函数"
```

---

### Task 5: 迁移行政区划数据

**Files:**
- Create: `src/utils/areas.ts`
- Reference: 原项目的 `areas.js` 和 `area.js`

**Step 1: 复制并转换行政区划数据**

从原项目的 `areas.js` 复制数据，转换为 TypeScript 格式：

```typescript
// src/utils/areas.ts
import type { AreaMap } from '../types'

// 行政区划数据（部分）
export const areaMaps: AreaMap = {
  // 从原 areas.js 复制数据，格式保持一致
  // 示例结构：
  // '110000': {
  //   name: '北京市',
  //   '110100': {
  //     name: '市辖区',
  //     '110101': '东城区',
  //     ...
  //   }
  // }
}

/**
 * 根据 key 获取区域名称
 */
export function getNameByKey(key: string): string {
  // 实现逻辑从原 area.js 迁移
  return ''
}

/**
 * 获取子区域
 */
export function getChildren(parentKey: string): AreaMap | null {
  // 实现逻辑从原 area.js 迁移
  return null
}

/**
 * 随机获取一个区县代码
 */
export function getRandomCountyKey(areaMap: AreaMap): { countyKey: string } {
  // 从原 idCard.js 中的相关逻辑迁移
  const provinces = Object.keys(areaMap).filter(k => k.endsWith('0000'))
  // 随机选择省份，然后选择市、区
  // 返回 6 位区县代码
  return { countyKey: '110101' }
}
```

**Step 2: 手动复制完整数据**

打开原项目的 `areas.js`，将完整的 areaMaps 数据复制到新文件中。

**Step 3: 提交**

```bash
git add src/utils/areas.ts
git commit -m "feat: 迁移行政区划数据"
```

---

### Task 6: 实现身份证算法

**Files:**
- Create: `src/utils/idCard.ts`
- Reference: 原项目的 `idCard.js`

**Step 1: 创建身份证算法文件**

```typescript
// src/utils/idCard.ts
import type { ValidateResult } from '../types'
import { areaMaps, getRandomCountyKey } from './areas'

/**
 * 加权因子
 */
const WEIGHT_FACTORS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]

/**
 * 校验码映射
 */
const CHECK_CODE_MAP = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

/**
 * 计算身份证校验码
 */
function getVerifyCode(id17: string): string {
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(id17[i]) * WEIGHT_FACTORS[i]
  }
  return CHECK_CODE_MAP[sum % 11]
}

/**
 * 随机生成生日（1960-2000年）
 */
function getRandomDate(startYear: number, endYear: number): string {
  const startDate = new Date(startYear, 0, 1)
  const endDate = new Date(endYear, 11, 31)
  const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  const randomDate = new Date(randomTimestamp)

  const year = randomDate.getFullYear()
  const month = String(randomDate.getMonth() + 1).padStart(2, '0')
  const day = String(randomDate.getDate()).padStart(2, '0')

  return `${year}${month}${day}`
}

/**
 * 随机生成身份证号
 */
export function randomGenId(): string {
  // 获取随机区县代码
  const { countyKey } = getRandomCountyKey(areaMaps)

  // 随机生日
  const birthday = getRandomDate(1960, 2000)

  // 随机性别（顺序码）
  const sequenceCode = String(Math.floor(Math.random() * 1000)).padStart(3, '0')

  // 前17位
  const id17 = countyKey + birthday + sequenceCode

  // 计算校验码
  const checkCode = getVerifyCode(id17)

  return id17 + checkCode
}

/**
 * 校验身份证号
 */
export function validateIdCard(id: string): ValidateResult {
  // 格式校验
  const regex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/

  if (!regex.test(id)) {
    return {
      isValid: false,
      message: '身份证号格式不正确'
    }
  }

  // 校验码验证
  const id17 = id.substring(0, 17)
  const checkCode = id.substring(17, 18).toUpperCase()
  const calculatedCheckCode = getVerifyCode(id17)

  if (checkCode !== calculatedCheckCode) {
    return {
      isValid: false,
      message: '身份证号校验码不正确'
    }
  }

  return {
    isValid: true,
    message: '身份证号校验通过'
  }
}
```

**Step 2: 提交**

```bash
git add src/utils/idCard.ts
git commit -m "feat: 实现身份证生成和校验算法"
```

---

### Task 7: 实现统一社会信用代码算法

**Files:**
- Create: `src/utils/creditCode.ts`
- Reference: 原项目的 `creditCode.js`

**Step 1: 创建统一社会信用代码算法**

```typescript
// src/utils/creditCode.ts
import type { ValidateResult } from '../types'
import { areaMaps } from './areas'

/**
 * 字符到数值映射
 */
function getMapC(): { [key: string]: number } {
  const map: { [key: string]: number } =
  const chars = '0123456789ABCDEFGHJKLMNPQRTUWXY'
  for (let i = 0; i < chars.length; i++) {
    map[chars[i]] = i
  }
  return map
}

/**
 * 位置权重映射
 */
function getMapW(): number[] {
  return [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]
}

/**
 * 校验码映射
 */
function getMapR(): string[] {
  return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X', 'Y']
}

/**
 * 生成统一社会信用代码
 */
export function generateCreditCode(): string {
  // 第1位：登记管理部门代码（9=工商）
  const dept = '9'

  // 第2位：机构类别代码（1=企业）
  const type = '1'

  // 第3-8位：行政区划代码（随机选择）
  const provinces = Object.keys(areaMaps).filter(k => k.endsWith('0000'))
  const randomProvince = provinces[Math.floor(Math.random() * provinces.length)]
  const areaCode = randomProvince.substring(0, 6)

  // 第9-17位：组织机构代码（8位主体+1位校验）
  let orgCode = ''
  for (let i = 0; i < 8; i++) {
    orgCode += Math.floor(Math.random() * 10)
  }

  // 计算组织机构代码校验位
  const orgWeights = [3, 7, 9, 10, 5, 8, 4, 2]
  let orgSum = 0
  for (let i = 0; i < 8; i++) {
    orgSum += parseInt(orgCode[i]) * orgWeights[i]
  }
  const orgCheck = (11 - (orgSum % 11)) % 11
  orgCode += orgCheck === 10 ? 'X' : String(orgCheck)

  // 前17位
  const code17 = dept + type + areaCode + orgCode

  // 计算第18位校验码
  const mapC = getMapC()
  const mapW = getMapW()
  const mapR = getMapR()

  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += mapC[code17[i]] * mapW[i]
  }
  const checkIndex = 31 - (sum % 31)
  const checkCode = mapR[checkIndex]

  return code17 + checkCode
}

/**
 * 校验统一社会信用代码
 */
export function validateCreditCode(code: string): ValidateResult {
  // 格式校验
  const regex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/

  if (!regex.test(code)) {
    return {
      isValid: false,
      message: '统一社会信用代码格式不正确'
    }
  }

  // 校验码验证
  const mapC = getMapC()
  const mapW = getMapW()
  const mapR = getMapR()

  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += mapC[code[i]] * mapW[i]
  }
  const checkIndex = 31 - (sum % 31)
  const calculatedCheckCode = mapR[checkIndex]

  if (code[17] !== calculatedCheckCode) {
    return {
      isValid: false,
      message: '统一社会信用代码校验码不正确'
    }
  }

  return {
    isValid: true,
    message: '统一社会信用代码校验通过'
  }
}
```

**Step 2: 提交**

```bash
git add src/utils/creditCode.ts
git commit -m "feat: 实现统一社会信用代码生成和校验算法"
```

---

### Task 8: 实现手机号算法

**Files:**
- Create: `src/utils/phone.ts`
- Reference: 原项目的 `phoneNo.js`

**Step 1: 创建手机号算法**

```typescript
// src/utils/phone.ts
import type { ValidateResult } from '../types'

/**
 * 手机号段列表
 */
const PHONE_PREFIXES = [
  '130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
  '145', '147', '149',
  '150', '151', '152', '153', '155', '156', '157', '158', '159',
  '162', '165', '166', '167',
  '170', '171', '172', '173', '175', '176', '177', '178',
  '180', '181', '182', '183', '184', '185', '186', '187', '188', '189',
  '190', '191', '192', '193', '195', '196', '197', '198', '199'
]

/**
 * 生成手机号
 */
export function generatePhone(): string {
  // 随机选择号段
  const prefix = PHONE_PREFIXES[Math.floor(Math.random() * PHONE_PREFIXES.length)]

  // 生成后8位
  let suffix = ''
  for (let i = 0; i < 8; i++) {
    suffix += Math.floor(Math.random() * 10)
  }

  return prefix + suffix
}

/**
 * 校验手机号
 */
export function validatePhone(phone: string): ValidateResult {
  const regex = /^1[3-9]\d{9}$/

  if (!regex.test(phone)) {
    return {
      isValid: false,
      message: '手机号格式不正确'
    }
  }

  return {
    isValid: true,
    message: '手机号校验通过'
  }
}
```

**Step 2: 提交**

```bash
git add src/utils/phone.ts
git commit -m "feat: 实现手机号生成和校验算法"
```

---

### Task 9: 实现银行卡号算法

**Files:**
- Create: `src/utils/bankCard.ts`
- Reference: 原项目的 `bankaccount.js`

**Step 1: 创建银行卡号算法**

```typescript
// src/utils/bankCard.ts
import type { ValidateResult } from '../types'

/**
 * Luhn 算法计算校验位
 */
function luhnChecksum(cardNumber: string): number {
  let sum = 0
  let isEven = false

  // 从右往左遍历
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10
}

/**
 * 生成银行卡号
 */
export function generateBankCard(): string {
  // 银行卡号前缀（示例：622202 为工商银行）
  const prefixes = ['622202', '622200', '621226', '621225', '621281', '621558']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]

  // 生成卡号长度（16-19位）
  const length = 16 + Math.floor(Math.random() * 4)

  // 生成前 length-1 位
  let cardNumber = prefix
  while (cardNumber.length < length - 1) {
    cardNumber += Math.floor(Math.random() * 10)
  }

  // 计算校验位
  const checksum = luhnChecksum(cardNumber + '0')
  const checkDigit = checksum === 0 ? 0 : 10 - checksum

  return cardNumber + checkDigit
}

/**
 * 校验银行卡号（Luhn 算法）
 */
export function validateBankCard(card: string): ValidateResult {
  // 格式校验
  const regex = /^\d{16,19}$/

  if (!regex.test(card)) {
    return {
      isValid: false,
      message: '银行卡号格式不正确'
    }
  }

  // Luhn 算法校验
  const checksum = luhnChecksum(card)

  if (checksum !== 0) {
    return {
      isValid: false,
      message: '银行卡号校验失败'
    }
  }

  return {
    isValid: true,
    message: '银行卡号校验通过'
  }
}
```

**Step 2: 提交**

```bash
git add src/utils/bankCard.ts
git commit -m "feat: 实现银行卡号生成和校验算法"
```

---

## 组件开发

### Task 10: 创建身份证生成器组件

**Files:**
- Create: `src/components/IdCardGenerator.vue`

**Step 1: 创建组件文件**

```vue
<template>
  <n-card title="身份证号码" :bordered="false">
    <n-space vertical :size="16">
      <n-input
        v-model:value="idCard"
        placeholder="点击生成按钮"
        readonly
        size="large"
      />
      <n-space :size="12">
        <n-button
          type="success"
          :loading="generating"
          @click="handleGenerate"
        >
          随机生成
        </n-button>
        <n-button
          type="info"
          :disabled="!idCard"
          @click="handleValidate"
        >
          校验
        </n-button>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NButton, NSpace, useMessage } from 'naive-ui'
import { randomGenId, validateIdCard } from '../utils/idCard'
import { copyToClipboard } from '../utils/clipboard'

const message = useMessage()
const idCard = ref('')
const generating = ref(false)

async function handleGenerate() {
  generating.value = true
  try {
    idCard.value = randomGenId()
    const copied = await copyToClipboard(idCard.value)
    if (copied) {
      message.success('已生成并复制到剪贴板')
    } else {
      message.warning('已生成，但复制失败，请手动复制')
    }
  } catch (error) {
    message.error('生成失败，请重试')
  } finally {
    generating.value = false
  }
}

function handleValidate() {
  const result = validateIdCard(idCard.value)
  if (result.isValid) {
    message.success(result.message)
  } else {
    message.warning(result.message)
  }
}
</script>

<style scoped>
:deep(.n-card) {
  height: 100%;
}
</style>
```

**Step 2: 提交**

```bash
git add src/components/IdCardGenerator.vue
git commit -m "feat: 创建身份证生成器组件"
```

---

### Task 11: 创建统一社会信用代码生成器组件

**Files:**
- Create: `src/components/CreditCodeGenerator.vue`

**Step 1: 创建组件文件**

```vue
<template>
  <n-card title="统一社会信用代码" :bordered="false">
    <n-space vertical :size="16">
      <n-input
        v-model:value="creditCode"
        placeholder="点击生成按钮"
        readonly
        size="large"
      />
      <n-space :size="12">
        <n-button
          type="success"
          :loading="generating"
          @click="handleGenerate"
        >
          生成
        </n-button>
        <n-button
          type="info"
          :disabled="!creditCode"
          @click="handleValidate"
        >
          校验
        </n-button>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NButton, NSpace, useMessage } from 'naive-ui'
import { generateCreditCode, validateCreditCode } from '../utils/creditCode'
import { copyToClipboard } from '../utils/clipboard'

const message = useMessage()
const creditCode = ref('')
const generating = ref(false)

async function handleGenerate() {
  generating.value = true
  try {
    creditCode.value = generateCreditCode()
    const copied = await copyToClipboard(creditCode.value)
    if (copied) {
      message.success('已生成并复制到剪贴板')
    } else {
      message.warning('已生成，但复制失败，请手动复制')
    }
  } catch (error) {
    message.error('生成失败，请重试')
  } finally {
    generating.value = false
  }
}

function handleValidate() {
  const result = validateCreditCode(creditCode.value)
  if (result.isValid) {
    message.success(result.message)
  } else {
    message.warning(result.message)
  }
}
</script>

<style scoped>
:deep(.n-card) {
  height: 100%;
}
</style>
```

**Step 2: 提交**

```bash
git add src/components/CreditCodeGenerator.vue
git commit -m "feat: 创建统一社会信用代码生成器组件"
```

---

### Task 12: 创建手机号生成器组件

**Files:**
- Create: `src/components/PhoneGenerator.vue`

**Step 1: 创建组件文件**

```vue
<template>
  <n-card title="手机号码" :bordered="false">
    <n-space vertical :size="16">
      <n-input
        v-model:value="phone"
        placeholder="点击生成按钮"
        readonly
        size="large"
      />
      <n-space :size="12">
        <n-button
          type="success"
          :loading="generating"
          @click="handleGenerate"
        >
          生成
        </n-button>
        <n-button
          type="info"
          :disabled="!phone"
          @click="handleValidate"
        >
          校验
        </n-button>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NButton, NSpace, useMessage } from 'naive-ui'
import { generatePhone, validatePhone } from '../utils/phone'
import { copyToClipboard } from '../utils/clipboard'

const message = useMessage()
const phone = ref('')
const generating = ref(false)

async function handleGenerate() {
  generating.value = true
  try {
    phone.value = generatePhone()
    const copied = await copyToClipboard(phone.value)
    if (copied) {
      message.success('已生成并复制到剪贴板')
    } else {
      message.warning('已生成，但复制失败，请手动复制')
    }
  } catch (error) {
    message.error('生成失败，请重试')
  } finally {
    generating.value = false
  }
}

function handleValidate() {
  const result = validatePhone(phone.value)
  if (result.isValid) {
    message.success(result.message)
  } else {
    message.warning(result.message)
  }
}
</script>

<style scoped>
:deep(.n-card) {
  height: 100%;
}
</style>
```

**Step 2: 提交**

```bash
git add src/components/PhoneGenerator.vue
git commit -m "feat: 创建手机号生成器组件"
```

---

### Task 13: 创建银行卡号生成器组件

**Files:**
- Create: `src/components/BankCardGenerator.vue`

**Step 1: 创建组件文件**

```vue
<template>
  <n-card title="银行卡号" :bordered="false">
    <n-space vertical :size="16">
      <n-input
        v-model:value="bankCard"
        placeholder="点击生成按钮"
        readonly
        size="large"
      />
      <n-space :size="12">
        <n-button
          type="success"
          :loading="generating"
          @click="handleGenerate"
        >
          生成
        </n-button>
        <n-button
          type="info"
          :disabled="!bankCard"
          @click="handleValidate"
        >
          校验
        </n-button>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NButton, NSpace, useMessage } from 'naive-ui'
import { generateBankCard, validateBankCard } from '../utils/bankCard'
import { copyToClipboard } from '../utils/clipboard'

const message = useMessage()
const bankCard = ref('')
const generating = ref(false)

async function handleGenerate() {
  generating.value = true
  try {
    bankCard.value = generateBankCard()
    const copied = await copyToClipboard(bankCard.value)
    if (copied) {
      message.success('已生成并复制到剪贴板')
    } else {
      message.warning('已生成，但复制失败，请手动复制')
    }
  } catch (error) {
    message.error('生成失败，请重试')
  } finally {
    generating.value = false
  }
}

function handleValidate() {
  const result = validateBankCard(bankCard.value)
  if (result.isValid) {
    message.success(result.message)
  } else {
    message.warning(result.message)
  }
}
</script>

<style scoped>
:deep(.n-card) {
  height: 100%;
}
</style>
```

**Step 2: 提交**

```bash
git add src/components/BankCardGenerator.vue
git commit -m "feat: 创建银行卡号生成器组件"
```

---

## 集成与部署

### Task 14: 集成所有组件到 App.vue

**Files:**
- Modify: `src/App.vue`

**Step 1: 更新 App.vue**

```vue
<template>
  <n-config-provider>
    <n-message-provider>
      <div class="app-container">
        <h1>测试数据生成器</h1>
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-gi>
            <IdCardGenerator />
          </n-gi>
          <n-gi>
            <CreditCodeGenerator />
          </n-gi>
          <n-gi>
            <PhoneGenerator />
          </n-gi>
          <n-gi>
            <BankCardGenerator />
          </n-gi>
        </n-grid>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NGrid, NGi } from 'naive-ui'
import IdCardGenerator from './components/IdCardGenerator.vue'
import CreditCodeGenerator from './components/CreditCodeGenerator.vue'
import PhoneGenerator from './components/PhoneGenerator.vue'
import BankCardGenerator from './components/BankCardGenerator.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
  min-width: 1024px;
}

h1 {
  text-align: center;
  margin-bottom: 32px;
  font-size: 28px;
  color: #333;
}
</style>
```

**Step 2: 验证所有功能**

```bash
npm run dev
```

预期：
- 页面显示 2x2 网格布局
- 4 个生成器卡片正常显示
- 点击"生成"按钮能生成数据并复制到剪贴板
- 点击"校验"按钮能正确校验数据

**Step 3: 提交**

```bash
git add src/App.vue
git commit -m "feat: 集成所有生成器组件"
```

---

### Task 15: 配置 GitHub Actions 自动部署

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: 创建 GitHub Actions 配置**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: false
```

**Step 2: 提交**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: 添加 GitHub Actions 自动部署配置"
```

---

### Task 16: 更新 README 文档

**Files:**
- Modify: `README.md`

**Step 1: 更新 README.md**

```markdown
# 测试数据生成器

一个基于 Vue 3 + TypeScript 的测试数据生成工具，用于生成符合中国标准的各类测试编号。

## 功能

- ✅ 身份证号码生成与校验
- ✅ 统一社会信用代码生成与校验
- ✅ 手机号码生成与校验
- ✅ 银行卡号生成与校验（Luhn 算法）

## 技术栈

- Vue 3
- TypeScript
- Vite
- Naive UI

## 本地开发

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

## 部署

推送代码到 main/master 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。

## 注意事项

1. 所有生成的数据仅用于测试目的，不具有实际意义
2. 生成后会自动复制到剪贴板
3. 支持手动输入后校验

## License

MIT
```

**Step 2: 提交**

```bash
git add README.md
git commit -m "docs: 更新 README 文档"
```

---

### Task 17: 最终测试与部署

**Step 1: 本地构建测试**

```bash
npm run build
npm run preview
```

预期：
- 构建成功，无 TypeScript 错误
- 预览服务器启动，功能正常

**Step 2: 推送到远程仓库**

```bash
git push origin master
```

**Step 3: 等待 GitHub Actions 完成**

- 访问 GitHub 仓库的 Actions 标签页
- 查看构建状态，确保成功
- 等待 gh-pages 分支创建

**Step 4: 配置 GitHub Pages**

1. 进入 GitHub 仓库 Settings → Pages
2. Source 选择 "gh-pages" 分支
3. Directory 选择 "/ (root)"
4. 点击 Save

**Step 5: 验证部署**

访问 `https://viquu.github.io/generator/`，确认：
- 页面正常显示
- 所有生成器功能正常
- 自动复制功能正常

**Step 6: 清理旧文件（可选）**

如果需要，可以删除原项目的旧文件：
- 旧的 HTML/JS/CSS 文件
- jQuery 和 Bootstrap 3 相关文件
- 但建议先保留，确认新版本完全正常后再删除

---

## 完成

所有任务完成后，项目已成功从 jQuery + Bootstrap 3 迁移到 Vue 3 + TypeScript + Vite + Naive UI。

**验收标准：**
- ✅ 所有 4 个生成器功能正常
- ✅ 生成的数据通过校验
- ✅ 自动复制功能正常
- ✅ 在 MacBook Pro 14 寸上一屏内完全可见
- ✅ GitHub Actions 自动部署成功
- ✅ 代码通过 TypeScript 类型检查
- ✅ 支持 Vimium 等键盘导航工具

**后续优化方向：**
- 添加单元测试
- 添加 E2E 测试
- 性能优化
- 添加暗色主题
- 扩展新的生成器（电话号码、邮箱等）

