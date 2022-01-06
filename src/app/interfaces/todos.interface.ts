import { Meta } from './general.interface';

export interface Todo {
  id: number;
  name: string;
  completed: boolean;
  users_id: string;
  folders_id: string;
  updated_at: string;
  created_at: string;
  deleted_at?: string;
}

export interface GetAllTodosFromOneFolder {
  meta: Meta;
  data: Todo[];
}

export interface CreateOrEditTodoReq {
  name: string;
  completed: boolean;
}

export interface CreateTodoResponse {
  meta: Meta;
  data: CreateTodoResponseData;
}

export interface CreateTodoResponseData {
  todo: Todo;
}

export interface DeleteTodoResponseData {
  meta: Meta;
  data: string;
}

export interface EditTodoResponse {
  meta: Meta;
  data: EditTodoResponseData;
}

export interface EditTodoResponseData {
  msg: string;
  todo: Todo;
}
