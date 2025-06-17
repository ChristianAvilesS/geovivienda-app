import { Direccion } from './direccion';

export class Inmueble {
  id: number = 0;
  nombre: string = '';
  tipo: string = '';
  direccion: Direccion = new Direccion();
  area: number = 0;
  precioBase: number = 0;
  descripcion: string = '';
  estado: string = '';
}
