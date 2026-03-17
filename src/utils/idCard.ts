// src/utils/idCard.ts

import type { ValidateResult } from '@/types'
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
  const sex = Math.floor(Math.random() * 2) + 1 // 1 or 2
  let sequenceCode = Math.floor(100 + Math.random() * (999 - 100))

  // 调整顺序码以匹配性别（奇数=男，偶数=女）
  if (sex === 1 && sequenceCode % 2 === 0) {
    sequenceCode += 1
  }
  if (sex === 2 && sequenceCode % 2 !== 0) {
    sequenceCode += 1
  }

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
  const regex = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[xX])$/

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
