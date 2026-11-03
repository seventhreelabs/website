import { fields, type BlockProps } from "@cmssy/react";
import { anchorField } from "../shared/fields";

export const faqProps = {
  anchor: anchorField("pytania"),
  heading: fields.text({ label: "Nagłówek", required: true }),
  items: fields.repeater({
    label: "Pytania",
    itemLabel: "Pytanie",
    addButtonLabel: "Dodaj pytanie",
    collapsible: true,
    itemSchema: {
      question: fields.text({ label: "Pytanie", required: true }),
      answer: fields.textarea({ label: "Odpowiedź", required: true }),
    },
  }),
};

export default function Faq({ content }: BlockProps<typeof faqProps>) {
  const items = content.items ?? [];

  return (
    <section
      id={content.anchor || undefined}
      className="mx-auto grid max-w-content scroll-mt-4 gap-8 px-5 py-16 md:px-8 md:py-26 lg:grid-cols-[1fr_2fr] lg:gap-18"
    >
      <h2 className="m-0 text-header2-clamp font-medium tracking-[-0.03em]">
        {content.heading}
      </h2>
      <div className="min-w-0 border-t border-ink">
        {items.map((item, index) => (
          <details
            key={index}
            open={index === 0}
            className="stl-faq border-b border-ink"
          >
            <summary className="flex cursor-pointer items-baseline justify-between gap-6 py-5 text-header4-clamp font-medium md:py-6">
              {item.question}
            </summary>
            <p className="mt-0 mb-6 max-w-[36em]">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
