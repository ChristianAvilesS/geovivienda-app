import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Rol } from '../../../models/rol';
import { RolService } from '../../../services/rol.service';

@Component({
  selector: 'app-listado-roles',
  imports: [MatTableModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './listado-roles.component.html',
  styleUrl: './listado-roles.component.css',
})
export class ListadoRolesComponent implements OnInit {
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'rol', 'eliminar'];
  usuario: Rol = new Rol();

  constructor(private rolS: RolService) {}

  ngOnInit() {
    this.rolS.listar().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminarRol(id: number) {
    this.rolS.eliminar(id).subscribe(() => {
      this.rolS.listar().subscribe((data) => {
        this.rolS.setLista(data);
      });
    });
  }
}
