document.addEventListener('DOMContentLoaded', () => {
  enhanceArticleVisuals();
  buildTOC();
  initSearch();
  initShare();
});

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^\w\s-가-힣]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function buildTOC() {
  const content = document.getElementById('article-content');
  const toc = document.getElementById('toc-list');
  if (!content || !toc) return;
  const headings = content.querySelectorAll('h2, h3');
  if (!headings.length) return;

  const list = document.createElement('ul');
  let sectionNumber = 0;
  let subNumber = 0;
  headings.forEach((heading, index) => {
    if (!heading.id) heading.id = `${slugify(heading.textContent)}-${index + 1}`;
    const item = document.createElement('li');
    if (heading.tagName === 'H3') {
      item.className = 'toc-sub';
      subNumber += 1;
    } else {
      sectionNumber += 1;
      subNumber = 0;
    }
    const link = document.createElement('a');
    const number = heading.tagName === 'H3'
      ? `${String(sectionNumber).padStart(2, '0')}.${subNumber}`
      : `${String(sectionNumber).padStart(2, '0')}.`;
    link.href = `#${heading.id}`;
    link.innerHTML = `<span class="toc-number">${number}</span>${escapeHtml(heading.textContent)}`;
    item.appendChild(link);
    list.appendChild(item);
  });
  toc.appendChild(list);
}

function enhanceArticleVisuals() {
  const content = document.getElementById('article-content');
  if (!content) return;
  const title = document.querySelector('.article-header h1')?.textContent || '';
  if (!title.includes('LLM 기초')) return;

  const headings = [...content.querySelectorAll('h2')];
  const find = prefix => headings.find(h => h.textContent.trim().startsWith(prefix));
  const insertBeforeFirstPre = (heading, node) => {
    if (!heading) return;
    let sibling = heading.nextElementSibling;
    while (sibling && sibling.tagName !== 'PRE' && sibling.tagName !== 'H2') sibling = sibling.nextElementSibling;
    if (sibling && sibling.tagName === 'PRE') sibling.before(node);
    else heading.after(node);
  };

  const section1 = find('1. 왜 EDA Agent');
  if (section1 && !content.querySelector('.concept-grid')) {
    const grid = document.createElement('div');
    grid.className = 'concept-grid';
    grid.innerHTML = `
      <div class="concept-card"><div class="concept-icon">◎</div><h3>소통과 의사결정</h3><p>기본 용어와 동작 메커니즘을 알아야 업계·벤더와 정확하게 소통할 수 있습니다.</p></div>
      <div class="concept-card"><div class="concept-icon">›_</div><h3>프롬프트 그 이상</h3><p>학습과 추론을 이해해야 AI 도구와 Pipeline을 제대로 설계할 수 있습니다.</p></div>
      <div class="concept-card"><div class="concept-icon">◎</div><h3>해결책 선택</h3><p>문제의 원인에 따라 Prompt·RAG·Fine-Tuning 중 최적의 방법을 선택합니다.</p></div>`;
    const firstList = section1.nextElementSibling?.nextElementSibling;
    if (firstList && (firstList.tagName === 'OL' || firstList.tagName === 'UL')) firstList.before(grid);
    else section1.after(grid);
    const insight = document.createElement('div');
    insight.className = 'insight-box';
    insight.textContent = '핵심 질문: 우리 비즈니스 문제를 해결할 때 Prompt, RAG, 파인튜닝 중 무엇을 선택해야 하는가?';
    grid.after(insight);
  }

  const figures = [
    ['2. AI · Machine Learning', '/assets/images/ai-ml-dl-llm.svg', 'Figure 2. AI · ML · DL · LLM의 포함 관계'],
    ['3. Neural Network', '/assets/images/neural-network.svg', 'Figure 3. Neural Network의 Input · Hidden · Output 구조'],
    ['4. 학습(Training)', '/assets/images/training-loop.svg', 'Figure 4. Prediction → Loss → Backpropagation → Weight Update 학습 Loop']
  ];
  figures.forEach(([prefix, src, caption]) => {
    const heading = find(prefix);
    if (!heading || content.querySelector(`img[src*="${src.split('/').pop()}"]`)) return;
    const figure = document.createElement('figure');
    figure.className = 'article-figure';
    figure.innerHTML = `<img src="${document.querySelector('base')?.href || ''}${src}" alt="${caption}" loading="lazy"><figcaption>${caption}</figcaption>`;
    const absoluteSrc = `${window.location.origin}${window.location.pathname.split('/posts/')[0]}${src}`;
    figure.querySelector('img').src = absoluteSrc;
    insertBeforeFirstPre(heading, figure);
  });
}

function initShare() {
  const button = document.getElementById('copy-link');
  if (!button) return;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const original = button.textContent;
      button.textContent = '✓';
      setTimeout(() => { button.textContent = original; }, 1400);
    } catch (error) {
      window.prompt('Copy this article URL:', window.location.href);
    }
  });
}

async function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const status = document.getElementById('search-status');
  if (!input || !results || !status) return;
  try {
    const response = await fetch(`${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '/') }search.json`);
    if (!response.ok) throw new Error('Search index unavailable');
    const articles = await response.json();
    const render = () => {
      const query = input.value.trim().toLowerCase();
      if (!query) { status.textContent = `${articles.length} articles available. Enter a keyword to search.`; results.innerHTML = ''; return; }
      const terms = query.split(/\s+/).filter(Boolean);
      const matches = articles.filter(article => [article.title, article.description, article.category, ...(article.tags || []), article.content].join(' ').toLowerCase()).every;
      const filtered = articles.filter(article => {
        const haystack = [article.title, article.description, article.category, ...(article.tags || []), article.content].join(' ').toLowerCase();
        return terms.every(term => haystack.includes(term));
      });
      status.textContent = `${filtered.length} article${filtered.length === 1 ? '' : 's'} found`;
      results.innerHTML = filtered.map(article => `
        <article class="article-card"><p class="tag">${escapeHtml(article.category || 'ARTICLE')}</p><h3><a class="article-link" href="${article.url}">${escapeHtml(article.title)}</a></h3><p class="post-meta">${escapeHtml(article.date)}</p><p>${escapeHtml(article.description || '')}</p><div class="tag-list">${(article.tags || []).map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join('')}</div><a class="text-link" href="${article.url}">Read article →</a></article>`).join('');
    };
    input.addEventListener('input', render);
    render();
  } catch (error) { status.textContent = 'Search is temporarily unavailable. Please try again later.'; }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
