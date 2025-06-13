import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-listado-usuarios',
  imports: [MatTableModule, CommonModule],
  templateUrl: './listado-usuarios.component.html',
  styleUrl: './listado-usuarios.component.css',
})
export class ListadoUsuariosComponent implements OnInit {
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  displayedColumns: string[] = ['nombre', 'telefono', 'direccion', 'username', 'email'];

  constructor(private uS: UsuarioService) {}

  ngOnInit() {
    this.uS.listar().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
}
