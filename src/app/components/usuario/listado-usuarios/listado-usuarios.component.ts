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
  styleUrls: [
    './listado-usuarios.component.css',
    './listado-usuarios.component.scss',
  ],
})
export class ListadoUsuariosComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  displayedColumns: string[] = ['nombre', 'username', 'boton'];
  usuario: Usuario = new Usuario();
  rolPredom: string = '';
  modalVisible: boolean = false;
  verEliminados: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usuarioService: UsuarioService,
    private rolUsuarioService: RolUsuarioService
  ) {}

  ngOnInit() {
    this.usuarioService.listar().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
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
    this.modalVisible = true;
    this.obtenerDatos(id);
  }

  cerrarModal() {
    this.modalVisible = false;
    this.usuario = new Usuario();
  }

  cambiarEstado() {
    this.verEliminados = !this.verEliminados;
    if (this.verEliminados) {
      this.usuarioService.listar().subscribe((data) => {
        this.dataSource.data = data;
      });
    } else {
      this.usuarioService.listarNoEliminados().subscribe((data) => {
        this.dataSource.data = data;
      });
    }
  }
}
