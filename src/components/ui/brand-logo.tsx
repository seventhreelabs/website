import Image from "next/image";
import Link from "next/link";
import type { SiteBranding } from "@/lib/cmssy/branding";

type BrandLogoProps = {
  branding: SiteBranding | null;
  /** Home link, already localized by the caller. */
  href?: string;
  /** Height utilities for the logo image, e.g. "h-5 md:h-7". */
  imageClassName: string;
  /** Type utilities for the text fallback, e.g. "text-header4-clamp". */
  textClassName: string;
  /** Render as the LCP candidate (header). */
  priority?: boolean;
};

/**
 * Logo linking home, from cmssy Settings -> Branding. Dark-background variant
 * first (the site is dark), then the main logo, then the brand name as text.
 */
export function BrandLogo({
  branding,
  href = "/",
  imageClassName,
  textClassName,
  priority,
}: BrandLogoProps) {
  const name = branding?.brandName ?? "";
  const logo = branding?.logoDarkUrl || branding?.logoUrl;

  return (
    <Link
      href={href}
      aria-label={name || undefined}
      className={`inline-flex items-center font-extrabold tracking-tight ${textClassName}`}
    >
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={180}
          height={40}
          priority={priority}
          className={`w-auto ${imageClassName}`}
        />
      ) : (
        name
      )}
    </Link>
  );
}
