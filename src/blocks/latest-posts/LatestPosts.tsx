import { localizeHref } from "@cmssy/core";
import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { PostCard } from "@/components/blog/post-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { anchorField } from "@/lib/cmssy/fields";
import { LATEST_POSTS_CONTEXT_KEY, postSlug, readPosts } from "@/lib/posts";

export type LatestPostsContent = InferBlockContent<typeof latestPostsProps>;

export const latestPostsProps = {
  anchor: anchorField("blog"),
  heading: fields.text({ label: "Nagłówek", required: true }),
  linkLabel: fields.text({ label: "Link do bloga: tekst", defaultValue: "Wszystkie wpisy" }),
};

/** The three newest posts and a link to the blog. Hidden while there are no posts. */
export default function LatestPosts({ content, context }: BlockProps<typeof latestPostsProps>) {
  const posts = readPosts(context?.app, LATEST_POSTS_CONTEXT_KEY);
  if (!posts.length) return null;
  const locale = context?.locale;
  const href = (path: string) => (locale ? localizeHref(path, locale) : path);

  return (
    <Section anchor={content.anchor} className="border-t border-line bg-white">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading>{content.heading}</SectionHeading>
        {content.linkLabel ? (
          <a href={href("/blog")} className="font-mono text-label uppercase underline-offset-4 hover:underline">
            {content.linkLabel} →
          </a>
        ) : null}
      </div>
      <div className="mt-8 border-b border-line">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} href={href(postSlug(post.slug))} locale={locale?.current ?? "pl"} as="h3" />
        ))}
      </div>
    </Section>
  );
}
