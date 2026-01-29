<template>
  <div class="chatbot">
    <header class="page-header">
      <div>
        <h2>{{ t('chatbotTitle') }}</h2>
        <p>{{ t('chatbotSubtitle') }}</p>
      </div>
      <button class="primary">Synchroniser l’index</button>
    </header>

    <section class="chat-layout">
      <aside class="knowledge">
        <h3>Sources indexées</h3>
        <ul>
          <li>
            <strong>Articles VuePress</strong>
            <span>42 billets</span>
          </li>
          <li>
            <strong>Archives PDF</strong>
            <span>128 numéros</span>
          </li>
          <li>
            <strong>Dictionnaires FR/DE</strong>
            <span>Glossaire & traduction</span>
          </li>
        </ul>
        <div class="model">
          <p>Modèle Ollama</p>
          <h4>mistral:7b-instruct</h4>
          <span>Embeddings: bge-m3</span>
        </div>
        <button class="ghost">Configurer Ollama</button>
      </aside>

      <div class="chat-panel">
        <div class="chat-history">
          <div class="message bot">
            <p>Bonjour ! Que souhaitez-vous trouver dans la revue ?</p>
            <span>Index FR/DE chargé</span>
          </div>
          <div class="message user">
            <p>Montre-moi les tendances marché 2026 et les PDF associés.</p>
          </div>
          <div class="message bot">
            <p>
              Voici 3 articles liés (Marchés, Économie) et 2 PDF du numéro hiver 2023. Voulez-vous
              un résumé ?
            </p>
            <div class="suggestions">
              <span>Résumé bilingue</span>
              <span>Ouvrir PDF</span>
              <span>Planifier une publication</span>
            </div>
          </div>
        </div>
        <div class="chat-input">
          <input placeholder="Posez une question au chatbot…" />
          <button class="primary">Envoyer</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { useLocale } from '../composables/useLocale';

  const { t } = useLocale();
</script>

<style scoped>
  .chatbot {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
  }

  .page-header p {
    color: #64748b;
  }

  .primary {
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    font-weight: 600;
    background: #1d4ed8;
    color: white;
  }

  .chat-layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 1.5rem;
  }

  .knowledge {
    background: white;
    padding: 1.5rem;
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
  }

  .knowledge ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .knowledge li {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.75rem;
  }

  .knowledge li:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .knowledge span {
    color: #64748b;
    font-size: 0.85rem;
  }

  .model {
    background: #1e293b;
    color: white;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .model span {
    color: rgba(255, 255, 255, 0.7);
  }

  .ghost {
    border: 1px solid #cbd5f5;
    background: transparent;
    padding: 0.6rem 1.2rem;
    border-radius: 999px;
    color: #1d4ed8;
    font-weight: 600;
  }

  .chat-panel {
    background: white;
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .chat-history {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 320px;
  }

  .message {
    max-width: 75%;
    padding: 1rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .message.bot {
    background: #f1f5f9;
  }

  .message.user {
    background: #1d4ed8;
    color: white;
    align-self: flex-end;
  }

  .message span {
    font-size: 0.75rem;
    color: #64748b;
  }

  .message.user span {
    color: rgba(255, 255, 255, 0.7);
  }

  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .suggestions span {
    background: white;
    border-radius: 999px;
    padding: 0.25rem 0.75rem;
    border: 1px solid #cbd5f5;
    font-size: 0.75rem;
  }

  .chat-input {
    display: flex;
    gap: 0.75rem;
  }

  .chat-input input {
    flex: 1;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  @media (max-width: 900px) {
    .chat-layout {
      grid-template-columns: 1fr;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .message {
      max-width: 100%;
    }
  }
</style>
