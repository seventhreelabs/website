"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { fields, type BlockProps } from "@cmssy/react";
import { readBranding } from "@/lib/cmssy/branding";

export const siteHeaderProps = {
  name: fields.text({
    label: "Nazwa",
    helperText:
      "Zapasowa. Logo i nazwę marki ustawisz w Ustawienia -> Branding; pole jest używane, gdy brandingu brak.",
    required: true,
  }),
  links: fields.repeater({
    label: "Menu",
    itemLabel: "Link",
    addButtonLabel: "Dodaj link",
    collapsible: true,
    maxItems: 6,
    itemSchema: {
      label: fields.text({ label: "Tekst", required: true }),
      href: fields.link({ label: "Adres", required: true }),
    },
  }),
  ctaLabel: fields.text({ label: "Przycisk: tekst", tab: "Przycisk" }),
  ctaHref: fields.link({ label: "Przycisk: adres", tab: "Przycisk" }),
};

export default function SiteHeader({
  content,
  context,
}: BlockProps<typeof siteHeaderProps>) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const links = content.links ?? [];
  const branding = readBranding(context?.app);
  const name = branding?.brandName || content.name;
  // header sits on black - prefer the logo variant meant for dark backgrounds
  const logo = branding?.logoDarkUrl || branding?.logoUrl;

  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 md:px-8 md:py-6">
        <Link
          href="/"
          aria-label={name}
          className="flex items-center text-header4-clamp font-extrabold tracking-tight"
        >
          {logo ? (
            <Image
              src={logo}
              alt={name}
              width={180}
              height={40}
              priority
              className="h-5 w-auto md:h-7"
            />
          ) : (
            name
          )}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
          className="min-h-11 rounded-full border border-white px-5 text-small font-bold md:hidden"
        >
          {open ? "Zamknij" : "Menu"}
        </button>
        <nav
          id="site-menu"
          aria-label="Główna"
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 pb-3 text-small font-medium md:flex md:w-auto md:flex-row md:items-center md:gap-7 md:pb-0`}
        >
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={close}
              className="py-3 hover:opacity-80"
            >
              {link.label}
            </a>
          ))}
          {content.ctaLabel && content.ctaHref ? (
            <a
              href={content.ctaHref}
              onClick={close}
              className="mt-2 rounded-full border border-white px-5 py-3 text-center hover:opacity-80 md:mt-0"
            >
              {content.ctaLabel}
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
