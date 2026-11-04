import { defineBlock } from "@cmssy/react";
import LatestPosts, { latestPostsProps } from "./LatestPosts";

export const latestPostsBlock = defineBlock({
  type: "latest-posts",
  label: "Najnowsze wpisy",
  category: "Blog",
  description: "Trzy najnowsze wpisy z bloga i link do całej listy. Znika, gdy nie ma wpisów.",
  component: LatestPosts,
  props: latestPostsProps,
});
