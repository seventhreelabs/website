import { defineBlock } from "@cmssy/react";
import Content, { contentProps } from "./Content";

export const contentBlock = defineBlock({
  type: "content",
  label: "Treść",
  category: "Strony",
  description: "Nagłówek, wstęp i długi tekst w jednej kolumnie. Polityki, regulaminy, artykuły.",
  component: Content,
  props: contentProps,
});
