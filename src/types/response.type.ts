//default API response type

export interface Status {
  status: string;
  message: string;
  remark?: string;
}

export interface GenericResponse<T> {
  data: T;
  status: Status;
}