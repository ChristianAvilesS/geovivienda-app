import { Component, Inject } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmar-eliminar',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmar-eliminar.component.html',
  styleUrl: './confirmar-eliminar.component.css',
})
export class ConfirmarEliminarComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  cancelar(): void {
    this.dialogRef.close(false);
  }

  confirmar(): void {
    this.dialogRef.close(true);
  }
}
