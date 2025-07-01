import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InmuebleService } from '../../../../services/inmueble.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtrado-inmuebles',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './filtrado-inmuebles.component.html',
  styleUrl: './filtrado-inmuebles.component.css',
})
export class FiltradoInmueblesComponent implements OnInit {
  formFiltro: FormGroup = new FormGroup({});

  tipos = [
    { viewValue: 'Casa', value: 'casa' },
    { viewValue: 'Departamento', value: 'departamento' },
  ];

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  constructor(
    private inmuebleService: InmuebleService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formFiltro = this.formBuilder.group({
      minArea: [100],
      maxArea: [300],
      minPrecio: [100000],
      maxPrecio: [300000],
      tipo: [''],
    });
  }
}
