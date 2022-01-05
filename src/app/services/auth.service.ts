import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginReq, LoginRes, RegisterRes, RegisterReq } from '../interfaces/auth.interface';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _baseUrl: string = environment.API_BASE_URL;
  private _loggedUser: User;

  constructor(private http: HttpClient) {}

  public login(form: LoginReq): Observable<LoginRes> {
    return this.http.post<LoginRes>(`${this._baseUrl}/users/login`, form);
  }

  public register(form: RegisterReq): Observable<RegisterRes> {
    return this.http.post<RegisterRes>(`${this._baseUrl}/users/register`, form);
  }

  public setUser(u: User) {
    this._loggedUser = u;
  }

  public getUser(): User {
    return this._loggedUser;
  }

  public logout(): void {
    this._loggedUser = null;
  }
}
