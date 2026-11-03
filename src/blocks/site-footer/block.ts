import { defineBlock } from "@cmssy/react";
import SiteFooter, { siteFooterProps } from "./SiteFooter";

export const siteFooterBlock = defineBlock({
  type: "site-footer",
  label: "Stopka",
  category: "Układ",
  description: "Dane firmy i linki. Region footer, dziedziczony przez podstrony.",
  layoutRegions: ["footer"],
  component: SiteFooter,
  props: siteFooterProps,
});
