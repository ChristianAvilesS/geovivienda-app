import { Contrato } from "./contrato";
import { MedioPago } from "./mediopago";

export class Pago {
    idPago?: number;
    descripcion: string="";
    importe: number=0;
    tipoMoneda: string="";
    medio:MedioPago = new MedioPago();
    fechaPago: Date = new Date();
    fechaVencimiento: Date = new Date();
    contrato: Partial<Contrato> = {};
}