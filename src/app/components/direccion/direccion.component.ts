import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListadoDireccionesComponent } from "./listado-direcciones/listado-direcciones.component";
import { ListadoUsuariosComponent } from "../usuario/listado-usuarios/listado-usuarios.component";

@Component({
  selector: 'app-direccion',
  imports: [RouterOutlet, ListadoDireccionesComponent, ListadoUsuariosComponent],
  templateUrl: './direccion.component.html',
  styleUrl: './direccion.component.css'
})
export class DireccionComponent {
  constructor(public route: ActivatedRoute) {}
}
