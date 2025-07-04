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
import { RolUsuarioService } from '../../../services/rol-usuario.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmarEliminarComponent } from '../../util/confirmar-eliminar/confirmar-eliminar.component';
import { SesionUsuarioService } from '../../../services/sesion-usuario.service';
import { RolUsuario } from '../../../models/rol-usuario';
import { RolService } from '../../../services/rol.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-perfil-usuario',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css',
})
export class PerfilUsuarioComponent implements OnInit {
  modoEdicion: boolean = false;
  form: FormGroup = new FormGroup({});
  id: number = 0;
  usuario: Usuario = new Usuario();
  rol: string = '';
  status: boolean = false;

  // Para cambio de rol
  form2: FormGroup = new FormGroup({});
  rolUsuario: RolUsuario = new RolUsuario();
  rolId: number = 0;
  roles: { id: number; value: string }[] = [];
  cambiarRolB: boolean = false;

  constructor(
    private userServ: UsuarioService,
    private rolUserServ: RolUsuarioService,
    private rolS: RolService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private sessionS: SesionUsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      direccion: ['', Validators.required],
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
    });

    this.id = this.sessionS.getIdUsuario();
    if (this.id == 0) {
      this.router.navigate(['inicio']);
    }
    this.userServ.buscarPorId(this.id).subscribe((user) => {
      this.usuario = user;

      this.rolUserServ
        .obtenerRolPredominante(this.id)
        .subscribe((rolPredom) => {
          this.rol = rolPredom.rol;

          this.form.patchValue({
            nombre: this.usuario.nombre,
            telefono: this.usuario.telefono,
            direccion: this.usuario.direccion.direccion,
            username: this.usuario.username,
            email: this.usuario.email,
            rol: this.rol,
          });
        });
    });

    this.form2 = this.formBuilder.group({
      rol: ['', Validators.required],
    });

    this.rolS.listarRolesSinAdmin().subscribe((data) => {
      data.forEach((rolObt) => {
        this.roles.push({ id: rolObt.idRol, value: rolObt.rol });
      });
    });

    this.rolUsuario.idRolUsuario.idUsuario = this.id;
  }

  habilitarEdicion() {
    this.modoEdicion = true;
    this.form.enable();
    this.form.get('username')?.disable();
    this.form.get('rol')?.disable();
  }

  guardar() {
    if (this.form.valid) {
      this.usuario.nombre = this.form.value.nombre;
      this.usuario.telefono = this.form.value.telefono;
      this.usuario.direccion.direccion = this.form.value.direccion;
      this.usuario.email = this.form.value.email;
      this.userServ.actualizar(this.usuario).subscribe(() => {
        this.userServ.listar().subscribe((data) => {
          this.userServ.setLista(data);
        });
        this.snackBar.open('Se actualizó el perfil correctamente', 'Cerrar', {
          duration: 1000,
        });
      });

      this.form.disable();
      this.modoEdicion = false;
    }
  }

  eliminarCuenta() {
    const dialogRef = this.dialog.open(ConfirmarEliminarComponent, {
      width: '30%',
      data: { mensaje: '¿Estás seguro de que deseas eliminar tu cuenta?' },
    });
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.userServ.eliminar(this.id).subscribe(() => {
          this.userServ.listar().subscribe((data) => {
            this.userServ.setLista(data);
          });
        });
      }
    });
  }

  empezarCambioRol() {
    this.modoEdicion = true;
    this.cambiarRolB = true;
  }

  cambiarRol() {
    if (this.form.valid) {
      this.rolUsuario.idRolUsuario.idRol = this.form2.value.rol;

      this.rolUserServ.insertar(this.rolUsuario).subscribe(() => {
        this.sessionS.cerrarSesion();
        this.snackBar.open(
          'Rol actualizado correctamente. Redireccionando a inicio y cerrando sesión',
          'Cerrar',
          {
            duration: 1000,
          }
        );
        this.cambiarRolB = false;
        this.router.navigate(['']);
      });
    }
  }

  irCambiarPassword() {
    this.router.navigate(['usuarios/cambiar-password']);
  }
}
