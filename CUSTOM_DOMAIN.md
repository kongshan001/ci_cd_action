# 自定义域名配置记录

本文档记录了为 GitHub Pages 项目配置自定义域名的完整过程、遇到的问题和解决方案。

---

## 问题背景

### 项目信息
- **GitHub 仓库**：https://github.com/kongshan001/ci_cd_action
- **GitHub Pages 原始地址**：https://kongshan001.github.io/ci_cd_action/
- **期望自定义域名**：https://ci_cd_action.dykongshan.com

### 配置目标
- 使用自定义域名访问 GitHub Pages 网站
- 启用 HTTPS 确保安全访问
- 保持与原始域名相同的访问体验

---

## 配置过程

### 步骤 1：创建 CNAME 文件

#### 方法选择
两种方法：
1. **GitHub 网页操作**（推荐，但未使用）
2. **本地操作**（实际使用）

#### 本地操作步骤
```bash
# 1. 创建 CNAME 文件
echo 'ci_cd_action.dykongshan.com' > CNAME

# 2. 提交到 Git
git add CNAME
git commit -m "chore: add custom domain configuration"

# 3. 推送到远程仓库
git push
```

### 步骤 2：配置 DNS 解析

#### 域名服务商设置
需要在域名管理后台添加 CNAME 记录：

| 类型 | 主机记录 | 记录值 | TTL |
|------|---------|-------|-----|
| CNAME | ci_cd_action | kongshan001.github.io | 600 |

#### 配置步骤
1. 登录域名服务商（阿里云、腾讯云等）
2. 找到域名解析管理
3. 添加 CNAME 记录
4. 保存并等待生效（10-60 分钟）

### 步骤 3：验证 DNS 解析

使用命令行验证：
```bash
nslookup ci_cd_action.dykongshan.com
```

预期结果：
```
ci_cd_action.dykongshan.com → kongshan001.github.io
```

实际结果：
```
Server:		202.96.134.33
Address:	202.96.134.33#53

Non-authoritative answer:
ci_cd_action.dykongshan.com	canonical name = kongshan001.github.io.
Name:	kongshan001.github.io
Address: 185.199.109.153
Name:	kongshan001.github.io
Address: 185.199.111.153
```

✅ **DNS 解析成功**

---

## 遇到的问题

### 问题描述

访问 https://ci_cd_action.dykongshan.com 时无法正常访问。

### GitHub Pages 设置页面显示

进入 **Settings** → **Pages** 后看到：

```
Custom domain
Custom domains allow you to serve your site from a domain other than kongshan001.github.io.

ci_cd_action.dykongshan.com

DNS check successful

Enforce HTTPS — Unavailable for your site because your domain contains invalid characters (ci_cd_action.dykongshan.com)
```

**关键错误**：
- ✅ DNS check successful - DNS 检查通过
- ❌ Enforce HTTPS — Unavailable - HTTPS 不可用
- ❌ your domain contains invalid characters - 域名包含无效字符

---

## 问题分析

### 根本原因

域名中包含下划线（_），不符合 GitHub Pages 的 HTTPS 要求。

### 技术原因

1. **域名规范**
   - 标准 DNS 域名只允许字母、数字、连字符（-）
   - 下划线（_）虽然在某些系统中可用，但不符合 RFC 标准

2. **GitHub Pages 限制**
   - GitHub Pages 自动为自定义域名签发 SSL/TLS 证书
   - 证书颁发机构（CA）要求域名符合严格标准
   - 包含下划线的域名无法通过验证

3. **HTTPS 要求**
   - 必须域名规范才能启用 HTTPS
   - 无法签发 SSL 证书意味着无法加密连接
   - 用户访问时会有安全警告

### 问题域名分析

| 域名部分 | 是否合法 | 说明 |
|---------|---------|------|
| `cicd` | ✅ 合法 | 字母 |
| `_` | ❌ 非法 | 下划线不符合标准 |
| `action` | ✅ 合法 | 字母 |

---

## 解决方案

### 方案选择

#### 方案 1：更换域名（推荐）
- 使用不包含下划线的域名
- 符合 GitHub Pages 规范
- 可以启用 HTTPS

#### 方案 2：放弃 HTTPS（不推荐）
- 继续使用包含下划线的域名
- 无法启用 HTTPS
- 有安全风险和浏览器警告
- **不推荐，已放弃**

### 实施方案：更换域名

#### 新域名选择

| 旧域名 | 新域名 | 说明 |
|-------|-------|------|
| `ci_cd_action.dykongshan.com` | `cicdaction.dykongshan.com` | 去掉所有下划线 |
| `ci_cd_action.dykongshan.com` | `ci-cd-action.dykongshan.com` | 用连字符代替下划线 |

**最终选择**：`cicdaction.dykongshan.com`（更简洁）

#### 操作步骤

##### 1. 更新 CNAME 文件

```bash
# 删除旧 CNAME
rm CNAME

# 创建新 CNAME
echo 'cicdaction.dykongshan.com' > CNAME

# 验证内容
cat CNAME
```

##### 2. 提交到 Git

```bash
git add CNAME
git commit -m "fix: update CNAME to remove underscores in domain name

- Change from ci_cd_action.dykongshan.com to cicdaction.dykongshan.com
- GitHub Pages requires domain names without underscores for HTTPS support"
git push
```

##### 3. 更新 DNS 记录

有两种方式：

**方式 A：修改现有记录**
1. 登录域名服务商
2. 找到 `ci_cd_action` 的 CNAME 记录
3. 将主机记录改为 `cicdaction`
4. 保存

**方式 B：删除并新建**
1. 删除 `ci_cd_action` 的 CNAME 记录
2. 新建记录：
   - **记录类型**：CNAME
   - **主机记录**：`cicdaction`
   - **记录值**：`kongshan001.github.io`
   - **TTL**：600

##### 4. 等待 DNS 生效

DNS 修改需要时间传播：
- **最快**：5-10 分钟
- **通常**：30-60 分钟
- **最长**：24 小时

##### 5. 验证 DNS 解析

```bash
nslookup cicdaction.dykongshan.com
```

预期结果：
```
cicdaction.dykongshan.com → kongshan001.github.io
```

##### 6. 验证 GitHub Pages 设置

访问：https://github.com/kongshan001/ci_cd_action/settings/pages

检查：
- ✅ Custom domain 显示 `cicdaction.dykongshan.com`
- ✅ DNS check 显示绿色 ✅
- ✅ Enforce HTTPS 可以勾选

##### 7. 启用 HTTPS

1. 在 GitHub Pages 设置页面
2. 勾选 **Enforce HTTPS**
3. 等待几分钟生效

##### 8. 访问测试

```
https://cicdaction.dykongshan.com
```

---

## 验证步骤

### 1. DNS 解析验证

```bash
# 使用 nslookup
nslookup cicdaction.dykongshan.com

# 或使用 dig（macOS/Linux）
dig cicdaction.dykongshan.com

# 或使用 host（macOS/Linux）
host cicdaction.dykongshan.com
```

### 2. 在线 DNS 检查

使用在线工具检查全球 DNS 传播：
- https://www.whatsmydns.net/
- https://dnschecker.org/

### 3. 本地测试

#### 清除 DNS 缓存
```bash
# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches
```

#### 测试域名访问
```bash
# 测试 HTTP 响应
curl -I https://cicdaction.dykongshan.com

# 测试 SSL 证书
curl -v https://cicdaction.dykongshan.com 2>&1 | grep -i ssl

# 获取完整页面内容
curl https://cicdaction.dykongshan.com
```

### 4. 浏览器测试

- 使用不同浏览器测试
- 清除浏览器缓存
- 使用无痕/隐私模式
- 检查浏览器开发者工具的 Network 标签

---

## 最佳实践

### 1. 域名命名规范

#### 允许的字符
- **字母**：a-z, A-Z
- **数字**：0-9
- **连字符**：-（不能在开头或结尾）

#### 禁止的字符
- **下划线**：_ ❌
- **空格**：  ❌
- **特殊符号**：!@#$%^&*() ❌

#### 推荐命名示例
✅ 合法：
- `cicdaction.dykongshan.com`
- `ci-cd-action.dykongshan.com`
- `github-tracker.dykongshan.com`

❌ 非法：
- `ci_cd_action.dykongshan.com`（包含下划线）
- `ci cd action.dykongshan.com`（包含空格）
- `ci-cd-action-.dykongshan.com`（连字符在结尾）

### 2. CNAME 文件规范

#### 文件位置
```
仓库根目录/CNAME
```

#### 文件内容
- 只包含域名
- 不包含 `http://` 或 `https://`
- 不包含末尾斜杠

#### 正确示例
```
cicdaction.dykongshan.com
```

#### 错误示例
```
https://cicdaction.dykongshan.com  ❌（包含协议）
cicdaction.dykongshan.com/  ❌（包含斜杠）
  ❌（包含空格）
```

### 3. DNS 配置规范

#### 推荐配置
| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|-------|-----|
| CNAME | your-subdomain | your-username.github.io | 600 |

#### TTL 设置建议
- **测试环境**：60-300（1-5分钟）
- **生产环境**：600-3600（10分钟-1小时）
- **稳定环境**：86400（24小时）

### 4. HTTPS 最佳实践

#### 启用 HTTPS
1. 确保 DNS 配置正确
2. 等待 DNS check 通过
3. 在 GitHub Pages 设置中启用
4. 测试 HTTPS 访问

#### HTTPS 强制重定向
GitHub Pages 自动处理：
- HTTP → HTTPS 重定向
- www → 非 www 重定向
- 多个域名自动指向主域名

---

## 常见问题

### Q1: 为什么域名不能包含下划线？

**A**:
1. **RFC 标准**：DNS 域名标准（RFC 1035）只允许字母、数字和连字符
2. **安全考虑**：下划线可能被用于攻击（如协议层）
3. **证书颁发**：CA（证书颁发机构）拒绝为不规范域名签发证书

### Q2: 我已经配置了旧域名，能继续使用吗？

**A**:
- ❌ 不能正常访问
- ❌ 无法启用 HTTPS
- ❌ 浏览器会显示安全警告
- ✅ 必须更换为规范域名

### Q3: DNS 修改需要多久生效？

**A**:
- **最快**：5-10 分钟
- **通常**：30-60 分钟
- **最长**：24 小时
- **影响因素**：TTL 设置、DNS 服务器缓存、ISP 缓存

### Q4: 如何加速 DNS 生效？

**A**:
1. **降低 TTL**：提前将 TTL 改为 60-300 秒
2. **清除缓存**：清除本地 DNS 缓存
3. **使用公共 DNS**：使用 8.8.8.8 或 1.1.1.1
4. **多地测试**：使用在线工具检查全球传播

### Q5: Enforce HTTPS 不可用怎么办？

**A**:
1. 检查域名是否包含非法字符（如下划线）
2. 确认 DNS 记录正确
3. 等待 DNS check 通过
4. 检查 GitHub Pages 设置页面是否有错误提示

### Q6: 可以同时使用多个域名吗？

**A**:
- ❌ 一个仓库只能有一个自定义域名
- ✅ 但可以使用原始 GitHub Pages 域名
- ✅ 两个域名都可以访问相同内容

### Q7: 如何回滚到原始域名？

**A**:
```bash
# 删除 CNAME 文件
git rm CNAME

# 提交并推送
git commit -m "chore: remove custom domain"
git push
```

### Q8: CNAME 文件内容格式有什么要求？

**A**:
- 文件名：大写 `CNAME`
- 位置：仓库根目录
- 内容：只有域名，无其他内容
- 编码：UTF-8
- 换行：Unix 换行符（LF）

---

## 故障排查

### 问题 1：DNS 检查失败

**症状**：
```
DNS check failed
```

**原因**：
- DNS 记录未正确配置
- DNS 未传播完成
- TTL 设置过大

**解决**：
1. 检查 DNS 记录是否正确
2. 等待 DNS 传播（最多 24 小时）
3. 使用在线工具检查：https://www.whatsmydns.net/

### 问题 2：Enforce HTTPS 不可用

**症状**：
```
Enforce HTTPS — Unavailable for your site because your domain contains invalid characters
```

**原因**：
- 域名包含下划线
- 域名不符合标准

**解决**：
- 更换为不包含下划线的域名
- 更新 CNAME 文件
- 更新 DNS 记录

### 问题 3：访问 404 Not Found

**症状**：
访问自定义域名显示 404 错误

**原因**：
- CNAME 文件未正确推送
- GitHub Pages 未部署
- DNS 未指向正确地址

**解决**：
1. 确认 CNAME 文件存在且正确
2. 检查 GitHub Actions 工作流状态
3. 使用 nslookup 验证 DNS 解析

### 问题 4：SSL 证书错误

**症状**：
```
NET::ERR_CERT_AUTHORITY_INVALID
```

**原因**：
- HTTPS 未启用
- 证书未生成
- DNS 未完成传播

**解决**：
1. 等待 DNS 检查通过
2. 在 GitHub Pages 设置中启用 HTTPS
3. 等待几分钟让证书生成

### 问题 5：HTTP 可以访问，HTTPS 不行

**症状**：
```
http://domain.com ✅
https://domain.com ❌
```

**原因**：
- HTTPS 未启用
- 证书未生成

**解决**：
1. 进入 GitHub Pages 设置
2. 勾选 **Enforce HTTPS**
3. 等待几分钟

---

## 总结

### 关键要点

1. **域名规范**：必须使用符合标准的域名（不含下划线）
2. **DNS 配置**：正确配置 CNAME 记录指向 GitHub Pages
3. **等待时间**：DNS 传播和 HTTPS 证书生成需要时间
4. **验证步骤**：逐步验证 DNS、GitHub Pages 设置、HTTPS

### 经验教训

1. ✅ **提前检查域名规范**：避免使用包含下划线的域名
2. ✅ **使用在线工具**：及时检查全球 DNS 传播状态
3. ✅ **等待足够时间**：DNS 传播最多需要 24 小时
4. ✅ **逐步验证**：DNS → GitHub Pages → HTTPS → 访问测试

### 成功标志

配置成功的标志：
- ✅ DNS 解析正确
- ✅ GitHub Pages 设置中显示域名
- ✅ DNS check 显示绿色 ✅
- ✅ Enforce HTTPS 可以勾选且已启用
- ✅ 可以通过自定义域名访问网站
- ✅ 浏览器显示安全锁图标

---

## 相关资源

### 官方文档
- [GitHub Pages - 管理自定义域名](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages - 故障排除自定义域名](https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains)

### 在线工具
- [WhatsMyDNS - DNS 传播检查](https://www.whatsmydns.net/)
- [DNS Checker - DNS 检查](https://dnschecker.org/)
- [SSL Checker - SSL 证书检查](https://www.sslshopper.com/ssl-checker.html)

### 技术标准
- [RFC 1035 - Domain Names](https://tools.ietf.org/html/rfc1035)
- [RFC 1123 - Requirements for Internet Hosts](https://tools.ietf.org/html/rfc1123)

---

## 版本历史

### v1.0.0 (2025-02-14)
- ✅ 创建自定义域名配置记录
- ✅ 记录问题背景和原因分析
- ✅ 提供完整解决方案
- ✅ 添加最佳实践和故障排查指南

---

如有任何问题或建议，欢迎提交 Issue 或 Pull Request！
