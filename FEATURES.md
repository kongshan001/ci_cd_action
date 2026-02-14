# GitHub Stars Tracker - 功能总结

## 项目概述

自动化追踪和整理 GitHub 上 star 飙升项目的工具，支持每日、每周、每月趋势报告，并自动部署到 GitHub Pages。

## 核心功能

### 1. 多时间范围报告

#### 每日报告
- **时间范围**：过去24小时
- **更新频率**：每天 UTC 7:00
- **适用场景**：快速了解最新热门项目

#### 每周报告
- **时间范围**：过去7天
- **更新频率**：每周一 UTC 7:00
- **适用场景**：了解本周热门项目

#### 每月报告
- **时间范围**：过去30天
- **更新频率**：每月1号 UTC 7:00
- **适用场景**：分析长期趋势

### 2. 完整的项目信息

每个报告包含：
- 项目名称、链接、描述
- Star 数、Watchers、Forks 数
- 编程语言
- 作者信息
- 创建和更新时间
- 项目标签（Topics）
- README 摘要

### 3. 多种文档格式

- **Markdown**：便于下载和阅读
- **HTML**：美观的网页展示
- **响应式设计**：支持桌面端和移动端

### 4. 历史归档

- 所有历史记录保留
- 按时间范围分类存储
- 优雅的归档页面导航

## 技术架构

### 自动化流程

```
GitHub Actions (定时触发)
    ↓
获取热门项目数据 (GitHub REST API)
    ↓
生成 Markdown 和 HTML 文档
    ↓
部署到 GitHub Pages
```

### 技术栈

- **Node.js**：运行时环境
- **GitHub Actions**：CI/CD 自动化
- **GitHub REST API**：数据获取
- **GitHub Pages**：静态网站托管

### 文件结构

```
github_ci_cd_action/
├── .github/
│   └── workflows/
│       └── daily-stars.yml      # GitHub Actions 工作流
├── src/
│   ├── fetch-trending.js        # 获取热门项目
│   ├── generate-markdown.js     # 生成文档
│   └── deploy-pages.js         # 部署脚本
├── docs/                       # 生成的文档
│   ├── index.html              # 主页
│   ├── archive/                # 归档目录
│   │   ├── daily/             # 每日报告
│   │   ├── weekly/            # 每周报告
│   │   └── monthly/           # 每月报告
│   ├── daily-YYYY-MM-DD.md
│   ├── weekly-YYYY-MM-DD.md
│   └── monthly-YYYY-MM-DD.md
├── data/                       # 数据文件（不提交）
├── package.json
├── README.md                   # 主文档
├── ARCHIVE.md                  # 归档功能说明
├── README_WEEKLY_MONTHLY.md    # 每周每月功能说明
└── DEVELOPMENT.md              # 开发问题记录
```

## 使用方法

### 访问网站

**主页（归档列表）**：
```
https://kongshan001.github.io/ci_cd_action/
```

**每日详细页面**：
```
https://kongshan001.github.io/ci_cd_action/archive/daily/2026-02-14.html
```

**每周详细页面**：
```
https://kongshan001.github.io/ci_cd_action/archive/weekly/2026-02-14.html
```

**每月详细页面**：
```
https://kongshan001.github.io/ci_cd_action/archive/monthly/2026-02-14.html
```

### 手动触发

1. 进入 GitHub Actions 页面
2. 找到 **GitHub Trending Stars Tracker** 工作流
3. 点击 **Run workflow** 按钮
4. 选择 **Time range** 参数
5. 点击 **Run workflow**

### 本地运行

```bash
# 安装依赖
npm install

# 获取数据
npm run fetch:daily
npm run fetch:weekly
npm run fetch:monthly

# 生成文档
npm run generate:daily
npm run generate:weekly
npm run generate:monthly

# 一键运行（默认每日）
npm start
```

## 特色功能

### 1. 智能归档

- 自动生成归档页面
- 按时间范围分类
- 显示所有可用报告
- 最新报告高亮显示

### 2. 美观的界面

- 渐变色背景
- 卡片式布局
- 响应式设计
- 交互式导航

### 3. 详细的统计

- 总 Stars 数
- 总 Forks 数
- 项目总数
- 涉及语言统计

### 4. 灵活的时间范围

- 24小时、7天、30天
- 满足不同需求
- 便于趋势分析

## 文档资源

- **README.md**：项目主文档
- **ARCHIVE.md**：归档功能说明
- **README_WEEKLY_MONTHLY.md**：每周每月功能详细说明
- **DEVELOPMENT.md**：开发问题和解决方案记录

## 版本历史

### v1.1.0 (2025-02-14)
- ✅ 添加每周和每月趋势报告
- ✅ 支持三种时间范围
- ✅ 重构归档目录结构
- ✅ 优化归档页面显示

### v1.0.0 (2025-02-14)
- ✅ 初始版本发布
- ✅ 每日趋势报告
- ✅ 自动化部署
- ✅ 多格式文档生成

## 常见问题

### Q: 如何查看历史报告？
A: 访问主页即可看到所有可用的历史报告卡片，点击即可查看详细内容。

### Q: 报告多久更新一次？
A: 
- 每日：每天 UTC 7:00
- 每周：每周一 UTC 7:00
- 每月：每月1号 UTC 7:00

也可以手动触发更新。

### Q: 可以自定义时间范围吗？
A: 目前支持三种预设时间范围。如需其他范围，可以修改源代码。

### Q: 数据从哪里来？
A: 数据来自 GitHub REST API，通过搜索指定时间范围内创建的项目，按 star 数排序。

### Q: 为什么有些日期没有数据？
A: GitHub Actions 可能因 API 限制或其他原因未能成功运行。检查 Actions 日志了解详情。

## 未来计划

- [ ] 自定义时间范围选择
- [ ] 多种排序方式
- [ ] 语言和标签筛选
- [ ] 趋势对比图表
- [ ] RSS 订阅
- [ ] 项目收藏功能
- [ ] PDF 报告导出
- [ ] 邮件通知

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

由 GitHub Actions 自动生成 🤖
