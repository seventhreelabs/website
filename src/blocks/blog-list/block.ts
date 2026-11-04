import { defineBlock } from "@cmssy/react";
import BlogList, { blogListProps } from "./BlogList";

export const blogListBlock = defineBlock({
  type: "blog-list",
  label: "Lista wpisów",
  category: "Blog",
  description: "Wszystkie opublikowane wpisy z modelu „Wpis na blogu”, od najnowszego. Dla strony /blog.",
  component: BlogList,
  props: blogListProps,
});
