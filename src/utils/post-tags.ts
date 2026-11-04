/** Labels of the `tags` options on the cmssy `post` model, per language. Keep in step with the model. */
const TAGS: Record<string, Record<string, string>> = {
  "ai-agents": { pl: "Agenci AI", en: "AI agents" },
  documents: { pl: "Dokumenty", en: "Documents" },
  integrations: { pl: "Integracje", en: "Integrations" },
  security: { pl: "Bezpieczeństwo", en: "Security" },
  process: { pl: "Procesy", en: "Processes" },
  "case-study": { pl: "Case study", en: "Case study" },
};

export function tagLabel(value: string, locale: string): string {
  return TAGS[value]?.[locale] ?? TAGS[value]?.pl ?? value;
}
