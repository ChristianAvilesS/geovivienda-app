import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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
import { SesionUsuarioService } from '../../../services/sesion-usuario.service';

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
  usuarioDuenioId: number = 0;
  imagenesSeleccionadas: File[] = [];
  direccion: string = '';
  map!: maplibregl.Map;
  marker!: maplibregl.Marker;

  imagenesGuardadas: Imagen[] = []; // ← vienen del backend
  imagenPreviewsNuevas: string[] = []; // ← solo para las nuevas

  inmuebleIdEditar!: number;
  edicion: boolean = false;

  inmuebleGuardado: Inmueble = new Inmueble();

  tipos = [
    { value: 'CASA', viewValue: 'Casa' },
    { value: 'DEPARTAMENTO', viewValue: 'Departamento' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private inmuebleService: InmuebleService,
    private inmuebleUsuarioService: InmuebleUsuarioService,
    private imagenService: ImagenesService,
    private sesioService: SesionUsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      area: ['', [Validators.required, Validators.min(0)]],
      direccion: ['', Validators.required],
      latitud: [''],
      longitud: [''],
    });

    this.usuarioDuenioId = this.sesioService.getIdUsuario();

    this.route.params.subscribe((params) => {
      this.inmuebleIdEditar = params['id'];
      this.edicion = params['id'] != null;
    });

    console.log(this.edicion);
    this.init();
  }

  init() {
    if (this.edicion) {
      this.inmuebleService
        .buscarPorId(this.inmuebleIdEditar)
        .subscribe((data) => {
          this.inmuebleGuardado = data;
          this.form.setValue({
            nombre: data.nombre,
            descripcion: data.descripcion,
            tipo: data.tipo,
            precio: data.precioBase,
            area: data.area,
            direccion: data.direccion.direccion,
            latitud: data.direccion.latitud,
            longitud: data.direccion.longitud,
          });

          if (isPlatformBrowser(this.platformId)) {
            const lat = data.direccion.latitud;
            const lng = data.direccion.longitud;

            if (this.map) {
              this.map.setCenter([lng, lat]);
              this.map.setZoom(16); // Zoom más cercano

              if (this.marker) {
                this.marker.setLngLat([lng, lat]);
              } else {
                this.marker = new maplibregl.Marker()
                  .setLngLat([lng, lat])
                  .addTo(this.map);
              }
            }
          }

          this.imagenService
            .listarPorInmueble(data.idInmueble)
            .subscribe((dataImagenes) => {
              this.imagenesGuardadas = dataImagenes;
            });
        });
    }
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
    this.imagenPreviewsNuevas = [];

    this.imagenesSeleccionadas.forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreviewsNuevas.push(e.target.result);
      };
      reader.readAsDataURL(archivo);
    });
  }

  eliminarImagenNueva(index: number): void {
    this.imagenesSeleccionadas.splice(index, 1);
    this.imagenPreviewsNuevas.splice(index, 1);
  }

  eliminarImagenGuardada(idImagen: number): void {
    if (confirm('¿Estás seguro de eliminar esta imagen?')) {
      this.imagenService.eliminarImagen(idImagen).subscribe(() => {
        this.imagenesGuardadas = this.imagenesGuardadas.filter(
          (img) => img.idImagen !== idImagen
        );
        console.log('Imagen eliminada correctamente');
      });
    }
  }

  insertarInmueble(): void {
    if (!this.form.valid) return;

    this.inmueble.idInmueble = this.inmuebleIdEditar;
    this.inmueble.nombre = this.form.value.nombre;
    this.inmueble.descripcion = this.form.value.descripcion;
    this.inmueble.area = this.form.value.area;
    this.inmueble.precioBase = this.form.value.precio;
    this.inmueble.estado = 'DISPONIBLE';
    this.inmueble.tipo = this.form.value.tipo;
    this.inmueble.direccion.direccion = this.form.value.direccion;

    console.log(this.edicion);

    if (this.edicion) {
      this.inmueble.direccion.idDireccion =
        this.inmuebleGuardado.direccion.idDireccion;
      this.inmueble.direccion.latitud = this.inmueble.direccion.latitud =
        this.form.value.latitud;
      this.inmueble.direccion.longitud = this.form.value.longitud;

      this.inmuebleService
        .actualizar(this.inmueble)
        .subscribe((inmuebleData) => {
          this.inmuebleService.listar().subscribe((inmueblesData) => {
            this.inmuebleService.setLista(inmueblesData);

            if (this.imagenesSeleccionadas.length > 0) {
              let imagenesProcesadas = 0;

              this.imagenesSeleccionadas.forEach((archivo, index) => {
                this.imagenService
                  .subirImagen(archivo)
                  .subscribe((res: any) => {
                    const url = res.url;
                    const imagenObj = new Imagen();
                    imagenObj.url = url;
                    imagenObj.titulo = `Imagen N°${index + 1} del inmueble ${
                      inmuebleData.idInmueble
                    }`;
                    imagenObj.inmueble.idInmueble = inmuebleData.idInmueble;

                    this.imagenService
                      .guardarImagen(imagenObj)
                      .subscribe(() => {
                        imagenesProcesadas++;

                        if (
                          imagenesProcesadas ===
                          this.imagenesSeleccionadas.length
                        ) {
                          this.router.navigate(['/inmuebles/listado']);
                        }
                      });
                  });
              });
            } else {
              this.router.navigate(['/inmuebles/listado']);
            }
          });
        });
    } else {
      this.inmuebleService.insertar(this.inmueble).subscribe((inmuebleData) => {
        // Relación usuario - inmueble
        this.inmuebleUsuario.id.idInmueble = inmuebleData.idInmueble;
        this.inmuebleUsuario.id.idUsuario = Number(this.usuarioDuenioId);
        this.inmuebleUsuario.inmueble.idInmueble = inmuebleData.idInmueble;
        this.inmuebleUsuario.usuario.idUsuario = Number(this.usuarioDuenioId);
        this.inmuebleUsuario.esDuenio = true;
        this.inmuebleUsuario.esFavorito = false;
        this.inmuebleUsuario.estadoSolicitud = 'NINGUNO';

        this.inmuebleUsuarioService
          .guardar(this.inmuebleUsuario)
          .subscribe(() => {
            if (this.imagenesSeleccionadas.length > 0) {
              let imagenesProcesadas = 0;

              this.imagenesSeleccionadas.forEach((archivo, index) => {
                this.imagenService.subirImagen(archivo).subscribe({
                  next: (res: any) => {
                    const imagenObj = new Imagen();
                    imagenObj.url = res.url;
                    imagenObj.titulo = `Imagen N°${index + 1} del inmueble ${
                      inmuebleData.idInmueble
                    }`;
                    imagenObj.inmueble.idInmueble = inmuebleData.idInmueble;

                    this.imagenService.guardarImagen(imagenObj).subscribe({
                      next: () => {
                        imagenesProcesadas++;
                        if (
                          imagenesProcesadas ===
                          this.imagenesSeleccionadas.length
                        ) {
                          this.router.navigate(['/inmuebles/listado']);
                        }
                      },
                      error: () => {
                        console.error('Error al guardar imagen en BD');
                        imagenesProcesadas++;
                        if (
                          imagenesProcesadas ===
                          this.imagenesSeleccionadas.length
                        ) {
                          this.router.navigate(['/inmuebles/listado']);
                        }
                      },
                    });
                  },
                  error: () => {
                    console.error('Error al subir imagen');
                    imagenesProcesadas++;
                    if (
                      imagenesProcesadas === this.imagenesSeleccionadas.length
                    ) {
                      this.router.navigate(['/inmuebles/listado']);
                    }
                  },
                });
              });
            } else {
              this.router.navigate(['/inmuebles/listado']);
            }
          });
      });
    }
  }
}
