# SevenThreeLabs - website

Next.js 16 (App Router) + cmssy headless CMS + Tailwind 4. Polish copy. One theme.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm typecheck` / `pnpm lint`
- `pnpm codegen` - regenerate GraphQL types after touching any `.graphql` document
- `pnpm cmssy:types` - refresh SDK operations + model types from the workspace, then codegen
- Block manifest changes land in cmssy only after a deploy; ask the user to open the editor once, then `list_block_types`.

## Directory layout

```
src/
  app/              routes only: layouts, pages, API handlers. No business logic.
  blocks/<name>/    one cmssy block per folder: block.ts (defineBlock) + <Name>.tsx (+ client parts)
  cmssy/            cmssy wiring from get_site_setup: block registry, editor, layout slots. Do not refactor.
  components/ui/    reusable presentational pieces shared by blocks (Section, Container, Button, ...)
  lib/cmssy/        SDK plumbing: client singleton, shared field factories
  lib/graphql/      documents/*.graphql (ours), cmssy-operations.graphql (SDK, generated), generated/ (codegen, committed)
  services/         data access for routes and server actions; the only place that calls the GraphQL client
  utils/            pure helpers with no React and no I/O
```

Rule of thumb: `app` -> `services` -> `lib`; `blocks` -> `components/ui` + `utils`. Nothing imports from `app`.

## Conventions

- **Types come from the source of truth, never hand-written twice.**
  - Block content: `InferBlockContent<typeof xProps>` (from `@cmssy/react`). Child components take slices of it, e.g. `NonNullable<HeroContent["flows"]>`.
  - GraphQL: import `*Document`, `*Query`, `*Mutation`, `*Variables` from `@/lib/graphql/generated/graphql`. Never declare a result type by hand.
  - CMS primitives: `CmssyFormDefinition`, `CmssyLocalizedValue`, etc. from `@cmssy/react`.
- **Blocks** are thin: fields schema + layout. Visual building blocks go to `components/ui`; logic to `utils`; data to `services`.
- **Server actions** live in `services/` with `"use server"` at the top, not inside block folders.
- **Images** go through `next/image`; `src/lib/cmssy/image-loader.ts` asks the cmssy CDN for a variant sized to the slot. Never `unoptimized`, never the raw asset URL in an `<img>`.
- **Design tokens** live only in `src/app/globals.css` (`:root` raw values, `@theme inline` mapping). Use `text-header2-clamp`, `bg-panel`, `max-w-content`; no arbitrary `text-[...]` or hex colours in components.
- **Field labels and helper text are Polish**; field keys and block types are English kebab-case.
- Every section block has `anchor: anchorField("...")` so the header menu can link to it.
- **Site-wide values** (branding: logo, brand name) are fetched once in the route via `services/site.ts` and handed to blocks through `appContext`; blocks read them with `readBranding(context?.app)` from `lib/cmssy/branding.ts`. No block `loader` for that - the editor bundles `blocks.ts` client-side.
- **Languages**: the default language has no URL prefix, others get `/<locale>/...` (SDK `localizedPath`, `localizeHref`, `splitLocaleFromPath`). Blocks read `context.locale`; the handful of non-CMS strings (menu button, aria labels, 404 fallback) live in `utils/ui-strings.ts`, everything else is cmssy content per language.
- **LLM surface**: every page has a markdown twin (`/<path>.md`, `/index.md`, or `Accept: text/markdown`), plus `/llms.txt`, `/llms-full.txt` (per language under `/<locale>/...`) and a schema.org graph (`utils/structured-data.ts`). Each section block ships `markdown.ts` (`BlockMarkdown<Content>`) registered in `src/cmssy/markdown.ts`; a block without one is silently absent from the markdown, so add it with the block. Rich text goes through `utils/html-to-markdown.ts`.
- **Blog** is the cmssy model `post` (not pages): `services/posts.ts` reads it, the catch-all route renders `/blog/<slug>` (and `/<locale>/blog/<slug>` only when the record's `inEnglish` is on) with `components/blog/*`; `/blog` itself is a cmssy page with the `blog-list` block, which gets its posts from `appContext` (`services/app-context.ts`). Tag labels mirror the model's options in `utils/post-tags.ts`. RSS at `/feed.xml`.
- **Draft mode** (`/api/draft?secret=…&redirect=/`, leave with `?disable=1`) shows unpublished pages and posts and an amber banner; verify CMS changes there instead of publishing. The cmssy editor always sees drafts.
- Client components only where state or browser APIs are needed; mark them with `"use client"` and keep them as leaves.

## Git

- Commit straight to `main` for now. Concise messages, conventional prefix (`feat:`, `fix:`, `style:`, `chore:`, `refactor:`).
