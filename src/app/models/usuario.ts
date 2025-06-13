import { Direccion } from './direccion';

export class Usuario {
  idUsuario: number = 0;
  nombre: string = '';
  telefono = '';
  direccion: Direccion = new Direccion();
  username: string = '';
  email: string = '';
  password: string = '';
  inactivo: boolean = false;
}
