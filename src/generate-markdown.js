const fs = require('fs');
const path = require('path');

function generateMarkdown(repos) {
  const today = new Date().toISOString().split('T')[0];
  
  let markdown = `# GitHub Star 飙升项目日报 - ${today}\n\n`;
  markdown += `> 📊 每日整理过去24小时内star增长最多的前10个项目\n\n`;
  markdown += `---\n\n`;
  
  markdown += `## 🔥 前10名热门项目\n\n`;
  markdown += `| 排名 | 项目 | ⭐ Stars | 📝 语言 | 👤 作者 |\n`;
  markdown += `|------|------|---------|---------|---------|\n`;
  
  repos.forEach((repo, index) => {
    const stars = repo.stars.toLocaleString();
    const author = `[${repo.owner.login}](https://github.com/${repo.owner.login})`;
    markdown += `| ${index + 1} | [${repo.name}](${repo.html_url}) | ${stars} | ${repo.language} | ${author} |\n`;
  });
  
  markdown += `\n---\n\n`;
  markdown += `## 📋 项目详情\n\n`;
  
  repos.forEach((repo, index) => {
    markdown += `### ${index + 1}. [${repo.name}](${repo.html_url})\n\n`;
    
    markdown += `**${repo.description}**\n\n`;
    
    markdown += `| 信息 | 详情 |\n`;
    markdown += `|------|------|\n`;
    markdown += `| ⭐ Stars | ${repo.stars.toLocaleString()} |\n`;
    markdown += `| 👁️ Watchers | ${repo.watchers.toLocaleString()} |\n`;
    markdown += `| 🍴 Forks | ${repo.forks.toLocaleString()} |\n`;
    markdown += `| 🐛 Open Issues | ${repo.open_issues.toLocaleString()} |\n`;
    markdown += `| 📝 语言 | ${repo.language} |\n`;
    markdown += `| 👤 作者 | [${repo.owner.login}](${repo.owner.html_url}) |\n`;
    markdown += `| 📅 创建时间 | ${new Date(repo.created_at).toLocaleDateString()} |\n`;
    markdown += `| 🔄 最后更新 | ${new Date(repo.updated_at).toLocaleString()} |\n\n`;
    
    if (repo.topics && repo.topics.length > 0) {
      markdown += `**标签：**\n`;
      repo.topics.forEach(topic => {
        markdown += `\`${topic}\` `;
      });
      markdown += `\n\n`;
    }
    
    if (repo.readme_summary) {
      markdown += `**项目简介：**\n\n`;
      markdown += `${repo.readme_summary}...\n\n`;
    }
    
    markdown += `[👉 查看项目详情](${repo.html_url})\n\n`;
    markdown += `---\n\n`;
  });
  
  markdown += `## 📊 统计信息\n\n`;
  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);
  const languages = {};
  repos.forEach(repo => {
    if (repo.language && repo.language !== 'Unknown') {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });
  
  markdown += `- **总Stars数：** ${totalStars.toLocaleString()}\n`;
  markdown += `- **总Forks数：** ${totalForks.toLocaleString()}\n`;
  markdown += `- **涉及语言：** ${Object.keys(languages).join(', ')}\n\n`;
  
  markdown += `---\n\n`;
  markdown += `*最后更新时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}*\n`;
  
  return markdown;
}

function generateHTML(repos) {
  const today = new Date().toISOString().split('T')[0];
  
  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Star 飙升项目日报 - ${today}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header .subtitle {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .content {
            padding: 40px;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .summary-table th,
        .summary-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .summary-table th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #333;
        }
        .summary-table tr:hover {
            background-color: #f5f5f5;
        }
        .repo-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
        }
        .repo-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .repo-title {
            font-size: 1.5em;
            color: #333;
            margin-bottom: 10px;
        }
        .repo-title a {
            color: #667eea;
            text-decoration: none;
        }
        .repo-title a:hover {
            text-decoration: underline;
        }
        .repo-description {
            color: #666;
            margin-bottom: 20px;
            font-size: 1.1em;
        }
        .repo-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-item {
            background: white;
            padding: 10px 15px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        }
        .stat-label {
            font-size: 0.9em;
            color: #888;
            margin-bottom: 5px;
        }
        .stat-value {
            font-weight: 600;
            color: #333;
            font-size: 1.1em;
        }
        .repo-topics {
            margin-bottom: 15px;
        }
        .topic {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.85em;
            margin-right: 8px;
            margin-bottom: 8px;
        }
        .repo-summary {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border-left: 3px solid #764ba2;
            color: #555;
            line-height: 1.6;
        }
        .repo-link {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 25px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
        }
        .repo-link:hover {
            background: #764ba2;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }
        .stats-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-top: 30px;
        }
        .stats-section h3 {
            margin-bottom: 20px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        .stat-card {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-card h4 {
            font-size: 2em;
            margin-bottom: 5px;
        }
        .stat-card p {
            opacity: 0.9;
        }
        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }
            .content {
                padding: 20px;
            }
            .repo-stats {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="margin-bottom: 20px;">
                <a href="../index.html" style="color: white; text-decoration: none; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 5px; display: inline-block;">← 返回历史列表</a>
            </div>
            <h1>🚀 GitHub Star 飙升项目日报</h1>
            <p class="subtitle">${today} · 过去24小时star增长最多的前10个项目</p>
        </div>
        
        <div class="content">
            <table class="summary-table">
                <thead>
                    <tr>
                        <th>排名</th>
                        <th>项目</th>
                        <th>⭐ Stars</th>
                        <th>📝 语言</th>
                        <th>👤 作者</th>
                    </tr>
                </thead>
                <tbody>
`;
  
  repos.forEach((repo, index) => {
    const stars = repo.stars.toLocaleString();
    const authorLink = `<a href="https://github.com/${repo.owner.login}" target="_blank">${repo.owner.login}</a>`;
    html += `                    <tr>
                        <td><strong>${index + 1}</strong></td>
                        <td><a href="${repo.html_url}" target="_blank">${repo.name}</a></td>
                        <td>${stars}</td>
                        <td>${repo.language}</td>
                        <td>${authorLink}</td>
                    </tr>
`;
  });
  
  html += `                </tbody>
            </table>
`;
  
  repos.forEach((repo, index) => {
    html += `
            <div class="repo-card">
                <div class="repo-header">
                    <div class="repo-title">
                        <a href="${repo.html_url}" target="_blank">${index + 1}. ${repo.name}</a>
                    </div>
                </div>
                <div class="repo-description">${repo.description || '暂无描述'}</div>
                
                <div class="repo-stats">
                    <div class="stat-item">
                        <div class="stat-label">⭐ Stars</div>
                        <div class="stat-value">${repo.stars.toLocaleString()}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">👁️ Watchers</div>
                        <div class="stat-value">${repo.watchers.toLocaleString()}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">🍴 Forks</div>
                        <div class="stat-value">${repo.forks.toLocaleString()}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">🐛 Issues</div>
                        <div class="stat-value">${repo.open_issues.toLocaleString()}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">📝 语言</div>
                        <div class="stat-value">${repo.language}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">📅 创建于</div>
                        <div class="stat-value">${new Date(repo.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
`;
    
    if (repo.topics && repo.topics.length > 0) {
      html += `                <div class="repo-topics">\n`;
      repo.topics.forEach(topic => {
        html += `                    <span class="topic">${topic}</span>\n`;
      });
      html += `                </div>\n`;
    }
    
    if (repo.readme_summary) {
      html += `                <div class="repo-summary">
                    <strong>📋 项目简介：</strong> ${repo.readme_summary}...
                </div>
`;
    }
    
    html += `                <a href="${repo.html_url}" target="_blank" class="repo-link">👉 查看项目详情</a>
            </div>
`;
  });
  
  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);
  const languages = {};
  repos.forEach(repo => {
    if (repo.language && repo.language !== 'Unknown') {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });
  
  html += `
            <div class="stats-section">
                <h3>📊 今日统计</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>${totalStars.toLocaleString()}</h4>
                        <p>总 Stars 数</p>
                    </div>
                    <div class="stat-card">
                        <h4>${totalForks.toLocaleString()}</h4>
                        <p>总 Forks 数</p>
                    </div>
                    <div class="stat-card">
                        <h4>${repos.length}</h4>
                        <p>项目总数</p>
                    </div>
                    <div class="stat-card">
                        <h4>${Object.keys(languages).length}</h4>
                        <p>涉及语言</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>最后更新时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
            <p style="margin-top: 10px;">由 GitHub Actions 自动生成 🤖</p>
        </div>
    </div>
</body>
</html>
`;
  
  return html;
}

function generateArchivePage() {
  const docsDir = path.join(__dirname, '../docs');
  
  if (!fs.existsSync(docsDir)) {
    return '';
  }
  
  const files = fs.readdirSync(docsDir);
  const mdFiles = files.filter(f => f.startsWith('daily-') && f.endsWith('.md'));
  
  if (mdFiles.length === 0) {
    return '';
  }
  
  const dates = mdFiles
    .map(f => f.replace('daily-', '').replace('.md', ''))
    .sort()
    .reverse();
  
  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Star 飙升项目 - 历史记录</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header .subtitle {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .content {
            padding: 40px;
        }
        .date-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .date-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            border: 2px solid #e0e0e0;
            transition: all 0.3s;
            cursor: pointer;
        }
        .date-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            border-color: #667eea;
        }
        .date-card h3 {
            font-size: 1.5em;
            color: #667eea;
            margin-bottom: 10px;
        }
        .date-card p {
            color: #666;
            font-size: 0.9em;
        }
        .latest {
            border-color: #28a745;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }
        .latest h3, .latest p {
            color: white;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }
        .info-box {
            background: #e7f3ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 4px;
        }
        .info-box h3 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .info-box p {
            color: #555;
            line-height: 1.6;
        }
        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }
            .content {
                padding: 20px;
            }
            .date-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 GitHub Star 飙升项目历史记录</h1>
            <p class="subtitle">查看过去每日的热门项目趋势</p>
        </div>
        
        <div class="content">
            <div class="info-box">
                <h3>📊 数据说明</h3>
                <p>每日自动整理过去24小时内star增长最多的前10个GitHub项目。点击日期查看该日的详细项目列表。</p>
            </div>
            
            <div class="date-grid">
`;
  
  dates.forEach((date, index) => {
    const isLatest = index === 0;
    const latestClass = isLatest ? ' latest' : '';
    const latestBadge = isLatest ? ' (最新)' : '';
    
    html += `                <div class="date-card${latestClass}" onclick="window.location.href='archive/${date}.html'">
                    <h3>${date}${latestBadge}</h3>
                    <p>查看该日的热门项目</p>
                </div>
`;
  });
  
  html += `            </div>
        </div>
        
        <div class="footer">
            <p>最后更新时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
            <p style="margin-top: 10px;">由 GitHub Actions 自动生成 🤖</p>
        </div>
    </div>
</body>
</html>`;
  
  return html;
}

async function generateDocs() {
  const dataPath = path.join(__dirname, '../data/trending-repos.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error('Data file not found. Please run fetch-trending.js first.');
    process.exit(1);
  }
  
  const repos = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  const markdown = generateMarkdown(repos);
  const html = generateHTML(repos);
  
  const docsDir = path.join(__dirname, '../docs');
  const archiveDir = path.join(docsDir, 'archive');
  fs.mkdirSync(docsDir, { recursive: true });
  fs.mkdirSync(archiveDir, { recursive: true });
  
  const today = new Date().toISOString().split('T')[0];
  
  fs.writeFileSync(path.join(docsDir, `daily-${today}.md`), markdown);
  fs.writeFileSync(path.join(archiveDir, `${today}.html`), html);
  
  const archivePage = generateArchivePage();
  fs.writeFileSync(path.join(docsDir, 'index.html'), archivePage);
  
  console.log(`Markdown generated: ${path.join(docsDir, `daily-${today}.md`)}`);
  console.log(`Archive HTML generated: ${path.join(archiveDir, `${today}.html`)}`);
  console.log(`Archive index page generated: ${path.join(docsDir, 'index.html')}`);
}

if (require.main === module) {
  generateDocs()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { generateMarkdown, generateHTML };
