// src/utils/bankCard.ts

import type { ValidateResult } from '@/types'

/**
 * 银行卡号开头BIN码
 */
const BANK_BIN_CODES = [
  '10', '18', '30', '35', '37', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '50', '51', '52', '53', '54', '55', '56', '58', '60', '62', '65', '68', '69',
  '84', '87', '88', '94', '95', '98', '99'
]

/**
 * 生成银行卡号（使用Luhn算法）
 */
export function generateBankCard(): string {
  // 随机选择开头BIN码
  const randomIndex = Math.floor(Math.random() * BANK_BIN_CODES.length)
  const start = BANK_BIN_CODES[randomIndex]

  // 生成中间随机数字（13位）
  const min = 1000000000000
  const max = 9999999999999
  const middle = Math.floor(Math.random() * (max - min) + min)

  // 前15位
  const first15 = start + middle

  // 计算Luhn校验码
  const checkDigit = calculateLuhnCheckDigit(first15)

  return first15 + checkDigit
}

/**
 * 计算Luhn校验位
 */
function calculateLuhnCheckDigit(cardNumber: string): string {
  const digits = cardNumber.split('').reverse()
  const oddSum: number[] = []
  const evenSum: number[] = []
  const evenDoubledOver9: number[] = []

  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i])
    if ((i + 1) % 2 === 1) {
      // 奇数位（从右往左第1,3,5...位）
      const doubled = digit * 2
      if (doubled < 9) {
        oddSum.push(doubled)
      } else {
        evenDoubledOver9.push(doubled)
      }
    } else {
      // 偶数位
      evenSum.push(digit)
    }
  }

  // 处理大于9的奇数位乘积
  const over9Ones: number[] = []
  const over9Tens: number[] = []
  for (const num of evenDoubledOver9) {
    over9Ones.push(num % 10)
    over9Tens.push(Math.floor(num / 10))
  }

  // 计算总和
  const sumOdd = oddSum.reduce((a, b) => a + b, 0)
  const sumEven = evenSum.reduce((a, b) => a + b, 0)
  const sumOver9Ones = over9Ones.reduce((a, b) => a + b, 0)
  const sumOver9Tens = over9Tens.reduce((a, b) => a + b, 0)

  const total = sumOdd + sumEven + sumOver9Ones + sumOver9Tens

  // 计算校验位
  const k = total % 10 === 0 ? 10 : total % 10
  const luhn = 10 - k

  return luhn.toString()
}

/**
 * 校验银行卡号（Luhn算法）
 */
export function validateBankCard(cardNumber: string): ValidateResult {
  if (!cardNumber || cardNumber.trim() === '') {
    return {
      isValid: false,
      message: '请输入银行卡号'
    }
  }

  if (cardNumber.length < 16 || cardNumber.length > 19) {
    return {
      isValid: false,
      message: '银行卡号长度必须在16到19之间'
    }
  }

  const numRegex = /^\d*$/
  if (!numRegex.test(cardNumber)) {
    return {
      isValid: false,
      message: '银行卡号必须全为数字'
    }
  }

  // 检查BIN码
  const binCodes = BANK_BIN_CODES.join(',')
  if (binCodes.indexOf(cardNumber.substring(0, 2)) === -1) {
    return {
      isValid: false,
      message: '银行卡号开头BIN码不符合规范'
    }
  }

  // Luhn校验
  const lastDigit = cardNumber.substr(cardNumber.length - 1, 1)
  const first15 = cardNumber.substr(0, cardNumber.length - 1)
  const calculatedCheckDigit = calculateLuhnCheckDigit(first15)

  if (lastDigit !== calculatedCheckDigit) {
    return {
      isValid: false,
      message: '银行卡号不符合Luhn校验'
    }
  }

  return {
    isValid: true,
    message: 'Luhn验证通过'
  }
}
