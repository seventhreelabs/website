import { defineBlock } from "@cmssy/react";
import WorkProcess, { workProcessProps } from "./WorkProcess";

export const workProcessBlock = defineBlock({
  type: "work-process",
  label: "Jak pracujemy",
  category: "Sekcje",
  description: "Klikalne etapy współpracy z opisem efektu.",
  component: WorkProcess,
  props: workProcessProps,
});
