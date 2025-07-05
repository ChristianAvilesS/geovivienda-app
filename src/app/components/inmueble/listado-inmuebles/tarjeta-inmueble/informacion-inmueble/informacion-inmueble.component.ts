import { ValoracionService } from './../../../../../services/valoracion.service';
import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import maplibregl, { Map } from 'maplibre-gl';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inmueble } from '../../../../../models/inmueble';
import { MatListModule } from '@angular/material/list';
import { InmuebleUsuarioService } from '../../../../../services/inmueble-usuario.service';
import { InmuebleUsuario } from '../../../../../models/inmueble-usuario';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { InmuebleService } from '../../../../../services/inmueble.service';
import { CommonModule } from '@angular/common';
import { SesionUsuarioService } from '../../../../../services/sesion-usuario.service';
import { environment } from '../../../../../environments/environments';
import { Valoracion } from '../../../../../models/valoracion';
import { MatCardModule } from '@angular/material/card';
import { ValoracionPromedio } from '../../../../../models/dtos/valoracion-promedio-dto';

const apiKeyMaps = environment.apiKeyMaps;

@Component({
  selector: 'app-informacion-inmueble',
  imports: [
    MatDialogModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    CommonModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './informacion-inmueble.component.html',
  styleUrl: './informacion-inmueble.component.css',
})
export class InformacionInmuebleComponent {
  private map!: Map;
  inmuebleUsuario: InmuebleUsuario = new InmuebleUsuario();

  esDuenio: boolean = false;

  valoracionSeleccionada: number = 0;
  valoracionGuardada: boolean = false;
  estrellas: number[] = [1, 2, 3, 4, 5];
  promedioValoracion: number = 0;
  totalValoraciones: number = 0;
  valoraciones: Valoracion[] = [];
  valoracionesMostradas: Valoracion[] = [];
  valoracionesPorPagina = 3;

  usuarioYaValoro: boolean = false;
  valoracionUsuario: Valoracion | null = null;

  constructor(
    private inmuebleService: InmuebleService,
    private inmuebleUsuarioService: InmuebleUsuarioService,
    private sesionService: SesionUsuarioService,
    private valoracionService: ValoracionService,
    private sesioService: SesionUsuarioService,

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
        this.inmuebleUsuario = data;
        if (this.sesionService.getIdUsuario() == data.usuario.idUsuario) {
          this.esDuenio = data.esDuenio;
        }
      });

    this.valoracionService
      .obtenerListaValoracionPromedio()
      .subscribe((data: ValoracionPromedio[]) => {
        const valoracion = data.find(
          (v) => v.nombreInmueble === this.inmueble.nombre
        );
        if (valoracion) {
          this.promedioValoracion = Math.round(valoracion.valoracion * 10) / 10;
          // También puedes calcular el total de valoraciones basado en las que tienes
          this.totalValoraciones = this.valoraciones.length;
        }
      });

    this.valoracionService.listValoracion().subscribe((res: Valoracion[]) => {
      this.valoraciones = res.filter(
        (v) => v.inmueble.idInmueble === this.inmueble.idInmueble
      );
      this.valoracionesMostradas = this.valoraciones.slice(
        0,
        this.valoracionesPorPagina
      );
    });

    this.cargarValoraciones();
    this.verificarValoracionUsuario();
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

  get esAlquiler(): boolean {
    return this.inmueble.estado?.toLowerCase() === 'por rentar';
  }

  get esVenta(): boolean {
    return this.inmueble.estado?.toLowerCase() === 'disponible';
  }

  private cargarValoraciones() {
    // Cargar promedio de valoraciones
    this.valoracionService
      .obtenerListaValoracionPromedio()
      .subscribe((data: ValoracionPromedio[]) => {
        console.log('Nombre inmueble actual:', this.inmueble.nombre);
        console.log('Valoraciones promedio recibidas:', data);
        const valoracion = data.find(
          (v) => v.nombreInmueble === this.inmueble.nombre
        );
        if (valoracion) {
          this.promedioValoracion = Math.round(valoracion.valoracion * 10) / 10;
        }
      });

    // Cargar lista de valoraciones
    this.valoracionService.listValoracion().subscribe((res: Valoracion[]) => {
      this.valoraciones = res.filter(
        (v) => v.inmueble.idInmueble === this.inmueble.idInmueble
      );
      this.valoracionesMostradas = this.valoraciones.slice(
        0,
        this.valoracionesPorPagina
      );
      this.totalValoraciones = this.valoraciones.length;
    });
  }

  guardarValoracion() {
    if (this.usuarioYaValoro) return;

    const valoracion = new Valoracion();
    valoracion.rating = this.valoracionSeleccionada;
    valoracion.inmueble.idInmueble = this.inmueble.idInmueble;
    valoracion.usuario.idUsuario = this.sesionService.getIdUsuario();

    console.log('Valoración a guardar:', this.valoracionUsuario);
    this.valoracionService.insertarValoracion(valoracion).subscribe({
      next: (val) => {
        this.valoracionUsuario = val;
        this.usuarioYaValoro = true;
        this.cargarValoraciones();
      },
      error: (err) => console.error('Error al guardar valoración:', err),
    });
  }

  private verificarValoracionUsuario() {
    const idUsuario = this.sesionService.getIdUsuario();
    if (idUsuario) {
      this.valoracionService.listValoracion().subscribe((res: Valoracion[]) => {
        const valoracionExistente = res.find(
          (v) =>
            v.inmueble.idInmueble === this.inmueble.idInmueble &&
            v.usuario.idUsuario === idUsuario
        );

        if (valoracionExistente) {
          this.usuarioYaValoro = true;
          this.valoracionUsuario = valoracionExistente;
          this.valoracionSeleccionada = valoracionExistente.rating;
        }
      });
    }
  }

  eliminarValoracion() {
    console.log(this.valoracionUsuario);


    if (!this.valoracionUsuario) return;
    console.log('ID a eliminar:', this.valoracionUsuario?.idValoracion);

    this.valoracionService

      .eliminarValoracion(this.valoracionUsuario.idValoracion)
      .subscribe({
        next: () => {
          this.usuarioYaValoro = false;
          this.valoracionUsuario = null;
          this.valoracionSeleccionada = 0;
          this.cargarValoraciones();
        },
        error: (err) => console.error('Error al eliminar valoración:', err),
      });
  }

  verMasValoraciones() {
    const next = this.valoracionesMostradas.length + this.valoracionesPorPagina;
    this.valoracionesMostradas = this.valoraciones.slice(0, next);
  }
}
