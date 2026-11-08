import { ImageResponse } from "next/og";
import { siteBranding } from "@/services/site";
import { siteUrl } from "@/lib/site-url";
import { clip } from "@/utils/seo";

export const revalidate = 86400;
const cache = { revalidate };

// Tokens from globals.css (:root) - the only place they are duplicated, satori reads no CSS.
const COLORS = { panel: "#121418", white: "#ffffff", mute: "#c4c9d1", amber: "#ffb000" };

/**
 * Open Graph card for pages without an image in cmssy branding:
 * `/og.png?t=<title>&d=<description>&l=<locale>`. Logo (or the brand name) in the
 * corner, the title large, the description under it.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branding = await siteBranding(cache);
  const brand = branding?.brandName ?? "SevenThreeLabs";
  const title = clip(searchParams.get("t") || brand, 90);
  const description = clip(searchParams.get("d") ?? "", 160);
  const logo = branding?.logoDarkUrl ?? branding?.logoUrl ?? null;

  return new ImageResponse(
    (
      <div
        lang={searchParams.get("l") ?? "pl"}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: COLORS.panel,
          color: COLORS.white,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, color: COLORS.mute }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- satori renders plain <img>; the logo carries the name
            <img src={logo} alt="" height={40} style={{ height: 40 }} />
          ) : (
            <>
              <div style={{ width: 16, height: 16, background: COLORS.amber, borderRadius: 4 }} />
              <span>{brand}</span>
            </>
          )}
          <span style={{ marginLeft: "auto", fontSize: 24 }}>{new URL(siteUrl()).host}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: title.length > 60 ? 56 : 72, fontWeight: 600, lineHeight: 1.06, letterSpacing: "-0.03em" }}>
            {title}
          </div>
          {description ? <div style={{ fontSize: 30, lineHeight: 1.35, color: COLORS.mute }}>{description}</div> : null}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "cache-control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800" },
    },
  );
}
