# 每周和每月趋势功能说明

## 功能概述

现在支持三种时间范围的 GitHub 热门项目趋势报告：
- **每日**：过去24小时内 star 增长最多的前10个项目
- **每周**：过去7天内 star 增长最多的前10个项目
- **每月**：过去30天内 star 增长最多的前10个项目

## 自动运行时间

### 定时任务

- **每日报告**：每天 UTC 7:00（北京时间下午 3:00）
- **每周报告**：每周一 UTC 7:00（北京时间周一下午 3:00）
- **每月报告**：每月1号 UTC 7:00（北京时间每月1号下午 3:00）

### 手动触发

也可以通过 GitHub Actions 界面手动触发，并选择时间范围：
1. 进入仓库的 **Actions** 标签
2. 找到 **GitHub Trending Stars Tracker** 工作流
3. 点击 **Run workflow** 按钮
4. 选择 **Time range** 参数（daily/weekly/monthly）
5. 点击 **Run workflow**

## 页面结构

```
docs/
├── index.html                  # 主页：显示所有可用报告的卡片
├── daily-YYYY-MM-DD.md        # 每日 Markdown 报告
├── weekly-YYYY-MM-DD.md       # 每周 Markdown 报告
├── monthly-YYYY-MM-DD.md      # 每月 Markdown 报告
└── archive/
    ├── daily/                 # 每日详细页面
    │   ├── YYYY-MM-DD.html
    │   └── ...
    ├── weekly/                # 每周详细页面
    │   ├── YYYY-MM-DD.html
    │   └── ...
    └── monthly/               # 每月详细页面
        ├── YYYY-MM-DD.html
        └── ...
```

## 访问方式

### 主页（归档列表）

访问网站根目录：
```
https://kongshan001.github.io/ci_cd_action/
```

显示内容：
- 📅 所有可用的报告卡片
- 🏷️ 每个卡片显示日期和时间范围标签（每日/每周/每月）
- 🆕 最新报告高亮显示（绿色）
- 📊 数据说明

### 每日详细页面

点击归档列表中的每日卡片，或直接访问：
```
https://kongshan001.github.io/ci_cd_action/archive/daily/2026-02-14.html
```

### 每周详细页面

点击归档列表中的每周卡片，或直接访问：
```
https://kongshan001.github.io/ci_cd_action/archive/weekly/2026-02-14.html
```

### 每月详细页面

点击归档列表中的每月卡片，或直接访问：
```
https://kongshan001.github.io/ci_cd_action/archive/monthly/2026-02-14.html
```

### Markdown 文档

- 每日：`daily-YYYY-MM-DD.md`
- 每周：`weekly-YYYY-MM-DD.md`
- 每月：`monthly-YYYY-MM-DD.md`

## 使用场景

### 每日报告

**适用场景**：
- 快速了解最新的热门项目趋势
- 发现当天的爆款项目
- 跟踪短期的技术趋势

**数据范围**：
- 过去24小时内创建的项目
- 按 star 数降序排列
- 前10个项目

### 每周报告

**适用场景**：
- 了解本周的热门项目
- 分析一周内的技术趋势
- 发现稳定的优质项目

**数据范围**：
- 过去7天内创建的项目
- 按 star 数降序排列
- 前10个项目

### 每月报告

**适用场景**：
- 了解本月的热门项目
- 分析长期的技术趋势
- 发现具有持续影响力的项目

**数据范围**：
- 过去30天内创建的项目
- 按 star 数降序排列
- 前10个项目

## 对比分析

### 时间维度对比

| 时间范围 | 项目时效性 | 趋势稳定性 | 适合用途 |
|---------|-----------|-----------|---------|
| 每日 | 最新，变化快 | 短期波动 | 发现最新趋势 |
| 每周 | 较新，相对稳定 | 中期趋势 | 平衡关注 |
| 每月 | 覆盖面广 | 长期趋势 | 深度分析 |

### 使用建议

- **初学者/快速浏览**：优先查看每日报告
- **开发者/技术爱好者**：结合每日和每周报告
- **分析师/研究者**：关注每周和每月报告
- **投资决策**：重点关注每月报告的趋势

## 本地测试

### 安装依赖

```bash
npm install
```

### 运行脚本

#### 获取数据

```bash
# 每日数据
npm run fetch:daily

# 每周数据
npm run fetch:weekly

# 每月数据
npm run fetch:monthly
```

#### 生成文档

```bash
# 每日报告
npm run generate:daily

# 每周报告
npm run generate:weekly

# 每月报告
npm run generate:monthly
```

#### 一键运行（默认每日）

```bash
npm start
```

### 自定义脚本

```bash
# 获取指定时间范围的数据
node src/fetch-trending.js <time_range>

# 生成指定时间范围的文档
node src/generate-markdown.js <time_range>

# 示例
node src/fetch-trending.js weekly
node src/generate-markdown.js monthly
```

## 技术细节

### 时间范围计算

```javascript
// 每日：减去1天
startDate.setDate(startDate.getDate() - 1);

// 每周：减去7天
startDate.setDate(startDate.getDate() - 7);

// 每月：减去30天
startDate.setDate(startDate.getDate() - 30);
```

### GitHub API 查询

```javascript
// 搜索过去24小时
created:>=2026-02-13T07:00:00.000Z

// 搜索过去7天
created:>=2026-02-06T07:00:00.000Z

// 搜索过去30天
created:>=2026-01-14T07:00:00.000Z
```

### 文件命名规则

- 数据文件：`trending-{time_range}-{date}.json`
- Markdown：`{time_range}-{date}.md`
- HTML 归档：`archive/{time_range}/{date}.html`

## 数据说明

### 数据来源

- GitHub REST API
- 搜索指定时间范围内创建的项目
- 按 star 数降序排列
- 获取前10个项目的完整信息

### 项目信息包含

- 项目名称和链接
- Star 数、Watchers、Forks 数
- 编程语言
- 作者信息
- 创建和更新时间
- 项目标签（Topics）
- README 摘要

### 注意事项

- GitHub API 有请求限制
- 同一项目不会重复出现在同一时间范围
- 不同时间范围的项目可能有重叠
- 数据基于项目创建时间，而非更新时间

## 常见问题

### Q: 为什么每日、每周、每月的报告日期相同？
A: 因为报告的生成日期相同，但数据覆盖的时间范围不同。点击卡片查看详细内容时会看到不同的时间范围描述。

### Q: 可以自定义时间范围吗？
A: 目前支持三种预设时间范围（24小时、7天、30天）。如需其他范围，可以修改源代码。

### Q: 为什么每月报告有时会失败？
A: GitHub API 有请求限制。在短时间内多次请求可能触发限制。建议等待一段时间后重试。

### Q: 如何只查看特定时间范围的报告？
A: 在主页上，根据时间范围标签（每日/每周/每月）点击对应的卡片即可。

### Q: 报告多久更新一次？
A: 根据定时任务配置：
- 每日：每天 UTC 7:00
- 每周：每周一 UTC 7:00
- 每月：每月1号 UTC 7:00

## 未来改进

- [ ] 添加自定义时间范围选择
- [ ] 支持多种排序方式（stars、forks、updated）
- [ ] 添加语言和标签筛选
- [ ] 生成趋势对比图表
- [ ] 支持 RSS 订阅
- [ ] 添加项目收藏功能
- [ ] 生成 PDF 报告
- [ ] 添加邮件通知

---

如有任何问题或建议，欢迎提交 Issue 或 Pull Request！
