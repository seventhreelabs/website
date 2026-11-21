import Image from "next/image";
import { localizeHref } from "@cmssy/core";
import { fields, mediaAlt, mediaUrl, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section, SectionHead } from "@/components/ui/section";
import { anchorField, kickerField, isLightTone, toneField } from "@/lib/cmssy/fields";

export type ShowcaseContent = InferBlockContent<typeof showcaseProps>;

export const showcaseProps = {
  anchor: anchorField("realizacje"),
  tone: toneField(),
  kicker: kickerField(),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst" }),
  items: fields.repeater({
    label: "Realizacje",
    itemLabel: "Realizacja",
    addButtonLabel: "Dodaj realizację",
    collapsible: true,
    itemSchema: {
      kicker: fields.text({ label: "Etykieta", helperText: "np. „Własny produkt”, „Strona klienta”." }),
      title: fields.text({ label: "Tytuł", required: true }),
      text: fields.textarea({ label: "Opis" }),
      tags: fields.repeater({
        label: "Technologie",
        itemLabel: "Technologia",
        addButtonLabel: "Dodaj",
        itemSchema: { name: fields.text({ label: "Nazwa", required: true }) },
      }),
      image: fields.media({ label: "Obraz", acceptedTypes: ["image"] }),
      href: fields.link({ label: "Adres" }),
      linkLabel: fields.text({ label: "Tekst linku", helperText: "np. „Zobacz cmssy.io”." }),
    },
  }),
};

/** Dark grid of products and client work; each card may link out and carry an image. */
export default function Showcase({ content, context }: BlockProps<typeof showcaseProps>) {
  const items = content.items ?? [];
  const locale = context?.locale;
  const href = (value: string) => (locale ? localizeHref(value, locale) : value);

  return (
    <Section light={isLightTone(content.tone)} anchor={content.anchor}>
      <SectionHead kicker={content.kicker} heading={content.heading} text={content.text} />
      <div className="grid gap-3.5 md:grid-cols-2">
        {items.map((item, index) => {
          const image = mediaUrl(item.image);
          const external = Boolean(item.href && /^[a-z]+:/i.test(item.href));
          return (
            <article
              key={index}
              className="flex min-w-0 flex-col overflow-hidden border border-line bg-card"
            >
              {image ? (
                <Image
                  src={image}
                  alt={mediaAlt(item.image) ?? item.title}
                  width={960}
                  height={540}
                  quality={85}
                  className="aspect-video w-full object-cover"
                />
              ) : null}
              <div className="flex grow flex-col p-6 md:p-8">
                {item.kicker ? (
                  <p className="m-0 font-mono text-micro tracking-wider text-amber uppercase">{item.kicker}</p>
                ) : null}
                <h3 className="mt-3 mb-0 text-header3-clamp font-semibold tracking-heading">{item.title}</h3>
                {item.text ? <p className="mt-3 mb-0 max-w-[32em] text-small text-mute">{item.text}</p> : null}
                {(item.tags ?? []).length ? (
                  <ul className="mt-5 mb-0 flex list-none flex-wrap gap-2 p-0 font-mono text-micro uppercase">
                    {(item.tags ?? []).map((tag, i) => (
                      <li key={i} className="border border-edge px-2 py-1 text-mute">
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {item.href && item.linkLabel ? (
                  <a
                    href={href(item.href)}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="mt-4 inline-block w-max py-2 font-bold underline hover:text-amber md:mt-6 md:py-0"
                  >
                    {item.linkLabel}
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
