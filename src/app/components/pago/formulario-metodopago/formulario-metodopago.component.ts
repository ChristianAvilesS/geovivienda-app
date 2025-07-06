import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
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
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaskDirective } from 'ngx-mask';

function fechaExpiracionValida(control: AbstractControl) {
  const valor = control.value;

  const [mes, anio] = valor.split('/').map(Number);
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();

  if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
    return { expirado: true };
  }

  return null;
}

@Component({
  selector: 'app-formulario-metodopago',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    NgxMaskDirective,
  ],
  templateUrl: './formulario-metodopago.component.html',
  styleUrl: './formulario-metodopago.component.css',
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
    private pagoDataService: PagoDataService
  ) {}

  ngOnInit(): void {
    const datos = this.pagoDataService.getDatosPago();

    if (!datos || !datos.medioPago) {
      alert('Metodo de pago no encontrada.');
      this.router.navigate(['inicio']);
      return;
    }

    this.datosPago = datos;
    this.contrato = datos.contrato;
    this.medioPagoSeleccionado = datos.medioPago;

    this.buildForm();
  }

  buildForm(): void {
    this.pagoForm = this.fb.group({
      // Tarjeta
      numeroTarjeta: [
        '',
        [
          Validators.pattern(/^\d{16}$/), // 16 dígitos numéricos
        ],
      ],
      nombreTitular: [
        '',
        [
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-z\s]+$/), // Solo letras y espacios
        ],
      ],
      fechaExpiracion: ['', [fechaExpiracionValida]],
      cvv: [
        '',
        [
          Validators.pattern(/^\d{3}$/), // 3 dígitos
        ],
      ],

      // Transferencia
      banco: ['', [Validators.minLength(3)]],
      numeroCuenta: [
        '',
        [
          Validators.pattern(/^\d{10,20}$/), // 10 a 20 dígitos
        ],
      ],
      codigoTransferencia: [
        '',
        [
          Validators.pattern(/^[A-Z0-9]{6,}$/), // Alfanumérico (como BCP, BBVA, etc.)
        ],
      ],

      // Otros campos que quizás tienes
      tipoMoneda: ['', Validators.required],
      descripcion: ['', Validators.maxLength(200)],
    });
  }

  enviarPago(): void {
    if (this.pagoForm.invalid) return;

    const formValues = this.pagoForm.value;

    const nuevoPago: Pago = {
      descripcion: formValues.descripcion,
      importe: this.datosPago.monto,
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
      },
    });
  }

  calcularFechaVencimiento(): Date {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 3);
    return fecha;
  }
}
