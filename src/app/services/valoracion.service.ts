import { Valoracion } from './../models/valoracion';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Imagen } from '../models/imagen';
import { Observable, Subject } from 'rxjs';
import { ValoracionPromedio } from '../models/dtos/valoracion-promedio-dto';
const url_base = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ValoracionService {
  private url = `${url_base}/valoracion`;
  private listaCambio = new Subject<Valoracion[]>();

  constructor(private http: HttpClient) {}

  listValoracion() {
    return this.http.get<Valoracion[]>(this.url);
  }

insertarValoracion(valoracion: Valoracion): Observable<Valoracion> {
  return this.http.post<Valoracion>(`${this.url}`, valoracion);
}


  setList(listaNueva: Valoracion[]) {
    this.listaCambio.next(listaNueva);
  }

  eliminarValoracion(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

obtenerListaValoracionPromedio(): Observable<ValoracionPromedio[]> {
  return this.http.get<ValoracionPromedio[]>(`${this.url}/promediovaloracion`);
}

}