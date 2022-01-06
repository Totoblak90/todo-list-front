import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeleteTodoResponseData, EditTodoResponse } from '../interfaces/todos.interface';
import {
  CreateOrEditTodoReq,
  CreateTodoResponse,
  GetAllTodosFromOneFolder,
} from '../interfaces/todos.interface';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  constructor(private httpClient: HttpClient) {}

  public listTodos(userId: number, folderId: number): Observable<GetAllTodosFromOneFolder> {
    return this.httpClient.get<GetAllTodosFromOneFolder>(
      `${environment.API_BASE_URL}/todos/${userId}/${folderId}`
    );
  }

  public createTodo(
    userId: number,
    folderId: number,
    form: CreateOrEditTodoReq
  ): Observable<CreateTodoResponse> {
    return this.httpClient.post<CreateTodoResponse>(
      `${environment.API_BASE_URL}/todos/create/${userId}/${folderId}`,
      form
    );
  }

  public editTodo(todoId: number, form: CreateOrEditTodoReq): Observable<EditTodoResponse> {
    return this.httpClient.put<EditTodoResponse>(
      `${environment.API_BASE_URL}/todos/edit/${todoId}`,
      form
    );
  }

  public deleteTodo(todoId: number): Observable<DeleteTodoResponseData> {
    return this.httpClient.delete<DeleteTodoResponseData>(
      `${environment.API_BASE_URL}/todos/delete/${todoId}`
    );
  }

  public bulkDeleteTodosFromSelectedFolder(folderId: number): Observable<any> {
    return this.httpClient.delete(
      `${environment.API_BASE_URL}/todos/bulk-delete/${folderId}`
    );
  }
}
