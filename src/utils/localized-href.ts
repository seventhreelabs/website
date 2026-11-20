import { localizeHref } from "@cmssy/core";
import { homeAnchor } from "./home-anchor";

type LocaleContext = Parameters<typeof localizeHref>[1];

/**
 * A cmssy link field as the visitor's URL: bare `#section` points at the home
 * page, and internal paths get the language prefix from the SDK. Content keeps
 * one language-neutral value (`/analizator`, `#kontakt`) for every language.
 */
export function localizedHref(value: string, locale: LocaleContext | undefined): string {
  return locale ? localizeHref(homeAnchor(value), locale) : homeAnchor(value);
}
