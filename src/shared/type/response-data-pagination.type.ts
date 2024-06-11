import { TResponse } from './response.type';

export type TResponseDataPagination<T> = TResponse & {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  pageIndex: number;
  item: T[] | null;
};
