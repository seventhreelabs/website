"use client";

import Link from "next/link";
import { useState } from "react";
import { fields, type BlockProps } from "@cmssy/react";

export const siteHeaderProps = {
  name: fields.text({ label: "Nazwa", required: true }),
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
}: BlockProps<typeof siteHeaderProps>) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const links = content.links ?? [];

  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex max-w-[80rem] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 md:px-8 md:py-6">
        <Link href="/" className="text-[1.375rem] font-extrabold tracking-tight">
          {content.name}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
          className="min-h-11 rounded-full border border-white px-5 text-base font-bold md:hidden"
        >
          {open ? "Zamknij" : "Menu"}
        </button>
        <nav
          id="site-menu"
          aria-label="Główna"
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 pb-3 text-base font-medium md:flex md:w-auto md:flex-row md:items-center md:gap-7 md:pb-0`}
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
