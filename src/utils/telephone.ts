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
