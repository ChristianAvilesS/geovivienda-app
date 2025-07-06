import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Inmueble } from '../../../../models/inmueble';
import { ImagenesService } from '../../../../services/imagenes.service';
import { Imagen } from '../../../../models/imagen';
import { MatDialog } from '@angular/material/dialog';
import { InformacionInmuebleComponent } from './informacion-inmueble/informacion-inmueble.component';
import { SesionUsuarioService } from '../../../../services/sesion-usuario.service';
import { InmuebleUsuarioService } from '../../../../services/inmueble-usuario.service';
import { ContratoInmueblesComponent } from '../../contrato-inmuebles/contrato-inmuebles.component';
import { InmuebleUsuario } from '../../../../models/inmueble-usuario';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tarjeta-inmueble',
  imports: [MatCardModule, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './tarjeta-inmueble.component.html',
  styleUrl: './tarjeta-inmueble.component.css',
})
export class TarjetaInmuebleComponent implements OnInit {
  imagenes: Imagen[] = [];
  inmuebleUsuario: InmuebleUsuario = new InmuebleUsuario();
  inmuebleUsuarioInit: InmuebleUsuario = new InmuebleUsuario();

  esFavorito: boolean = false;
  estaLogeado: boolean = false;

  private _inmueble!: Inmueble;

  readonly dialog = inject(MatDialog);

  constructor(
    private imagenService: ImagenesService,
    private sesionService: SesionUsuarioService,
    private inmuebleusuarioService: InmuebleUsuarioService
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(InformacionInmuebleComponent, {
      data: this.inmueble,
    });

    dialogRef.afterClosed().subscribe((modalidadElegida) => {
      console.log(`Dialog result: ${modalidadElegida}`);

      if (modalidadElegida === 'alquiler' || modalidadElegida === 'venta') {
        console.log('Usuario quiere ' + modalidadElegida);

        this.sesionService.getUsuarioActual().subscribe((comprador) => {
          this.inmuebleusuarioService
            .buscarDuenioPorInmueble(this.inmueble.idInmueble)
            .subscribe((data) => {
              this.inmuebleUsuario = data;
              const vendedor = this.inmuebleUsuario.usuario;

              this.dialog.open(ContratoInmueblesComponent, {
                data: {
                  inmueble: this.inmueble,
                  comprador,
                  vendedor,
                  fechaFirma: new Date(),
                  fechaVencimiento: this.calcularVencimiento(modalidadElegida),
                },
                width: '800px',
              });
            });
        });
      }
    });
  }

  calcularVencimiento(modalidad: string): Date {
    const fecha = new Date();
    if (modalidad === 'alquiler') {
      fecha.setMonth(fecha.getMonth() + 6); // 6 meses
    } else {
      fecha.setFullYear(fecha.getFullYear() + 1); // 1 año para venta
    }
    return fecha;
  }

  @Input() set inmueble(value: Inmueble) {
    if (value && value.idInmueble) {
      this._inmueble = value;
      this.imagenService.listarPorInmueble(value.idInmueble).subscribe({
        next: (data) => {
          this.imagenes = data;
          console.log('Imágenes:', data);
        },
      });
    }
  }

  get inmueble(): Inmueble {
    return this._inmueble;
  }

  customOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: true,
    nav: true,
    navText: ['◀', '▶'],
    items: 1,
    margin: 10,
  };

  marcarDesmarcarFavorito() {
    this.inmuebleusuarioService
      .marcarDesmarcarFavorito(
        this.inmueble.idInmueble,
        this.sesionService.getIdUsuario()
      )
      .subscribe((data) => {
        this.esFavorito = data.esFavorito;
        this.inmuebleusuarioService.setObj(data);
      });
  }

  ngOnInit(): void {
    this.inmuebleusuarioService
      .obtenerPorIds(
        this.inmueble.idInmueble,
        this.sesionService.getIdUsuario()
      )
      .subscribe((data) => {
        this.inmuebleUsuarioInit = data;

        console.log(this.inmuebleUsuarioInit);
        if (
          this.inmuebleUsuarioInit.usuario.idUsuario ===
            this.sesionService.getIdUsuario() &&
          this.inmuebleUsuarioInit.esFavorito
        ) {
          this.esFavorito = true;
        }
        console.log(this.esFavorito);
      });

    this.estaLogeado = this.sesionService.estaLogeado();
  }
}
