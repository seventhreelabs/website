import type { CmssyLocaleContext } from "@cmssy/core";
import { localizedPath } from "@cmssy/core/internal";

type LanguageSwitcherProps = {
  locale: CmssyLocaleContext;
  /** The current page's slug, so each language links to the same page. */
  slug: string;
  label: string;
  className?: string;
};

/** One link per enabled language; hidden while the site has a single language. */
export function LanguageSwitcher({ locale, slug, label, className = "" }: LanguageSwitcherProps) {
  if (locale.enabled.length < 2) return null;
  // default language first, the rest in the order cmssy lists them
  const codes = [locale.default, ...locale.enabled.filter((code) => code !== locale.default)];

  return (
    <nav aria-label={label} className={`flex items-center gap-1 ${className}`}>
      {codes.map((code) => {
        const current = code === locale.current;
        return (
          <a
            key={code}
            href={localizedPath(slug, code, locale.default)}
            hrefLang={code}
            aria-current={current ? "page" : undefined}
            className={`rounded-full px-2.5 py-1.5 font-mono text-label uppercase ${
              current ? "bg-lift text-white" : "text-mute hover:text-white"
            }`}
          >
            {code}
          </a>
        );
      })}
    </nav>
  );
}
