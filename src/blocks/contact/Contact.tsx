import { fields, type BlockProps } from "@cmssy/react";
import { anchorField } from "../shared/fields";
import { ContactForm } from "./ContactForm";

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
    <section
      id={content.anchor || undefined}
      className="relative scroll-mt-4 overflow-hidden bg-panel text-white"
    >
      <div className="mx-auto grid max-w-[80rem] gap-10 px-5 py-16 md:px-8 md:py-26 lg:grid-cols-2 lg:gap-18">
        <div className="min-w-0">
          <h2 className="m-0 text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.04] font-medium tracking-[-0.03em]">
            {content.heading}
          </h2>
          {content.text ? (
            <p className="mt-6 mb-0 max-w-[30em] text-lg md:text-xl">
              {content.text}
            </p>
          ) : null}
          {content.email ? (
            <p className="mt-6 mb-0">
              <a href={`mailto:${content.email}`} className="underline">
                {content.email}
              </a>
            </p>
          ) : null}
        </div>
        {form ? (
          <ContactForm
            form={form}
            locale={context?.locale.current ?? "pl"}
          />
        ) : null}
      </div>
    </section>
  );
}
