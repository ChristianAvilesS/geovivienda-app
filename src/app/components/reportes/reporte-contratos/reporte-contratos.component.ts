import { ReportesService } from '../../../services/reportes.service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-reporte-contratos',
  imports: [
    BaseChartDirective,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reporte-contratos.component.html',
  styleUrl: './reporte-contratos.component.css',
})
export class ReporteContratosComponent implements OnInit {
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { stacked: false },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Cantidad de Inmuebles' },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cantidad de Inmuebles por Tipo de Contrato y Mes',
      },
    },
  };
  chartLabels: string[] = [];
  chartType: ChartType = 'bar';
  chartLegend: boolean = true;
  chartData: ChartDataset[] = [];
  form: FormGroup = new FormGroup({});
  visible: boolean = false;

  constructor(private rS: ReportesService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      anio: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.min(2000),
        ],
      ],
    });
  }

  aceptar() {
    this.visible = false;
    if (this.form.valid) {
      this.rS
        .reporteCantidadInmueblesPorTipoContratoPorMesEnAnio(
          this.form.value.anio
        )
        .subscribe((data) => {
          this.visible = true;
          this.chartLabels = data.map((item) => item.mes);
          this.chartData = [
            {
              data: data.map((item) => item.cantidadCompra),
              label: 'Compra',
              backgroundColor: '#0a663a',
              borderColor: 'black',
              borderWidth: 2,
            },
            {
              data: data.map((item) => item.cantidadAlquiler),
              label: 'Alquiler',
              backgroundColor: '#f0ea5f',
              borderColor: 'black',
              borderWidth: 2,
            },
          ];
        });
    }
  }
}
