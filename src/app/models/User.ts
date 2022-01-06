import { Folder } from '../interfaces/folder.interface';
import { Todo } from '../interfaces/todos.interface';

export class User {
  constructor(
    public id: number,
    public email: string,
    public created_at: string,
    public updated_at: string,
    public Folders: Folder[],
    public Todos: Todo[]
  ) {}
}
