import { AuthRequest } from '../services/Auth';

/*
  External facing types
*/

export interface Paged<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  results: Array<T>;
}

export interface PagingOptions {
  page?: number | string;
  pageSize?: number | string;
}

/*
  Pagination Helper Types
*/

export interface ParsedPaging extends PagingOptions {
  errorMessage?: string;
}

export const DefaultPaging = {
  page: 1,
  pageSize: 100
};

export interface OffsetPaging {
  offset: number;
  limit: number;

  original: {
    page: number;
    pageSize: number;
  };
}

/*
  Pagination Helper Functions
*/

export function pagingFromRequest(req: AuthRequest): ParsedPaging {
  const paging: ParsedPaging = {};

  // check the query parameters
  const { page: pageParam, pageSize: sizeParam } = req.query || {};
  if (pageParam) {
    paging.page = parseInt(`${pageParam}`, 10);
    if (isNaN(paging.page)) {
      paging.errorMessage = `Invalid input for number param: page. Received: ${pageParam}`;
    }
  }

  if (sizeParam) {
    paging.pageSize = parseInt(`${sizeParam}`, 10);
    if (isNaN(paging.pageSize)) {
      paging.errorMessage =
        (!!paging.errorMessage ? '; ' : '') +
        `Invalid input for number param: pageSize. Received: ${sizeParam}`;
    }
  }

  if (pageParam || sizeParam || paging.errorMessage) {
    return paging;
  }

  // check the body
  const { page, pageSize } = req.body || {};
  if (page) {
    paging.page = parseInt(`${page}`, 10);
    if (isNaN(paging.page)) {
      paging.errorMessage = `Invalid input for number param: page. Received: ${page}`;
    }
  }

  if (pageSize) {
    paging.pageSize = parseInt(`${pageSize}`, 10);
    if (isNaN(paging.pageSize)) {
      paging.errorMessage =
        (!!paging.errorMessage ? '; ' : '') +
        `Invalid input for number param: pageSize. Received: ${pageSize}`;
    }
  }

  return paging;
}

export function asOffset(paging?: PagingOptions): OffsetPaging {
  const BASE_TEN: number = 10;
  const MAX_PAGE_SIZE: number = 500;

  const page: number = Math.max(
    parseInt(`${paging?.page || DefaultPaging.page}`, BASE_TEN),
    DefaultPaging.page
  );
  const pageSize: number = Math.min(
    parseInt(`${paging?.pageSize || DefaultPaging.pageSize}`, BASE_TEN),
    MAX_PAGE_SIZE
  );

  const res: OffsetPaging = {
    offset: page <= 1 ? 0 : (page - 1) * pageSize,
    limit: pageSize,
    original: {
      page,
      pageSize
    }
  };

  return res;
}

export function attemptToJSON<T, V = T | Partial<T>>(obj: T): T | V {
  try {
    if (typeof (obj as any)?.toJSON === 'function') {
      return (obj as any).toJSON() as V;
    }
    return obj;
  } catch (err) {
    return obj;
  }
}

export function asPagedResponse<T, V = T>(
  dbResponse: { rows: Array<T>; count: number },
  offsets: OffsetPaging,
  mapResults: (result: T) => T | V = attemptToJSON
): Paged<T | V> {
  return {
    page: offsets.original.page,
    pageSize: offsets.original.pageSize,
    totalCount: dbResponse.count,
    results: (dbResponse.rows || []).map(mapResults)
  };
}
