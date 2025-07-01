import { Component, Input } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Inmueble } from '../../../models/inmueble';
import { Usuario } from '../../../models/usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contrato-inmuebles',
  imports: [FormsModule, CommonModule],
  templateUrl: './contrato-inmuebles.component.html',
  styleUrl: './contrato-inmuebles.component.css'
})
export class ContratoInmueblesComponent {
  @Input() inmueble!:Inmueble
  @Input() comprador!: Usuario;
  @Input() vendedor!: Usuario;
  @Input() fechaFirma: Date = new Date();
  @Input() fechaVencimiento: Date = new Date();

  aceptado: boolean = false;

  get esVenta(): boolean {
    return this.inmueble.estado === 'DISPONIBLE' || this.inmueble.estado === 'VENDIDO';
  }
  get esAlquiler(): boolean {
    return this.inmueble.estado === 'POR RENTAR' || this.inmueble.estado === 'RENTADO';
   }
  get tipoContrato(): string {
    return this.esVenta
      ? 'CONTRATO DE COMPRAVENTA DE INMUEBLE'
      : 'CONTRATO DE ARRENDAMIENTO DE INMUEBLE';
  }

  getTextoContratoPorPaginas(): string[] {
    const direccion = this.inmueble.direccion?.direccion ?? '(Dirección)';
    const area = this.inmueble.area;
    const precio = this.inmueble.precioBase.toFixed(2);
    const fechaFirma = this.fechaFirma.toLocaleDateString();
    const fechaVencimiento = this.fechaVencimiento.toLocaleDateString();

    if (this.esVenta) {
      return [
`CONTRATO DE COMPRAVENTA DE INMUEBLE

En la ciudad de [Ciudad], a los ${fechaFirma}, se suscribe el presente contrato de compraventa entre:

Vendedor: ${this.vendedor.nombre}
Comprador: ${this.comprador.nombre}

I. DESCRIPCIÓN DEL INMUEBLE
El inmueble "${this.inmueble.nombre}", ubicado en ${direccion}, con un área de ${area} m².

II. PRECIO DE VENTA
El precio es S/. ${precio}, pagado a través del sistema.

III. FECHAS
Fecha de firma: ${fechaFirma}
Fecha de vencimiento: ${fechaVencimiento}
`,

`CLÁUSULAS DEL CONTRATO

1. Transmisión de propiedad:
   Se realizará al completar el pago. El vendedor garantiza que el inmueble está libre de cargas.

2. Obligaciones del comprador:
   El comprador acepta pagar puntualmente y respetar los términos acordados.

3. Garantías:
   El inmueble será entregado en condiciones legales y físicas óptimas.

4. Resolución anticipada:
   Cualquiera de las partes puede resolver el contrato con una notificación previa de 7 días.

5. Jurisdicción:
   Cualquier disputa será resuelta en la jurisdicción correspondiente.
`
      ];
    } else {
      return [
`CONTRATO DE ARRENDAMIENTO DE INMUEBLE

Celebrado el ${fechaFirma}, entre:

Arrendador: ${this.vendedor.nombre}
Arrendatario: ${this.comprador.nombre}

I. OBJETO DEL CONTRATO
El inmueble "${this.inmueble.nombre}", ubicado en ${direccion}, con un área de ${area} m², se alquila para uso residencial/comercial.

II. PRECIO Y DURACIÓN
Monto mensual: S/. ${precio}
Fecha de inicio: ${fechaFirma}
Fecha de vencimiento: ${fechaVencimiento}
`,

`CLÁUSULAS DEL CONTRATO

1. Pago:
   El arrendatario pagará puntualmente cada mes. Retrasos mayores a 5 días serán penalizados.

2. Uso del inmueble:
   No podrá subarrendar ni modificar sin permiso escrito del arrendador.

3. Estado del inmueble:
   El arrendatario acepta el estado actual y se compromete a conservarlo.

4. Resolución:
   El contrato puede finalizar por incumplimiento con 15 días de aviso.

5. Jurisdicción:
   Toda controversia será resuelta en la ciudad donde se ubica el inmueble.
`
      ];
    }
  }

  descargarPDF() {
    const doc = new jsPDF();
    const paginas = this.getTextoContratoPorPaginas();
    paginas.forEach((texto, index) => {
      const lineas = doc.splitTextToSize(texto, 180);
      doc.text(lineas, 15, 20);
      if (index < paginas.length - 1) doc.addPage();
    });
    doc.save(`${this.tipoContrato}.pdf`);
  }

  continuarPago() {
    alert('Contrato aceptado. Procediendo al pago...');
    // Aquí emitirías evento o redireccionarías al flujo de pago
  }

}
