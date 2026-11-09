# 青映AI · 视频展示站

当前已接入三条真实作品，按给定顺序展示，第一条同时作为首屏精选。不要求系列或风格；标题可选。

## 本地预览

Node.js 18+，无需安装依赖：

```sh
npm run dev
```

打开 http://127.0.0.1:4173 ，端口占用时可运行 `PORT=4174 npm run dev`。

## 内容与播放

`videos.js` 保存稳定公开地址、独立封面、实际尺寸和时长。三条标题为候选名称，可修改或删除，不影响播放。视频文件未加入 Git 仓库。

- 先显示封面，点击后才设置 video src 并尝试播放。
- 保留原画幅，不裁切人物和字幕。原生控件提供进度、声音和浏览器支持的全屏能力。
- 同时只播放一个视频。收起会暂停、清除 src、释放加载资源并返回封面焦点。
- 提供加载、缓冲、结束和失败重试提示。
- 封面由接入时从视频截取，无需用户另外提供；图片独立加载，网页不依赖跨域截帧。

## 媒体地址

2026-11-09 为用户选定的三条作品建立了 `ai-public/showcase/clip-{内容哈希}/` 展示副本和 poster.jpg。原任务文件、Bucket ACL 和 CDN 鉴权配置均未更改。展示副本可匿名访问。

源链接中的 auth_key、原任务路径和用户 ID 未写入本仓库；没有签名密钥。新增作品时只需提供视频链接，接入时检查访问、提取尺寸和封面后更新清单。

## 验证与部署

运行 `npm run check` 检查原生 JS 语法。本项目是零依赖静态 HTML/CSS/JS，无 TypeScript；`npm run build` 生成静态发布目录 `dist/`。实际检查见 `docs/validation.md`，访问检查见 `docs/oss-cdn-review.md`。

### 首次发布

1. 在仓库 Settings → Pages → Build and deployment 中，将 Source 设为 **GitHub Actions**。
2. 确认待提交内容，将页面改动和 Pages 工作流提交并推送到 main。
3. 在 Actions 查看 **Deploy GitHub Pages**。成功后的站点地址以运行输出为准，预计为 https://qying-ai.github.io/video-portfolio/ 。
4. 上线后验证封面、三条视频播放、进度、手机和 HTTPS。后续推送 main 会自动更新，也可手动运行工作流。

工作流运行语法检查和静态构建，只上传 dist。发布目录只包含 HTML、CSS、两个 JS 文件、logo 和 .nojekyll，视频仍从 CDN 加载；不发布内部检查文档、源签名链接、开发脚本或图集示例。

### 本地检查发布目录

```sh
npm run check
npm run build
python3 -m http.server 4180 --bind 127.0.0.1 --directory dist
```

打开 http://127.0.0.1:4180 。网页使用相对资源地址，适用于 GitHub 项目子路径和未来自定义域名。

### 后续绑定域名

注册域名后，在 Settings → Pages 配置 Custom domain，按 GitHub 指引设置 DNS，等待证书后开启 Enforce HTTPS。使用 Actions 部署时，不能仅靠仓库里的 CNAME 文件设置域名。无需改视频 CDN 地址。

仓库 Pages 发布源已由用户设为 GitHub Actions。页面与发布配置已完成本地验证，首次上线仍需将提交推送到 main 并等待工作流成功。

参考：[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[配置发布源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
