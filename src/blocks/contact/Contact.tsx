import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Button } from "@/components/ui/button";
import { Kicker, Section, SectionHeading } from "@/components/ui/section";
import { anchorField, kickerField } from "@/lib/cmssy/fields";
import { localizedHref } from "@/utils/localized-href";
import { ContactForm } from "./ContactForm";

export type ContactContent = InferBlockContent<typeof contactProps>;

export const contactProps = {
  anchor: anchorField("kontakt"),
  kicker: kickerField(),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst" }),
  ctaLabel: fields.text({ label: "Przycisk: tekst", tab: "Przycisk", helperText: "np. „Umów krótką rozmowę”. Pusty: bez przycisku." }),
  ctaHref: fields.link({ label: "Przycisk: adres", tab: "Przycisk" }),
  email: fields.email({ label: "Adres e-mail" }),
  hintText: fields.text({
    label: "Podpowiedź: tekst",
    tab: "Podpowiedź",
    helperText: "Zdanie przed linkiem, np. „Nie wiesz, od czego zacząć?”. Opcjonalne.",
  }),
  hintLabel: fields.text({ label: "Podpowiedź: tekst linku", tab: "Podpowiedź" }),
  hintHref: fields.link({ label: "Podpowiedź: adres", tab: "Podpowiedź" }),
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

  const href = (value: string) => localizedHref(value, context?.locale);

  return (
    <Section
      anchor={content.anchor}
      className="bg-amber text-pitch"
      innerClassName="grid gap-10 md:py-19 lg:grid-cols-2 lg:items-end lg:gap-18"
    >
      <div className="min-w-0">
        {content.kicker ? <Kicker className="text-amber-deep">{content.kicker}</Kicker> : null}
        <SectionHeading className={`max-w-[11em] ${content.kicker ? "mt-3.5" : ""}`}>
          {content.heading}
        </SectionHeading>
        {content.text ? (
          <p className="mt-5 mb-0 max-w-[26em] text-caption text-amber-deep md:text-small">
            {content.text}
          </p>
        ) : null}
        {content.ctaLabel && content.ctaHref ? (
          <Button href={href(content.ctaHref)} variant="dark" arrow="↗" className="mt-7">
            {content.ctaLabel}
          </Button>
        ) : null}
        {content.hintLabel && content.hintHref ? (
          <p className="mt-6 mb-0 max-w-[30em] text-caption">
            {content.hintText ? `${content.hintText} ` : null}
            <a href={href(content.hintHref)} className="font-bold underline underline-offset-4">
              {content.hintLabel}
            </a>
          </p>
        ) : null}
        {content.email ? (
          <p className="mt-4 mb-0 font-mono text-label">
            <a href={`mailto:${content.email}`} className="inline-block py-2.5 underline underline-offset-4 md:py-0">
              {content.email}
            </a>
          </p>
        ) : null}
      </div>
      {form ? (
        <div className="min-w-0 bg-paper p-6 text-ink md:p-8">
          <ContactForm form={form} locale={context?.locale.current ?? "pl"} />
        </div>
      ) : null}
    </Section>
  );
}
