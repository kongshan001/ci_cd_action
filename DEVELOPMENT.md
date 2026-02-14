# 开发问题记录

本文档记录了项目开发过程中遇到的问题、原因分析和解决方案。

---

## 问题一：缺少依赖锁文件

### 问题描述
```
Dependencies lock file is not found in /home/runner/work/ci_cd_action/ci_cd_action. 
Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

### 问题背景
GitHub Actions 工作流在执行 `npm ci` 时失败，找不到依赖锁文件。

### 原因分析
- 本地只运行了 `npm init` 创建 `package.json`
- 未运行 `npm install` 生成 `package-lock.json`
- GitHub Actions 的 `npm ci` 命令必须依赖锁文件

### 解决方案
```bash
# 在本地运行
npm install

# 生成并提交 package-lock.json
git add package-lock.json
git commit -m "chore: add package-lock.json for GitHub Actions"
git push
```

### 预防措施
- 每次更新 `package.json` 后运行 `npm install` 确保锁文件同步
- 将 `package-lock.json` 加入版本控制

---

## 问题二：模块导入错误

### 问题描述
```
Error: Cannot find module '@octokit/rest'
Require stack:
- /home/runner/work/ci_cd_action/ci_cd_action/src/fetch-trending.js
```

### 问题背景
在 GitHub Actions 工作流中，`npm run fetch` 执行时无法找到 `@octokit/rest` 模块。

### 原因分析
- `package.json` 中安装的依赖包是 `octokit`
- 但代码中使用了错误的导入语句 `require('@octokit/rest')`
- `@octokit/rest` 是另一个独立的包，并未安装

### 解决方案
修改 `src/fetch-trending.js` 中的导入语句：

```javascript
// 错误的导入
const { Octokit } = require('@octokit/rest');

// 正确的导入
const { Octokit } = require('octokit');
```

```bash
git add src/fetch-trending.js
git commit -m "fix: correct octokit import statement"
git push
```

### 预防措施
- 参考 npm 官方文档确认正确的包名和导入方式
- 使用 TypeScript 获得更好的类型检查

---

## 问题三：API 调用错误

### 问题描述
```
Error fetching trending repositories: Cannot read properties of undefined (reading 'repos')
TypeError: Cannot read properties of undefined (reading 'repos')
    at fetchTrendingRepos (/home/runner/work/ci_cd_action/ci_cd_action/src/fetch-trending.js:24:43)
```

### 问题背景
在调用 GitHub API 搜索仓库时发生运行时错误。

### 原因分析
- 代码中使用了 `octokit.search.repos()` 方法
- 但 Octokit 实例的 `search` 属性是 `undefined`
- 正确的 API 调用应该通过 `octokit.rest` 属性访问

### 技术细节
Octokit v18+ 的 API 调用方式：
```javascript
// 错误方式
await octokit.search.repos({...});

// 正确方式
await octokit.rest.search.repos({...});
```

### 解决方案
修改 `src/fetch-trending.js` 中的 API 调用：

```javascript
// 错误的调用
const response = await octokit.search.repos({...});

// 正确的调用
const response = await octokit.rest.search.repos({...});
```

```bash
git add src/fetch-trending.js
git commit -m "fix: use correct octokit.rest.search API endpoint"
git push
```

### 预防措施
- 仔细阅读 Octokit 官方文档
- 在本地充分测试后再推送到远程
- 使用 TypeScript 可以获得更好的 API 类型提示

---

## 问题四：GitHub Pages 部署问题

### 问题描述
`docs/` 目录被 git 忽略，无法部署到 GitHub Pages。

### 问题背景
GitHub Pages 需要从仓库中读取 `docs/` 目录的文件进行部署，但该目录被 `.gitignore` 忽略。

### 原因分析
- 初始的 `.gitignore` 配置包含了 `docs/`
- 生成的文档文件没有被提交到仓库
- GitHub Actions 无法找到部署所需的文件

### 解决方案
1. 修改 `.gitignore`，移除 `docs/`：

```gitignore
node_modules/
data/
*.log
.env
.DS_Store
```

2. 提交生成的文档：

```bash
# 本地生成文档
npm run generate

# 添加并提交 docs 目录
git add docs/
git commit -m "feat: add generated docs for GitHub Pages"
git push
```

### 预防措施
- 根据项目需求合理配置 `.gitignore`
- 需要部署的文件不应被忽略
- 使用文档明确说明哪些文件需要提交

---

## 问题排查流程

### 1. 本地测试优先
在推送到 GitHub 之前，确保所有脚本在本地能正常运行：

```bash
npm install           # 安装依赖
npm run fetch         # 测试数据获取
npm run generate      # 测试文档生成
npm run deploy        # 测试部署准备
```

### 2. 查看 GitHub Actions 日志
- 进入仓库的 Actions 标签
- 点击失败的工作流运行
- 逐个步骤查看详细日志

### 3. 常见错误类型
| 错误类型 | 检查项 | 解决方法 |
|---------|-------|---------|
| 依赖错误 | package.json, package-lock.json | 检查依赖是否正确安装 |
| 模块导入错误 | require/import 语句 | 确认包名和导入方式 |
| API 调用错误 | API 文档 | 使用正确的 API 端点 |
| 权限错误 | GitHub Actions 权限配置 | 配置正确的读写权限 |

### 4. 调试技巧
- 使用 `console.log()` 输出中间结果
- 在本地使用 Node.js 单独运行脚本
- 检查环境变量是否正确设置

---

## 技术栈说明

### 依赖包
```json
{
  "@actions/core": "^1.10.1",
  "@actions/github": "^6.0.0",
  "octokit": "^3.1.2"
}
```

### GitHub API 使用
- **认证**：使用 `GITHUB_TOKEN` 环境变量
- **搜索仓库**：`octokit.rest.search.repos()`
- **获取仓库详情**：`octokit.rest.repos.get()`
- **获取 README**：`octokit.rest.repos.getReadme()`

---

## 最佳实践

### 代码质量
1. **依赖管理**
   - 保持依赖更新
   - 定期检查安全漏洞
   - 使用 `npm ci` 进行干净安装

2. **错误处理**
   - 所有可能失败的 API 调用都应添加 try-catch
   - 提供清晰的错误信息
   - 记录详细的日志

3. **配置管理**
   - 使用环境变量管理敏感信息
   - 提供合理的默认值
   - 文档化所有配置项

### CI/CD 流程
1. **工作流设计**
   - 合理划分构建和部署阶段
   - 使用缓存加速构建
   - 配置并发控制

2. **权限管理**
   - 最小权限原则
   - 明确 Actions 权限范围
   - 定期审查权限配置

### 文档维护
1. **README 文档**
   - 清晰的安装说明
   - 详细的配置步骤
   - 常见问题解答

2. **变更日志**
   - 记录所有重要变更
   - 说明变更原因
   - 提供迁移指南（如需要）

---

## 相关资源

### 官方文档
- [Octokit.js Documentation](https://octokit.github.io/rest.js/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub REST API](https://docs.github.com/en/rest)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

### 工具参考
- [Node.js Package Manager](https://docs.npmjs.com/)
- [Git Documentation](https://git-scm.com/doc)

---

## 版本历史

### v1.1.0 (2025-02-14)
- ✅ 添加每周和每月趋势报告功能
- ✅ 支持三种时间范围：每日、每周、每月
- ✅ 更新 GitHub Actions 工作流，添加多个定时任务
- ✅ 重构归档目录结构，支持不同时间范围
- ✅ 优化归档页面显示，添加时间范围标签

### v1.0.0 (2025-02-14)
- ✅ 初始版本发布
- ✅ 实现自动获取热门项目功能
- ✅ 支持 Markdown 和 HTML 文档生成
- ✅ 集成 GitHub Actions 自动化流程
- ✅ 部署到 GitHub Pages

---

## 贡献者

如发现问题或有改进建议，欢迎提交 Issue 或 Pull Request。
