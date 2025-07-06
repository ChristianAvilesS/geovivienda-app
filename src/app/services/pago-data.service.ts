import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PagoDataService {
  private key = 'datosPago';

  setDatosPago(data: any): void {
    sessionStorage.setItem(this.key, JSON.stringify(data));
  }

  getDatosPago(): any {
    const stored = sessionStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : null;
  }

  limpiarDatos(): void {
    sessionStorage.removeItem(this.key);
  }
}
