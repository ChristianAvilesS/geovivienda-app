import { Component } from '@angular/core';
import { ReporteContratosComponent } from './reporte-contratos/reporte-contratos.component';
import { ReporteEstadoUsuariosComponent } from './reporte-estado-usuarios/reporte-estado-usuarios.component';
import { ReportePorcentajeTiposComponent } from './reporte-porcentaje-tipos/reporte-porcentaje-tipos.component';
import { ReporteRecaudacionMediosComponent } from './reporte-recaudacion-medios/reporte-recaudacion-medios.component';

@Component({
  selector: 'app-reportes',
  imports: [
    ReporteEstadoUsuariosComponent,
    ReportePorcentajeTiposComponent,
    ReporteContratosComponent,
    ReporteRecaudacionMediosComponent,
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent {}
