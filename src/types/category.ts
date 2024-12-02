export interface ICategoryMenu {
  _id: string;
  name: string;
}
export interface CategoryMenuResponse {
  statusCode: number;
  message: string;
  data: ICategoryMenu[];
}
