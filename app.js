const heroContainer = document.getElementById('hero');
const articlesContainer = document.getElementById('articles');
const navLinks = document.querySelectorAll('.nav-links a');

const categoryMap = {
  latest: 'terbaru',
  national: 'nasional',
  international: 'internasional',
  business: 'ekonomi',
  sports: 'olahraga',
  technology: 'teknologi',
  entertainment: 'hiburan',
  lifestyle: 'gaya-hidup'
};

const API_BASE_URL = 'https://api-berita-indonesia.vercel.app/cnn';

let allArticles = [];
let currentCategory = 'latest';

function fetchArticles(category) {
  heroContainer.innerHTML = '';
  articlesContainer.innerHTML = '<p>Memuat berita...</p>';

  const endpoint = categoryMap[category] || 'terbaru';
  const url = `${API_BASE_URL}/${endpoint}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      allArticles = data.data.posts || [];
      renderArticles();
    })
    .catch(() => {
      articlesContainer.innerHTML = '<p>Gagal memuat berita.</p>';
    });
}

function renderArticles() {
  const limit = 20;
  const sortOrder = 'desc';

  let filtered = allArticles;

  filtered.sort((a, b) => {
    const dateA = new Date(a.pubDate);
    const dateB = new Date(b.pubDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const articles = filtered.slice(0, limit);

  if (articles.length > 0) {
    const hero = articles[0];
    const heroDate = new Date(hero.pubDate).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    heroContainer.innerHTML = `
      <div class="highlight-content">
        <div class="highlight-text">
          <div class="label">Headline</div>
          <h2>${hero.title}</h2>
          <p class="desc">${hero.description || ''}</p>
          <div class="highlight-meta">
            <span>📅 ${heroDate}</span>
            <a href="${hero.link}" class="highlight-link" target="_blank">Baca Selengkapnya</a>
          </div>
        </div>
        <div class="highlight-image">
          <img src="${hero.thumbnail || 'https://via.placeholder.com/600x300'}" alt="${hero.title}">
        </div>
      </div>
    `;
  }

  articlesContainer.innerHTML = '';
  articles.slice(1).forEach(article => {
    const articleEl = document.createElement('div');
    articleEl.className = 'article';
    articleEl.innerHTML = `
      <img src="${article.thumbnail || 'https://via.placeholder.com/400x200'}" alt="${article.title}">
      <div class="article-content">
        <h3>${article.title}</h3>
        <p>${new Date(article.pubDate).toLocaleDateString('id-ID')}</p>
        <a href="${article.link}" target="_blank">Baca selengkapnya</a>
      </div>
    `;
    articlesContainer.appendChild(articleEl);
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    currentCategory = link.dataset.category;
    fetchArticles(currentCategory);
  });
});

fetchArticles(currentCategory);
