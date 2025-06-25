import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Rol } from '../../../models/rol';
import { RolService } from '../../../services/rol.service';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-listado-roles',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './listado-roles.component.html',
  styleUrl: './listado-roles.component.css',
})
export class ListadoRolesComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'rol', 'eliminar'];
  usuario: Rol = new Rol();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rolS: RolService) {}

  ngOnInit() {
    this.rolS.listar().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  eliminarRol(id: number) {
    this.rolS.eliminar(id).subscribe(() => {
      this.rolS.listar().subscribe((data) => {
        this.rolS.setLista(data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      });
    });
  }
}
