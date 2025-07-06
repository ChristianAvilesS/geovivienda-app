import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InmuebleService } from '../../../../services/inmueble.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FiltradoInmuebleDTO } from '../../../../models/dtos/filtrado-inmuebles-dto';

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
    MatButtonModule,
  ],
  templateUrl: './filtrado-inmuebles.component.html',
  styleUrl: './filtrado-inmuebles.component.css',
})
export class FiltradoInmueblesComponent implements OnInit {
  formFiltro: FormGroup = new FormGroup({});

  paramsDto: FiltradoInmuebleDTO = new FiltradoInmuebleDTO();
  lat: number = -12.0464;
  long: number = -77.0428;

  tipos = [
    { viewValue: 'Casa', value: 'casa' },
    { viewValue: 'Departamento', value: 'departamento' },
  ];

  formatLabel(value: number): string {
    if (value >= 1000 && value < 1000000) {
      return Math.round(value / 1000) + 'k';
    } else if (value >= 1000000) {
      return Math.round(value / 100000) / 10 + 'M';
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

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
      }
    );
  }

  filtrar() {
    this.paramsDto.minArea = this.formFiltro.value.minArea;
    this.paramsDto.maxArea = this.formFiltro.value.maxArea;
    this.paramsDto.minPrecio = this.formFiltro.value.minPrecio;
    this.paramsDto.maxPrecio = this.formFiltro.value.maxPrecio;
    this.paramsDto.tipo = this.formFiltro.value.tipo;
    this.paramsDto.latitud = this.lat;
    this.paramsDto.longitud = this.long;
    this.paramsDto.radio = 0.5; // radio en grados (~55 km)

    console.log(this.paramsDto);

    this.inmuebleService.filtrar(this.paramsDto).subscribe((data) => {
      this.inmuebleService.setLista(data);
    });
  }
}
