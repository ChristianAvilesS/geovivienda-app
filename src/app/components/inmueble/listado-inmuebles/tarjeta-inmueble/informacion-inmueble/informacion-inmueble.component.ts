import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import maplibregl, { Map } from 'maplibre-gl';
import { InmuebleService } from '../../../../../services/inmueble.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inmueble } from '../../../../../models/inmueble';
import { MatListModule } from '@angular/material/list';
import { InmuebleUsuarioService } from '../../../../../services/inmueble-usuario.service';
import { InmuebleUsuario } from '../../../../../models/inmueble-usuario';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-informacion-inmueble',
  imports: [MatDialogModule, MatListModule, MatIconModule],
  templateUrl: './informacion-inmueble.component.html',
  styleUrl: './informacion-inmueble.component.css',
})
export class InformacionInmuebleComponent {
  private map!: Map;
  inmuebleUsuario: InmuebleUsuario = new InmuebleUsuario();

  constructor(
    private inmuebleUsuarioService: InmuebleUsuarioService,
    @Inject(MAT_DIALOG_DATA) public inmueble: Inmueble
  ) {}

  ngOnInit() {
    this.inmuebleUsuarioService
      .buscarDuenioPorInmueble(this.inmueble.idInmueble)
      .subscribe((data) => {
        this.inmuebleUsuario = data;
        console.log(this.inmuebleUsuario.usuario);
      });
  }

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

    setTimeout(() => this.map.resize(), 300);
  }
}
