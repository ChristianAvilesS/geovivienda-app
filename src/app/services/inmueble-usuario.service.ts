import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { InmuebleUsuario } from '../models/inmueble-usuario';
import { Observable, Subject } from 'rxjs';
const url_base = environment.base;

@Injectable({
  providedIn: 'root',
})
export class InmuebleUsuarioService {
  private url = url_base + '/inmueblesusuario';
  private objCambio: Subject<InmuebleUsuario> = new Subject<InmuebleUsuario>();

  constructor(private http: HttpClient) {}

  buscarDuenioPorInmueble(idInmueble: number) {
    return this.http.get<InmuebleUsuario>(`${this.url}/duenio/${idInmueble}`);
  }

  guardar(inmuebleUsuario: InmuebleUsuario) {
    return this.http.post(this.url, inmuebleUsuario);
  }

  marcarDesmarcarFavorito(idInmueble: number, idUsuario: number) {
    const params = {
      idInmueble: idInmueble.toString(),
      idUsuario: idUsuario.toString(),
    };

    return this.http.put<InmuebleUsuario>(
      `${this.url}/marcardesmarcarfavorito`,
      null, // no hay body, solo params
      { params }
    );
  }

  obtenerPorIds(idInmueble: number, idUsuario: number) {
    return this.http.get<InmuebleUsuario>(this.url + '/buscar', {
      params: {
        idInmueble: idInmueble,
        idUsuario: idUsuario,
      },
    });
  }

  getObj(): Observable<InmuebleUsuario> {
    return this.objCambio.asObservable();
  }

  setObj(objNuevo: InmuebleUsuario): void {
    this.objCambio.next(objNuevo);
  }
}
