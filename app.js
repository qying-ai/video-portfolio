import { works } from './videos.js';
const main = document.querySelector('#main');
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const title = work => work.title || `作品 ${String(works.indexOf(work) + 1).padStart(2, '0')}`;
const duration = work => `${Math.floor(work.duration / 60)}:${String(Math.floor(work.duration % 60)).padStart(2,'0')}`;
function media(work, featured = false) {
  return `<div class="media ${featured ? 'hero-media' : ''}" style="--ratio:${work.width}/${work.height}" data-media="${work.id}"><button class="cover" data-play="${work.id}" aria-label="播放${escape(title(work))}"><img src="${escape(work.poster)}" width="${work.width}" height="${work.height}" alt="${escape(title(work))}视频封面" loading="${featured ? 'eager' : 'lazy'}" ${featured ? 'fetchpriority="high"' : ''}><span class="play-icon" aria-hidden="true">▶</span><span class="duration">${duration(work)}</span></button><div class="playback" hidden><video controls playsinline preload="none" poster="${escape(work.poster)}" aria-label="${escape(title(work))}"></video><div class="player-feedback"><span class="player-status" role="status" aria-live="polite"></span><button class="retry" data-retry hidden>重新加载</button><button class="close-player" data-close aria-label="收起${escape(title(work))}">收起 ×</button></div></div></div>`;
}
if (works.length) {
  const featured = works[0];
  main.innerHTML = `<section class="hero"><div class="hero-copy"><span class="eyebrow">青映AI · 精选视频</span><h1>想象，<br>有了画面。</h1><p>用青映AI创作，<br>值得被看见的片刻。</p><a class="primary" href="#works">浏览视频 <span aria-hidden="true">↘</span></a></div><div class="featured">${media(featured,true)}<h2>${escape(title(featured))}</h2></div></section><section class="works-section" id="works"><div class="section-heading"><h2>精选作品</h2><span>每一条，都是一次想象的发生。</span></div><div class="gallery-grid">${works.map((work,index)=>`<article class="work">${media(work)}<div class="work-caption"><h3>${escape(title(work))}</h3><span class="work-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span></div></article>`).join('')}</div></section>`;
} else {
  main.innerHTML = '<section class="empty"><h1>精彩，即将呈现。</h1><p>精选视频正在整理中。</p></section>';
}
function start(container) {
  const work = works.find(item => item.id === container.dataset.media);
  const video = container.querySelector('video');
  document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
  container.querySelector('.cover').hidden = true;
  container.querySelector('.playback').hidden = false;
  container.querySelector('.retry').hidden = true;
  container.querySelector('.player-status').textContent = '正在加载视频…';
  video.src = work.url;
  video.focus({preventScroll:true});
  video.play().catch(() => {
    if (!video.error && !container.querySelector('.playback').hidden) container.querySelector('.player-status').textContent = '点击播放器播放';
  });
}
document.querySelectorAll('video').forEach(video => {
  const container = video.closest('.media');
  const status = container.querySelector('.player-status');
  video.addEventListener('playing', () => { status.textContent = ''; });
  video.addEventListener('waiting', () => { status.textContent = '正在缓冲…'; });
  video.addEventListener('ended', () => { status.textContent = '播放结束，可点击播放器重播'; });
  video.addEventListener('error', () => { status.textContent = '视频加载失败，请重试'; container.querySelector('.retry').hidden = false; });
  video.addEventListener('play', () => { document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); }); });
});
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  const container = button?.closest('.media');
  if (!container) return;
  if (button.hasAttribute('data-play') || button.hasAttribute('data-retry')) start(container);
  if (button.hasAttribute('data-close')) {
    const video = container.querySelector('video');
    video.pause();
    video.removeAttribute('src');
    video.load();
    container.querySelector('.playback').hidden = true;
    const cover = container.querySelector('.cover');
    cover.hidden = false;
    cover.focus({preventScroll:true});
  }
});
