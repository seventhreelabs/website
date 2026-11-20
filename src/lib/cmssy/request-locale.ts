import { cache } from "react";

/**
 * The language the root layout resolved for this request, for not-found.tsx.
 * Next renders the 404 boundary together with every page, so reading
 * headers() there made the whole site dynamic (no-store, no CDN cache).
 * The layout renders before its 404 boundary, so the value is set by then.
 */
const slot = cache((): { locale?: string } => ({}));

export function setRequestLocale(locale: string | undefined) {
  slot().locale = locale;
}

export function requestLocale(): string | undefined {
  return slot().locale;
}
