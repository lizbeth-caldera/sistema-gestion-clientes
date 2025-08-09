import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(body: { username: string; password: string }): Observable<any> {
    return this.http.post<{ access_token: string }>(
      `${environment.apiUrl}/login`, body
    ).pipe(
      tap(res => localStorage.setItem('access', res.access_token))
    );
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('access');
  }

  logout(): void {
    localStorage.removeItem('access');
  }
}
