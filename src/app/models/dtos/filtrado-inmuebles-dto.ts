export class FiltradoInmuebleDTO {
  minArea?: number;
  maxArea?: number;
  minPrecio?: number;
  maxPrecio?: number;
  tipo?: string;
  latitud!: number;
  longitud!: number;
  radio!: number;

  constructor(init?: Partial<FiltradoInmuebleDTO>) {
    Object.assign(this, init);
  }
}
