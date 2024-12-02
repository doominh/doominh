export interface IBaseTable {
  branch_id: string;
  name: string;
}

export interface ITable extends IBaseTable {
  _id: string;
  status: StatusEnum;
  qr_code: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IPatchTable extends IBaseTable {
  data: {
    status: StatusEnum;
  };
  message: string;
  statusCode: number;
}

export interface ICreateTable extends IBaseTable {}

export interface IDeleteTable {
  table_id: string;
}

export interface ICheckStatusTable {
  data: {
    status: StatusEnum;
  };
  message: string;
  statusCode: number;
}
export interface IResponseOpenTable {
  data: ITable;
  message: string;
  statusCode: number;
}

export enum StatusEnum {
  ACTIVE = 1,
  INACTIVE = 0,
  SERVED = 2
}

export interface ITableOverviewResponse {
  statusCode: number;
  message: string;
  data: {
    totalTables: number;
    totalActiveTables: number;
    totalInactiveTables: number;
  };
}
