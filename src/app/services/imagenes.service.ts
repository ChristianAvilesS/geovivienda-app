import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Imagen } from '../models/imagen';
import { Observable } from 'rxjs';
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

  subirImagen(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(`${this.url}/subirimagen`, formData);
  }

  guardarImagen(imagen: Imagen) {
    return this.http.post(this.url, imagen);
  }

  eliminarImagen(id: number) {
    return this.http.delete(this.url+"/"+id);
  }
}
