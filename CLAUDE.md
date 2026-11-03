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
- **Design tokens** live only in `src/app/globals.css` (`:root` raw values, `@theme inline` mapping). Use `text-header2-clamp`, `bg-panel`, `max-w-content`; no arbitrary `text-[...]` or hex colours in components.
- **Field labels and helper text are Polish**; field keys and block types are English kebab-case.
- Every section block has `anchor: anchorField("...")` so the header menu can link to it.
- Client components only where state or browser APIs are needed; mark them with `"use client"` and keep them as leaves.

## Git

- Commit straight to `main` for now. Concise messages, conventional prefix (`feat:`, `fix:`, `style:`, `chore:`, `refactor:`).
