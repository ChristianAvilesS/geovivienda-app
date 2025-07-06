import { ReportesService } from '../../../services/reportes.service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-porcentaje-tipos',
  imports: [BaseChartDirective],
  templateUrl: './reporte-porcentaje-tipos.component.html',
  styleUrl: './reporte-porcentaje-tipos.component.css',
})
export class ReportePorcentajeTiposComponent implements OnInit {
  chartOptions: ChartOptions = {
    responsive: true,
  };
  chartLabels: string[] = [];
  chartType: ChartType = 'pie';
  chartLegend: boolean = true;
  chartData: ChartDataset[] = [];

  constructor(private rS: ReportesService) {}

  ngOnInit(): void {
    this.rS.reportePorcentajeDeUsuariosPorTipo().subscribe((data) => {
      this.chartLabels = data.map((item) => item.tipoUsuario);
      this.chartData = [
        {
          data: data.map((item) => item.porcentaje),
          label: 'Porcentaje',
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
