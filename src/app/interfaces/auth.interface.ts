import { Meta, UserRegisterResponse, UserRes } from './general.interface';

export interface LoginReq {
  email: string;
  password: string;
}

export interface LoginRes {
  meta: Meta;
  data: LoginResData;
}

export interface LoginResData {
  message: string;
  user: UserRes;
}

export interface RegisterReq {
  email: string;
  password: string;
  passwordRepeat: string;
}

export interface RegisterRes {
  meta: Meta;
  data: RegisterResData;
}

export interface RegisterResData {
  user: UserRegisterResponse;
}
