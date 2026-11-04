type DraftBannerProps = {
  label: string;
  exitLabel: string;
  /** Path to return to after leaving draft mode. */
  path: string;
};

/** Thin amber strip shown while Next draft mode is on: unpublished cmssy content is visible. */
export function DraftBanner({ label, exitLabel, path }: DraftBannerProps) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-4 bg-amber px-4 py-2 font-mono text-label uppercase text-ink">
      <span>{label}</span>
      <a href={`/api/draft?disable=1&redirect=${encodeURIComponent(path)}`} className="underline underline-offset-4">
        {exitLabel}
      </a>
    </div>
  );
}
