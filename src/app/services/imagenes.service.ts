import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Imagen } from '../models/imagen';
const url_base = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ImagenesService {
  private url = `${url_base}/imagenes`;

  constructor(private http: HttpClient) {}

  listarPorInmueble(id: number) {
    return this.http.get<Imagen[]>(`${this.url}/buscarporinmueble/${id}`);
  }
}
