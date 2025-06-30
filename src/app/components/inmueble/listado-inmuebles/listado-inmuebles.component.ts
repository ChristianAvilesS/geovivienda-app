import { Component, inject } from '@angular/core';
import { InmuebleService } from '../../../services/inmueble.service';
import { TarjetaInmuebleComponent } from './tarjeta-inmueble/tarjeta-inmueble.component';
import { Inmueble } from '../../../models/inmueble';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FiltradoInmueblesComponent } from './filtrado-inmuebles/filtrado-inmuebles.component';

@Component({
  selector: 'app-listado-inmuebles',
  standalone: true,
  imports: [
    TarjetaInmuebleComponent,
    CommonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './listado-inmuebles.component.html',
  styleUrl: './listado-inmuebles.component.css',
})
export class ListadoInmueblesComponent {
  inmueblesOriginales: Inmueble[] = [];
  inmuebles: Inmueble[] = [];

  direccionControl = new FormControl('');
  direccionesFiltradas$: Observable<string[]> = of([]);

  pageSize = 8;
  pageIndex = 0;

  constructor(private iS: InmuebleService) {}

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(FiltradoInmueblesComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.iS.listar().subscribe((data) => {
      this.inmueblesOriginales = data;
      this.actualizarInmuebles();
    });

    this.iS.getLista().subscribe((data) => {
      this.inmueblesOriginales = data;
      this.actualizarInmuebles();
    });

    this.direccionesFiltradas$ = this.direccionControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((valor) => {
        if (!valor || valor.length < 3) return of([]);
        return this.iS.autocompletadoDirecciones(valor);
      })
    );

    this.direccionControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((direccion) => {
        if (typeof direccion === 'string' && direccion.length > 5) {
          this.buscarPorDireccion();
        } else {
          this.iS.listar().subscribe((data) => {
            this.inmueblesOriginales = data;
            this.actualizarInmuebles();
          });

          this.iS.getLista().subscribe((data) => {
            this.inmueblesOriginales = data;
            this.actualizarInmuebles();
          });
        }
      });
  }

  buscarPorDireccion() {
    const direccion = this.direccionControl.value;
    if (!direccion || direccion.length < 3) return;

    this.iS.obtenerCercaDireccion(direccion, 0.02).subscribe((data) => {
      this.inmueblesOriginales = data;
      this.pageIndex = 0;
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
