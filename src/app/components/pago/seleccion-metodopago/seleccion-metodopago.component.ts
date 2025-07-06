import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoDataService } from '../../../services/pago-data.service';
import { MedioPago } from '../../../models/mediopago';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-seleccion-metodopago',
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './seleccion-metodopago.component.html',
  styleUrl: './seleccion-metodopago.component.css'
})
export class SeleccionMetodoPagoComponent implements OnInit {
  listaMetodos = []=[
    { idMedio: 2, medioPago: 'visa' },
    { idMedio: 4, medioPago: 'mastercard' },
    { idMedio: 1, medioPago: 'transferencia' }
  ]
  contrato: any;
  inmueble: any;
  comprador: any;
  vendedor: any;
  monto: number = 0;
  metodoSeleccionado!: MedioPago;

  constructor(private router: Router,private pagoDataService: PagoDataService) {}

  ngOnInit(): void {
    const state = history.state;
    if (!state || !state.contrato || !state.inmueble) {
    alert('Contrato no encontrado. Redirigiendo...');
    this.router.navigate(['/']);
    return;
   }
    this.contrato = state.contrato;
    this.inmueble = state.inmueble;
    this.comprador = state.comprador;
    this.vendedor = state.vendedor;
    this.monto = state.monto;

    console.log('Contrato recibido:', JSON.stringify(this.contrato, null, 2));
    console.log('Inmueble recibido:', JSON.stringify(this.inmueble, null, 2));
  }

  seleccionarMetodo(metodo: MedioPago):void {
    this.metodoSeleccionado = metodo;
  }

  continuar() {
    if (!this.metodoSeleccionado) {
      alert('Debes seleccionar un método de pago.');
      return;
    }

    console.log('Navegando con método:', this.metodoSeleccionado);

    this.pagoDataService.setDatosPago({
    contrato: { id: this.contrato.id },
    inmueble: this.inmueble,
    comprador: this.comprador,
    vendedor: this.vendedor,
    monto: this.monto,
    medioPago: this.metodoSeleccionado,
  });

  this.router.navigate(['/pagos/formulario-pago']);
  }
}
