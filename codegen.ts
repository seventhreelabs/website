import type { CodegenConfig } from "@graphql-codegen/cli";

// Types for every GraphQL document in the project. Run `pnpm codegen` after
// changing a document; commit the output so builds need no network.
const config: CodegenConfig = {
  schema: "https://api.cmssy.io/graphql",
  documents: [
    "src/lib/graphql/documents/**/*.graphql",
    "src/lib/graphql/cmssy-operations.graphql",
  ],
  ignoreNoDocuments: true,
  generates: {
    "src/lib/graphql/generated/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        documentMode: "string",
        scalars: { JSON: "unknown", DateTime: "string" },
      },
    },
  },
};

export default config;
