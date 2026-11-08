import Image from "next/image";
import { mediaAlt, mediaUrl } from "@cmssy/react";
import { RichText } from "@/components/ui/rich-text";
import { Section } from "@/components/ui/section";
import type { Post } from "@/lib/posts";
import { formatDate, readingMinutes } from "@/utils/dates";
import { tagLabel } from "@/utils/post-tags";
import { ui } from "@/utils/ui-strings";
import { PostMeta } from "./post-meta";

type PostArticleProps = {
  post: Post;
  locale: string;
  /** Localized link back to the blog index. */
  blogHref: string;
};

/** A full post: back link, title, meta, lead, cover, body, tags. */
export function PostArticle({ post, locale, blogHref }: PostArticleProps) {
  const t = ui(locale);
  const cover = mediaUrl(post.cover);

  return (
    <Section innerClassName="max-w-3xl">
      <a href={blogHref} className="-my-3 inline-block py-3 font-mono text-label uppercase text-rim hover:text-ink">
        ← {t.backToBlog}
      </a>
      <h1 className="m-0 mt-6 text-header1-clamp font-medium tracking-[-0.03em] text-balance">{post.title}</h1>
      <PostMeta
        publishedAt={post.publishedAt}
        author={post.author}
        minutes={readingMinutes(post.body)}
        minutesLabel={t.minutesRead}
        locale={locale}
        className="mt-5"
      />
      {post.excerpt ? <p className="mt-6 text-large-clamp text-rim">{post.excerpt}</p> : null}
      {cover ? (
        <Image
          src={cover}
          alt={mediaAlt(post.cover) ?? ""}
          width={1200}
          height={675}
          sizes="(min-width: 768px) 48rem, 100vw"
          priority
          className="mt-10 aspect-video h-auto w-full rounded-xl object-cover"
        />
      ) : null}
      <RichText html={post.body} className="mt-10" />
      <footer className="mt-12 border-t border-line pt-6">
        {post.tags.length ? (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-label uppercase text-rim">
                {tagLabel(tag, locale)}
              </li>
            ))}
          </ul>
        ) : null}
        {post.updatedOn ? (
          <p className="mt-4 font-mono text-label uppercase text-rim">
            {t.mdUpdated}: <time dateTime={post.updatedOn}>{formatDate(post.updatedOn, locale)}</time>
          </p>
        ) : null}
      </footer>
    </Section>
  );
}
