import { defineBlock } from "@cmssy/react";
import Hero, { heroProps } from "./Hero";

export const heroBlock = defineBlock({
  type: "hero",
  label: "Hero",
  category: "Sekcje",
  description: "Nagłówek z animowanym tłem 3D na całą szerokość, tekstem i przyciskami.",
  component: Hero,
  props: heroProps,
});
