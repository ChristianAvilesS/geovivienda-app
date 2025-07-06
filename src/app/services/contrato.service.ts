import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Contrato } from '../models/contrato';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private url = `${base_url}/contratos`;

  constructor(private http:HttpClient) { }

  insert(c: Contrato) {
      return this.http.post(this.url, c);
  }
}
