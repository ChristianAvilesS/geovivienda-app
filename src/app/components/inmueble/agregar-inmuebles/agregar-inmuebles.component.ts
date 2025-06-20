import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';

// Servicios y modelos
import { InmuebleService } from '../../../services/inmueble.service';
import { InmuebleUsuarioService } from '../../../services/inmueble-usuario.service';
import { ImagenesService } from '../../../services/imagenes.service';
import { Inmueble } from '../../../models/inmueble';
import { InmuebleUsuario } from '../../../models/inmueble-usuario';
import { Imagen } from '../../../models/imagen';

// MapLibre
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-agregar-inmuebles',
  templateUrl: './agregar-inmuebles.component.html',
  styleUrl: './agregar-inmuebles.component.css',
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class AgregarInmueblesComponent implements OnInit, AfterViewInit {
  form: FormGroup = new FormGroup({});
  inmueble: Inmueble = new Inmueble();
  inmuebleUsuario: InmuebleUsuario = new InmuebleUsuario();
  imagenesSeleccionadas: File[] = [];
  direccion: string = '';
  map!: maplibregl.Map;
  marker!: maplibregl.Marker;

  tipos = [
    { value: 'CASA', viewValue: 'Casa' },
    { value: 'DEPARTAMENTO', viewValue: 'Departamento' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private inmuebleService: InmuebleService,
    private inmuebleUsuarioService: InmuebleUsuarioService,
    private imagenService: ImagenesService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', Validators.required],
      area: ['', Validators.required],
      direccion: ['', Validators.required],
      latitud: [''],
      longitud: [''],
      usuarioDuenio: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.map = new maplibregl.Map({
      container: 'mapa',
      style:
        'https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=a638798ea1c142ef85837a2036970f91',
      center: [-77.0428, -12.0464], // Lima
      zoom: 12,
    });

    this.map.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      if (this.marker) {
        this.marker.setLngLat([lng, lat]);
      } else {
        this.marker = new maplibregl.Marker()
          .setLngLat([lng, lat])
          .addTo(this.map);
      }

      this.form.patchValue({ latitud: lat, longitud: lng });
      this.obtenerDireccion(lat, lng);
    });
  }

  obtenerDireccion(lat: number, lon: number): void {
    const apiKey = 'a638798ea1c142ef85837a2036970f91';
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.features?.length > 0) {
          const direccion = data.features[0].properties.formatted;
          this.form.patchValue({ direccion, latitud: lat, longitud: lon });
        }
      });
  }

  onFilesSelected(event: any): void {
    this.imagenesSeleccionadas = Array.from(event.target.files);
  }

  insertarInmueble(): void {
    if (!this.form.valid) return;

    this.inmueble.nombre = this.form.value.nombre;
    this.inmueble.descripcion = this.form.value.descripcion;
    this.inmueble.area = this.form.value.area;
    this.inmueble.precioBase = this.form.value.precio;
    this.inmueble.estado = 'Disponible';
    this.inmueble.tipo = this.form.value.tipo;
    this.inmueble.direccion.direccion = this.form.value.direccion;

    this.inmuebleService.insertar(this.inmueble).subscribe((inmuebleData) => {
      // Asignar relación usuario-inmueble
      this.inmuebleUsuario.id.idInmueble = inmuebleData.idInmueble;
      this.inmuebleUsuario.id.idUsuario = Number(this.form.value.usuarioDuenio);
      this.inmuebleUsuario.inmueble.idInmueble = inmuebleData.idInmueble;
      this.inmuebleUsuario.usuario.idUsuario = Number(
        this.form.value.usuarioDuenio
      );
      this.inmuebleUsuario.esDuenio = true;
      this.inmuebleUsuario.esFavorito = false;
      this.inmuebleUsuario.estadoSolicitud = 'NINGUNO';
      this.inmuebleUsuarioService
        .guardar(this.inmuebleUsuario)
        .subscribe(() => {
          if (this.imagenesSeleccionadas.length > 0) {
            console.log(this.imagenesSeleccionadas);
            this.imagenesSeleccionadas.forEach((archivo, index) => {
              this.imagenService.subirImagen(archivo).subscribe((res: any) => {
                const url = res.url;
                const imagenObj = new Imagen();
                imagenObj.url = url;
                imagenObj.titulo = `Imagen N°${index + 1} del inmueble ${
                  inmuebleData.idInmueble
                }`;
                imagenObj.inmueble.idInmueble = inmuebleData.idInmueble;

                this.imagenService.guardarImagen(imagenObj).subscribe(() => {
                  console.log('Imagen guardada correctamente');
                });
              });
            });
          }

          this.router.navigate(['/inmuebles/listado']);
        });
    });
  }
}
