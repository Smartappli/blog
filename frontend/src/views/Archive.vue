<template>
  <div class="archive">
    <header class="page-header">
      <div>
        <h2>{{ t('archiveTitle') }}</h2>
        <p>Accédez aux anciens numéros, indexés et consultables dans le chatbot.</p>
      </div>
      <div class="actions">
        <input v-model="keyword" placeholder="Filtrer un numéro, un thème…" />
        <select v-model="selectedYear">
          <option value="all">Toutes les années</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        <button type="button" class="search-button" @click="searchArchives">Rechercher</button>
        <button v-if="isAdmin" class="primary">Importer un PDF</button>
      </div>
    </header>

    <section class="archive-grid">
      <article v-for="issue in filteredIssues" :key="issue.name" class="archive-card">
        <div>
          <h3>{{ issue.name }}</h3>
          <p>{{ issue.summary }}</p>
          <div class="tags">
            <span v-for="tag in issue.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
        <div class="meta">
          <span>{{ issue.year }}</span>
          <span class="pill">{{ issue.pages }} pages</span>
          <button class="ghost">Consulter le PDF</button>
        </div>
      </article>
    </section>

    <section v-if="isAdmin" class="insight">
      <h3>Indexation intelligente</h3>
      <p>
        Chaque PDF est découpé, vectorisé et relié aux articles VuePress correspondants pour
        retrouver instantanément un paragraphe ou une figure.
      </p>
      <div class="stats">
        <div>
          <strong>128</strong>
          <span>PDF indexés</span>
        </div>
        <div>
          <strong>4 580</strong>
          <span>Pages analysées</span>
        </div>
        <div>
          <strong>2 langues</strong>
          <span>FR / DE</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { useWalleSmartConfig } from '@wallesmart/sdk-vue';
  import { computed, ref } from 'vue';
  import { useLocale } from '../composables/useLocale';

  const config = useWalleSmartConfig();
  const { t } = useLocale();

  const keyword = ref('');
  const selectedYear = ref('all');
  const appliedKeyword = ref('');
  const appliedYear = ref('all');
  const isAdmin = computed(() => {
    const role = config.profileRole?.toLowerCase() || '';
    return role === 'admin' || role === 'administrateur';
  });

  const issues = [
    {
      name: 'Numéro 21 • Printemps 2024',
      summary: 'Focus santé des troupeaux, retour terrain et innovations nutritionnelles.',
      year: '2024',
      pages: 64,
      tags: ['Santé', 'Nutrition', 'Bilingue']
    },
    {
      name: 'Numéro 20 • Hiver 2023',
      summary: 'Dossier spécial économie, marchés et coopérations transfrontalières.',
      year: '2023',
      pages: 58,
      tags: ['Marchés', 'Économie', 'Europe']
    },
    {
      name: 'Supplément Tech • Été 2023',
      summary: 'Robotique, capteurs et transition numérique des exploitations.',
      year: '2023',
      pages: 42,
      tags: ['Tech', 'IoT', 'Data']
    }
  ];

  const years = computed(() => Array.from(new Set(issues.map((issue) => issue.year))));

  const searchArchives = () => {
    appliedKeyword.value = keyword.value;
    appliedYear.value = selectedYear.value;
  };

  const filteredIssues = computed(() => {
    const query = appliedKeyword.value.trim().toLowerCase();
    return issues.filter((issue) => {
      const matchesYear = appliedYear.value === 'all' || issue.year === appliedYear.value;
      const matchesQuery =
        !query ||
        `${issue.name} ${issue.summary} ${issue.tags.join(' ')}`.toLowerCase().includes(query);
      return matchesYear && matchesQuery;
    });
  });
</script>

<style scoped>
  .archive {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .page-header {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .page-header p {
    color: #64748b;
  }

  .actions {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) 180px auto auto;
    gap: 1rem;
    align-items: center;
  }

  .actions input,
  .actions select {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  .primary,
  .search-button {
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    background: #1d4ed8;
    color: white;
    white-space: nowrap;
    cursor: pointer;
  }

  .archive-grid {
    display: grid;
    gap: 1.2rem;
  }

  .archive-card {
    background: white;
    border-radius: 1.2rem;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
  }

  .archive-card p {
    margin-top: 0.5rem;
    color: #64748b;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }

  .tags span {
    background: #e0e7ff;
    color: #3730a3;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
  }

  .meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #475569;
  }

  .pill {
    background: #f1f5f9;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
  }

  .ghost {
    border: 1px solid #cbd5f5;
    background: transparent;
    padding: 0.5rem 1.1rem;
    border-radius: 999px;
    color: #1d4ed8;
    font-weight: 600;
  }

  .insight {
    background: #1e293b;
    color: white;
    padding: 2rem;
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .stats div {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stats strong {
    font-size: 1.4rem;
  }

  @media (max-width: 900px) {
    .actions {
      grid-template-columns: 1fr;
    }

    .archive-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .meta {
      align-items: flex-start;
    }
  }
</style>
