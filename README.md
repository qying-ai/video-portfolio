# 青映AI · 视频展示站

第一阶段：三个可交互设计方向，供评审选择。还未接入真实作品或部署 GitHub Pages。

## 本地预览

需要 Node.js 18+，无需安装依赖。

```sh
npm run dev
```

打开 http://127.0.0.1:4173 ，通过顶部按钮切换：

- A 精选放映：一条精选作品作为首屏中心，下方浏览分类作品。
- B 明亮作品集：更大面积的错落封面，适合多种风格和单条作品。
- C 系列栏目：选择系列，再选择分集，适合连续内容。

链接可带 `#screening`、`#gallery`、`#series`。所有封面来自 Lemon 现有 `style-atlas.png`，标题为布局示例，不代表已生成的视频；页面不会假装播放。

## 文件

- `index.html`：共用页头、方向切换和页脚。
- `app.js`：示意数据、三种布局、分类和详情交互。
- `styles.css`：响应式样式、键盘焦点、减少动画偏好。
- `assets/logo.png`、`assets/style-atlas.png`：青映项目已有素材。
- `scripts/serve.mjs`：只绑定本机的零依赖静态预览服务。
- `docs/oss-cdn-review.md`：源码、匿名网络请求证据、公开资源路径建议与验证边界。
- `docs/validation.md`：实际检查范围。

## 阶段边界

本阶段只交互选型。选定方向后再接入真实视频清单、播放器状态、按媒体画幅展示、封面加载、GitHub Pages 工作流和域名部署说明。后续可迁入 Vite + TypeScript；本阶段静态原型无需构建，运行 `npm run check` 检查 JavaScript 语法。

没有 commit、push、云配置变更或公共发布。`noindex` 是原型的搜索引擎提示，不是访问控制。
