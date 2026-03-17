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
