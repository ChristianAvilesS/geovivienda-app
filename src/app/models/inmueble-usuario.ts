import { InmuebleUsuarioId } from './ids/inmueble-usuario-id';
import { Inmueble } from './inmueble';
import { Usuario } from './usuario';

export class InmuebleUsuario {
  id: InmuebleUsuarioId = new InmuebleUsuarioId();
  usuario: Usuario = new Usuario();
  inmueble: Inmueble = new Inmueble();
  esDuenio: boolean = false;
  esFavorito: boolean = false;
  estadoSolicitud: string = "";
  fechaSolicitud: Date = new Date()
}
