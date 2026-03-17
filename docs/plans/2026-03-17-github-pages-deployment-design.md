# GitHub Pages 部署方案设计

## 概述

将项目从传统的 gh-pages 分支部署方式迁移到 GitHub 官方推荐的 GitHub Actions 部署方式。

**目标：**
- 使用 GitHub 官方的 actions/deploy-pages 进行部署
- 移除对 gh-pages 分支的依赖
- 采用现代化的部署流程

**背景：**
- 项目刚完成从 jQuery + Bootstrap 3 到 Vue 3 + Element Plus 的现代化改造
- 现有 workflow 使用第三方 action（peaceiris/actions-gh-pages）推送到 gh-pages 分支
- GitHub 从 2022 年起推荐使用 GitHub Actions 直接部署

## 架构设计

### 部署流程

```
推送到 master 分支
    ↓
GitHub Actions 触发
    ↓
Job 1: Build
  - 安装依赖 (npm ci)
  - 构建项目 (npm run build)
  - 上传 dist 目录为 artifact
    ↓
Job 2: Deploy
  - 下载 artifact
  - 部署到 GitHub Pages
    ↓
网站更新完成
```

### 关键变化

**从：**
- 使用 peaceiris/actions-gh-pages@v3
- 推送构建产物到 gh-pages 分支
- 从 gh-pages 分支部署
- 需要 `contents: write` 权限

**到：**
- 使用 actions/upload-pages-artifact@v3 和 actions/deploy-pages@v4
- 上传构建产物为 artifact
- 直接从 artifact 部署
- 需要 `pages: write` 和 `id-token: write` 权限

### 权限配置

```yaml
permissions:
  contents: read      # 读取仓库代码
  pages: write        # 部署到 GitHub Pages
  id-token: write     # 获取 OIDC token（Pages 部署需要）
```

## Workflow 配置

### 新的 workflow 文件

文件路径：`.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

# 防止并发部署
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 改进点

1. **Actions 版本升级**
   - checkout: v3 → v4
   - setup-node: v3 → v4
   - Node.js: 18 → 20

2. **并发控制**
   - 添加 `concurrency` 配置防止多个部署同时进行
   - `cancel-in-progress: false` 确保部署完整执行

3. **环境跟踪**
   - 使用 `environment: github-pages` 跟踪部署历史
   - 在 GitHub UI 中可以看到部署记录和 URL

4. **职责分离**
   - build job：构建和上传
   - deploy job：部署
   - 清晰的依赖关系（deploy needs build）

## GitHub 仓库配置

### 配置步骤

1. 访问仓库设置页面：
   ```
   https://github.com/viquu/generator/settings/pages
   ```

2. 在 **Build and deployment** 部分：
   - **Source**: 选择 "GitHub Actions"
   - 保存后自动生效

3. 配置完成标志：
   - Source 显示为 "GitHub Actions"
   - 不再显示分支选择器

### 现有配置检查

- ✅ `vite.config.ts` 已正确配置 `base: '/generator/'`
- ✅ 构建输出目录为 `dist`
- ✅ 仓库名称为 `generator`

## 测试验证

### 部署验证步骤

1. **推送代码**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "feat: 升级到 GitHub Pages 官方部署方式"
   git push origin master
   ```

2. **监控部署**
   - 访问 `https://github.com/viquu/generator/actions`
   - 查看最新的 workflow 运行
   - 确认 build 和 deploy 两个 job 都成功

3. **验证网站**
   - 访问 `https://viquu.github.io/generator/`
   - 测试各个生成器功能：
     - 身份证号生成器
     - 统一社会信用代码生成器
     - 手机号生成器
     - 银行卡号生成器

4. **检查资源加载**
   - 打开浏览器开发者工具
   - 确认所有 JS/CSS 资源正确加载
   - 确认没有 404 错误

### 故障排查

**如果部署失败：**

1. 检查 Actions 日志中的错误信息
2. 确认 GitHub Pages 设置中 Source 为 "GitHub Actions"
3. 确认权限配置正确
4. 检查 vite.config.ts 中的 base 路径

**常见问题：**

- **403 错误**：检查 `pages: write` 权限是否配置
- **资源 404**：检查 `base: '/generator/'` 配置
- **部署卡住**：检查是否有并发部署，等待前一个完成

## 可选：清理工作

### 删除 gh-pages 分支

在确认新部署方式正常工作后，可以删除旧的 gh-pages 分支：

```bash
# 删除远程分支
git push origin --delete gh-pages

# 删除本地分支（如果有）
git branch -D gh-pages
```

**注意：** 这是可选操作，不影响新的部署方式。

## 优势总结

1. **官方支持**：GitHub 官方推荐和维护的方式
2. **更简洁**：不需要额外的 gh-pages 分支
3. **更快速**：直接从 artifact 部署，减少中间步骤
4. **更安全**：使用 OIDC token，权限控制更精细
5. **更现代**：与项目的技术栈现代化保持一致
6. **可追踪**：在 Environments 中可以看到完整的部署历史

## 实施计划

1. 修改 `.github/workflows/deploy.yml` 文件
2. 提交并推送到 master 分支
3. 在 GitHub 仓库设置中将 Pages Source 改为 "GitHub Actions"
4. 等待自动部署完成
5. 验证网站功能
6. （可选）删除 gh-pages 分支
