import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import lottie from 'lottie-web';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pago-exitoso',
  imports: [MatButtonModule],
  templateUrl: './pago-exitoso.component.html',
  styleUrl: './pago-exitoso.component.css'
})
export class PagoExitosoComponent implements OnInit{
  @ViewChild('animacionContenedor', { static: true }) animacionContenedor!: ElementRef;

  constructor(private router: Router) {}

  ngOnInit(): void {
    lottie.loadAnimation({
      container: this.animacionContenedor.nativeElement,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: '/assets/PagoExitoso_Animacion.json'
    });
  }

  volverInicio(): void {
    this.router.navigate(['/']);
  }

}
