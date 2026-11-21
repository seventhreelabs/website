import { localizeHref } from "@cmssy/core";
import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { PostCard } from "@/components/blog/post-card";
import { Kicker, Section, SectionHeading } from "@/components/ui/section";
import { anchorField, kickerField, isLightTone, toneField } from "@/lib/cmssy/fields";
import { LATEST_POSTS_CONTEXT_KEY, postSlug, readPosts } from "@/lib/posts";

export type LatestPostsContent = InferBlockContent<typeof latestPostsProps>;

export const latestPostsProps = {
  anchor: anchorField("blog"),
  tone: toneField(),
  kicker: kickerField(),
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
    <Section light={isLightTone(content.tone)} anchor={content.anchor} className="bg-panel">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {content.kicker ? <Kicker>{content.kicker}</Kicker> : null}
          <SectionHeading className={content.kicker ? "mt-3.5" : ""}>{content.heading}</SectionHeading>
        </div>
        {content.linkLabel ? (
          <a href={href("/blog")} className="-my-3 inline-block py-3 font-mono text-label text-amber uppercase underline-offset-4 hover:underline">
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
