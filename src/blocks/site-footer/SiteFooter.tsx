import Image from "next/image";
import { localizeHref } from "@cmssy/core";
import { fields, mediaAlt, mediaUrl, type BlockProps } from "@cmssy/react";
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
  creditLabel: fields.text({
    label: "Tekst przed logo",
    tab: "Powered by",
    helperText: "np. „Strona działa na”. Pusty: bez dopisku.",
  }),
  creditName: fields.text({
    label: "Nazwa",
    tab: "Powered by",
    helperText: "np. „Cmssy”. Pokazywana, gdy nie ma logo, i jako alt logo.",
  }),
  creditHref: fields.url({ label: "Adres", tab: "Powered by" }),
  creditLogo: fields.media({ label: "Logo", tab: "Powered by", acceptedTypes: ["image"] }),
};

export default function SiteFooter({
  content,
  context,
}: BlockProps<typeof siteFooterProps>) {
  const branding = readBranding(context?.app);
  const locale = context?.locale;
  const href = (value: string) => (locale ? localizeHref(value, locale) : value);
  const creditLogo = mediaUrl(content.creditLogo);
  const credit =
    content.creditName || creditLogo ? (
      <span className="inline-flex items-center gap-2">
        {content.creditLabel ? <span className="text-mute">{content.creditLabel}</span> : null}
        {creditLogo ? (
          <Image
            src={creditLogo}
            alt={mediaAlt(content.creditLogo) ?? content.creditName ?? ""}
            width={120}
            height={24}
            className="h-4 w-auto"
          />
        ) : (
          <span className="font-bold">{content.creditName}</span>
        )}
      </span>
    ) : null;

  return (
    <footer className="bg-panel text-small text-white">
      <div className="mx-auto max-w-content px-5 pb-8 md:px-8">
        <div className="flex flex-col gap-1 border-t border-rim pt-5 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-2 sm:gap-x-8">
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
            <a key={index} href={href(link.href)} className="py-2 underline sm:py-0">
              {link.label}
            </a>
          ))}
          {COOKIEBOT_ID ? (
            <CookieSettingsLink label={ui(locale?.current).cookieSettings} className="cursor-pointer appearance-none bg-transparent px-0 py-2 text-left text-small text-white underline sm:py-0" />
          ) : null}
          {credit ? (
            content.creditHref ? (
              <a
                href={content.creditHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 hover:text-amber sm:ml-auto sm:py-0"
              >
                {credit}
              </a>
            ) : (
              <span className="sm:ml-auto">{credit}</span>
            )
          ) : null}
        </div>
      </div>
    </footer>
  );
}
