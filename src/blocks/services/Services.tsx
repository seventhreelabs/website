import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section, SectionHead } from "@/components/ui/section";
import { anchorField, kickerField, isLightTone, toneField } from "@/lib/cmssy/fields";

export const servicesProps = {
  anchor: anchorField("zakres"),
  tone: toneField(),
  kicker: kickerField(),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst obok nagłówka" }),
  items: fields.repeater({
    label: "Usługi",
    itemLabel: "Usługa",
    addButtonLabel: "Dodaj usługę",
    collapsible: true,
    itemSchema: {
      title: fields.text({ label: "Tytuł", required: true }),
      text: fields.textarea({ label: "Opis" }),
    },
  }),
};

export type ServicesContent = InferBlockContent<typeof servicesProps>;

/** Numbered, ruled grid of what gets automated. */
export default function Services({ content }: BlockProps<typeof servicesProps>) {
  const items = content.items ?? [];

  return (
    <Section light={isLightTone(content.tone)} anchor={content.anchor} className="bg-panel">
      <SectionHead kicker={content.kicker} heading={content.heading} text={content.text} />
      <ul className="m-0 grid list-none border-t border-l border-edge p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={index} className="min-h-37.5 min-w-0 border-r border-b border-edge p-6 md:min-h-50">
            <span className="font-mono text-micro text-amber">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-5 mb-2 text-header4-clamp font-bold tracking-title md:mt-7.5">{item.title}</h3>
            {item.text ? <p className="m-0 max-w-[22em] text-small text-mute">{item.text}</p> : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
