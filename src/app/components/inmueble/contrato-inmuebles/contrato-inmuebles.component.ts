import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { ContratoService } from '../../../services/contrato.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Contrato } from '../../../models/contrato';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contrato-inmuebles',
  imports: [FormsModule, CommonModule, MatButtonModule],
  templateUrl: './contrato-inmuebles.component.html',
  styleUrl: './contrato-inmuebles.component.css',
})
export class ContratoInmueblesComponent {
  aceptado: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contratoService: ContratoService,
    private dialogRef: MatDialogRef<ContratoInmueblesComponent>,
    private router: Router
  ) {}

  get inmueble() {
    return this.data.inmueble;
  }

  get comprador() {
    return this.data.comprador;
  }

  get vendedor() {
    return this.data.vendedor;
  }

  get fechaFirma(): Date {
    return this.data.fechaFirma;
  }

  get fechaVencimiento(): Date {
    return this.data.fechaVencimiento;
  }

  get esVenta(): boolean {
    return this.inmueble.estado?.toLowerCase() === 'disponible';
  }

  get esAlquiler(): boolean {
    return this.inmueble.estado?.toLowerCase() === 'por rentar';
  }

  get tipoContrato(): string {
    return this.esAlquiler
      ? 'CONTRATO DE ARRENDAMIENTO DE INMUEBLE'
      : 'CONTRATO DE COMPRAVENTA DE INMUEBLE';
  }

  getTextoContratoPorPaginas(): string[] {
    const direccion = this.inmueble.direccion?.direccion ?? '(Dirección)';
    const area = this.inmueble.area;
    const precio = this.inmueble.precioBase.toFixed(2);
    const fechaFirma = this.fechaFirma.toLocaleDateString();
    const fechaVencimiento = this.fechaVencimiento.toLocaleDateString();
    const ciudad = 'Lima';

    if (!this.esAlquiler) {
      return [
        `
CONTRATO DE COMPRAVENTA DE INMUEBLE

En la ciudad de ${ciudad}, a los ${fechaFirma}, se celebra el presente contrato entre:

Vendedor: ${this.vendedor.nombre} - Correo: ${this.vendedor.email}
Comprador: ${this.comprador.nombre} - Correo: ${this.comprador.email}

I. IDENTIFICACIÓN DEL INMUEBLE
El inmueble "${this.inmueble.nombre}", ubicado en ${direccion}, con un área de ${area} m².

II. PRECIO Y FORMA DE PAGO
El precio de compraventa es de S/. ${precio}, que el comprador se obliga a pagar mediante la plataforma digital en el plazo acordado.

III. CONDICIONES DE LA VENTA
El inmueble se encuentra libre de cargas, gravámenes, litigios o cualquier limitación. El vendedor se compromete a entregar el bien en las condiciones descritas.

IV. FECHAS
Firma del contrato: ${fechaFirma}
Vencimiento del acuerdo: ${fechaVencimiento}

V. OBLIGACIONES DE LAS PARTES
El vendedor se obliga a entregar el inmueble en un plazo no mayor a 5 días después del pago total. El comprador se obliga a asumir los gastos legales y registrales.

`,
        `
VI. CLÁUSULAS ADICIONALES

1. Entrega del Inmueble:
   El vendedor hará entrega física del inmueble una vez confirmado el pago total.

2. Garantías:
   El vendedor garantiza que el inmueble cumple con las condiciones de habitabilidad y uso legal.

3. Obligaciones del Comprador:
   El comprador se compromete a no modificar el uso del inmueble hasta la inscripción oficial del cambio de propiedad.

4. Resolución del Contrato:
   Cualquiera de las partes podrá resolver el contrato por incumplimiento, previo aviso escrito con 10 días de anticipación.

5. Jurisdicción:
   Las partes se someten a la jurisdicción de los tribunales de ${ciudad}, renunciando a cualquier otro fuero.

VII. ACEPTACIÓN Y FIRMAS

Ambas partes manifiestan su aceptación total de los términos expresados en este contrato digital.



`,
      ];
    } else {
      return [
        `CONTRATO DE ARRENDAMIENTO DE INMUEBLE

En la ciudad de Lima, a los ${fechaFirma}, se suscribe el presente contrato entre las siguientes partes:

ARRRENDADOR: ${this.vendedor.nombre}, identificado con correo ${this.vendedor.email}, en adelante denominado EL ARRENDADOR.

ARRENDATARIO: ${this.comprador.nombre}, identificado con correo ${this.comprador.email}, en adelante denominado EL ARRENDATARIO.

I. OBJETO DEL CONTRATO
El ARRENDADOR da en arrendamiento a EL ARRENDATARIO el inmueble "${this.inmueble.nombre}", ubicado en ${direccion}, con un área total de ${area} metros cuadrados, destinado exclusivamente para fines residenciales/comerciales.

II. PLAZO DE ARRENDAMIENTO
El presente contrato tendrá una duración de 6 meses, iniciando el ${fechaFirma} y culminando el ${fechaVencimiento}, pudiendo renovarse de común acuerdo entre ambas partes.

III. PRECIO DEL ARRENDAMIENTO
EL ARRENDATARIO se compromete a pagar mensualmente la suma de S/. ${precio} (Nuevos Soles), dentro de los cinco (5) primeros días de cada mes. El pago se realizará mediante depósito bancario u otro medio acordado previamente.

IV. MANTENIMIENTO Y SERVICIOS
El ARRENDATARIO se obliga a conservar el inmueble en buen estado y será responsable de los daños causados por mal uso. Asimismo, asumirá el pago de los servicios de agua, luz, internet, arbitrios, entre otros.`,

        `V. MODIFICACIONES
No se permitirá modificación estructural alguna del inmueble sin el consentimiento expreso y por escrito del ARRENDADOR.

VI. SUBARRENDAMIENTO
Queda expresamente prohibido el subarrendamiento total o parcial del inmueble objeto del presente contrato.

VII. TERMINACIÓN ANTICIPADA
Cualquiera de las partes podrá resolver el contrato de forma anticipada notificando a la otra parte con al menos quince (15) días calendario de antelación.

VIII. JURISDICCIÓN
Para la interpretación y cumplimiento del presente contrato, las partes se someten a la jurisdicción de los jueces y tribunales de la ciudad de Lima, renunciando a cualquier otro fuero que pudiera corresponderles.

IX. CLÁUSULA DE GARANTÍA
EL ARRENDATARIO entregará una garantía equivalente a un (1) mes de arrendamiento, la cual será devuelta al término del contrato, previa verificación del estado del inmueble.

X. FIRMA DEL CONTRATO
Ambas partes declaran haber leído el contenido del presente contrato, aceptando sus condiciones libre y voluntariamente.

`,
      ];
    }
  }

  descargarPDF() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const leftMargin = 20;
    const topMargin = 20;
    const lineHeight = 7;
    const maxLineWidth = 170;
    const fontSize = 12;
    const fontFamily = 'Times';

    const paginas = this.getTextoContratoPorPaginas();
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(fontSize);

    let y = topMargin;

    const labelUno = this.esAlquiler ? 'ARRENDADOR' : 'VENDEDOR';
    const labelDos = this.esAlquiler ? 'ARRENDATARIO' : 'COMPRADOR';

    paginas.forEach((pagina, index) => {
      const lineas = doc.splitTextToSize(pagina, maxLineWidth);
      lineas.forEach((linea: string) => {
        if (y + lineHeight > 280) {
          doc.addPage();
          y = topMargin;
        }
        doc.text(linea, leftMargin, y, { align: 'justify' });
        y += lineHeight;
      });

      if (index === paginas.length - 1 && y + 30 < 280) {
        y += 20;

        const centerX1 = leftMargin + 40;
        const centerX2 = leftMargin + 130;

        doc.text('___________________________', centerX1, y, {
          align: 'center',
        });
        doc.text('___________________________', centerX2, y, {
          align: 'center',
        });

        y += 6;
        doc.text(this.vendedor.nombre, centerX1, y, { align: 'center' });
        doc.text(this.comprador.nombre, centerX2, y, { align: 'center' });

        y += 6;
        doc.text(labelUno, centerX1, y, { align: 'center' });
        doc.text(labelDos, centerX2, y, { align: 'center' });
      } else if (index < paginas.length - 1) {
        doc.addPage();
        y = topMargin;
      }
    });

    doc.save(`${this.tipoContrato.replaceAll(' ', '_')}.pdf`);
  }

  continuarPago() {
    const contrato: Contrato = {
      descripcion: `${this.tipoContrato} entre ${this.vendedor.nombre} y ${this.comprador.nombre}`,
      montoTotal: this.inmueble.precioBase,
      comprador: this.comprador,
      vendedor: this.vendedor,
      inmueble: this.inmueble,
      fechaFirma: this.fechaFirma,
      fechaVencimiento: this.fechaVencimiento,
      tipoContrato: this.tipoContrato,
    };

    this.contratoService.insert(contrato).subscribe({
      next: (res) => {
        alert('Contrato registrado correctamente. Redirigiendo al pago...');
        this.dialogRef.close(true); // Puedes emitir true si quieres manejarlo desde quien lo abrió
        this.router.navigate(['/pagos/seleccion-metodo-pago'], {
          state: {
            contrato: res,
            inmueble: this.inmueble,
            comprador: this.comprador,
            vendedor: this.vendedor,
            monto: this.inmueble.precioBase,
          },
        });
        this.cerrar();
      },

      error: (err) => {
        console.error('Error al registrar el contrato:', err);
        alert('Ocurrió un error al guardar el contrato.');
      },
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
