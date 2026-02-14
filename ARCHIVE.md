# 多日归档功能说明

## 功能概述

现在 GitHub Pages 页面支持查看多日的历史趋势信息，而不仅仅是当天数据。

## 页面结构

```
docs/
├── index.html              # 主页：历史归档列表（包含所有可用日期）
├── archive/                # 归档目录：每日详细页面
│   ├── 2026-02-14.html     # 2026-02-14 的详细页面
│   ├── 2026-02-13.html     # 2026-02-13 的详细页面
│   └── ...
└── daily-YYYY-MM-DD.md     # Markdown 格式的日报
```

## 访问方式

### 1. 主页（历史归档列表）
访问网站根目录：
```
https://kongshan001.github.io/ci_cd_action/
```

显示内容：
- 📅 所有可用的历史日期
- 🔥 最新日期标记为"最新"（绿色高亮）
- 📊 数据说明
- 点击任意日期卡片查看该日的详细项目

### 2. 每日详细页面
点击归档列表中的日期，或直接访问：
```
https://kongshan001.github.io/ci_cd_action/archive/2026-02-14.html
```

显示内容：
- 🚀 当天的前10个热门项目
- 📋 项目的完整信息（Stars、Watchers、Forks、语言等）
- 🏷️ 项目标签（Topics）
- 📝 项目简介（README摘要）
- 📊 当日统计数据
- ⬅️ "返回历史列表"链接

### 3. Markdown 文档
直接访问 Markdown 格式：
```
https://kongshan001.github.io/ci_cd_action/daily-2026-02-14.md
```

## 工作流程

### GitHub Actions 自动运行

1. **每天 UTC 7:00** 自动触发
2. **获取数据**：搜索过去24小时内 star 增长最多的前10个项目
3. **生成文档**：
   - 创建新的 Markdown 文件：`docs/daily-YYYY-MM-DD.md`
   - 创建新的归档 HTML：`docs/archive/YYYY-MM-DD.html`
   - 更新主页：`docs/index.html`（添加新日期到列表）
4. **部署**：自动推送到 GitHub Pages

### 历史数据保留

- 所有历史文件都保存在仓库中
- 每次运行都添加新文件，不会覆盖旧文件
- 主页会自动更新，包含所有可用的历史日期

## 功能特点

### ✅ 多日支持
- 可以查看任意历史日期的数据
- 所有历史记录都保留在网站中

### ✅ 优雅的导航
- 主页显示日期卡片网格
- 最新日期高亮显示
- 每日页面有返回主页的链接

### ✅ 响应式设计
- 支持桌面端和移动端
- 自适应网格布局

### ✅ 完整信息
- 每个项目包含详细的统计数据
- 项目标签和简介
- GitHub 链接

## 使用示例

### 查看历史趋势

1. 打开网站主页
2. 浏览日期卡片网格
3. 点击感兴趣的日期
4. 查看该日的热门项目列表
5. 点击"返回历史列表"回到主页

### 比较不同日期

1. 查看某一天的热门项目
2. 返回主页
3. 查看另一天的热门项目
4. 对比两天的趋势变化

## 技术细节

### 文件命名规则

- Markdown：`daily-YYYY-MM-DD.md`
- HTML 归档：`archive/YYYY-MM-DD.html`
- 例如：`daily-2026-02-14.md`、`archive/2026-02-14.html`

### 数据来源

- GitHub REST API
- 搜索过去24小时内创建的项目
- 按 star 数降序排列
- 获取前10个项目的完整信息

### 生成逻辑

```javascript
// 主页：扫描所有 daily-YYYY-MM-DD.md 文件
// 按日期降序排列
// 生成日期卡片网格

// 每日页面：生成完整的项目详情
// 包含统计信息和项目卡片
// 添加返回主页链接
```

## 维护说明

### 自动清理

建议定期清理旧文件以节省空间：

```bash
# 保留最近30天的数据
find docs/archive -name "*.html" -mtime +30 -delete
find docs -name "daily-*.md" -mtime +30 -delete
```

### 手动删除

如需删除特定日期的数据：

```bash
# 删除某一天的文件
rm docs/daily-2026-02-14.md
rm docs/archive/2026-02-14.html

# 重新运行生成脚本更新主页
npm run generate
```

### 数据备份

建议定期备份历史数据：

```bash
# 创建归档
tar -czf github-stars-backup-$(date +%Y%m%d).tar.gz docs/
```

## 常见问题

### Q: 为什么有些日期没有数据？
A: GitHub Actions 可能由于 API 限制或其他原因未能成功运行。检查 Actions 日志了解详情。

### Q: 如何查看更长时间范围的历史？
A: 在主页上，日期卡片按时间倒序排列，向下滚动即可查看更早的日期。

### Q: 可以下载所有历史数据吗？
A: 可以直接克隆仓库获取所有历史文件：
```bash
git clone https://github.com/kongshan001/ci_cd_action.git
```

### Q: 如何自定义显示的日期范围？
A: 修改 `src/generate-markdown.js` 中的 `generateArchivePage` 函数，添加日期过滤逻辑。

## 未来改进

- [ ] 添加日期范围筛选
- [ ] 支持导出为 CSV/JSON 格式
- [ ] 添加项目趋势图表
- [ ] 支持按语言/标签筛选
- [ ] 添加项目对比功能
- [ ] 支持 RSS 订阅

---

如有任何问题或建议，欢迎提交 Issue 或 Pull Request！
