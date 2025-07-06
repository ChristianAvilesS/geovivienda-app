import { Component,OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Contrato } from '../../../models/contrato';
import { MedioPago } from '../../../models/mediopago';
import { PagoService } from '../../../services/pago.service';
import { Pago } from '../../../models/pago';
import { MediopagoService } from '../../../services/mediopago.service';
import { Inmueble } from '../../../models/inmueble';
import { Usuario } from '../../../models/usuario';
import { ActivatedRoute } from '@angular/router';
import { PagoDataService } from '../../../services/pago-data.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-formulario-metodopago',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './formulario-metodopago.component.html',
  styleUrl: './formulario-metodopago.component.css'
})
export class FormularioMetodopagoComponent implements OnInit {
  pagoForm!: FormGroup;
  metodo: string = '';
  contrato!: Contrato;
  medioPagoSeleccionado!: MedioPago;
  datosPago!: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pagoService: PagoService,
    private pagoDataService: PagoDataService,
  ) {}

  ngOnInit(): void {
    const datos = this.pagoDataService.getDatosPago();

  if (!datos || !datos.medioPago) {
    alert('Metodo de pago no encontrada.');
    this.router.navigate(['/pagos/seleccion-metodo-pago']);
    return;
  }

  this.datosPago = datos;
  this.contrato = datos.contrato;
  this.medioPagoSeleccionado = datos.medioPago;

  console.log('Datos recibidos del servicio:', datos);
  console.log('Medio de pago seleccionado:', this.medioPagoSeleccionado);

  this.buildForm();
  }

  buildForm(): void {
    this.pagoForm = this.fb.group({
      descripcion: ['', Validators.required],
      tipoMoneda: ['PEN', Validators.required],
      // Visa / Mastercard
      numeroTarjeta: [''],
      nombreTitular: [''],
      fechaExpiracion: [''],
      cvv: [''],
      // Transferencia
      banco: [''],
      numeroCuenta: [''],
      codigoTransferencia: ['']
    });
  }

  enviarPago(): void {
    if (this.pagoForm.invalid) return;

    const formValues = this.pagoForm.value;

    const nuevoPago: Pago = {
      descripcion: formValues.descripcion,
      importe:this.datosPago.monto,
      tipoMoneda: formValues.tipoMoneda,
      medio: this.medioPagoSeleccionado,
      fechaPago: new Date(),
      fechaVencimiento: this.calcularFechaVencimiento(),
      contrato: { id: this.contrato.id },
    };

    console.log('Pago a registrar:', nuevoPago);

    this.pagoService.insert(nuevoPago).subscribe({
      next: () => {
        console.log('Pago exitoso');
        this.router.navigate(['/pagos/pagoexitoso']);
      },
      error: (error) => {
        console.error('Error al registrar el pago:', error);
      }
    });
  }

  calcularFechaVencimiento(): Date {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 3);
    return fecha;
  }
}
