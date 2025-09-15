export interface StrapiPostAttributes {
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface APIResponseCollection<T extends string> {
  data: Array<{
    id: number;
    attributes: StrapiPostAttributes;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface APIResponseData<T extends string> {
  id: number;
  attributes: StrapiPostAttributes;
}
