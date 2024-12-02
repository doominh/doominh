import { IBranch } from './branch';
import { IError } from './error';

interface IRequestCredentials {
  username: string;
  password: string;
}

export interface IRegisterRequest extends IRequestCredentials {
  fullname: string;
  email: string;
  phone: string;
  role: string;
  branch: string;
}

export interface ILoginRequest extends IRequestCredentials {}

interface IResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface ILoginResponse extends IResponse<IUser | IError> {}

export interface IAuth {
  loggedIn: boolean;
  errorMessage: string | null;
  currentUser: IUser;
}

export interface IUser {
  token: string;
  refreshToken: string;
  userId: string;
  username: string;
  image?: string;
  fullname: string;
  role: string;
  branchId: IBranch;
}

export interface IRefreshToken {
  data: {
    token: string;
  };
}
