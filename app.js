// 第一阶段只有设计方向预览。所有封面来自青映现有画风示例图，不代表真实视频。
const works = [
  { id: 'coffee', title: '今天，用英语点一杯咖啡', category: '情景英语', series: '跟着 KK 学英语', art: 0, ratio: '16:9', desc: '把一句英语，放进一个熟悉的生活场景。' },
  { id: 'forest', title: '森林里的第一位客人', category: '动画故事', series: '小狐狸的咖啡馆', art: 2, ratio: '16:9', desc: '一间小店，一段关于相遇的暖心故事。' },
  { id: 'morning', title: '把清晨画成一张明信片', category: '风格短片', series: '生活里的小片刻', art: 3, ratio: '9:16', desc: '水彩、阳光和咖啡香，留住日常里的小片刻。' },
  { id: 'hello', title: '从一句 Hello 开始', category: '情景英语', series: '跟着 KK 学英语', art: 1, ratio: '9:16', desc: '让每一次开口，都从简单的对话开始。' },
];
const main = document.querySelector('#main');
const categories = ['全部作品', '情景英语', '动画故事', '风格短片'];
let direction = ['screening', 'gallery', 'series'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'screening';
let category = '全部作品';
let selected = works[0];
const art = (work, cls = '') => `<div class="art art-${work.art} ${cls}" role="img" aria-label="${work.title}的画风示意封面"><span class="sample-label">画风示意</span></div>`;
const filters = () => `<div class="filters" role="group" aria-label="按作品类型筛选">${categories.map(c => `<button data-filter="${c}" aria-pressed="${category === c}">${c}</button>`).join('')}</div>`;
const tile = work => `<article class="work"><button class="cover" data-work="${work.id}" aria-label="查看示意作品：${work.title}">${art(work)}<span class="cover-action">查看作品 <span aria-hidden="true">↗</span></span><span class="ratio">${work.ratio}</span></button><div class="work-meta"><span>${work.category}</span><span>示例选题</span></div><h3><button data-work="${work.id}">${work.title}</button></h3><p>${work.series}</p></article>`;
function detail(work) {
  return `<section class="detail" aria-label="作品详情"><div>${art(work, 'detail-art')}</div><div class="detail-copy"><span class="eyebrow">${work.category} / ${work.ratio}</span><h2>${work.title}</h2><p>${work.desc}</p><div class="pending" role="status"><strong>视频待接入</strong><span>目前展示的是画风示意，真实作品将在视频链接确认后替换。</span></div><button class="text-button" data-close>收起详情 ↑</button></div></section>`;
}
function render() {
  document.body.dataset.direction = direction;
  document.querySelectorAll('[data-direction]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.direction === direction)));
  const visible = works.filter(w => category === '全部作品' || w.category === category);
  if (direction === 'screening') {
    main.innerHTML = `<section class="screening-hero"><div class="hero-copy"><span class="eyebrow">青映AI · 精选作品</span><h1>让好故事，<br>一集集发生。</h1><p>从一个角色，到一整个系列。<br>看看我们用 AI 创作的那些片刻。</p><a class="primary" href="#works">探索作品 <span aria-hidden="true">↘</span></a><span class="hero-index">本期精选 / 01</span></div><button class="hero-visual" data-work="coffee" aria-label="查看今天，用英语点一杯咖啡的示意详情">${art(works[0])}<span class="hero-caption"><span>跟着 KK 学英语<strong>今天，用英语点一杯咖啡</strong></span><span class="round-arrow" aria-hidden="true">↗</span></span></button></section><section class="works-section" id="works"><div class="section-heading"><h2>值得停留的片刻</h2><span>每一种想象，都有自己的画面。</span></div>${filters()}<div class="work-grid">${visible.map(tile).join('')}</div><div id="detail-slot"></div></section>`;
  } else if (direction === 'gallery') {
    main.innerHTML = `<section class="gallery-intro"><div><span class="eyebrow">青映AI · 作品集</span><h1>想象，有了画面。</h1></div><p>故事、角色、风格。<br>从这里，遇见青映的创作。</p></section><section class="works-section" id="works">${filters()}<div class="gallery-grid">${visible.map(tile).join('')}</div><div id="detail-slot"></div></section>`;
  } else {
    const grouped = works.filter(w => w.series === selected.series);
    main.innerHTML = `<section class="series-intro"><span class="eyebrow">青映AI · 系列放映</span><h1>认识一个角色，<br>走进一整个故事。</h1><p>沿着熟悉的角色与画风，继续看下一集。</p></section><section class="series-layout" id="works"><aside class="series-nav" aria-label="选择系列"><h2>探索系列</h2>${[works[0], works[1], works[2]].map((w, i) => `<button data-series="${w.id}" aria-pressed="${w.series === selected.series}"><span class="series-number">0${i+1}</span><span><strong>${w.series}</strong><small>${w.category}</small></span><span aria-hidden="true">↗</span></button>`).join('')}</aside><div class="series-feature"><div class="series-screen">${art(selected)}<span class="series-stamp">${selected.series}</span></div><div class="episode-heading"><div><span class="eyebrow">当前选集 · 示意</span><h2>${selected.title}</h2></div><button class="secondary" data-work="${selected.id}">查看详情 ↗</button></div><div class="episode-list" role="group" aria-label="选择分集">${grouped.map((w,i) => `<button data-episode="${w.id}" aria-pressed="${selected.id === w.id}"><small>第 ${i+1} 集</small><strong>${w.title}</strong><span>示例选题</span></button>`).join('')}</div><div id="detail-slot"></div></div></section>`;
  }
}
function changeDirection(next) {
  direction = next;
  category = '全部作品';
  selected = works[0];
  history.replaceState(null, '', `#${direction}`);
  render();
}
document.addEventListener('click', e => {
  const button = e.target.closest('button');
  if (!button) return;
  if (button.dataset.direction) changeDirection(button.dataset.direction);
  if (button.dataset.filter) {
    category = button.dataset.filter;
    render();
    [...document.querySelectorAll('[data-filter]')].find(b => b.dataset.filter === category)?.focus({ preventScroll: true });
  }
  if (button.dataset.series || button.dataset.episode) {
    const id = button.dataset.series || button.dataset.episode;
    selected = works.find(w => w.id === id);
    render();
    document.querySelector(`[data-${button.dataset.series ? 'series' : 'episode'}="${id}"]`)?.focus({ preventScroll: true });
  }
  if (button.dataset.work) {
    const work = works.find(w => w.id === button.dataset.work);
    const slot = document.querySelector('#detail-slot');
    slot.innerHTML = detail(work);
    slot.querySelector('h2').tabIndex = -1;
    slot.querySelector('h2').focus({ preventScroll: true });
    slot.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    slot.dataset.opener = work.id;
  }
  if (button.hasAttribute('data-close')) {
    const slot = document.querySelector('#detail-slot');
    const opener = document.querySelector(`[data-work="${slot.dataset.opener}"]`);
    slot.innerHTML = '';
    opener?.focus({ preventScroll: true });
  }
});
render();
