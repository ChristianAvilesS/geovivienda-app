import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RolUsuarioService } from '../../../services/rol-usuario.service';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-listado-usuarios',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './listado-usuarios.component.html',
  styleUrl: './listado-usuarios.component.css',
})
export class ListadoUsuariosComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  displayedColumns: string[] = ['nombre', 'username', 'boton'];
  usuario: Usuario = new Usuario();
  rolPredom: string = '';
  modalVisible: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usuarioService: UsuarioService,
    private rolUsuarioService: RolUsuarioService
  ) {}

  ngOnInit() {
    this.usuarioService.listar().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private obtenerDatos(id: number) {
    this.usuarioService.buscarPorId(id).subscribe((data) => {
      this.usuario = data;
    });
    this.rolUsuarioService.obtenerRolPredominante(id).subscribe((data) => {
      this.rolPredom = data.rol;
    });
  }

  abrirModal(id: number) {
    console.log(this.modalVisible);
    this.modalVisible = true;
    console.log(this.modalVisible);
    this.obtenerDatos(id);
  }

  cerrarModal() {
    this.modalVisible = false;
    this.usuario = new Usuario();
  }
}
