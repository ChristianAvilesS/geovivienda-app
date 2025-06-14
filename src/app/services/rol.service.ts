import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable, Subject } from 'rxjs';
import { Rol } from '../models/rol';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private url = `${base_url}/roles`;
  private listaCambio = new Subject<Rol[]>();

  constructor(private http: HttpClient) {}

  listar(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url);
  }

  insertar(r: Rol) {
    return this.http.post(this.url, r);
  }

  setLista(listaNueva: Rol[]) {
    this.listaCambio.next(listaNueva);
  }

  getLista() {
    return this.listaCambio.asObservable();
  }

  buscarPorId(id: number): Observable<Rol> {
    return this.http.get<Rol>(this.url + `/${id}`);
  }

  actualizar(r: Rol) {
    return this.http.put(this.url + `/${r.idRol}`, r);
  }

  eliminar(id: number) {
    return this.http.delete(this.url + `/${id}`);
  }
}
