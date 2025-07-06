import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Visita } from '../models/visita';
import { environment } from '../environments/environments';
import { Subject } from 'rxjs';
const url_base = environment.base;

@Injectable({
  providedIn: 'root',
})
export class VisitaService {
  private url = url_base + '/visitas';
  private listaCambio: Subject<Visita[]> = new Subject<Visita[]>();

  constructor(private http: HttpClient) {}

  listarTodos() {
    return this.http.get<Visita[]>(this.url);
  }

  listarPorUsuario(idUsuario: number) {
    return this.http.get<Visita[]>(this.url + '/listarporusuario', {
      params: {
        idUsuario: idUsuario,
      },
    });
  }

  listarPorUsuarioHistorial(idUsuario: number) {
    return this.http.get<Visita[]>(this.url + '/listarporusuariohistorial', {
      params: {
        idUsuario: idUsuario,
      },
    });
  }

  listarPorUsuarioVendedor(idUsuario: number) {
    return this.http.get<Visita[]>(this.url + '/listarporusuariovendedor', {
      params: {
        idUsuario: idUsuario,
      },
    });
  }

  listarPorUsuarioVendedorHistorial(idUsuario: number) {
    return this.http.get<Visita[]>(
      this.url + '/listarporusuariovendedorhistorial',
      {
        params: {
          idUsuario: idUsuario,
        },
      }
    );
  }

  getLista() {
    return this.listaCambio.asObservable();
  }

  setLista(listaNueva: Visita[]) {
    this.listaCambio.next(listaNueva);
  }

  agendarVisita(visita: Visita) {
    return this.http.post<Visita>(this.url, visita);
  }

  eliminarVisita(idVisita: number) {
    return this.http.delete<Visita>(this.url + '/' + idVisita);
  }

  verificarAgendadas(idUsuario: number, idInmueble: number) {
    return this.http.get<{ agendada: boolean }>(this.url + '/verificar', {
      params: {
        idUsuario: idUsuario,
        idInmueble: idInmueble,
      },
    });
  }
}
