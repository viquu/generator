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
 
