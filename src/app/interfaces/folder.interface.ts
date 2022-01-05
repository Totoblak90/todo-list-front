import { Meta } from './general.interface';
export interface Folder {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  users_id: number;
}

export type CreateFolderRequest = Pick<Folder, 'users_id' | 'name'>;
export type EditFolderRequest = Pick<Folder, 'name'>;

export interface CreateFolderResponse {
  meta: Meta;
  data: CreateFolderResponseData;
}

export interface CreateFolderResponseData {
  folder: Folder;
}

export interface DeleteFolderResponse {
  meta: Meta;
  data: string;
}

export interface EditFolderResponse {
  meta: Meta;
  data: EditFolderResponseData;
}
export interface EditFolderResponseData {
  message: string;
  folder: Folder;
}
