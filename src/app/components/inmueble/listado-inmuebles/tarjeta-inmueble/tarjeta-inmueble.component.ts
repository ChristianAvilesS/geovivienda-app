import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Inmueble } from '../../../../models/inmueble';
import { ImagenesService } from '../../../../services/imagenes.service';
import { Imagen } from '../../../../models/imagen';
import { MatDialog } from '@angular/material/dialog';
import { InformacionInmuebleComponent } from './informacion-inmueble/informacion-inmueble.component';

@Component({
  selector: 'app-tarjeta-inmueble',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './tarjeta-inmueble.component.html',
  styleUrl: './tarjeta-inmueble.component.css',
})
export class TarjetaInmuebleComponent {
  imagenes: Imagen[] = [];

  private _inmueble!: Inmueble;

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(InformacionInmuebleComponent, {
      data: this.inmueble,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
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
