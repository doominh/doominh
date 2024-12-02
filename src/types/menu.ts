import { IRegisterRequest } from './auth';
import { ICategoryMenu } from './category';

interface IBaseResponse {
  statusCode: number;
  message: string;
}

interface IFoodDetails {
  name: string;
  price: number;
  description: string;
  image: File | null | string;
}

export interface IMenu {
  _id: string;
  user_id: IRegisterRequest | null;
  image_cover: File | null | string;
  name: string;
  updatedAt: string;
  createdAt: string;
}

export interface MenuResponse extends IBaseResponse {
  data: IMenu;
}

export interface MenuDetail extends IFoodDetails {
  _id?: string;
  menu_id: string;
  category_id: string | ICategoryMenu;
}

export interface MenuDetailResponse extends IBaseResponse {
  data: MenuDetail | MenuDetail[];
}

export interface CartDetails extends IFoodDetails {
  _id?: string;
  quantity: number;
  note: string;
  menu_detail_id: string;
}
