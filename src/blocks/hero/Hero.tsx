import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroBackground } from "./HeroBackground";
import { ProcessDemo } from "./ProcessDemo";

export const heroProps = {
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst" }),
  actions: fields.repeater({
    label: "Przyciski",
    itemLabel: "Przycisk",
    addButtonLabel: "Dodaj przycisk",
    maxItems: 2,
    itemSchema: {
      label: fields.text({ label: "Tekst", required: true }),
      href: fields.link({ label: "Adres", required: true }),
      variant: fields.select({
        label: "Wariant",
        options: ["Główny", "Obrys"],
        defaultValue: "Główny",
      }),
    },
  }),
  flows: fields.repeater({
    label: "Przykładowe procesy",
    tab: "Procesy",
    itemLabel: "Proces",
    addButtonLabel: "Dodaj proces",
    collapsible: true,
    maxItems: 4,
    itemSchema: {
      label: fields.text({ label: "Nazwa", required: true }),
      steps: fields.repeater({
        label: "Kroki",
        itemLabel: "Krok",
        addButtonLabel: "Dodaj krok",
        minItems: 2,
        maxItems: 7,
        itemSchema: {
          text: fields.text({ label: "Opis", required: true }),
          actor: fields.select({
            label: "Kto wykonuje",
            options: ["Agent", "Człowiek"],
            defaultValue: "Agent",
          }),
        },
      }),
    },
  }),
  flowNote: fields.text({ label: "Przypis pod procesem", tab: "Procesy" }),
};

export type HeroContent = InferBlockContent<typeof heroProps>;

export default function Hero({ content }: BlockProps<typeof heroProps>) {
  const flows = content.flows ?? [];

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <HeroBackground />
      <Container className="relative grid items-center gap-12 pt-10 pb-14 md:pt-16 md:pb-20 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <h1 className="m-0 text-display-clamp font-medium tracking-[-0.035em] text-balance">
            {content.heading}
          </h1>
          {content.text ? (
            <p className="mt-6 mb-0 max-w-[34em] text-large-clamp md:mt-8">
              {content.text}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-9">
            {(content.actions ?? []).map((action, index) => (
              <Button
                key={index}
                href={action.href}
                variant={action.variant === "Obrys" ? "outline" : "primary"}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
        {flows.length > 0 ? (
          <ProcessDemo flows={flows} note={content.flowNote} />
        ) : null}
      </Container>
    </section>
  );
}
