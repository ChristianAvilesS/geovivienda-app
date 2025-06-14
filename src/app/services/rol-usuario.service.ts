import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RolUsuario } from '../models/rol-usuario';
import { RolUsuarioId } from '../models/ids/rol-usuario-id';
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RolUsuarioService {
  private url = `${base_url}/rolesusuario`;
  private listaCambio = new Subject<RolUsuario[]>();

  constructor(private http: HttpClient) {}

  listar(): Observable<RolUsuario[]> {
    return this.http.get<RolUsuario[]>(this.url);
  }

  insertar(ru: RolUsuario) {
    return this.http.post(this.url, ru);
  }

  setLista(listaNueva: RolUsuario[]) {
    this.listaCambio.next(listaNueva);
  }

  getLista() {
    return this.listaCambio.asObservable();
  }

  buscarPorId(id: RolUsuarioId): Observable<RolUsuario> {
    const params = new HttpParams()
      .set('idUsuario', `${id.idUsuario}`)
      .set('idRol', `${id.idRol}`);

    return this.http.get<RolUsuario>(this.url + '/buscar', { params });
  }

  eliminar(id: RolUsuarioId) {
    const params = new HttpParams()
      .set('idUsuario', `${id.idUsuario}`)
      .set('idRol', `${id.idRol}`);
    return this.http.delete(this.url, { params });
  }
}
