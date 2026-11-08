import { localizeHref } from "@cmssy/core";
import { fields, type BlockProps } from "@cmssy/react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { CookieSettingsLink } from "@/components/ui/cookie-settings-link";
import { COOKIEBOT_ID } from "@/components/cookie-consent";
import { readBranding } from "@/lib/cmssy/branding";
import { ui } from "@/utils/ui-strings";

export const siteFooterProps = {
  details: fields.repeater({
    label: "Dane firmy",
    itemLabel: "Pozycja",
    addButtonLabel: "Dodaj pozycję",
    itemSchema: {
      text: fields.text({ label: "Tekst", required: true }),
    },
  }),
  links: fields.repeater({
    label: "Linki",
    itemLabel: "Link",
    addButtonLabel: "Dodaj link",
    itemSchema: {
      label: fields.text({ label: "Tekst", required: true }),
      href: fields.link({ label: "Adres", required: true }),
    },
  }),
};

export default function SiteFooter({
  content,
  context,
}: BlockProps<typeof siteFooterProps>) {
  const branding = readBranding(context?.app);
  const locale = context?.locale;
  const href = (value: string) => (locale ? localizeHref(value, locale) : value);

  return (
    <footer className="bg-panel text-small text-white">
      <div className="mx-auto max-w-content px-5 pb-8 md:px-8">
        <div className="flex flex-col gap-2 border-t border-rim pt-5 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-8">
          <BrandLogo
            branding={branding}
            href={href("/")}
            imageClassName="h-4"
            textClassName="text-small"
          />
          {(content.details ?? []).map((item, index) => (
            <span key={index}>{item.text}</span>
          ))}
          {(content.links ?? []).map((link, index) => (
            <a key={index} href={href(link.href)} className="underline">
              {link.label}
            </a>
          ))}
          {COOKIEBOT_ID ? (
            <CookieSettingsLink label={ui(locale?.current).cookieSettings} className="cursor-pointer appearance-none bg-transparent p-0 text-left text-small text-white underline" />
          ) : null}
        </div>
      </div>
    </footer>
  );
}
