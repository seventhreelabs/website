import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";

export type TechMarqueeContent = InferBlockContent<typeof techMarqueeProps>;

export const techMarqueeProps = {
  items: fields.repeater({
    label: "Technologie",
    itemLabel: "Technologia",
    addButtonLabel: "Dodaj technologię",
    required: true,
    minItems: 3,
    itemSchema: {
      name: fields.text({ label: "Nazwa", required: true }),
    },
  }),
};

export default function TechMarquee({
  content,
}: BlockProps<typeof techMarqueeProps>) {
  return (
    <section
      aria-label="Technologie"
      className="overflow-hidden border-t border-edge bg-black py-5"
    >
      <ul className="stl-track m-0 flex w-max list-none p-0 font-mono text-caption text-mute">
        {[0, 1].map((copy) =>
          content.items.map((item, index) => (
            <li
              key={`${copy}-${index}`}
              aria-hidden={copy === 1 || undefined}
              className="px-6 whitespace-nowrap md:px-9"
            >
              {item.name}
            </li>
          )),
        )}
      </ul>
    </section>
  );
}
