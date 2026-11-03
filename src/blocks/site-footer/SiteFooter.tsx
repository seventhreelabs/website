import { fields, type BlockProps } from "@cmssy/react";

export const siteFooterProps = {
  company: fields.text({ label: "Firma", required: true }),
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
}: BlockProps<typeof siteFooterProps>) {
  return (
    <footer className="bg-panel text-small text-white">
      <div className="mx-auto max-w-content px-5 pb-8 md:px-8">
        <div className="flex flex-col gap-2 border-t border-rim pt-5 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-8">
          <span>{content.company}</span>
          {(content.details ?? []).map((item, index) => (
            <span key={index}>{item.text}</span>
          ))}
          {(content.links ?? []).map((link, index) => (
            <a key={index} href={link.href} className="underline">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
