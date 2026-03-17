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
