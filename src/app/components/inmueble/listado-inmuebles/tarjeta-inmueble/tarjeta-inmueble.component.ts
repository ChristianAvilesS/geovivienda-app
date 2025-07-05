import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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

@Component({
  selector: 'app-tarjeta-inmueble',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './tarjeta-inmueble.component.html',
  styleUrl: './tarjeta-inmueble.component.css',
})
export class TarjetaInmuebleComponent {
  imagenes: Imagen[] = [];
  inmuebleUsuario: InmuebleUsuario = new InmuebleUsuario();

  private _inmueble!: Inmueble;

  readonly dialog = inject(MatDialog);
  private sesionService = inject(SesionUsuarioService);
  private inmuebleusuarioService = inject(InmuebleUsuarioService);

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

  constructor(private imagenService: ImagenesService) {}
}
