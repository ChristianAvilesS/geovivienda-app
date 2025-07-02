import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Comentario } from '../models/comentario';
import { Subject } from 'rxjs';
const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private url = `${base_url}/comentarios`;
  private listaCambio = new Subject<Comentario[]>();

  constructor(private http: HttpClient) { }

  listarporinmueble(id: number) {
      return this.http.get<Comentario[]>(this.url + '/buscarporinmueble/'+ id);
    }
    
  insertar(comentario: Comentario) {
      return this.http.post<Comentario>(this.url, comentario);
    }

  buscarPorId(id: number) {
      return this.http.get<Comentario>(`${this.url}/${id}`);
    }

  setLista(listaNueva: Comentario[]) {
      this.listaCambio.next(listaNueva);
    }
  
    getLista() {
      return this.listaCambio.asObservable();
    }
}
