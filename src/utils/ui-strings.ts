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
