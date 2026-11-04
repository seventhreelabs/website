import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { RichText } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import { anchorField } from "@/lib/cmssy/fields";

export type ContentContent = InferBlockContent<typeof contentProps>;

export const contentProps = {
  anchor: anchorField("tresc"),
  heading: fields.text({ label: "Nagłówek", required: true }),
  lead: fields.textarea({
    label: "Wstęp",
    helperText: "Jedno, dwa zdania pod nagłówkiem. Opcjonalne.",
  }),
  body: fields.richText({ label: "Treść", required: true }),
};

/** Long-form page: policy, terms, an article. One narrow column of prose. */
export default function Content({ content }: BlockProps<typeof contentProps>) {
  return (
    <Section anchor={content.anchor} innerClassName="max-w-3xl">
      <h1 className="m-0 text-header1-clamp font-medium tracking-[-0.03em] text-balance">
        {content.heading}
      </h1>
      {content.lead ? (
        <p className="mt-6 text-large-clamp text-rim">{content.lead}</p>
      ) : null}
      <RichText html={content.body} className="mt-10" />
    </Section>
  );
}
