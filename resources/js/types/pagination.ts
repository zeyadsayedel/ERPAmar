export interface PaginationLinks {
  prev?: string | null;
  next?: string | null;
}

export interface PaginationProps<T> {
  data: T[];
  from: number;
  to: number;
  total: number;
  links?: PaginationLinks;
}