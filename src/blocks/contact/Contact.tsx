import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section } from "@/components/ui/section";
import { anchorField } from "@/lib/cmssy/fields";
import { ContactForm } from "./ContactForm";

export type ContactContent = InferBlockContent<typeof contactProps>;

export const contactProps = {
  anchor: anchorField("kontakt"),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst" }),
  email: fields.email({ label: "Adres e-mail" }),
  form: fields.form({
    label: "Formularz",
    helperText: "Pola, komunikaty i przycisk ustawiasz w Form Builderze.",
  }),
};

export default function Contact({
  content,
  context,
}: BlockProps<typeof contactProps>) {
  const form = content.form ? context?.forms?.[content.form] : undefined;

  return (
    <Section
      anchor={content.anchor}
      className="relative overflow-hidden bg-panel text-white"
      innerClassName="grid gap-10 lg:grid-cols-2 lg:gap-18"
    >
      <div className="min-w-0">
        <h2 className="m-0 text-header1-clamp font-medium tracking-[-0.03em]">
          {content.heading}
        </h2>
        {content.text ? (
          <p className="mt-6 mb-0 max-w-[30em] text-medium-clamp">
            {content.text}
          </p>
        ) : null}
        {content.email ? (
          <p className="mt-6 mb-0">
            <a href={`mailto:${content.email}`} className="inline-block py-2.5 underline md:py-0">
              {content.email}
            </a>
          </p>
        ) : null}
      </div>
      {form ? (
        <ContactForm form={form} locale={context?.locale.current ?? "pl"} />
      ) : null}
    </Section>
  );
}
