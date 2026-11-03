import type { CmssyLocalizedValue } from "@cmssy/react";

/** Pick the string for `locale` from a cmssy localized value, falling back to any language. */
export function localize(
  text: CmssyLocalizedValue | undefined,
  locale: string,
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] ?? Object.values(text)[0] ?? "";
}
