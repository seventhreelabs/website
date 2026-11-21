import { defineBlock } from "@cmssy/react";
import CaseDemo, { caseDemoProps } from "./CaseDemo";

export const caseDemoBlock = defineBlock({
  type: "case-demo",
  label: "Przykład procesu",
  category: "Sekcje",
  description: "Jeden przykładowy proces: opis z faktami i schemat kroków od wejścia do akceptacji człowieka.",
  component: CaseDemo,
  props: caseDemoProps,
});
