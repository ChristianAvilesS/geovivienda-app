import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Inmueble } from '../../../../models/inmueble';

@Component({
  selector: 'app-tarjeta-inmueble',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './tarjeta-inmueble.component.html',
  styleUrl: './tarjeta-inmueble.component.css',
})
export class TarjetaInmuebleComponent {
  @Input() inmueble!: Inmueble;
}
