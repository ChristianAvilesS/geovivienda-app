import { Injectable } from '@angular/core';
import { Direccion } from '../models/direccion';
import { environment } from '../environments/environments';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private url = `${base_url}/direcciones`;
  private listaCambio = new Subject<Direccion[]>();

  constructor(private http: HttpClient) {}

  listar(): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(this.url);
  }

  insertar(d: Direccion) {
    console.log('Sin implementación actualmente');
  }

  setLista(listaNueva: Direccion[]) {
    this.listaCambio.next(listaNueva);
  }

  getLista() {
    return this.listaCambio.asObservable();
  }

  buscarPorId(id: number): Observable<Direccion> {
    return this.http.get<Direccion>(this.url + `/${id}`);
  }

  actualizar(d: Direccion) {
    console.log('Sin implementación actualmente');
  }

  eliminar(id: number) {
    return this.http.delete(this.url + `/${id}`);
  }
}
