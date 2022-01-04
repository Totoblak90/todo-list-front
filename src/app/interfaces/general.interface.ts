import { Folder } from "./folder.interface";

export interface Meta {
  status: number;
}

export interface UserRes {
  id: number;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  Folders: Folder[];
  Todos: any[];
}
