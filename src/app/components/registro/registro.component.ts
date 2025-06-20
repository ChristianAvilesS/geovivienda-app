import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-registro',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  usuario: Usuario = new Usuario();
  rolId: number = 0;
  status: boolean = false;
  roles: { id: number; value: string }[] = [];

  constructor(
    private userServ: UsuarioService,
    private rolS: RolService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required, Validators.pattern('^[0-9]{9}$')],
      direccion: ['', Validators.required],
      username: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordVerificar: ['', Validators.required],
      rol: ['', Validators.required],
    });

    this.rolS.listar().subscribe((data) => {
      data.forEach((rolObt) => {
        this.roles.push({ id: rolObt.idRol, value: rolObt.rol });
      });
    });
  }

  aceptar() {
    if (this.form.valid) {
      if (this.form.value.password !== this.form.value.passwordVerificar)
        return;
      this.usuario.nombre = this.form.value.nombre;
      this.usuario.telefono = this.form.value.telefono;
      this.usuario.direccion.direccion = this.form.value.direccion;
      this.usuario.username = this.form.value.username;
      this.usuario.email = this.form.value.email;
      this.usuario.password = this.form.value.password;

      this.rolId = this.form.value.rol;

      this.userServ.insertar(this.usuario, this.rolId).subscribe((response) => {
        this.id = response.idUsuario;
        this.userServ.listar().subscribe((data) => {
          this.userServ.setLista(data);
        });
      });
    }

    this.router.navigate(['usuarios/listado']);
  }
}
