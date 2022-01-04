import { Meta, UserRes } from './general.interface';

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
