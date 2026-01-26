//default API response type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  status: number;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];           
  meta: PaginationMeta;
}