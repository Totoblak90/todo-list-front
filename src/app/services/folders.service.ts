import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeleteFolderResponse } from '../interfaces/folder.interface';
import {
  CreateFolderRequest,
  CreateFolderResponse,
} from '../interfaces/folder.interface';

@Injectable({
  providedIn: 'root',
})
export class FoldersService {
  private _baseUrl: string = environment.API_BASE_URL;

  constructor(private httpClient: HttpClient) {}

  public createFolder(
    form: CreateFolderRequest
  ): Observable<CreateFolderResponse> {
    return this.httpClient.post<CreateFolderResponse>(
      `${this._baseUrl}/folders/create`,
      form
    );
  }

  public deleteFolder(id: number): Observable<DeleteFolderResponse> {
    return this.httpClient.delete<DeleteFolderResponse>(`${this._baseUrl}/folders/delete/${id}`)
  }
}
