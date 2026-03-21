<template>
  <div class="editorial">
    <header class="page-header">
      <div>
        <h2>{{ t('workflowTitle') }}</h2>
        <p>Gérez les articles de la soumission jusqu’à la mise en page avec un flux clair par étape.</p>
      </div>
    </header>

    <section class="submission-panel">
      <h3>Soumettre un article</h3>
      <form class="submission-form" @submit.prevent="submitArticle">
        <label>
          Titre
          <input v-model.trim="draftForm.title" type="text" placeholder="Ex. Tendances 2026 de l’élevage laitier" required />
        </label>
        <label>
          Auteur
          <input v-model.trim="draftForm.author" type="text" placeholder="Nom de l’auteur" required />
        </label>
        <label>
          Date cible
          <input v-model="draftForm.due" type="date" required />
        </label>
        <button class="primary" type="submit">Ajouter au flux éditorial</button>
      </form>
      <p v-if="lastSubmitted" class="submitted-info">
        Article « {{ lastSubmitted.title }} » soumis et placé en <strong>Soumis</strong>.
      </p>
    </section>

    <section class="workflow">
      <div v-for="stage in stageOrder" :key="stage" class="workflow-column">
        <div class="column-header">
          <h3>{{ stage }}</h3>
          <span>{{ getArticlesByStage(stage).length }}</span>
        </div>
        <div class="column-body">
          <article v-for="item in getArticlesByStage(stage)" :key="item.id" class="workflow-card">
            <h4>{{ item.title }}</h4>
            <p>{{ item.author }}</p>
            <div class="meta">
              <span>{{ formatDate(item.due) }}</span>
              <span class="status">{{ item.stage }}</span>
            </div>
            <button v-if="nextStage(item.stage)" class="advance" @click="advanceArticle(item.id)">
              Passer en {{ nextStage(item.stage) }}
            </button>
            <span v-else class="done">Prêt pour publication</span>
          </article>
        </div>
      </div>
    </section>

    <section class="planning">
      <div class="planning-header">
        <h3>{{ t('issuesTitle') }}</h3>
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
  import { reactive, ref } from 'vue';
  import { useLocale } from '../composables/useLocale';

  const { t } = useLocale();

  type EditorialStage = 'Soumis' | 'Révision' | 'Relecture' | 'Mise en page';

  interface EditorialArticle {
    id: number;
    title: string;
    author: string;
    due: string;
    stage: EditorialStage;
  }

  interface DraftForm {
    title: string;
    author: string;
    due: string;
  }

  const stageOrder: EditorialStage[] = ['Soumis', 'Révision', 'Relecture', 'Mise en page'];

  const articles = ref<EditorialArticle[]>([
    { id: 1, title: 'Dossier biodiversité', author: 'M. Lemaire', due: '2026-04-15', stage: 'Soumis' },
    { id: 2, title: 'Portrait d’éleveurs FR/DE', author: 'L. Dubois', due: '2026-04-22', stage: 'Révision' },
    { id: 3, title: 'Guide qualité fourrages', author: 'Équipe qualité', due: '2026-04-28', stage: 'Relecture' },
    { id: 4, title: 'Numéro spécial durabilité', author: 'Rédaction', due: '2026-05-02', stage: 'Mise en page' }
  ]);

  const draftForm = reactive<DraftForm>({
    title: '',
    author: '',
    due: ''
  });

  const lastSubmitted = ref<EditorialArticle | null>(null);

  const getArticlesByStage = (stage: EditorialStage) =>
    articles.value
      .filter((article) => article.stage === stage)
      .sort((a, b) => a.due.localeCompare(b.due));

  const nextStage = (stage: EditorialStage): EditorialStage | null => {
    const index = stageOrder.indexOf(stage);
    return index >= 0 && index < stageOrder.length - 1 ? stageOrder[index + 1] : null;
  };

  const advanceArticle = (articleId: number) => {
    const article = articles.value.find((entry) => entry.id === articleId);
    if (!article) return;

    const upcoming = nextStage(article.stage);
    if (!upcoming) return;

    article.stage = upcoming;
  };

  const submitArticle = () => {
    if (!draftForm.title || !draftForm.author || !draftForm.due) return;

    const newArticle: EditorialArticle = {
      id: Date.now(),
      title: draftForm.title,
      author: draftForm.author,
      due: draftForm.due,
      stage: 'Soumis'
    };

    articles.value = [newArticle, ...articles.value];
    lastSubmitted.value = newArticle;

    draftForm.title = '';
    draftForm.author = '';
    draftForm.due = '';
  };

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  const issues = [
    {
      name: 'Numéro 24 • Printemps 2026',
      description: 'Spécial nutrition & systèmes herbagers, interviews croisées FR/DE.',
      release: 'Publication : 02 mai 2026',
      status: 'Maquette',
      tags: ['Nutrition', 'Herbages', 'Bilingue']
    },
    {
      name: 'Supplément Tech • Été 2026',
      description: 'Capteurs, IA et automatisation des exploitations.',
      release: 'Publication : 12 juin 2026',
      status: 'En préparation',
      tags: ['Tech', 'IoT', 'Data']
    }
  ];
</script>

<style scoped>
  .editorial {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .page-header p {
    color: #64748b;
  }

  .submission-panel,
  .planning {
    background: white;
    padding: 1.5rem;
    border-radius: 1.2rem;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  }

  .submission-panel h3 {
    margin-bottom: 1rem;
  }

  .submission-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 1rem;
    align-items: end;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    font-size: 0.9rem;
    color: #334155;
  }

  input {
    border: 1px solid #cbd5e1;
    border-radius: 0.8rem;
    padding: 0.65rem 0.8rem;
    font: inherit;
  }

  .primary {
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 999px;
    font-weight: 600;
    background: #1d4ed8;
    color: white;
  }

  .submitted-info {
    margin-top: 1rem;
    color: #0f766e;
    background: #ccfbf1;
    padding: 0.75rem;
    border-radius: 0.8rem;
  }

  .workflow {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1rem;
  }

  .workflow-column {
    background: white;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

  .column-body {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .workflow-card {
    background: #f8fafc;
    border-radius: 0.9rem;
    padding: 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
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

  .advance {
    border: 1px solid #93c5fd;
    background: #eff6ff;
    color: #1d4ed8;
    border-radius: 0.7rem;
    padding: 0.45rem 0.65rem;
    font-weight: 600;
  }

  .done {
    color: #0f766e;
    font-size: 0.82rem;
    font-weight: 600;
  }

  .planning {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .planning-grid {
    display: grid;
    gap: 0.8rem;
  }

  .issue-card {
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 1rem;
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
    .issue-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .issue-meta {
      text-align: left;
    }
  }
</style>
