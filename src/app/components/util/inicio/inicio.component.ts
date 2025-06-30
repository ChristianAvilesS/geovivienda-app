import {
  Component,
  Inject,
  AfterViewInit,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as maplibregl from 'maplibre-gl';
import { environment } from '../../../environments/environments';
import { InmuebleService } from '../../../services/inmueble.service';
import { Inmueble } from '../../../models/inmueble';
import { SesionUsuarioService } from '../../../services/sesion-usuario.service';

const apiKey = environment.apiKeyMaps;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  standalone: true,
})
export class InicioComponent implements OnInit {
  long: number = -77.0428; // por defecto Lima
  lat: number = -12.0464;
  map!: maplibregl.Map;

  logeado: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private inmuebleService: InmuebleService,
    private sesionService: SesionUsuarioService
  ) {}

  ngOnInit() {
    this.logeado = this.sesionService.estaLogeado();

    if (!isPlatformBrowser(this.platformId)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.initMap(this.long, this.lat);
        this.cargarInmueblesCercanos();
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
        this.initMap(this.long, this.lat); // Centro en Lima si falla
        this.cargarInmueblesCercanos();
      }
    );
  }

  initMap(lng: number, lat: number) {
    this.map = new maplibregl.Map({
      container: 'my-map',
      style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${apiKey}`,
      center: [lng, lat],
      zoom: 13,
    });

    this.map.addControl(new maplibregl.NavigationControl());

    new maplibregl.Marker({ color: 'blue' })
      .setLngLat([lng, lat])
      .setPopup(new maplibregl.Popup().setHTML('<b>Estás aquí</b>'))
      .addTo(this.map);

    setTimeout(() => this.map.resize(), 300);
  }

  cargarInmueblesCercanos() {
    this.inmuebleService
      .obtenerCercaUsuario(this.long, this.lat)
      .subscribe((data: Inmueble[]) => {
        console.log(data);
        data.forEach((inmueble) => {
          const lat = inmueble.direccion.latitud;
          const lon = inmueble.direccion.longitud;

          console.log('Inmuebles cercanos:', inmueble);

          const popupHtml = `
            <b>${inmueble.nombre}</b><br/>
            ${inmueble.direccion.direccion}<br/>
            <small>${inmueble.tipo} - S/ ${inmueble.precioBase}</small><br/>           
          `;

          new maplibregl.Marker({ color: 'red' })
            .setLngLat([lon, lat])
            .setPopup(new maplibregl.Popup().setHTML(popupHtml))
            .addTo(this.map);
        });
      });
  }
}
