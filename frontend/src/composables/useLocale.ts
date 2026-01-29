import { inject, provide, ref } from 'vue';

export type Locale = 'fr' | 'de';

const messages = {
  fr: {
    appName: 'Revue VuePress',
    navHome: 'Accueil',
    navEditorial: 'Éditorial',
    navArchive: 'Archives PDF',
    navChatbot: 'Chatbot',
    navSearch: 'Recherche',
    heroTitle: 'La revue bilingue de référence pour l’élevage',
    heroSubtitle:
      'Un blog VuePress en français et allemand, avec planification éditoriale, indexation intelligente et accès aux anciens numéros.',
    heroCta: 'Consulter les derniers articles',
    searchTitle: 'Trouver un article',
    searchPlaceholder: 'Mot-clé, auteur, sujet…',
    categoryAll: 'Toutes les catégories',
    featuredTitle: 'Articles à la une',
    workflowTitle: 'Processus éditorial',
    issuesTitle: 'Numéros planifiés',
    archiveTitle: 'Anciens numéros en PDF',
    chatbotTitle: 'Assistant éditorial Ollama',
    chatbotSubtitle:
      'Posez vos questions aux articles et aux archives PDF grâce à un modèle open source indexé localement.',
    languageLabel: 'Langue',
    vuepressLabel: 'Propulsé par VuePress'
  },
  de: {
    appName: 'VuePress Magazin',
    navHome: 'Startseite',
    navEditorial: 'Redaktion',
    navArchive: 'PDF-Archiv',
    navChatbot: 'Chatbot',
    navSearch: 'Suche',
    heroTitle: 'Das zweisprachige Fachmagazin für Tierhaltung',
    heroSubtitle:
      'Ein VuePress-Blog auf Französisch und Deutsch mit redaktioneller Planung, smarter Indexierung und PDF-Archiv.',
    heroCta: 'Neueste Artikel entdecken',
    searchTitle: 'Artikel finden',
    searchPlaceholder: 'Stichwort, Autor, Thema…',
    categoryAll: 'Alle Kategorien',
    featuredTitle: 'Aktuelle Beiträge',
    workflowTitle: 'Redaktioneller Ablauf',
    issuesTitle: 'Geplante Ausgaben',
    archiveTitle: 'Frühere Ausgaben als PDF',
    chatbotTitle: 'Ollama Redaktionsassistent',
    chatbotSubtitle:
      'Fragen Sie Artikel und PDF-Archive mit einem lokal indexierten Open-Source-Modell ab.',
    languageLabel: 'Sprache',
    vuepressLabel: 'Erstellt mit VuePress'
  }
};

const localeSymbol = Symbol('locale');

export type LocaleMessageKey = keyof typeof messages.fr;

export interface LocaleContext {
  language: ReturnType<typeof ref<Locale>>;
  t: (key: LocaleMessageKey) => string;
  setLanguage: (lang: Locale) => void;
}

export const createLocale = (): LocaleContext => {
  const language = ref<Locale>('fr');
  const t = (key: LocaleMessageKey) => messages[language.value][key] ?? key;
  const setLanguage = (lang: Locale) => {
    language.value = lang;
  };
  return { language, t, setLanguage };
};

export const provideLocale = () => {
  const locale = createLocale();
  provide(localeSymbol, locale);
  return locale;
};

export const useLocale = () => {
  const locale = inject<LocaleContext>(localeSymbol);
  if (!locale) {
    throw new Error('Locale not provided');
  }
  return locale;
};
