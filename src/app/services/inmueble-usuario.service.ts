import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { InmuebleUsuario } from '../models/inmueble-usuario';
const url_base = environment.base;

@Injectable({
  providedIn: 'root',
})
export class InmuebleUsuarioService {
  private url = url_base + '/inmueblesusuario';

  constructor(private http: HttpClient) {}

  buscarDuenioPorInmueble(idInmueble: number) {
    return this.http.get<InmuebleUsuario>(`${this.url}/duenio/${idInmueble}`);
  }

  guardar(inmuebleUsuario: InmuebleUsuario) {
    return this.http.post(this.url, inmuebleUsuario);
  }
}
