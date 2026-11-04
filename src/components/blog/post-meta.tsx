import { formatDate } from "@/utils/dates";

type PostMetaProps = {
  publishedAt: string;
  author?: string;
  minutes?: number;
  minutesLabel?: string;
  locale: string;
  className?: string;
};

/** Date · author · reading time, in the mono label style. */
export function PostMeta({ publishedAt, author, minutes, minutesLabel, locale, className = "" }: PostMetaProps) {
  const parts = [
    <time key="date" dateTime={publishedAt}>{formatDate(publishedAt, locale)}</time>,
    author ? <span key="author">{author}</span> : null,
    minutes && minutesLabel ? <span key="minutes">{`${minutes} ${minutesLabel}`}</span> : null,
  ].filter(Boolean);

  return (
    <p className={`m-0 flex flex-wrap gap-x-3 gap-y-1 font-mono text-label uppercase text-rim ${className}`}>
      {parts.map((part, i) => (
        <span key={i} className="flex gap-x-3">
          {i > 0 ? <span aria-hidden="true">·</span> : null}
          {part}
        </span>
      ))}
    </p>
  );
}
