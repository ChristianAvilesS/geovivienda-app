import { Inmueble } from "./inmueble";
import { Usuario } from "./usuario";

export class Comentario {
    idComentario: number = 0;
    descripcion: string = '';
    usuario: Usuario = new Usuario();
    inmueble: Inmueble = new Inmueble();
}