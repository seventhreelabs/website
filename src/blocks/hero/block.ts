import { defineBlock } from "@cmssy/react";
import Hero, { heroProps } from "./Hero";

export const heroBlock = defineBlock({
  type: "hero",
  label: "Hero",
  category: "Sekcje",
  description: "Nagłówek z tłem 3D, przyciskami i interaktywnymi przykładami procesów.",
  component: Hero,
  props: heroProps,
});
