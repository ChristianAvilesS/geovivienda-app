import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Inmueble } from '../models/inmueble';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FiltradoInmuebleDTO } from '../models/dtos/filtrado-inmuebles-dto';
const base_url = environment.base;
const apiKey = environment.apiKeyMaps;

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

  obtenerCercaDireccion(dir: string, rango: number) {
    return this.http.get<Inmueble[]>(this.url + '/inmuebles_en_direccion', {
      params: {
        dir: dir,
        rango: rango,
      },
    });
  }

  autocompletadoDirecciones(value: string) {
    return this.http
      .get<any>(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          value
        )}&format=json&apiKey=${apiKey}`
      )
      .pipe(map((res) => res.results.map((r: any) => r.formatted as string)));
  }

  filtrar(paramsDto: FiltradoInmuebleDTO) {
    const params: any = {
      latitud: paramsDto.latitud,
      longitud: paramsDto.longitud,
      radio: paramsDto.radio,
    };

    if (paramsDto.minArea != null) {
      params.minArea = paramsDto.minArea;
    }
    if (paramsDto.maxArea != null) {
      params.maxArea = paramsDto.maxArea;
    }
    if (paramsDto.minPrecio != null) {
      params.minPrecio = paramsDto.minPrecio;
    }
    if (paramsDto.maxPrecio != null) {
      params.maxPrecio = paramsDto.maxPrecio;
    }
    if (paramsDto.tipo != null && paramsDto.tipo !== '') {
      params.tipo = paramsDto.tipo;
    }

    console.log('Parámetros enviados:', params);

    return this.http.get<Inmueble[]>(`${this.url}/filtrado`, { params });
  }

  mostrarFavoritos(idUsuario: number) {
    return this.http.get<Inmueble[]>(this.url + '/favoritos', {
      params: {
        idUsuario: idUsuario,
      },
    });
  }

  listarPorUsuario(idUsuario: number) {
    return this.http.get<Inmueble[]>(this.url + '/listarporusuario', {
      params: {
        idUsuario: idUsuario,
      },
    });
  }
}
