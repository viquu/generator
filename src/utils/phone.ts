// src/utils/phone.ts

import type { ValidateResult } from '@/types'

/**
 * 手机号段列表
 */
const PHONE_PREFIXES = [
  '130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
  '145', '147', '150', '151', '152', '153', '156', '157', '158', '159',
  '170', '176', '177', '178', '180', '181', '182', '183', '184', '185',
  '186', '187', '188', '189'
]

/**
 * 生成手机号
 */
export function generatePhone(): string {
  // 随机选择号段
  const randomIndex = Math.floor(Math.random() * PHONE_PREFIXES.length)
  const prefix = PHONE_PREFIXES[randomIndex]

  // 生成后8位随机数字
  const min = 10000000
  const max = 99999999
  const suffix = Math.floor(Math.random() * (max - min) + min)

  return prefix + suffix
}

/**
 * 校验手机号
 */
export function validatePhone(phone: string): ValidateResult {
  const regex = /^1[3|4|5|7|8][0-9]\d{8}$/

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
