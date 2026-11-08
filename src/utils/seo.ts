/** Pure helpers for metadata - no React, no I/O. */

const TITLE_MAX = 90;
const DESCRIPTION_MAX = 160;

/** `"Title | Brand"` unless the title already names the brand. */
export function withBrand(title: string, brand: string | null | undefined): string {
  if (!brand || !title) return title || brand || "";
  return title.toLowerCase().includes(brand.toLowerCase()) ? title : `${title} | ${brand}`;
}

/** Path of the generated Open Graph card for a page without a branding image. */
export function ogImagePath(input: { title: string; description?: string | null; locale: string }): string {
  const params = new URLSearchParams({ t: clip(input.title, TITLE_MAX), l: input.locale });
  if (input.description) params.set("d", clip(input.description, DESCRIPTION_MAX));
  return `/og.png?${params}`;
}

export function clip(value: string, max: number): string {
  const text = value.trim();
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}
