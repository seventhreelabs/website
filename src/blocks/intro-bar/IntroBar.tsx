import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Container } from "@/components/ui/container";

export const introBarProps = {
  items: fields.repeater({
    label: "Hasła",
    itemLabel: "Hasło",
    addButtonLabel: "Dodaj hasło",
    required: true,
    minItems: 1,
    maxItems: 3,
    itemSchema: {
      text: fields.text({ label: "Tekst", required: true }),
    },
  }),
};

export type IntroBarContent = InferBlockContent<typeof introBarProps>;

/** Thin amber strip under the hero: two or three short mono lines. */
export default function IntroBar({ content }: BlockProps<typeof introBarProps>) {
  const items = content.items ?? [];
  if (!items.length) return null;

  return (
    <div className="bg-amber py-4 text-pitch">
      <Container>
        <ul className="m-0 flex list-none flex-col gap-1 p-0 font-mono text-micro tracking-wider uppercase sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-8">
          {items.map((item, index) => (
            <li key={index}>{item.text}</li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
