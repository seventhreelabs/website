import { defineBlock } from "@cmssy/react";
import TechMarquee, { techMarqueeProps } from "./TechMarquee";

export const techMarqueeBlock = defineBlock({
  type: "tech-marquee",
  label: "Pasek technologii",
  category: "Sekcje",
  description: "Przesuwający się pasek nazw technologii.",
  component: TechMarquee,
  props: techMarqueeProps,
});
