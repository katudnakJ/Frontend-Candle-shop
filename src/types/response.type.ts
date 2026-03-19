//default API response type

export interface Status {
  statusCode: string;
  message: string;
  remark?: string;
}

export interface GenericResponse<T> {
  data: T;
  status: Status;
}