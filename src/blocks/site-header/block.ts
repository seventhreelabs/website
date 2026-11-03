import { defineBlock } from "@cmssy/react";
import SiteHeader, { siteHeaderProps } from "./SiteHeader";

export const siteHeaderBlock = defineBlock({
  type: "site-header",
  label: "Nagłówek",
  category: "Układ",
  description: "Nazwa firmy, menu i przycisk. Region header, dziedziczony przez podstrony.",
  layoutRegions: ["header"],
  component: SiteHeader,
  props: siteHeaderProps,
});
