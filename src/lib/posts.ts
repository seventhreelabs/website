import type { ResolvedMedia } from "@cmssy/core";

/** One blog post (cmssy model `post`), already folded to one language. */
export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: ResolvedMedia | null;
  /** YYYY-MM-DD */
  publishedAt: string;
  updatedOn: string | null;
  author: string;
  tags: string[];
  inEnglish: boolean;
  seoTitle: string;
  seoDescription: string;
  /** Record change time from cmssy (ISO). */
  updatedAt: string;
};

export const POSTS_CONTEXT_KEY = "posts";
export const LATEST_POSTS_CONTEXT_KEY = "latestPosts";

/** Posts handed to blocks through appContext (see services/app-context.ts). */
export function readPosts(app: Record<string, unknown> | undefined, key: string): Post[] {
  const value = app?.[key];
  return Array.isArray(value) ? (value as Post[]) : [];
}

/** Site path of a post before the language prefix. */
export function postSlug(slug: string): string {
  return `/blog/${slug}`;
}
