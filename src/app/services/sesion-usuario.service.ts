import { Injectable } from '@angular/core';
import { JwtRequest } from '../models/jwt-request';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments';
import { JwtResponse } from '../models/jwt-response';
import { jwtDecode } from 'jwt-decode';
import { Payload } from '../models/dtos/payload';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

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

  constructor(private http: HttpClient) {
    const token = this.getToken();
    this.token = token ?? '';
    if (token) {
      try {
        this.payload = jwtDecode<Payload>(token);
        this.logeado.next(true);
      } catch (e) {
        this.logeado.next(false);
      }
    } else {
      this.logeado.next(false);
    }
  }

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
    const token = this.getToken();
    if (token && token.split('.').length === 3) {
      try {
        return jwtDecode<Payload>(token);
      } catch (e) {}
    }
    return new Payload();
  }

  estaLogeado(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<Payload>(token);
      const exp = decoded.exp;
      if (!exp) return false;

      const now = Math.floor(Date.now() / 1000); // en segundos
      return exp > now;
    } catch (e) {
      return false;
    }
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  getIdUsuario(): number {
    const token = localStorage.getItem('token');
    if (!token) return 0;
    const decoded: any = jwtDecode(token);
    console.log(decoded);
    return decoded.idUsuario;
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded = jwtDecode<Payload>(token);
      return decoded.role ? decoded.role.split(',') : [];
    } catch (e) {
      return [];
    }
  }
  getUsuarioActual(): Observable<Usuario> {
    const id = this.getIdUsuario();
    return this.http.get<Usuario>(`${base_url}/usuarios/${id}`);
  }

  toLocalIsoStringFromUtc(isoUtc: string): string {
    const dateUtc = new Date(isoUtc);
    const offset = dateUtc.getTimezoneOffset() * 60000; // en milisegundos
    const localDate = new Date(dateUtc.getTime() - offset);
    return localDate.toISOString().slice(0, 19); // sin zona horaria ni "Z"
  }
}
