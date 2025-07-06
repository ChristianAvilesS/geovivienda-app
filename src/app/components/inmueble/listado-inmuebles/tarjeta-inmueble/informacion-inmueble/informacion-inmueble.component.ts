import { Component, Inject, signal } from '@angular/core';
import { ValoracionService } from './../../../../../services/valoracion.service';
import { MatDialogModule } from '@angular/material/dialog';
import maplibregl, { Map } from 'maplibre-gl';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inmueble } from '../../../../../models/inmueble';
import { MatListModule } from '@angular/material/list';
import { InmuebleUsuarioService } from '../../../../../services/inmueble-usuario.service';
import { InmuebleUsuario } from '../../../../../models/inmueble-usuario';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Router, RouterLink } from '@angular/router';
import { InmuebleService } from '../../../../../services/inmueble.service';
import { CommonModule } from '@angular/common';
import { SesionUsuarioService } from '../../../../../services/sesion-usuario.service';
import { environment } from '../../../../../environments/environments';
import { Valoracion } from '../../../../../models/valoracion';
import { MatCardModule } from '@angular/material/card';
import { ValoracionPromedio } from '../../../../../models/dtos/valoracion-promedio-dto';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Comentario } from '../../../../../models/comentario';
import { ComentarioService } from '../../../../../services/comentario.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { VisitaService } from '../../../../../services/visita.service';
import { Visita } from '../../../../../models/visita';
import { Anuncio } from '../../../../../models/anuncio';
import { AnuncioService } from '../../../../../services/anuncio.service';

const apiKeyMaps = environment.apiKeyMaps;

export function fechaHoraFuturaValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fecha: Date = group.get('fecha')?.value;
    const hora: Date = group.get('hora')?.value;

    if (!fecha || !hora) return null;

    const combined = new Date(fecha);
    combined.setHours(hora.getHours(), hora.getMinutes(), 0, 0);

    console.log(combined);

    const now = new Date();

    return combined > now ? null : { fechaHoraNoFutura: true };
  };
}

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
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTimepickerModule,
  ],
  templateUrl: './informacion-inmueble.component.html',
  styleUrl: './informacion-inmueble.component.css',
})
export class InformacionInmuebleComponent {
  private map!: Map;
  inmuebleUsuario: InmuebleUsuario = new InmuebleUsuario();
  comentarioform: FormGroup = new FormGroup({});
  comentario: Comentario = new Comentario();
  esDuenio: boolean = false;
  comentarios: Comentario[] = [];
  readonly panelOpenState = signal(false);
  existeComentario: boolean = false;
  comentarioActual: Comentario = new Comentario();

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

  estaLogeado: boolean = false;

  formVisita: FormGroup = new FormGroup({});

  visita: Visita = new Visita();

  existeVisita: boolean = false;

  minHora: string = '09:00';
  maxHora: string = '19:00';

  esVendedor: boolean = false;

  anuncioform: FormGroup = new FormGroup({});
  anuncio: Anuncio = new Anuncio();
  existeAnuncio: boolean = false;
  anuncioActual: Anuncio = new Anuncio();

  constructor(
    private inmuebleService: InmuebleService,
    private inmuebleUsuarioService: InmuebleUsuarioService,
    private sesionService: SesionUsuarioService,
    private valoracionService: ValoracionService,
    private comentarioService: ComentarioService,
    private visitasService: VisitaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private anuncioService: AnuncioService,
    @Inject(MAT_DIALOG_DATA) public inmueble: Inmueble
  ) {}

  ngOnInit() {
    const roles = this.sesionService.getRoles();

    this.esVendedor = roles.includes('VENDEDOR');

    //InmuebleUsuario

    this.inmuebleUsuarioService
      .buscarDuenioPorInmueble(this.inmueble.idInmueble)
      .subscribe((data) => {
        this.inmuebleUsuario = data;
        if (this.sesionService.getIdUsuario() == data.usuario.idUsuario) {
          this.esDuenio = data.esDuenio;
        }
      });

    this.estaLogeado = this.sesionService.estaLogeado();

    //Valoraciones

    this.cargarValoraciones();
    this.verificarValoracionUsuario();

    //Comentarios

    this.comentarioService
      .listarporUsuarioInmueble(
        this.sesionService.getIdUsuario(),
        this.inmueble.idInmueble
      )
      .subscribe((data) => {
        if (data) {
          this.existeComentario = true;
          this.comentarioActual = data;
          console.log(this.existeComentario);
        }
      });

    this.comentarioform = this.formBuilder.group({
      comentario: [''],
    });

    this.comentarioService
      .listarporinmueble(this.inmueble.idInmueble)
      .subscribe((data) => {
        this.comentarios = data;
      });

    this.comentarioService.getLista().subscribe((data) => {
      this.comentarios = data;
    });

    //Anuncio

    this.anuncioform = this.formBuilder.group({
      anuncio: [''],
    });

    this.anuncioService
      .buscarPorInmueble(this.inmueble.idInmueble)
      .subscribe((data) => {
        this.existeAnuncio = true;
        this.anuncioActual = data;
      });

    //Visitas

    this.formVisita = this.formBuilder.group(
      {
        fecha: [null, Validators.required], // Date
        hora: ['', [Validators.required]], // "HH:mm"
      },
      {
        validators: [fechaHoraFuturaValidator()],
      }
    );

    this.verificarAgendadas();
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

  get esAlquiler(): boolean {
    return this.inmueble.estado?.toLowerCase() === 'por rentar';
  }

  get esVenta(): boolean {
    return this.inmueble.estado?.toLowerCase() === 'disponible';
  }

  eliminarInmueble(id: number) {
    this.inmuebleService.eliminar(id).subscribe(() => {
      this.inmuebleService.listar().subscribe((data) => {
        this.inmuebleService.setLista(data);
      });
    });
  }

  /*Comentarios -----------------------------------------*/

  insertarComentario() {
    const idUsuario = this.sesionService.getIdUsuario();
    const idInmueble = this.inmueble.idInmueble;

    this.comentario.descripcion = this.comentarioform.value.comentario;
    this.comentario.inmueble.idInmueble = idInmueble;
    this.comentario.usuario.idUsuario = idUsuario;

    if (this.existeComentario) {
      this.comentario.idComentario = this.comentarioActual.idComentario;
      this.comentarioService.actualizar(this.comentario).subscribe(() => {
        this.actualizarListaComentarios(idInmueble);
      });
    } else {
      this.comentarioService
        .insertar(this.comentario)
        .subscribe((dataInmueble) => {
          this.comentarioActual = dataInmueble;
          this.actualizarListaComentarios(idInmueble);
        });
    }
  }

  private actualizarListaComentarios(idInmueble: number): void {
    this.comentarioService.listarporinmueble(idInmueble).subscribe((data) => {
      this.comentarioService.setLista(data);
      this.existeComentario = true;
    });
  }

  eliminarComentario() {
    this.comentarioService
      .eliminar(this.comentarioActual.idComentario)
      .subscribe(() => {
        this.existeComentario = false;
        this.comentarioService
          .listarporinmueble(this.inmueble.idInmueble)
          .subscribe((data) => {
            this.comentarioService.setLista(data);
          });
      });
  }

  mostrarCantidad: number = 3;

  toggleVerMas() {
    if (this.mostrarCantidad >= this.comentarios.length) {
      this.mostrarCantidad = 3;
    } else {
      this.mostrarCantidad = this.comentarios.length;
    }
  }

  /*Anuncios -----------------------------------------*/

  insertarAnuncio() {
    const idUsuario = this.sesionService.getIdUsuario();
    const idInmueble = this.inmueble.idInmueble;

    const ahora = new Date();
    const isoString = ahora.toISOString();
    const localString = this.sesionService.toLocalIsoStringFromUtc(isoString);

    this.anuncio.descripcion = this.anuncioform.value.anuncio;
    this.anuncio.inmueble.idInmueble = idInmueble;
    this.anuncio.anunciante.idUsuario = idUsuario;
    this.anuncio.fechaPublicacion = localString;

    if (this.existeAnuncio) {
      this.anuncio.idAnuncio = this.anuncioActual.idAnuncio;
      this.anuncioService.editarAnuncio(this.anuncio).subscribe(() => {
        this.actualizarListaAnuncios();
      });
    } else {
      this.anuncioService
        .agregarAnuncio(this.anuncio)
        .subscribe((dataInmueble) => {
          this.anuncio = dataInmueble;
          this.actualizarListaAnuncios();
        });
    }
  }

  private actualizarListaAnuncios(): void {
    this.anuncioService.listarAnuncios().subscribe((data) => {
      this.anuncioService.setLista(data);
      this.existeAnuncio = true;
    });
  }

  eliminarAnuncio() {
    this.anuncioService.eliminar(this.anuncioActual.idAnuncio).subscribe(() => {
      this.existeAnuncio = false;
      this.anuncioService.listarAnuncios().subscribe((data) => {
        this.anuncioService.setLista(data);
      });
    });
  }

  /*Valoraciones -----------------------------------------*/

  private cargarValoraciones(): void {
    this.valoracionService.listValoracion().subscribe((res: Valoracion[]) => {
      this.valoraciones = res.filter(
        (v) => v.inmueble.idInmueble === this.inmueble.idInmueble
      );

      this.valoracionesMostradas = this.valoraciones.slice(
        0,
        this.valoracionesPorPagina
      );

      this.totalValoraciones = this.valoraciones.length;

      // Obtener promedio
      this.valoracionService
        .obtenerListaValoracionPromedio()
        .subscribe((data: ValoracionPromedio[]) => {
          const valoracion = data.find(
            (v) => v.nombreInmueble === this.inmueble.nombre
          );

          if (valoracion) {
            this.promedioValoracion =
              Math.round(valoracion.valoracion * 10) / 10;
          }
        });
    });
  }

  guardarValoracion() {
    if (this.usuarioYaValoro) return;

    const valoracion = new Valoracion();
    valoracion.rating = this.valoracionSeleccionada;
    valoracion.inmueble.idInmueble = this.inmueble.idInmueble;
    valoracion.usuario.idUsuario = this.sesionService.getIdUsuario();

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
    if (!this.valoracionUsuario) return;

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

  //Visitas

  agendarVisita() {
    if (this.formVisita.invalid) {
      this.formVisita.markAllAsTouched();
      return;
    }

    const { fecha, hora } = this.formVisita.value;

    const combinedDate = new Date(fecha);
    combinedDate.setHours(hora.getHours(), hora.getMinutes(), 0, 0);

    const isoString = combinedDate.toISOString();

    const localString = this.sesionService.toLocalIsoStringFromUtc(isoString);

    this.visita.inmueble.idInmueble = this.inmueble.idInmueble;
    this.visita.usuario.idUsuario = this.sesionService.getIdUsuario();
    this.visita.fechaVisita = localString;

    this.visitasService.agendarVisita(this.visita).subscribe(() => {
      this.visitasService
        .listarPorUsuario(this.sesionService.getIdUsuario())
        .subscribe((data) => this.visitasService.setLista(data));
    });

    this.router.navigate(['visitas']);
  }

  verificarAgendadas() {
    this.visitasService
      .verificarAgendadas(
        this.sesionService.getIdUsuario(),
        this.inmueble.idInmueble
      )
      .subscribe((data) => {
        this.existeVisita = data.agendada;
      });
  }
}
