import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mediopago',
  imports: [RouterOutlet],
  templateUrl: './mediopago.component.html',
  styleUrl: './mediopago.component.css'
})
export class MediopagoComponent {
  constructor(public route:ActivatedRoute) {}
}
