import { Direccion } from "../direccion";

export class UsuarioDevueltoDTO {
  idUsuario: number = 0;
  nombre: string = '';
  telefono = '';
  direccion: Direccion = new Direccion();
  username: string = '';
  email: string = '';
}
