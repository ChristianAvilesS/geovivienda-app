import { RolUsuarioId } from './ids/rol-usuario-id';
import { Rol } from './rol';
import { Usuario } from './usuario';

export class RolUsuario {
  id: RolUsuarioId = new RolUsuarioId();
  usuario: Usuario = new Usuario();
  rol: Rol = new Rol();
}
