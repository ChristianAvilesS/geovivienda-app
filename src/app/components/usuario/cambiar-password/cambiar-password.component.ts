import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CambioPasswordDto } from '../../../models/dtos/cambio-password-dto';
import { UsuarioService } from '../../../services/usuario.service';
import { SesionUsuarioService } from '../../../services/sesion-usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-cambiar-password',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cambiar-password.component.html',
  styleUrl: './cambiar-password.component.css',
})
export class CambiarPasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  cambioPassword: CambioPasswordDto = new CambioPasswordDto();

  constructor(
    private userServ: UsuarioService,
    private sessionS: SesionUsuarioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      passwordActual: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordVerificar: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.userServ
      .buscarPorId(this.sessionS.getIdUsuario())
      .subscribe((data) => {
        this.cambioPassword.jwt.username = data.username;
      });
  }

  aceptar() {
    if (this.form.valid) {
      if (this.form.value.password !== this.form.value.passwordVerificar) {
        this.snackBar.open('Las contraseñas no son iguales', 'Cerrar', {
          duration: 1000,
        });
        return;
      }
      this.cambioPassword.jwt.password = this.form.value.passwordActual;
      this.cambioPassword.nuevoPassword = this.form.value.password;

      this.userServ.cambiarPassword(this.cambioPassword).subscribe({
        next: (success) => {
          if (success) {
            this.snackBar.open('Contraseña actualizada con éxito', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigate(['usuarios/perfil']);
          } else {
            this.snackBar.open(
              'La contraseña actual no corresponde a la contraseña dada',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
        }
      });
    }
  }
}
