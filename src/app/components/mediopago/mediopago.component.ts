import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListadoMediospagoComponent } from './listado-mediospago/listado-mediospago.component';

@Component({
  selector: 'app-mediopago',
  imports: [RouterOutlet,ListadoMediospagoComponent],
  templateUrl: './mediopago.component.html',
  styleUrl: './mediopago.component.css'
})
export class MediopagoComponent {
  constructor(public route:ActivatedRoute) {}
}
