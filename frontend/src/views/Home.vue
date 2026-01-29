<template>
  <div class="home">
    <section class="hero">
      <div>
        <p class="hero-pill">{{ t('vuepressLabel') }}</p>
        <h2>{{ t('heroTitle') }}</h2>
        <p class="hero-subtitle">{{ t('heroSubtitle') }}</p>
        <div class="hero-actions">
          <button class="primary">{{ t('heroCta') }}</button>
          <button class="secondary">{{ t('navSearch') }}</button>
        </div>
      </div>
      <div class="hero-card">
        <h3>{{ t('featuredTitle') }}</h3>
        <div v-for="article in featuredArticles" :key="article.slug" class="featured-item">
          <div>
            <span class="category">{{ article.category }}</span>
            <h4>{{ localize(article.title) }}</h4>
            <p>{{ localize(article.summary) }}</p>
          </div>
          <span class="pill">{{ article.readTime }} min</span>
        </div>
      </div>
    </section>

    <section class="search" id="search">
      <div class="search-header">
        <h3>{{ t('searchTitle') }}</h3>
        <p>VuePress + Algolia + Ollama : une recherche hybride rapide et contextuelle.</p>
      </div>
      <div class="search-controls">
        <input v-model="keyword" :placeholder="t('searchPlaceholder')" />
        <select v-model="selectedCategory">
          <option value="all">{{ t('categoryAll') }}</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="results">
        <article v-for="article in filteredArticles" :key="article.slug" class="article-card">
          <div class="article-header">
            <div>
              <span class="category">{{ article.category }}</span>
              <h4>{{ localize(article.title) }}</h4>
              <p>{{ localize(article.summary) }}</p>
            </div>
            <div class="article-meta">
              <span>{{ article.date }}</span>
              <span>{{ article.readTime }} min</span>
            </div>
          </div>
          <div class="article-links">
            <span>Liens éditoriaux :</span>
            <div class="related">
              <span v-for="slug in article.related" :key="slug" class="link">
                {{ localize(articleBySlug(slug)?.title || article.title) }}
              </span>
            </div>
          </div>
          <div class="tag-list">
            <span v-for="tag in article.tags" :key="tag">#{{ tag }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="insights">
      <div class="insight">
        <h3>Catégories populaires</h3>
        <div class="chips">
          <span v-for="category in categories" :key="category">{{ category }}</span>
        </div>
      </div>
      <div class="insight">
        <h3>VuePress prêt pour le bilingue</h3>
        <ul>
          <li>Navigation FR/DE et blocs éditoriaux synchronisés.</li>
          <li>Liens croisés entre dossiers d’articles.</li>
          <li>Indexation PDF + Markdown dans une seule base.</li>
        </ul>
      </div>
      <div class="insight">
        <h3>Connexion au chatbot Ollama</h3>
        <p>
          Les articles et PDF sont vectorisés pour répondre aux questions des lecteurs en temps réel.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useLocale } from '../composables/useLocale';

  const { language, t } = useLocale();

  const keyword = ref('');
  const selectedCategory = ref('all');

  const articles = [
    {
      slug: 'innovation-fourrages',
      category: 'Nutrition',
      date: '12 oct 2025',
      readTime: 6,
      title: {
        fr: 'Innovation dans les fourrages durables',
        de: 'Innovation bei nachhaltigen Futtermitteln'
      },
      summary: {
        fr: 'Stratégies pour réduire l’empreinte carbone en élevage laitier.',
        de: 'Strategien zur Reduktion des CO₂-Fußabdrucks in Milchbetrieben.'
      },
      tags: ['durabilité', 'prairies', 'CO2'],
      related: ['bien-etre-animal', 'data-ferme'],
      featured: true
    },
    {
      slug: 'bien-etre-animal',
      category: 'Bien-être',
      date: '05 oct 2025',
      readTime: 5,
      title: {
        fr: 'Bien-être animal : pratiques certifiées',
        de: 'Tierwohl: zertifizierte Praktiken'
      },
      summary: {
        fr: 'Protocoles communs FR/DE pour améliorer le confort des troupeaux.',
        de: 'Gemeinsame FR/DE-Protokolle zur Verbesserung des Tierkomforts.'
      },
      tags: ['santé', 'audit', 'certification'],
      related: ['innovation-fourrages'],
      featured: true
    },
    {
      slug: 'data-ferme',
      category: 'Numérique',
      date: '28 sept 2025',
      readTime: 7,
      title: {
        fr: 'Data & capteurs : piloter la ferme',
        de: 'Daten & Sensoren: den Betrieb steuern'
      },
      summary: {
        fr: 'Tableaux de bord, alertes IoT et indicateurs de performance.',
        de: 'Dashboards, IoT-Alerts und Leistungskennzahlen.'
      },
      tags: ['iot', 'dashboard', 'analytics'],
      related: ['innovation-fourrages'],
      featured: true
    },
    {
      slug: 'marches-europe',
      category: 'Marchés',
      date: '20 sept 2025',
      readTime: 4,
      title: {
        fr: 'Marchés européens : tendances 2026',
        de: 'Europäische Märkte: Trends 2026'
      },
      summary: {
        fr: 'Synthèse des indicateurs économiques et prix du lait.',
        de: 'Zusammenfassung von Wirtschaftsdaten und Milchpreisen.'
      },
      tags: ['économie', 'prix', 'export'],
      related: ['data-ferme'],
      featured: false
    }
  ];

  const categories = computed(() => {
    const unique = new Set(articles.map((article) => article.category));
    return Array.from(unique);
  });

  const filteredArticles = computed(() => {
    const query = keyword.value.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory.value === 'all' || article.category === selectedCategory.value;
      const content = `${localize(article.title)} ${localize(article.summary)} ${article.tags.join(' ')}`;
      const matchesQuery = !query || content.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  });

  const featuredArticles = computed(() => articles.filter((article) => article.featured));

  const localize = (text: { fr: string; de: string }) => text[language.value];

  const articleBySlug = (slug: string) => articles.find((article) => article.slug === slug);
</script>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 2rem;
    align-items: center;
  }

  .hero-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    background: #e0e7ff;
    color: #3730a3;
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .hero h2 {
    font-size: 2.4rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.05rem;
    color: #475569;
    margin-bottom: 1.5rem;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
  }

  .hero-actions button {
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
  }

  .hero-actions .primary {
    background: #1d4ed8;
    color: white;
    box-shadow: 0 10px 20px rgba(29, 78, 216, 0.2);
  }

  .hero-actions .secondary {
    background: white;
    color: #1d4ed8;
    border: 1px solid #c7d2fe;
  }

  .hero-card {
    background: white;
    padding: 1.5rem;
    border-radius: 1.25rem;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .featured-item {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    border-top: 1px solid #e2e8f0;
    padding-top: 1rem;
  }

  .featured-item:first-of-type {
    border-top: none;
    padding-top: 0;
  }

  .featured-item h4 {
    margin-top: 0.35rem;
    margin-bottom: 0.35rem;
  }

  .pill {
    background: #f1f5f9;
    color: #475569;
    border-radius: 999px;
    padding: 0.2rem 0.6rem;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  .search {
    background: white;
    padding: 2rem;
    border-radius: 1.5rem;
    box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .search-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .search-controls {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 1rem;
  }

  .search-controls input,
  .search-controls select {
    padding: 0.8rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
  }

  .results {
    display: grid;
    gap: 1.2rem;
  }

  .article-card {
    border: 1px solid #e2e8f0;
    padding: 1.4rem;
    border-radius: 1rem;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .article-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .article-meta {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    text-align: right;
    font-size: 0.85rem;
    color: #64748b;
  }

  .category {
    background: #dbeafe;
    color: #1d4ed8;
    font-weight: 600;
    border-radius: 999px;
    padding: 0.2rem 0.6rem;
    font-size: 0.75rem;
  }

  .article-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #475569;
  }

  .related {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .related .link {
    background: white;
    border: 1px solid #cbd5f5;
    border-radius: 999px;
    padding: 0.25rem 0.6rem;
  }

  .tag-list {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tag-list span {
    font-size: 0.75rem;
    background: #e2e8f0;
    color: #475569;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
  }

  .insights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .insight {
    background: white;
    padding: 1.5rem;
    border-radius: 1.25rem;
    box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chips span {
    background: #f1f5f9;
    border-radius: 999px;
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
  }

  @media (max-width: 900px) {
    .hero {
      grid-template-columns: 1fr;
    }

    .search-controls {
      grid-template-columns: 1fr;
    }

    .article-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .article-meta {
      text-align: left;
    }
  }
</style>
