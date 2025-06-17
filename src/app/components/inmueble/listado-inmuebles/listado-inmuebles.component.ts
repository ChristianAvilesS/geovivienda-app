import { Component } from '@angular/core';
import { InmuebleService } from '../../../services/inmueble.service';
import { TarjetaInmuebleComponent } from './tarjeta-inmueble/tarjeta-inmueble.component';
import { Inmueble } from '../../../models/inmueble';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listado-inmuebles',
  imports: [TarjetaInmuebleComponent, CommonModule],
  templateUrl: './listado-inmuebles.component.html',
  styleUrl: './listado-inmuebles.component.css',
})
export class ListadoInmueblesComponent {
  inmuebles: Inmueble[] = [];

  constructor(private iS: InmuebleService) {}

  ngOnInit() {
    this.iS.listar().subscribe((data) => {
      this.inmuebles = data;
    });
  }
}
