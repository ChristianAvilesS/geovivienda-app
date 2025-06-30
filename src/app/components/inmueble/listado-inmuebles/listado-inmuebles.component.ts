import { Component } from '@angular/core';
import { InmuebleService } from '../../../services/inmueble.service';
import { TarjetaInmuebleComponent } from './tarjeta-inmueble/tarjeta-inmueble.component';
import { Inmueble } from '../../../models/inmueble';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-listado-inmuebles',
  standalone: true,
  imports: [TarjetaInmuebleComponent, CommonModule, MatPaginatorModule],
  templateUrl: './listado-inmuebles.component.html',
  styleUrl: './listado-inmuebles.component.css',
})
export class ListadoInmueblesComponent {
  inmueblesOriginales: Inmueble[] = [];
  inmuebles: Inmueble[] = [];

  pageSize = 8;
  pageIndex = 0;

  constructor(private iS: InmuebleService) {}

  ngOnInit() {
    this.iS.listar().subscribe((data) => {
      this.inmueblesOriginales = data;
      this.actualizarInmuebles();
    });

    this.iS.getLista().subscribe((data) => {
      this.inmueblesOriginales = data;
      this.actualizarInmuebles();
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarInmuebles();
  }

  actualizarInmuebles() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.inmuebles = this.inmueblesOriginales.slice(startIndex, endIndex);
  }
}
