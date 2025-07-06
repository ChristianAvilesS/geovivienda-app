import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Pago } from '../models/pago';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private url = `${base_url}/pagos`;

  constructor(private http:HttpClient) { }

  insert(p: Pago) {
    return this.http.post(this.url, p);
  }
}
