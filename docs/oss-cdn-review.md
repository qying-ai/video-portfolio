# OSS / CDN 展示资源检查

检查日期：2026-11-08。仅阅读 Lemon 源码和文档、发送匿名只读 HTTP 请求。未修改云配置、ACL、对象、签名或生产代码。未读取或记录密钥。

## 源码与文档证据

- `lemon/apps/zhimon-api/src/utils/cdn-auth.ts`：本站 CDN 使用 A 型 `auth_key`，仅服务端签名。时间戳按 1800 秒分桶；**1800 秒不是签名有效期**，实际 TTL 在 CDN 控制台配置。函数会给本站 CDN URL 统一加签，并不按免鉴权目录跳过，所以「URL 带 auth_key」本身不能证明该资源一定需要鉴权。
- `lemon/apps/zhimon-api/src/utils/oss.ts`：公网地址优先使用 `OSS_PUBLIC_BASE_URL`；`publicUrlForKey` 只是拼地址，不检查可访问性。OSS 上传签名和 CDN 访问签名是不同机制。
- `lemon/apps/zhimon-api/src/ai/compile/voice-presets.ts`：公共音色使用 `https://zpublic.zhimon.com/ai-public/voice/`，明确要求免鉴权。
- `lemon/packages/shared-types/src/brands.ts`：公共品牌图使用 `/images/logo.png`。
- `lemon/docs/需求文档/robot脚本鉴权下发-需求文档.md`：历史记录是 `zhimon` 私有桶、CDN 私有回源；URL 鉴权覆盖 `*/ai/*`、`*/brand/*`、`*/matrix/*`。文档包含 `tascripts` 的历史待办，未当作当前控制台配置。
- `lemon/docs/运维与上线.md`：记录不开 Referer 防盗链，以便供应商抓取。未登录控制台核实当前完整规则。

## 匿名实测

向 CDN 请求时发送 `Origin: https://qying-ai.github.io`，不带 Cookie、Authorization、auth_key。使用 Range GET 尽量减少流量。

| 地址 / 路径 | 结果 | 能支持的结论 |
| --- | --- | --- |
| `zpublic.zhimon.com/images/logo.png` | 206，image/png | 该现存图片可匿名读取，支持本次范围请求 |
| `zpublic.zhimon.com/ai-public/voice/annaSu-casual-friendly-bright-clip.mp3` | 206，audio/mpeg | 该现存音频可匿名读取，支持本次范围请求 |
| `/ai/portfolio-access-probe-nonexistent.mp4` | CDN HTML 403 | 与该前缀鉴权记录一致，不证明对象存在 |
| `/brand/portfolio-access-probe-nonexistent.png` | CDN HTML 403 | 同上 |
| `/matrix/portfolio-access-probe-nonexistent.png` | CDN HTML 403 | 同上 |
| `/ai-public/showcase/portfolio-access-probe-nonexistent.mp4` | OSS XML 404 / NoSuchKey | 这次请求通过 CDN 到源站，没有证明视频存在或所有子路径均免鉴权 |
| `zhimon.oss-cn-hangzhou.aliyuncs.com/ai-public/voice/annaSu-casual-friendly-bright-clip.mp3` | HEAD 403 | 同一现存对象无法通过裸 OSS 域名匿名读取 |
| 公共音色 CDN 地址，HEAD 携带 GitHub Referer | 200 | 本次 GitHub 来源请求未被 Referer 拦截 |

成功的 CDN 响应返回 `Access-Control-Allow-Origin: https://app.zhimon.com`，没有匹配 GitHub 来源。普通、不设置 crossorigin 的视频元素通常可跨域播放，但 fetch、带 crossorigin 的媒体和 canvas 读像素需符合 CORS。不能把 HTTP 请求成功当作浏览器播放验收。

## 建议

1. 挑选确实对外展示的成片，**复制**到 `ai-public/showcase/{作品slug}/v1/video.mp4`，配套封面放 `poster.jpg`。保留受保护原件。
2. 静态站引用 `https://zpublic.zhimon.com/ai-public/showcase/...` 的稳定地址，公开配置不带 auth_key、AccessKey、用户 ID 或任务 ID。
3. 公开路径先用一个真实视频验证匿名 GET、Range 206、MIME、手机播放和拖动，再批量复制。不能仅凭本次 NoSuchKey 认定已完成放行。
4. 封面使用独立图片，避免在 GitHub 页面跨域截视频帧。若后续确实需要 fetch 或 canvas，再针对公开资源配置合适 CORS，并验证 CDN 缓存及 Origin 行为。
5. 不关闭 `ai/`、`brand/`、`matrix/` 鉴权，不把原桶改成公共读，不把签名密钥放进 GitHub Actions 或网页。

## 尚未验证

控制台完整鉴权匹配规则、实际 TTL、Bucket Policy / 对象 ACL、CORS 完整配置及缓存行为；真实 showcase 视频、完整播放、拖动、弱网、微信与 Safari。当前不需要改变云配置。

## 2026-11-09：三条真实视频验证与展示副本

为用户指定的三条作品在同桶建立独立的 `ai-public/showcase/clip-{sha256前12位}/video.mp4` 与 `poster.jpg`，未覆盖原任务文件、未改变对象 ACL / Bucket ACL / CDN 配置。视频使用同桶复制，封面为本机抽帧后上传。目录对应内容哈希，避免用户或任务标识进入公开清单。

三条视频及封面经 CDN、无 auth_key、携带 GitHub Origin / Referer 的 Range GET 均返回 206：MP4 为 video/mp4，封面为 image/jpeg。随后在本机展示页用不带 crossorigin 的 video 元素实际播放三条、验证第二条进度跳转。由此确认这三个已存在对象在本次检查中不需要 CDN URL 签名。当前 CORS 无需更改，页面不对视频执行 fetch / canvas 截帧。

仅这三条选定作品及对应封面作为公开展示副本；没有开放整个 ai/tasks 路径。稳定 CDN 地址位于 videos.js。原始带签名链接及下载的源视频仅用于本机处理，未加入仓库。
