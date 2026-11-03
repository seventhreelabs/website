/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type FormActionType =
  | 'contact'
  | 'custom';

export type FormFieldType =
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'email'
  | 'file'
  | 'hidden'
  | 'multiselect'
  | 'number'
  | 'password'
  | 'phone'
  | 'radio'
  | 'select'
  | 'text'
  | 'textarea'
  | 'url';

export type PriceDisplayMode =
  | 'gross'
  | 'net';

/** Whose list it is: the customer's (MEMBER), their company's or the sales channel's. */
export type PriceListSource =
  | 'CHANNEL'
  | 'COMPANY'
  | 'MEMBER';

/** A product, or one variant of it, to price for the signed-in member. */
export type PriceQueryItem = {
  recordId: string | number;
  /** The variant's id as the delivery ProductVariant.id returns it. Leave it out on a variant product to get its lowest and highest price. */
  variantKey?: string | null | undefined;
};

export type PriceSource =
  | 'catalogue'
  | 'price_list_entry'
  | 'price_list_percent';

export type SubmitFormInput = {
  data: unknown;
  website?: string | null | undefined;
};

export type TaxTreatmentKind =
  | 'exempt'
  | 'export'
  | 'reverse_charge'
  | 'standard';

export type PublicSiteConfigQueryVariables = Exact<{
  workspaceSlug: string;
}>;


export type PublicSiteConfigQuery = { public: { siteConfig: { id: string, workspaceId: string, siteName: unknown, defaultLanguage: string, enabledLanguages: Array<string>, enabledFeatures: Array<string>, notFoundPageId: string | null, previewUrl: string | null, branding: { brandName: string | null, logoUrl: string | null, logoDarkUrl: string | null, faviconUrl: string | null, ogImageUrl: string | null } | null } | null } };

export type PublicPageQueryVariables = Exact<{
  workspaceSlug: string;
  slug: string;
  previewSecret?: string | null | undefined;
}>;


export type PublicPageQuery = { public: { page: { get: { id: string, slug: string, pageType: string, blocks: Array<{ id: string, type: string, content: unknown, style: unknown, advanced: unknown }>, publishedBlocks: Array<{ id: string, type: string, content: unknown, style: unknown, advanced: unknown }> } | null } } };

export type PublicPageByIdQueryVariables = Exact<{
  workspaceSlug: string;
  pageId: string | number;
}>;


export type PublicPageByIdQuery = { public: { page: { getById: { id: string, slug: string, pageType: string, publishedBlocks: Array<{ id: string, type: string, content: unknown, style: unknown, advanced: unknown }> } | null } } };

export type PublicPagesQueryVariables = Exact<{
  workspaceSlug: string;
}>;


export type PublicPagesQuery = { public: { page: { list: Array<{ id: string, slug: string, updatedAt: string, publishedAt: string | null }> } } };

export type PublicPageMetaQueryVariables = Exact<{
  workspaceSlug: string;
  slug: string;
}>;


export type PublicPageMetaQuery = { public: { page: { get: { id: string, seoTitle: unknown, seoDescription: unknown, seoKeywords: Array<string>, displayName: unknown } | null } } };

export type PublicPageLayoutsQueryVariables = Exact<{
  workspaceSlug: string;
  pageSlug: string;
  previewSecret?: string | null | undefined;
}>;


export type PublicPageLayoutsQuery = { public: { page: { layouts: Array<{ region: string, settings: unknown, blocks: Array<{ id: string, type: string, content: unknown, style: unknown, advanced: unknown, order: number, isActive: boolean }> }> } } };

export type PublicModelRecordsQueryVariables = Exact<{
  workspaceId: string;
  modelSlug: string;
  filter?: unknown;
  sort?: string | null | undefined;
  locale?: string | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  populate?: Array<string> | string | null | undefined;
  previewSecret?: string | null | undefined;
}>;


export type PublicModelRecordsQuery = { public: { model: { records: { total: number, hasMore: boolean, items: Array<{ id: string, modelId: string, data: unknown, status: string | null, createdAt: string, updatedAt: string }> } } } };

export type PublicRecordsByIdsQueryVariables = Exact<{
  workspaceId: string;
  ids: Array<string> | string;
  locale?: string | null | undefined;
  previewSecret?: string | null | undefined;
}>;


export type PublicRecordsByIdsQuery = { public: { model: { recordsByIds: Array<{ id: string, modelId: string, data: unknown, status: string | null, createdAt: string, updatedAt: string }> } } };

export type PublicFormQueryVariables = Exact<{
  formId: string | number;
}>;


export type PublicFormQuery = { public: { form: { get: { id: string, name: string, slug: string, description: string | null, fields: Array<{ id: string, name: string, fieldType: FormFieldType, label: unknown, placeholder: unknown, helpText: unknown, defaultValue: string | null, width: string, order: number, showWhen: unknown, requiredWhen: unknown, options: Array<{ value: string, label: unknown, disabled: boolean }>, validation: { required: boolean, minLength: number | null, maxLength: number | null, minValue: number | null, maxValue: number | null, pattern: string | null, customMessage: string | null } }>, settings: { actionType: FormActionType, submitButtonLabel: unknown, successMessage: unknown, errorMessage: unknown, redirectUrl: string | null, requireLogin: boolean } } | null } } };

export type SubmitFormMutationVariables = Exact<{
  formId: string | number;
  input: SubmitFormInput;
}>;


export type SubmitFormMutation = { public: { form: { submit: { success: boolean, message: string, submissionId: string | null, redirectUrl: string | null } } } };

export type BuyerPricesQueryVariables = Exact<{
  workspaceId: string | number;
  items: Array<PriceQueryItem> | PriceQueryItem;
  channel?: string | null | undefined;
  previewSecret?: string | null | undefined;
}>;


export type BuyerPricesQuery = { account: { prices: Array<{ recordId: string, variantKey: string | null, currency: string, price: number, priceMax: number | null, listed: boolean, basePrice: number, source: PriceSource, listSource: PriceListSource | null, minQuantity: number, maxQuantity: number, increment: number, displayMode: PriceDisplayMode, taxRate: number, taxTreatmentKind: TaxTreatmentKind, tiers: Array<{ minQty: number, price: number }>, priceAmount: { net: number, tax: number, gross: number }, priceMaxAmount: { net: number, tax: number, gross: number } | null, basePriceAmount: { net: number, tax: number, gross: number } }> } };

export type SubmitSiteFormMutationVariables = Exact<{
  formId: string | number;
  input: SubmitFormInput;
}>;


export type SubmitSiteFormMutation = { public: { form: { submit: { success: boolean, message: string, submissionId: string | null, redirectUrl: string | null } } } };

export type PublishedPagesQueryVariables = Exact<{
  workspaceSlug: string;
}>;


export type PublishedPagesQuery = { public: { page: { list: Array<{ slug: string, publishedAt: string | null }> } } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const PublicSiteConfigDocument = new TypedDocumentString(`
    query PublicSiteConfig($workspaceSlug: String!) {
  public {
    siteConfig(workspaceSlug: $workspaceSlug) {
      id
      workspaceId
      siteName
      defaultLanguage
      enabledLanguages
      enabledFeatures
      notFoundPageId
      previewUrl
      branding {
        brandName
        logoUrl
        logoDarkUrl
        faviconUrl
        ogImageUrl
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublicSiteConfigQuery, PublicSiteConfigQueryVariables>;
export const PublicPageDocument = new TypedDocumentString(`
    query PublicPage($workspaceSlug: String!, $slug: String!, $previewSecret: String) {
  public {
    page {
      get(workspaceSlug: $workspaceSlug, slug: $slug, previewSecret: $previewSecret) {
        id
        slug
        pageType
        blocks {
          id
          type
          content
          style
          advanced
        }
        publishedBlocks {
          id
          type
          content
          style
          advanced
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublicPageQuery, PublicPageQueryVariables>;
export const PublicPageByIdDocument = new TypedDocumentString(`
    query PublicPageById($workspaceSlug: String!, $pageId: ID!) {
  public {
    page {
      getById(workspaceSlug: $workspaceSlug, pageId: $pageId) {
        id
        slug
        pageType
        publishedBlocks {
          id
          type
          content
          style
          advanced
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublicPageByIdQuery, PublicPageByIdQueryVariables>;
export const PublicPagesDocument = new TypedDocumentString(`
    query PublicPages($workspaceSlug: String!) {
  public {
    page {
      list(workspaceSlug: $workspaceSlug) {
        id
        slug
        updatedAt
        publishedAt
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublicPagesQuery, PublicPagesQueryVariables>;
export const PublicPageMetaDocument = new TypedDocumentString(`
    query PublicPageMeta($workspaceSlug: String!, $slug: String!) {
  public {
    page {
      get(workspaceSlug: $workspaceSlug, slug: $slug) {
        id
        seoTitle
        seoDescription
        seoKeywords
        displayName
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublicPageMetaQuery, PublicPageMetaQueryVariables>;
export const PublicPageLayoutsDocument = new TypedDocumentString(`
    query PublicPageLayouts($workspaceSlug: String!, $pageSlug: String!, $previewSecret: String) {
  public {
    page {
      layouts(
        workspaceSlug: $workspaceSlug
        pageSlug: $pageSlug
        previewSecret: $previewSecret
      ) {
        region
        blocks {
          id
          type
          content
          style
          advanced
          order
          isActive
        }
        settings
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublicPageLayoutsQuery, PublicPageLayoutsQueryVariables>;
export const PublicModelRecordsDocument = new TypedDocumentString(`
    query PublicModelRecords($workspaceId: String!, $modelSlug: String!, $filter: JSON, $sort: String, $locale: String, $limit: Int, $offset: Int, $populate: [String!], $previewSecret: String) {
  public {
    model {
      records(
        workspaceId: $workspaceId
        modelSlug: $modelSlug
        filter: $filter
        sort: $sort
        locale: $locale
        limit: $limit
        offset: $offset
        populate: $populate
        previewSecret: $previewSecret
      ) {
        items {
          id
          modelId
          data
          status
          createdAt
          updatedAt
        }
        total
        hasMore
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublicModelRecordsQuery, PublicModelRecordsQueryVariables>;
export const PublicRecordsByIdsDocument = new TypedDocumentString(`
    query PublicRecordsByIds($workspaceId: String!, $ids: [String!]!, $locale: String, $previewSecret: String) {
  public {
    model {
      recordsByIds(
        workspaceId: $workspaceId
        ids: $ids
        locale: $locale
        previewSecret: $previewSecret
      ) {
        id
        modelId
        data
        status
        createdAt
        updatedAt
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublicRecordsByIdsQuery, PublicRecordsByIdsQueryVariables>;
export const PublicFormDocument = new TypedDocumentString(`
    query PublicForm($formId: ID!) {
  public {
    form {
      get(formId: $formId) {
        id
        name
        slug
        description
        fields {
          id
          name
          fieldType
          label
          placeholder
          helpText
          defaultValue
          width
          order
          showWhen
          requiredWhen
          options {
            value
            label
            disabled
          }
          validation {
            required
            minLength
            maxLength
            minValue
            maxValue
            pattern
            customMessage
          }
        }
        settings {
          actionType
          submitButtonLabel
          successMessage
          errorMessage
          redirectUrl
          requireLogin
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublicFormQuery, PublicFormQueryVariables>;
export const SubmitFormDocument = new TypedDocumentString(`
    mutation SubmitForm($formId: ID!, $input: SubmitFormInput!) {
  public {
    form {
      submit(formId: $formId, input: $input) {
        success
        message
        submissionId
        redirectUrl
      }
    }
  }
}
    `) as unknown as TypedDocumentString<SubmitFormMutation, SubmitFormMutationVariables>;
export const BuyerPricesDocument = new TypedDocumentString(`
    query BuyerPrices($workspaceId: ID!, $items: [PriceQueryItem!]!, $channel: String, $previewSecret: String) {
  account {
    prices(
      workspaceId: $workspaceId
      items: $items
      channel: $channel
      previewSecret: $previewSecret
    ) {
      recordId
      variantKey
      currency
      price
      priceMax
      listed
      basePrice
      source
      listSource
      minQuantity
      maxQuantity
      increment
      tiers {
        minQty
        price
      }
      displayMode
      taxRate
      taxTreatmentKind
      priceAmount {
        net
        tax
        gross
      }
      priceMaxAmount {
        net
        tax
        gross
      }
      basePriceAmount {
        net
        tax
        gross
      }
    }
  }
}
    `) as unknown as TypedDocumentString<BuyerPricesQuery, BuyerPricesQueryVariables>;
export const SubmitSiteFormDocument = new TypedDocumentString(`
    mutation SubmitSiteForm($formId: ID!, $input: SubmitFormInput!) {
  public {
    form {
      submit(formId: $formId, input: $input) {
        success
        message
        submissionId
        redirectUrl
      }
    }
  }
}
    `) as unknown as TypedDocumentString<SubmitSiteFormMutation, SubmitSiteFormMutationVariables>;
export const PublishedPagesDocument = new TypedDocumentString(`
    query PublishedPages($workspaceSlug: String!) {
  public {
    page {
      list(workspaceSlug: $workspaceSlug) {
        slug
        publishedAt
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PublishedPagesQuery, PublishedPagesQueryVariables>;