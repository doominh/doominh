import { Key } from 'react';

export interface IBranch {
  updatedAt: string;
  createdAt: string;
  data: unknown;
  _id?: Key;
  name: string;
  user_id: string;
  menu_id: string;
  logo_image?: string;
  address: string;
  email: string;
  employee: string[];
  phone_number: string;
  open: string;
  close: string;
}

interface IResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type IBranchesResponse = IResponse<IBranch[]>;
export type IBranchDetailResponse = IResponse<IBranch>;

export interface ICreateBranch {
  data: Partial<IBranch>;
}
