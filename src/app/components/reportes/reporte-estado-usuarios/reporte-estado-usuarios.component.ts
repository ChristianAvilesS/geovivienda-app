import { ReportesService } from '../../../services/reportes.service';
import {
  ChartDataset,
  ChartOptions,
  ChartType,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-estado-usuarios',
  imports: [BaseChartDirective],
  templateUrl: './reporte-estado-usuarios.component.html',
  styleUrl: './reporte-estado-usuarios.component.css',
})
export class ReporteEstadoUsuariosComponent implements OnInit {
  chartOptions: ChartOptions = {
    responsive: true,
  };
  chartLabels: string[] = [];
  chartType: ChartType = 'pie';
  chartLegend: boolean = true;
  chartData: ChartDataset[] = [];

  constructor(private rS: ReportesService) {}

  ngOnInit(): void {
    this.rS.reporteEstadoUsuarios().subscribe((data) => {
      this.chartLabels = data.map((item) => item.estadoUsuario);
      this.chartData = [
        {
          data: data.map((item) => item.cantidad),
          label: 'Estado del usuario',
          backgroundColor: [
            '#0a663a', // Verde base
            '#f0ea5f', // Amarillo complementario (tu otro color base)
            '#aed581', // Verde lima claro para degradado
            '#004d40', // Verde pino profundo para énfasis
          ],
          borderColor: 'black',
          borderWidth: 2,
        },
      ];
    });
  }
}
