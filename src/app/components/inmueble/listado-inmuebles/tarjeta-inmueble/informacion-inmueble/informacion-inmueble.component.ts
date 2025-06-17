import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import maplibregl, { Map } from 'maplibre-gl';
import { InmuebleService } from '../../../../../services/inmueble.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inmueble } from '../../../../../models/inmueble';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-informacion-inmueble',
  imports: [MatDialogModule, MatListModule],
  templateUrl: './informacion-inmueble.component.html',
  styleUrl: './informacion-inmueble.component.css',
})
export class InformacionInmuebleComponent {
  private map!: Map;

  constructor(
    inmuebleService: InmuebleService,
    @Inject(MAT_DIALOG_DATA) public inmueble: Inmueble
  ) {}

  ngAfterViewInit(): void {
    this.map = new maplibregl.Map({
      container: 'my-map',
      style:
        'https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=a638798ea1c142ef85837a2036970f91',
      center: [
        this.inmueble.direccion.longitud,
        this.inmueble.direccion.latitud,
      ],
      zoom: 16,
    });

    this.map.addControl(new maplibregl.NavigationControl());

    const marker = new maplibregl.Marker({ color: 'red' })
      .setLngLat([
        this.inmueble.direccion.longitud,
        this.inmueble.direccion.latitud,
      ])
      .setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(`
        <p>${this.inmueble.direccion.direccion}</p>
      `)
      )
      .addTo(this.map);

    // Opcional: abrir el popup automáticamente
    marker.togglePopup();

    // Recalcular tamaño después de que el modal se abra
    setTimeout(() => this.map.resize(), 300);
  }
}
