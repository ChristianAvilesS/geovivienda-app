import { Inmueble } from "./inmueble";
import { Usuario } from "./usuario";

export class Contrato{
    id?:number;
    vendedor:Usuario = new Usuario();
    inmueble:Inmueble = new Inmueble();
    comprador:Usuario = new Usuario();
    tipoContrato: string = '';
    descripcion: string = '';
    montoTotal: number = 0;
    fechaFirma: Date = new Date();
    fechaVencimiento: Date = new Date();
}