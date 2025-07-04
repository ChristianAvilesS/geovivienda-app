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
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agregar-admin',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './agregar-admin.component.html',
  styleUrl: './agregar-admin.component.css',
})
export class AgregarAdminComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  usuario: Usuario = new Usuario();
  rolId: number = 0;

  constructor(
    private userServ: UsuarioService,
    private rolS: RolService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      direccion: ['', Validators.required],
      username: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.rolS.buscarRolPorNombre('ADMIN').subscribe((data) => {
      this.rolId = data.idRol;
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.usuario.nombre = this.form.value.nombre;
      this.usuario.telefono = this.form.value.telefono;
      this.usuario.direccion.direccion = this.form.value.direccion;
      this.usuario.username = this.form.value.username;
      this.usuario.email = this.form.value.email;
      this.usuario.password = this.form.value.password;

      this.userServ.insertar(this.usuario, this.rolId).subscribe(() => {
        this.snackBar.open(
          'Registrado exitosamente',
          'Cerrar',
          {
            duration: 1000,
          }
        );
        this.router.navigate(['usuarios/listado']);
      });
    }
  }
}
