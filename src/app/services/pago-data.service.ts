import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagoDataService {
  private datosPago: any = null;

  setDatosPago(data: any): void {
    this.datosPago = data;
  }

  getDatosPago(): any {
    return this.datosPago;
  }

  limpiarDatos(): void {
    this.datosPago = null;
  }

}
