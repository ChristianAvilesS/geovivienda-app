import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import maplibregl, { Map } from 'maplibre-gl';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inmueble } from '../../../../../models/inmueble';
import { MatListModule } from '@angular/material/list';
import { InmuebleUsuarioService } from '../../../../../services/inmueble-usuario.service';
import { InmuebleUsuario } from '../../../../../models/inmueble-usuario';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { InmuebleService } from '../../../../../services/inmueble.service';
import { CommonModule } from '@angular/common';
import { SesionUsuarioService } from '../../../../../services/sesion-usuario.service';
import { environment } from '../../../../../environments/environments';

const apiKeyMaps = environment.apiKeyMaps;

@Component({
  selector: 'app-informacion-inmueble',
  imports: [
    MatDialogModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './informacion-inmueble.component.html',
  styleUrl: './informacion-inmueble.component.css',
})
export class InformacionInmuebleComponent {
  private map!: Map;
  inmuebleUsuario: InmuebleUsuario = new InmuebleUsuario();

  esDuenio: boolean = false;

  constructor(
    private inmuebleService: InmuebleService,
    private inmuebleUsuarioService: InmuebleUsuarioService,
    private sesionService: SesionUsuarioService,
    @Inject(MAT_DIALOG_DATA) public inmueble: Inmueble
  ) {}

  ngOnInit() {
    this.inmuebleUsuarioService
      .buscarDuenioPorInmueble(this.inmueble.idInmueble)
      .subscribe((data) => {
        this.inmuebleUsuario = data;
        console.log(this.inmuebleUsuario.usuario);
      });

    this.inmuebleUsuarioService
      .buscarDuenioPorInmueble(this.inmueble.idInmueble)
      .subscribe((data) => {
        if (this.sesionService.getIdUsuario() == data.usuario.idUsuario) {
          this.esDuenio = data.esDuenio;
        }
      });
  }

  ngAfterViewInit(): void {
    this.map = new maplibregl.Map({
      container: 'my-map',
      style:
        'https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=' +
        apiKeyMaps,
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

  eliminar(id: number) {
    this.inmuebleService.eliminar(id).subscribe(() => {
      this.inmuebleService.listar().subscribe((data) => {
        this.inmuebleService.setLista(data);
      });
    });
  }
}
