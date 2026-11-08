import { defineBlock } from "@cmssy/react";
import Showcase, { showcaseProps } from "./Showcase";

export const showcaseBlock = defineBlock({
  type: "showcase",
  label: "Realizacje",
  category: "Sekcje",
  description: "Ciemne karty produktów i projektów z technologiami, obrazem i linkiem.",
  component: Showcase,
  props: showcaseProps,
});
