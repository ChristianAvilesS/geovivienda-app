import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usuario',
  imports: [RouterOutlet],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  constructor(public route: ActivatedRoute) {}
}
