import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Inmueble } from '../models/inmueble';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class InmuebleService {
  private url = `${base_url}/inmuebles`;
  private listaCambio = new Subject<Inmueble[]>();

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Inmueble[]>(this.url + '/listado-logico');
  }

  insertar(inmueble: Inmueble) {
    return this.http.post<Inmueble>(this.url, inmueble);
  }

  actualizar(inmueble: Inmueble) {
    return this.http.put<Inmueble>(this.url, inmueble);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  buscarPorId(id: number) {
    return this.http.get<Inmueble>(`${this.url}/${id}`);
  }

  setLista(listaNueva: Inmueble[]) {
    this.listaCambio.next(listaNueva);
  }

  getLista() {
    return this.listaCambio.asObservable();
  }

  obtenerCercaUsuario(long: number, lat: number) {
    return this.http.get<Inmueble[]>(this.url + '/inmuebles_cerca_usuario', {
      params: {
        lon: long,
        lat: lat,
      },
    });
  }
}
