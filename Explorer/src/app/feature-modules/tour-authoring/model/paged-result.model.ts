// model/paged-result.model.ts
export interface PagedResult<T> {
  results: T[];
  totalCount: number;
}