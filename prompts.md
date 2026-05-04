# batnoter Prompts

> 项目：batnoter/batnoter
> 技术栈：React + TypeScript + MUI 前端，GitHub API 作为存储后端，Redux 状态管理，Markdown 编辑器

---

## 功能迭代

**1. 添加笔记标签功能**
在 batnoter 中为笔记添加标签支持。用户可以在笔记编辑时添加多个标签（存储在文件名或 frontmatter 中），在侧边栏显示标签列表，点击标签筛选对应笔记，提升笔记组织效率。

**2. 支持笔记全文搜索**
在 batnoter 中添加全文搜索功能。用户可以在搜索框输入关键词，实时搜索所有笔记的标题和内容，高亮显示匹配文本，支持按相关度排序搜索结果。

**3. 添加笔记模板功能**
在 batnoter 中添加笔记模板支持。用户可以创建常用笔记模板（如日记模板、会议记录模板），新建笔记时可以选择模板快速填充内容，模板存储在 GitHub 仓库的特定目录中。

**4. 支持笔记导出功能**
在 batnoter 中添加笔记导出功能，支持将单篇笔记或全部笔记导出为 ZIP 压缩包（包含所有 Markdown 文件），方便用户备份或迁移到其他笔记工具。

**5. 添加笔记版本历史查看**
在 batnoter 中利用 GitHub API 的 commits 接口，为每篇笔记添加版本历史查看功能。用户可以查看笔记的修改历史，对比不同版本的差异，并恢复到任意历史版本。

---

## Bug 修复

**6. 修复 Markdown 编辑器中文输入法冲突**
在 batnoter 的 Markdown 编辑器中，使用中文输入法（如搜狗、微信输入法）输入时，拼音字母会被直接插入到编辑器而非等待确认。请处理 `compositionstart`/`compositionend` 事件，避免输入法冲突。

**7. 修复笔记保存时 GitHub API 频率限制**
在 batnoter 中，频繁保存笔记时会触发 GitHub API 的频率限制（60次/小时），导致保存失败。请添加保存防抖（1秒延迟），并在触发限制时显示友好提示和剩余等待时间。

**8. 修复笔记列表在大量文件时加载缓慢**
在 batnoter 中，当 GitHub 仓库中有超过 100 篇笔记时，笔记列表加载明显变慢。请实现分页加载或虚拟滚动，避免一次性加载所有笔记元数据。

**9. 修复图片粘贴上传失败时无提示**
在 batnoter 中，将图片粘贴到编辑器时，如果上传到 GitHub 失败，编辑器会插入一个损坏的图片链接而没有错误提示。请添加上传失败的错误处理，显示提示并回滚插入的链接。

**10. 修复深色模式下 Markdown 预览样式异常**
在 batnoter 的深色模式下，Markdown 预览区域的代码块背景色和文字颜色与深色主题不协调。请为 Markdown 预览添加深色模式专用的 CSS 样式，确保代码块在深色背景下清晰可读。

---

## 重构

**11. 将 GitHub API 调用封装为统一 Service 层**
batnoter 中 GitHub API 调用分散在各个 Redux thunk 中，缺乏统一的错误处理。请创建 `src/api/github.service.ts`，封装所有 GitHub API 调用，统一处理认证、错误响应和频率限制。

**12. 将 Redux 状态管理迁移到 Redux Toolkit**
batnoter 使用传统 Redux 模式，存在大量样板代码。请将 actions、reducers、thunks 迁移到 Redux Toolkit 的 `createSlice` 和 `createAsyncThunk`，减少代码量并提升可维护性。

---

## 测试

**13. 为 GitHub API Service 编写单元测试**
使用 Jest + MSW（Mock Service Worker）为 batnoter 的 GitHub API Service 编写单元测试，覆盖：获取笔记列表、读取笔记内容、创建笔记、更新笔记、删除笔记、API 错误处理。

**14. 为笔记编辑器组件编写集成测试**
使用 React Testing Library 为 batnoter 的笔记编辑器组件编写集成测试，覆盖：Markdown 输入、预览切换、保存操作、自动保存触发、键盘快捷键（Ctrl+S 保存）。

**15. 为 Redux Store 编写单元测试**
为 batnoter 的 Redux store 编写单元测试，覆盖：笔记列表加载（loading/success/error 状态）、笔记创建/更新/删除、当前笔记选择、搜索过滤逻辑。

---

## 代码理解

**16. 解释 batnoter 使用 GitHub 作为存储后端的架构**
在 batnoter 中，笔记数据完全存储在用户的 GitHub 仓库中。请解释 GitHub OAuth 认证流程、笔记文件的存储格式（路径规则、文件命名）、如何通过 GitHub Contents API 进行 CRUD 操作，以及这种架构的优缺点。

**17. 解释 batnoter 的离线支持策略**
在 batnoter 中，当用户没有网络连接时，应用如何处理？Service Worker 缓存了哪些资源？离线时能否查看已加载的笔记？如何在网络恢复后同步离线期间的修改？

---

## DevOps

**18. 编写 GitHub Actions 自动构建流水线**
为 batnoter 编写 `.github/workflows/docker-build.yml`，实现推送 main 分支时自动构建 Docker 镜像并推送到 Docker Hub，使用 npm 缓存加速构建，支持多架构（amd64/arm64）。

**19. 编写 Nginx 配置优化**
为 batnoter 的 Nginx 部署优化配置：开启 gzip 压缩、设置静态资源长期缓存（JS/CSS 文件名含 hash）、配置 SPA 路由回退（try_files）、添加安全响应头（X-Frame-Options/CSP）。

**20. 编写 docker-compose.yml 部署配置**
为 batnoter 编写 `docker-compose.yml`，包含：batnoter 服务（映射 3000 端口）、环境变量配置（GitHub OAuth Client ID/Secret）、健康检查、自动重启策略。

---

## 构建与截图命令

**构建截图：**
```bash
cd /path/to/batnoter && docker build -t batnoter-test .
```

**网页截图：**
```bash
docker run -d -p 3000:3000 --name batnoter-test batnoter-test && sleep 3 && open http://localhost:3000
```

**清理：**
```bash
docker rm -f batnoter-test && docker rmi batnoter-test
```
