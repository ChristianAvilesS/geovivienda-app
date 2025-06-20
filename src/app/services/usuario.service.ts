import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { UsuarioDevueltoDTO } from '../models/dtos/usuario-devuelto-dto';
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = `${base_url}/usuarios`;
  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  insertar(u: Usuario, rolId: number) {
    const params = { rol: rolId };
    return this.http.post<UsuarioDevueltoDTO>(this.url, u, { params });
  }

  setLista(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }

  getLista() {
    return this.listaCambio.asObservable();
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  actualizar(u: Usuario) {
    return this.http.put(`${this.url}/${u.idUsuario}`, u);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
