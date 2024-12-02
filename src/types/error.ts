export interface ErrorDetail {
  statusCode: number;
  message: string | Record<string, unknown>;
}

export interface ErrorData {
  status: number;
  data: ErrorDetail;
}

export interface IError {
  statusCode: number;
  message: string | object;
  path: string;
  timestamp: string;
}
