import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  /*
    Método para iniciar sesión.
    - Recibe un objeto con username y password.
    - Llama al endpoint /login de la API.
    - Si la respuesta trae access_token, lo guarda en localStorage.
  */
  login(body: { username: string; password: string }): Observable<any> {
    return this.http.post<{ access_token: string }>(
      `${environment.apiUrl}/login`, // URL del endpoint de login
      body                           // credenciales del usuario
    ).pipe(
      // Guarda el token en localStorage para usarlo después en las peticiones
      tap(res => localStorage.setItem('access', res.access_token))
    );
  }
}
