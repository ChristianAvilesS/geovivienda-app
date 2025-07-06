import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InmuebleService } from '../../../../services/inmueble.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-buscar-inmueble',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './buscar-inmueble.component.html',
  styleUrl: './buscar-inmueble.component.css',
})
export class BuscarInmuebleComponent {
  direccionControl = new FormControl<string>('');
  direccionesFiltradas$: Observable<string[]> = of([]);

  constructor(private iS: InmuebleService) {}

  buscarDirecciones() {
    const texto = this.direccionControl.value;
    if (!texto || texto.length < 3) {
      this.direccionesFiltradas$ = of([]);
      return;
    }

    this.direccionesFiltradas$ = this.iS.autocompletadoDirecciones(texto);
  }

  buscarPorDireccion() {
    const direccion = this.direccionControl.value;

    if (direccion) {
      this.iS.obtenerCercaDireccion(direccion, 0.05).subscribe((data) => {
        this.iS.setLista(data);
      });
    }
  }
}
