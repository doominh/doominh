import { StatusEnum } from './table';

export interface IBillDetail {
  bill_id: string;
  name: string;
  price: number;
  quantity: number;
  sub_total: number;
  note: string;
}

export interface IEmployeeBill extends IBillDetail {
  _id: string;
  status: StatusEnum;
}

export interface IDeleteData {
  billDetail: IBillDetail;
}
