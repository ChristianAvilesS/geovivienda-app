import { Inmueble } from './inmueble';
import { Usuario } from './usuario';

export class Valoracion {
  idValoracion: number = 0;
  rating: number = 0;
  usuario: Usuario = new Usuario();
  inmueble: Inmueble = new Inmueble();
}
