import { Component, OnInit } from '@angular/core';
import { ListadoRolesComponent } from './listado-roles/listado-roles.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/rol';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rol',
  imports: [
    ListadoRolesComponent,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css',
})
export class RolComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  rol: Rol = new Rol();

  constructor(private rolS: RolService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      rol: ['', Validators.required],
    });
  }

  guardar() {
    if (this.form.valid) {
      this.rol.rol = this.form.value.rol;
      this.rolS.insertar(this.rol).subscribe(() => {
        this.rolS.listar().subscribe((data) => {
          this.rolS.setLista(data);
        });
      });
    }
  }
}
