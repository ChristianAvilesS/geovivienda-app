import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteEstadoUsuarios } from '../models/dtos/reporte-estado-usuarios';
import { ReportePorcentajeTipos } from '../models/dtos/reporte-porcentaje-tipos';
import { ReporteRecaudacionMedios } from '../models/dtos/reporte-recaudacion-medios';
import { ReporteContratos } from '../models/dtos/reporte-contratos';
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private url = `${base_url}/reportes`;

  constructor(private http: HttpClient) {}

  reporteEstadoUsuarios(): Observable<ReporteEstadoUsuarios[]> {
    return this.http.get<ReporteEstadoUsuarios[]>(
      `${this.url}/reporte-estado-usuarios`
    );
  }

  reportePorcentajeDeUsuariosPorTipo(): Observable<ReportePorcentajeTipos[]> {
    return this.http.get<ReportePorcentajeTipos[]>(
      `${this.url}/reporte-porcentaje-tipos`
    );
  }

  reporteCantidadInmueblesPorTipoContratoPorMesEnAnio(
    anio: string
  ): Observable<ReporteContratos[]> {
    const params = new HttpParams().set('anio', `${anio}`);
    return this.http.get<ReporteContratos[]>(`${this.url}/reporte-contratos`, {
      params,
    });
  }

  reporteDineroRecaudadoPorTipoPago(): Observable<ReporteRecaudacionMedios[]> {
    return this.http.get<ReporteRecaudacionMedios[]>(
      `${this.url}/reporte-recaudacion-medios`
    );
  }
}
