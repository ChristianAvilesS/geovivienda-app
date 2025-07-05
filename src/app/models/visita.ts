import { Inmueble } from "./inmueble";
import { Usuario } from "./usuario";

export class Visita{
    idVisita: number = 0;
    inmueble: Inmueble = new Inmueble();
    usuario: Usuario = new Usuario();
    fechaVisita: string = '';
}