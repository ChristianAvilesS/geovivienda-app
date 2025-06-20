import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Subject } from 'rxjs';
import { MedioPago } from '../models/mediopago';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class MediopagoService {
  private url = `${base_url}/mediospago`;
  private listaCambio = new Subject<MedioPago[]>();

  constructor(private http:HttpClient) { }

  list() {
    return this.http.get<MedioPago[]>(this.url);
  }
  insert(mP: MedioPago) {
    return this.http.post(this.url, mP);
  }
  update(mP: MedioPago) {
    return this.http.put(this.url, mP);
  }
  deleteM(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
  getList() {
    return this.listaCambio.asObservable();
  }
  setList(listaNueva: MedioPago[]) {
    this.listaCambio.next(listaNueva);
  }
  findById(id: number) {
    return this.http.get<MedioPago>(`${this.url}/${id}`);
  }
  
}
