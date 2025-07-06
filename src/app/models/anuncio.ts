import { Inmueble } from './inmueble';
import { Usuario } from './usuario';

export class Anuncio {
  idAnuncio: number = 0;
  anunciante: Usuario = new Usuario();
  descripcion: string = '';
  fechaPublicacion: string = '';
  inmueble: Inmueble = new Inmueble();
}
