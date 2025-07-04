import { JwtRequest } from '../jwt-request';

export class CambioPasswordDto {
  jwt: JwtRequest = new JwtRequest();
  nuevoPassword: string = '';
}
