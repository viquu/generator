# GitHub Pages 部署升级实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 GitHub Pages 部署从 gh-pages 分支方式升级到 GitHub Actions 官方部署方式

**Architecture:** 修改现有的 GitHub Actions workflow，使用 actions/upload-pages-artifact 和 actions/deploy-pages 替代 peaceiris/actions-gh-pages，实现无需 gh-pages 分支的直接部署

**Tech Stack:** GitHub Actions, Vite, Vue 3

---

## Task 1: 更新 Workflow 文件

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Step 1: 备份当前 workflow 文件**

```bash
cp .github/workflows/deploy.yml .github/workflows/deploy.yml.backup
git add .github/workflows/deploy.yml.backup
git commit -m "backup: 保存旧的 workflow 配置"
```

**Step 2: 修改 workflow 文件 - 更新头部配置**

修改 `.github/workflows/deploy.yml` 的第 1-8 行：

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
```

**关键变化：**
- 权限从 `contents: write` 改为 `contents: read, pages: write, id-token: write`
- 添加 `concurrency` 配置

**Step 3: 修改 workflow 文件 - 更新 build job**

修改 `.github/workflows/deploy.yml` 的 jobs 部分，替换整个 `build-and-deploy` job 为两个独立的 job。

首先是 build job：

```yaml
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
```

**关键变化：**
- actions/checkout@v3 → v4
- actions/setup-node@v3 → v4
- Node.js 18 → 20
- 移除 Deploy to gh-pages 步骤
- 添加 Upload artifact 步骤

**Step 4: 修改 workflow 文件 - 添加 deploy job**

在 build job 之后添加 deploy job：

```yaml
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

**关键变化：**
- 新增独立的 deploy job
- 使用 `needs: build` 确保顺序执行
- 使用 `environment: github-pages` 跟踪部署
- 使用官方的 actions/deploy-pages@v4

**Step 5: 验证 workflow 文件语法**

检查完整的 workflow 文件内容：

```bash
cat .github/workflows/deploy.yml
```

预期输出应该是完整的 YAML 文件，包含：
- name, on, permissions, concurrency
- build job（7个步骤）
- deploy job（1个步骤）

**Step 6: 提交修改**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: 升级到 GitHub Pages 官方部署方式

- 使用 actions/upload-pages-artifact 和 actions/deploy-pages
- 升级 actions 版本到 v4
- 升级 Node.js 到 20
- 添加并发控制和环境跟踪
- 移除对 gh-pages 分支的依赖"
```

---

## Task 2: 推送并配置 GitHub Pages

**Files:**
- Remote: GitHub repository settings

**Step 1: 推送到远程仓库**

```bash
git push origin master
```

预期输出：
```
Enumerating objects: X, done.
...
To github.com:viquu/generator.git
   xxxxxxx..yyyyyyy  master -> master
```

**Step 2: 在 GitHub 配置 Pages 部署源**

手动操作步骤：

1. 打开浏览器访问：`https://github.com/viquu/generator/settings/pages`

2. 在 **Build and deployment** 部分：
   - 找到 **Source** 下拉菜单
   - 从 "Deploy from a branch" 改为 **"GitHub Actions"**
   - 页面会自动保存

3. 确认配置：
   - Source 显示为 "GitHub Actions"
   - 不再显示分支选择器
   - 页面顶部可能显示 "Your site is ready to be published at https://viquu.github.io/generator/"

**Step 3: 监控首次部署**

1. 访问 Actions 页面：`https://github.com/viquu/generator/actions`

2. 查看最新的 "Deploy to GitHub Pages" workflow 运行

3. 确认两个 job 都成功：
   - ✅ build（约 1-2 分钟）
   - ✅ deploy（约 30 秒）

4. 如果失败，点击失败的 job 查看日志

**常见问题排查：**

- **403 Forbidden**: 检查 Settings → Actions → General → Workflow permissions 是否允许 "Read and write permissions"
- **pages: write permission denied**: 确认 Pages Source 已改为 "GitHub Actions"
- **artifact not found**: 确认 build job 成功完成

---

## Task 3: 验证部署结果

**Files:**
- Remote: https://viquu.github.io/generator/

**Step 1: 访问部署的网站**

在浏览器中打开：`https://viquu.github.io/generator/`

预期结果：
- 页面正常加载
- 显示 Vue 3 + Element Plus 的界面
- 没有 404 错误

**Step 2: 测试各个生成器功能**

逐一测试：

1. **身份证号生成器**
   - 点击"手气不错"按钮
   - 确认生成 18 位身份证号
   - 确认自动复制提示

2. **统一社会信用代码生成器**
   - 点击"手气不错"按钮
   - 确认生成 18 位信用代码
   - 确认自动复制提示

3. **手机号生成器**
   - 点击"手气不错"按钮
   - 确认生成 11 位手机号
   - 确认自动复制提示

4. **银行卡号生成器**
   - 点击"手气不错"按钮
   - 确认生成 16-19 位银行卡号
   - 确认自动复制提示

**Step 3: 检查浏览器控制台**

打开浏览器开发者工具（F12）：

1. 切换到 Console 标签
   - 确认没有 JavaScript 错误
   - 确认没有红色错误信息

2. 切换到 Network 标签
   - 刷新页面
   - 确认所有资源状态码为 200
   - 确认没有 404 错误
   - 确认 JS/CSS 文件路径正确（包含 /generator/ 前缀）

**Step 4: 记录验证结果**

创建验证记录：

```bash
echo "# 部署验证记录

部署时间: $(date)
部署 URL: https://viquu.github.io/generator/
Workflow 运行: https://github.com/viquu/generator/actions

## 功能测试
- [x] 身份证号生成器
- [x] 统一社会信用代码生成器
- [x] 手机号生成器
- [x] 银行卡号生成器

## 技术检查
- [x] 页面正常加载
- [x] 资源路径正确
- [x] 无控制台错误
- [x] 自动复制功能正常

验证通过 ✅
" > deployment-verification.txt

git add deployment-verification.txt
git commit -m "docs: 添加部署验证记录"
```

---

## Task 4: 清理工作（可选）

**Files:**
- Remote: gh-pages branch (if exists)

**Step 1: 检查是否存在 gh-pages 分支**

```bash
git ls-remote --heads origin gh-pages
```

预期输出：
- 如果存在：显示 commit hash 和 refs/heads/gh-pages
- 如果不存在：无输出

**Step 2: 删除远程 gh-pages 分支（如果存在）**

⚠️ **警告：** 只有在确认新部署方式正常工作后才执行此步骤

```bash
git push origin --delete gh-pages
```

预期输出：
```
To github.com:viquu/generator.git
 - [deleted]         gh-pages
```

**Step 3: 删除本地 gh-pages 分支（如果存在）**

```bash
# 检查本地分支
git branch -a | grep gh-pages

# 如果存在本地分支，删除它
git branch -D gh-pages
```

**Step 4: 删除备份文件**

```bash
git rm .github/workflows/deploy.yml.backup
git commit -m "chore: 清理旧的 workflow 备份文件"
```

**Step 5: 推送清理后的代码**

```bash
git push origin master
```

---

## 完成检查清单

部署升级完成后，确认以下所有项目：

- [ ] `.github/workflows/deploy.yml` 已更新为新的配置
- [ ] GitHub Pages Source 已改为 "GitHub Actions"
- [ ] Workflow 运行成功（build + deploy 都通过）
- [ ] 网站可以正常访问 https://viquu.github.io/generator/
- [ ] 所有生成器功能正常工作
- [ ] 浏览器控制台无错误
- [ ] 资源文件正确加载（无 404）
- [ ] 自动复制功能正常
- [ ] （可选）gh-pages 分支已删除

## 回滚方案

如果新部署方式出现问题，可以快速回滚：

```bash
# 恢复旧的 workflow 文件
git checkout HEAD~1 .github/workflows/deploy.yml
git commit -m "revert: 回滚到旧的部署方式"
git push origin master

# 在 GitHub Settings → Pages 中
# 将 Source 改回 "Deploy from a branch"
# 选择 gh-pages 分支
```

## 参考文档

- [GitHub Pages 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)
- [actions/deploy-pages](https://github.com/actions/deploy-pages)
- [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact)
