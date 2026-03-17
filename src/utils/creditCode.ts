// src/utils/creditCode.ts

import type { ValidateResult } from '@/types'

/**
 * 字符到数值的映射
 */
function getMapC(char: string): number | undefined {
  const map: { [key: string]: number } = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17,
    'J': 18, 'K': 19, 'L': 20, 'M': 21, 'N': 22, 'P': 23, 'Q': 24, 'R': 25,
    'T': 26, 'U': 27, 'W': 28, 'X': 29, 'Y': 30
  }
  return map[char]
}

/**
 * 位置权重映射
 */
function getMapW(position: string): number | undefined {
  const map: { [key: string]: number } = {
    '1': 1, '2': 3, '3': 9, '4': 27, '5': 19, '6': 26, '7': 16, '8': 17,
    '9': 20, '10': 29, '11': 25, '12': 13, '13': 8, '14': 24, '15': 10,
    '16': 30, '17': 28
  }
  return map[position]
}

/**
 * 校验码映射
 */
function getMapR(value: string): string | undefined {
  const map: { [key: string]: string } = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '10': 'A', '11': 'B', '12': 'C', '13': 'D', '14': 'E', '15': 'F', '16': 'G', '17': 'H',
    '18': 'J', '19': 'K', '20': 'L', '21': 'M', '22': 'N', '23': 'P', '24': 'Q', '25': 'R',
    '26': 'T', '27': 'U', '28': 'W', '29': 'X', '30': 'Y', '31': '0'
  }
  return map[value]
}

/**
 * 生成组织机构代码（8位数字+1位校验码）
 */
function generateOrgCode(): string {
  const num = Math.floor(10000000 + Math.random() * (99999999 - 10000000))
  const ws = [3, 7, 9, 10, 5, 8, 4, 2]
  let sum = 0

  for (let i = 0; i < 8; i++) {
    sum += parseInt((num + '').charAt(i)) * ws[i]
  }

  let C9: string | number = 11 - (sum % 11)
  if (C9 === 11) {
    C9 = '0'
  } else if (C9 === 10) {
    C9 = 'X'
  } else {
    C9 = C9 + ''
  }

  return num + '' + C9
}

/**
 * 生成统一社会信用代码
 */
export function generateCreditCode(): string {
  // 第1位：登记管理部门代码（默认9=工商）
  const regOrg = '9'

  // 第2位：机构类别代码（默认1=企业）
  const orgType = '1'

  // 第3-8位：行政区划代码（从简化的区划数组中随机选择）
  const areas = [
    '110000', '110101', '120000', '120101', '130000', '130100',
    '140000', '140100', '150000', '150100', '210000', '210100',
    '220000', '220100', '230000', '230100', '310000', '310101',
    '320000', '320100', '330000', '330100', '340000', '340100',
    '350000', '350100', '360000', '360100', '370000', '370100',
    '410000', '410100', '420000', '420100', '430000', '430100',
    '440000', '440100', '450000', '450100', '460000', '460100',
    '500000', '500101', '510000', '510100', '520000', '520100',
    '530000', '530100', '540000', '540100', '610000', '610100',
    '620000', '620100', '630000', '630100', '640000', '640100',
    '650000', '650100'
  ]
  const randomIndex = Math.floor(Math.random() * areas.length)
  const area = areas[randomIndex]

  // 第9-17位：组织机构代码
  const orgCode = generateOrgCode()

  // 前17位
  const code17 = regOrg + orgType + area + orgCode

  // 计算第18位校验码
  let sum = 0
  for (let i = 0; i < 17; i++) {
    const charValue = getMapC(code17.charAt(i))
    const weight = getMapW((i + 1).toString())
    if (charValue !== undefined && weight !== undefined) {
      sum += charValue * weight
    }
  }

  let C18 = 31 - (sum % 31)
  if (C18 === 31) {
    C18 = 0
  }

  const checkCode = getMapR(C18.toString())

  return code17 + checkCode
}

/**
 * 校验统一社会信用代码
 */
export function validateCreditCode(creditCode: string): ValidateResult {
  const upperCode = creditCode.toUpperCase()

  if (upperCode.length !== 18) {
    return {
      isValid: false,
      message: '信用代码必须为18位'
    }
  }

  let sum = 0
  const arr = upperCode.split('')

  for (let i = 0; i < arr.length - 1; i++) {
    const c = arr[i]
    const charValue = getMapC(c)

    if (charValue === undefined) {
      return {
        isValid: false,
        message: '请输入正确的信用代码'
      }
    }

    const weight = getMapW((i + 1).toString())

    if (weight === undefined) {
      return {
        isValid: false,
        message: '请输入正确的信用代码'
      }
    }

    sum += charValue * weight
  }

  const mod = sum % 31
  const calculatedCheckCode = getMapR((31 - mod).toString())

  if (calculatedCheckCode === undefined) {
    return {
      isValid: false,
      message: '请输入正确的信用代码'
    }
  }

  if (arr[arr.length - 1] !== calculatedCheckCode) {
    return {
      isValid: false,
      message: '请输入正确的信用代码'
    }
  }

  return {
    isValid: true,
    message: '校验通过'
  }
}
