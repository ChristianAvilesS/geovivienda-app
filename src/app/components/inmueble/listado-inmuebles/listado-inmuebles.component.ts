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
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FiltradoInmueblesComponent } from './filtrado-inmuebles/filtrado-inmuebles.component';
import { BuscarInmuebleComponent } from './buscar-inmueble/buscar-inmueble.component';
import { SesionUsuarioService } from '../../../services/sesion-usuario.service';

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
  styleUrls: [
    './listado-inmuebles.component.css',
    './listado-inmuebles.component.scss',
  ],
})
export class ListadoInmueblesComponent {
  solicituRealizada: boolean = false;
  inmueblesOriginales: Inmueble[] = [];
  inmuebles: Inmueble[] = [];

  estaLogeado: boolean = false;

  roles: any = [];
  esVendedor: boolean = false;

  pageSize = 3;
  pageIndex = 0;

  constructor(
    private iS: InmuebleService,
    private sessionService: SesionUsuarioService
  ) {}

  readonly dialog = inject(MatDialog);

  openDialogFiltro() {
    const dialogRef = this.dialog.open(FiltradoInmueblesComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogBuscar() {
    const dialogRef = this.dialog.open(BuscarInmuebleComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.iS.listar().subscribe((data) => {
      this.inmueblesOriginales = data;
      this.actualizarInmuebles();
      this.solicituRealizada = true;
    });

    this.iS.getLista().subscribe((data) => {
      this.inmueblesOriginales = data;
      this.actualizarInmuebles();
      this.solicituRealizada = true;
    });

    this.roles = this.sessionService.getRoles();

    this.estaLogeado = this.sessionService.estaLogeado();

    this.esVendedor = this.roles?.includes('VENDEDOR') ?? false;
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

  mostrarFavoritos() {
    this.iS
      .mostrarFavoritos(this.sessionService.getIdUsuario())
      .subscribe((data) => {
        this.iS.setLista(data);
      });
  }

  listarPorUsuario() {
    this.iS
      .listarPorUsuario(this.sessionService.getIdUsuario())
      .subscribe((data) => {
        this.iS.setLista(data);
      });
  }
}
