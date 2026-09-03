document.addEventListener('DOMContentLoaded', () => {
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
  if (!headings.length) {
    toc.closest('.toc-card')?.remove();
    return;
  }

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
      if (!query) {
        status.textContent = `${articles.length} articles available. Enter a keyword to search.`;
        results.innerHTML = '';
        return;
      }

      const terms = query.split(/\s+/).filter(Boolean);
      const matches = articles.filter(article => {
        const haystack = [article.title, article.description, article.category, ...(article.tags || []), article.content]
          .join(' ').toLowerCase();
        return terms.every(term => haystack.includes(term));
      });

      status.textContent = `${matches.length} article${matches.length === 1 ? '' : 's'} found`;
      results.innerHTML = matches.map(article => `
        <article class="article-card">
          <p class="tag">${escapeHtml(article.category || 'ARTICLE')}</p>
          <h3><a class="article-link" href="${article.url}">${escapeHtml(article.title)}</a></h3>
          <p class="post-meta">${escapeHtml(article.date)}</p>
          <p>${escapeHtml(article.description || '')}</p>
          <div class="tag-list">${(article.tags || []).map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join('')}</div>
          <a class="text-link" href="${article.url}">Read article →</a>
        </article>
      `).join('');
    };

    input.addEventListener('input', render);
    render();
  } catch (error) {
    status.textContent = 'Search is temporarily unavailable. Please try again later.';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}
