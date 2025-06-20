import { Injectable } from '@angular/core';
import { JwtRequest } from '../models/jwt-request';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments';
import { JwtResponse } from '../models/jwt-response';
import { jwtDecode } from 'jwt-decode';
import { Payload } from '../models/dtos/payload';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class SesionUsuarioService {
  // npm install jwt-decode
  private token: string = '';
  private payload: Payload = new Payload();

  private logeado = new BehaviorSubject<boolean>(this.estaLogeado());
  logeado$ = this.logeado.asObservable(); // otros componentes se suscriben a esto

  constructor(private http: HttpClient) {}

  iniciarSesion(jwt: JwtRequest): Observable<Payload> {
    return this.http.post<JwtResponse>(`${base_url}/login`, jwt).pipe(
      tap((response) => {
        this.token = response.jwttoken;
        localStorage.setItem('token', this.token);
        this.payload = jwtDecode(this.token!);
        this.logeado.next(true);
      }),
      map(() => this.payload) // Valor que se ve en subscribe
    );
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.logeado.next(false);
  }

  decodeToken() {
    return this.payload;
  }
  estaLogeado(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  getIdUsuario(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.idUsuario || null;
  }
}
