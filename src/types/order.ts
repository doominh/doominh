import { ITable, StatusEnum } from './table';

export interface IOrder {
  _id: string;
  name: string;
  price: number;
  sub_total: number;
  note: string;
  quantity: number;
}

export interface UpdateBillPayload {
  branch_id: string;
  table_name: string;
  updates: Partial<IOrder>[];
}

export interface IQuantity {
  _id: string;
  old_quantity: number;
  new_quantity: number;
  note: string;
}

export interface UpdateBillQuantity {
  branch_id: string;
  table_name: string;
  updates: IQuantity[];
}

export interface IEmployeeOrder extends IOrder {
  _id: string;
  status: StatusEnum;
  updatedAt: string;
  createdAt: string;
}

export interface IChef extends IOrder {
  old_status: number;
  new_status: number;
  _id: string;
  status: StatusEnums;
  bill_id: string;
  updatedAt: string;
  createdAt: string;
}

export enum StatusEnums {
  ORDERED = 0,
  PREPARING = 1,
  SERVED = 2
}

interface IResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}

export type IOrderResponse = IResponse<(IOrder | IEmployeeOrder)[] | null>;
export type IChefResponse = IResponse<IChef[] | null>;

export interface EmployeeOrdersData {
  orders: IEmployeeOrder[];
  table: ITable;
}
