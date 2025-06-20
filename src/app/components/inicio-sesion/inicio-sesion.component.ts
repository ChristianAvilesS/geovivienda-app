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
import { JwtRequest } from '../../models/jwt-request';
import { SesionUsuarioService } from '../../services/sesion-usuario.service';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css',
})
export class InicioSesionComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  loginRequest: JwtRequest = new JwtRequest();
  status: boolean = false;
  roles: { id: number; value: string }[] = [];

  constructor(
    private loginS: SesionUsuarioService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.loginRequest.username = this.form.value.username;
      this.loginRequest.password = this.form.value.password;

      this.loginS.iniciarSesion(this.loginRequest).subscribe(()=>
        this.router.navigate([`usuarios/perfil`])
      );
    }
  }
}
