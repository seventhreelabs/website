import { defineBlock } from "@cmssy/react";
import ProcessAnalyzer, { processAnalyzerProps } from "./ProcessAnalyzer";

export const processAnalyzerBlock = defineBlock({
  type: "process-analyzer",
  label: "Analizator procesu",
  category: "Sekcje",
  description: "Pole na opis procesu; AI ocenia, co da się zautomatyzować, i poleca usługi z listy.",
  component: ProcessAnalyzer,
  props: processAnalyzerProps,
});
