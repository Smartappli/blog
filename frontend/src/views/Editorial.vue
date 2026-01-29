<template>
  <div class="editorial">
    <header class="page-header">
      <div>
        <h2>{{ t('workflowTitle') }}</h2>
        <p>Planification collaborative, validation bilingue et suivi du calendrier VuePress.</p>
      </div>
      <button class="primary">Créer un dossier</button>
    </header>

    <section class="workflow">
      <div v-for="column in workflow" :key="column.title" class="workflow-column">
        <div class="column-header">
          <h3>{{ column.title }}</h3>
          <span>{{ column.items.length }}</span>
        </div>
        <div class="column-body">
          <article v-for="item in column.items" :key="item.title" class="workflow-card">
            <h4>{{ item.title }}</h4>
            <p>{{ item.owner }}</p>
            <div class="meta">
              <span>{{ item.due }}</span>
              <span class="status">{{ item.status }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="planning">
      <div class="planning-header">
        <h3>{{ t('issuesTitle') }}</h3>
        <button class="ghost">Exporter le planning</button>
      </div>
      <div class="planning-grid">
        <div v-for="issue in issues" :key="issue.name" class="issue-card">
          <div>
            <h4>{{ issue.name }}</h4>
            <p>{{ issue.description }}</p>
            <div class="tags">
              <span v-for="tag in issue.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="issue-meta">
            <span>{{ issue.release }}</span>
            <span class="pill">{{ issue.status }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { useLocale } from '../composables/useLocale';

  const { t } = useLocale();

  const workflow = [
    {
      title: 'Idées',
      items: [
        { title: 'Dossier biodiversité', owner: 'M. Lemaire', due: '15 oct', status: 'Brief' },
        { title: 'Données lait/viande', owner: 'K. Muller', due: '18 oct', status: 'Analyse' }
      ]
    },
    {
      title: 'En rédaction',
      items: [
        { title: 'Portrait d’éleveurs FR/DE', owner: 'L. Dubois', due: '22 oct', status: 'Bilingue' },
        { title: 'Focus innovation robots', owner: 'S. Koch', due: '25 oct', status: 'Review' }
      ]
    },
    {
      title: 'Relecture',
      items: [
        { title: 'Guide qualité fourrages', owner: 'Équipe qualité', due: '28 oct', status: 'Corrections' }
      ]
    },
    {
      title: 'Planifié',
      items: [
        { title: 'Numéro spécial durabilité', owner: 'Rédaction', due: '02 nov', status: 'Prêt' }
      ]
    }
  ];

  const issues = [
    {
      name: 'Numéro 24 • Automne 2025',
      description: 'Spécial nutrition & systèmes herbagers, interviews croisées FR/DE.',
      release: 'Publication : 02 novembre',
      status: 'Maquette',
      tags: ['Nutrition', 'Herbages', 'Bilingue']
    },
    {
      name: 'Supplément Tech • Décembre 2025',
      description: 'Capteurs, IA et automatisation des exploitations.',
      release: 'Publication : 12 décembre',
      status: 'En préparation',
      tags: ['Tech', 'IoT', 'Data']
    },
    {
      name: 'Dossier Marchés • Janvier 2026',
      description: 'Analyse de la filière et prospectives européennes.',
      release: 'Publication : 17 janvier',
      status: 'Planifié',
      tags: ['Marchés', 'Économie']
    }
  ];
</script>

<style scoped>
  .editorial {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-header p {
    color: #64748b;
  }

  .page-header button {
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    font-weight: 600;
    background: #1d4ed8;
    color: white;
  }

  .workflow {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .workflow-column {
    background: white;
    border-radius: 1.2rem;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
  }

  .column-header {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
  }

  .column-header span {
    background: #e2e8f0;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
  }

  .workflow-card {
    background: #f8fafc;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .workflow-card p {
    color: #64748b;
    font-size: 0.85rem;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #475569;
  }

  .status {
    background: #dbeafe;
    color: #1d4ed8;
    border-radius: 999px;
    padding: 0.2rem 0.6rem;
  }

  .planning {
    background: white;
    padding: 1.8rem;
    border-radius: 1.5rem;
    box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .planning-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ghost {
    border: 1px solid #cbd5f5;
    background: transparent;
    padding: 0.6rem 1.2rem;
    border-radius: 999px;
    color: #1d4ed8;
    font-weight: 600;
  }

  .planning-grid {
    display: grid;
    gap: 1rem;
  }

  .issue-card {
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 1.2rem;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    background: #f8fafc;
  }

  .issue-card p {
    color: #64748b;
    margin-top: 0.35rem;
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
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
  }

  .issue-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: right;
    font-size: 0.85rem;
    color: #475569;
  }

  .pill {
    background: #1d4ed8;
    color: white;
    border-radius: 999px;
    padding: 0.2rem 0.6rem;
    align-self: flex-end;
  }

  @media (max-width: 900px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .issue-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .issue-meta {
      text-align: left;
    }
  }
</style>
