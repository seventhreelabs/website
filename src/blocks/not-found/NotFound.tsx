import { fields, type BlockProps } from "@cmssy/react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export const notFoundProps = {
  code: fields.text({
    label: "Kod",
    helperText: "Mały napis nad nagłówkiem, np. 404.",
    defaultValue: "404",
  }),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst" }),
  ctaLabel: fields.text({ label: "Przycisk: tekst", tab: "Przycisk" }),
  ctaHref: fields.link({ label: "Przycisk: adres", tab: "Przycisk" }),
};

/** Error page body: code, heading, a line of text and a way back. */
export default function NotFound({ content }: BlockProps<typeof notFoundProps>) {
  return (
    <Section innerClassName="flex min-h-[60vh] max-w-3xl flex-col items-start justify-center">
      {content.code ? (
        <p className="m-0 font-mono text-label font-bold uppercase tracking-[0.2em] text-amber">
          {content.code}
        </p>
      ) : null}
      <h1 className="mt-4 text-header1-clamp font-medium tracking-[-0.03em] text-balance">
        {content.heading}
      </h1>
      {content.text ? (
        <p className="mt-6 max-w-xl text-large-clamp text-rim">{content.text}</p>
      ) : null}
      {content.ctaLabel && content.ctaHref ? (
        <Button href={content.ctaHref} className="mt-10">
          {content.ctaLabel}
        </Button>
      ) : null}
    </Section>
  );
}
