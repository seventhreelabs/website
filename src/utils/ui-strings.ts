/**
 * The few interface strings that are not CMS content (menu button, aria
 * labels, 404 fallback). Everything a visitor reads as copy lives in cmssy.
 */
type Strings = {
  menuOpen: string;
  menuClose: string;
  mainNav: string;
  languageNav: string;
  actorAgent: string;
  actorHuman: string;
  sampleProcess: string;
  workflowSteps: string;
  notFoundHeading: string;
  notFoundText: string;
  notFoundCta: string;
  languageName: string;
  technologies: string;
  sampleProcesses: string;
  profile: string;
  email: string;
  mdNote: string;
  mdPages: string;
  mdLanguages: string;
  mdFormat: string;
  mdFormatNote: string;
  mdUpdated: string;
  backToBlog: string;
  minutesRead: string;
  blog: string;
  author: string;
  tags: string;
};

const STRINGS: Record<string, Strings> = {
  pl: {
    menuOpen: "Menu",
    menuClose: "Zamknij",
    mainNav: "Główna",
    languageNav: "Język",
    actorAgent: "Agent",
    actorHuman: "Człowiek",
    sampleProcess: "Przykładowy proces",
    workflowSteps: "Etapy współpracy",
    notFoundHeading: "Tej strony nie ma",
    notFoundText: "Adres jest nieaktualny albo strona została przeniesiona.",
    notFoundCta: "Wróć na stronę główną",
    languageName: "Polski",
    technologies: "Technologie",
    sampleProcesses: "Przykładowe procesy",
    profile: "Profil",
    email: "E-mail",
    mdNote: "Wersja markdown strony",
    mdPages: "Strony",
    mdLanguages: "Inne języki",
    mdFormat: "Format dla agentów i LLM",
    mdFormatNote: "Każda strona jest dostępna jako markdown: dodaj `.md` do adresu albo wyślij nagłówek `Accept: text/markdown`. Cała treść serwisu w jednym pliku:",
    mdUpdated: "Ostatnia aktualizacja",
    backToBlog: "Blog",
    minutesRead: "min czytania",
    blog: "Blog",
    author: "Autor",
    tags: "Tagi",
  },
  en: {
    menuOpen: "Menu",
    menuClose: "Close",
    mainNav: "Main",
    languageNav: "Language",
    actorAgent: "Agent",
    actorHuman: "Human",
    sampleProcess: "Sample process",
    workflowSteps: "Stages of work",
    notFoundHeading: "This page does not exist",
    notFoundText: "The address is out of date or the page has moved.",
    notFoundCta: "Back to the home page",
    languageName: "English",
    technologies: "Technologies",
    sampleProcesses: "Sample processes",
    profile: "Profile",
    email: "Email",
    mdNote: "Markdown version of",
    mdPages: "Pages",
    mdLanguages: "Other languages",
    mdFormat: "Format for agents and LLMs",
    mdFormatNote: "Every page is available as markdown: append `.md` to its URL or send an `Accept: text/markdown` header. The whole site in one file:",
    mdUpdated: "Last updated",
    backToBlog: "Blog",
    minutesRead: "min read",
    blog: "Blog",
    author: "Author",
    tags: "Tags",
  },
};

export type UiStrings = Strings;

const FALLBACK = "pl";

export function ui(locale?: string | null): UiStrings {
  return STRINGS[locale ?? ""] ?? STRINGS[FALLBACK];
}

const OG_LOCALES: Record<string, string> = { pl: "pl_PL", en: "en_US" };

/** Open Graph locale tag for a site language. */
export function ogLocale(locale: string): string {
  return OG_LOCALES[locale] ?? locale;
}
