import { defineBlock } from "@cmssy/react";
import IntroBar, { introBarProps } from "./IntroBar";

export const introBarBlock = defineBlock({
  type: "intro-bar",
  label: "Pasek z hasłami",
  category: "Sekcje",
  description: "Żółty pasek z dwoma, trzema krótkimi hasłami, zwykle pod hero.",
  component: IntroBar,
  props: introBarProps,
});
