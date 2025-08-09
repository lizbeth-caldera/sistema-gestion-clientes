import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/* 
   Interfaz para tipar un cliente.
   Esto ayuda a que en todo el código
   sepamos qué campos esperamos.
*/
export interface Cliente {
  id: number;
  razon_social: string;
  tipo_persona: 'FISICA' | 'MORAL';
  rfc: string;
  representante_legal: string;
  email: string;
  telefono: string;
  documento?: string; // opcional, puede no venir
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  // URL base de la API, viene del environment
  private readonly base = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  /* =========================
     CRUD (métodos de servicio)
     ========================= */

  // Traer todos los clientes
  list(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.base);
  }

  // Traer un cliente por ID
  get(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.base}/${id}`);
  }

  // Crear nuevo cliente
  create(body: Cliente): Observable<any> {
    return this.http.post(this.base, body);
  }

  // Editar un cliente existente
  update(id: number, b: Cliente): Observable<any> {
    return this.http.put(`${this.base}/${id}`, b);
  }

  // Eliminar cliente
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
