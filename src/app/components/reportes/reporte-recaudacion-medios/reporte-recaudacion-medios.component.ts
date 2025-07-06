import { ReportesService } from '../../../services/reportes.service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-recaudacion-medios',
  imports: [BaseChartDirective],
  templateUrl: './reporte-recaudacion-medios.component.html',
  styleUrl: './reporte-recaudacion-medios.component.css',
})
export class ReporteRecaudacionMediosComponent implements OnInit {
  chartOptions: ChartOptions = {
    responsive: true,
  };
  chartLabels: string[] = [];
  chartType: ChartType = 'doughnut';
  chartLegend: boolean = true;
  chartData: ChartDataset[] = [];

  constructor(private rS: ReportesService) {}

  ngOnInit(): void {
    this.rS.reporteDineroRecaudadoPorTipoPago().subscribe((data) => {
      this.chartLabels = data.map((item) => item.medioPago);
      this.chartData = [
        {
          data: data.map((item) => item.importe),
          label: 'Dinero recaudado',
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
