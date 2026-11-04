import {
  createCmssyEditPage,
  CmssyLayoutSlot,
  isCmssyEditMode,
} from "@cmssy/next/server";
import type { CmssyRegion } from "@cmssy/next";
import { cmssy, type layout } from "@/cmssy.config";
import { blocks } from "@/cmssy/blocks";
import { CmssyEditor } from "@/cmssy/editor";
import { EditableLayout } from "@/cmssy/editable-layout";
import { splitLocaleFromPath } from "@cmssy/core/internal";
import { siteLocales } from "@/lib/cmssy/locales";
import { slugFromPath } from "@/lib/site-url";
import { buildAppContext } from "@/services/app-context";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const CmssyEditPage = createCmssyEditPage(cmssy, blocks, {
  editor: CmssyEditor,
  appContext: ({ page, locale }) => buildAppContext(page.slug ?? "/", locale, undefined, true),
});

export default async function EditPage(props: PageProps) {
  const { path } = await props.params;

  const editMode = await isCmssyEditMode();
  const locales = await siteLocales();
  const { locale, path: pagePath } = splitLocaleFromPath(path, locales);
  const context = await buildAppContext(slugFromPath(pagePath), locale, undefined, true);

  const slot = (region: CmssyRegion<typeof layout>) => (
    <CmssyLayoutSlot
      config={cmssy}
      blocks={blocks}
      region={region}
      path={path ?? []}
      editMode={editMode}
      editable={EditableLayout}
      appContext={context}
    />
  );

  return (
    <>
      {slot("header")}
      <main>
        <CmssyEditPage {...props} />
      </main>
      {slot("footer")}
    </>
  );
}
