import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Subject } from 'rxjs';
import { Anuncio } from '../models/anuncio';

const url_base = environment.base;

@Injectable({
  providedIn: 'root',
})
export class AnuncioService {
  private url = url_base + '/anuncios';
  private listaCambio: Subject<Anuncio[]> = new Subject<Anuncio[]>();

  constructor(private http: HttpClient) {}

  listarAnuncios() {
    return this.http.get<Anuncio[]>(this.url);
  }

  getLista() {
    return this.listaCambio.asObservable();
  }

  setLista(listaNueva: Anuncio[]) {
    this.listaCambio.next(listaNueva);
  }

  agregarAnuncio(anuncio: Anuncio) {
    return this.http.post<Anuncio>(this.url, anuncio);
  }

  editarAnuncio(anuncio: Anuncio) {
    return this.http.put<Anuncio>(this.url, anuncio);
  }

  buscarPorInmueble(idInmueble: number) {
    return this.http.get<Anuncio>(this.url + '/buscarporinmueble', {
      params: {
        idInmueble: idInmueble,
      },
    });
  }

  eliminar(idAnuncio: number) {
    return this.http.delete(this.url + '/' + idAnuncio);
  }
}
