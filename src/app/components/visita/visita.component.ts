import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { VisitaService } from '../../services/visita.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { Visita } from '../../models/visita';
import { SesionUsuarioService } from '../../services/sesion-usuario.service';

@Component({
  selector: 'app-visita',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './visita.component.html',
  styleUrl: './visita.component.css',
})
export class VisitaComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Visita> = new MatTableDataSource();
  displayedColumns: string[] = [
    'inmueble',
    'direccion',
    'fecha',
    'hora',
    'acciones',
  ];

  displayedColumnsVendedor: string[] = [
    'inmueble',
    'usuario',
    'direccion',
    'fecha',
    'hora',
    'acciones',
  ];

  esVendedor: boolean = false;
  esAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private visitaService: VisitaService,
    private sesionService: SesionUsuarioService
  ) {}

  ngOnInit() {
    const roles = this.sesionService.getRoles();

    this.esVendedor = roles.includes('VENDEDOR');
    this.esAdmin = roles.includes('ADMIN');

    if (this.esVendedor) {
      this.listarProximasVendedor();
    } else {
      this.listarProximas();
    }

    this.visitaService.getLista().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  filtrarHistorial() {
    this.esVendedor ? this.listarHistorialVendedor() : this.listarHistorial();
  }

  filtrarProximas() {
    this.esVendedor ? this.listarProximasVendedor() : this.listarProximas();
  }

  listarTodos() {
    this.visitaService.listarTodos().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    this.visitaService.eliminarVisita(id).subscribe(() => {
      if (this.esVendedor) {
        this.listarProximasVendedor();
      } else {
        this.listarProximas();
      }
    });
  }

  listarProximas() {
    this.visitaService
      .listarPorUsuario(this.sesionService.getIdUsuario())
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
  }

  listarHistorial() {
    this.visitaService
      .listarPorUsuarioHistorial(this.sesionService.getIdUsuario())
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
  }

  listarProximasVendedor() {
    this.visitaService
      .listarPorUsuarioVendedor(this.sesionService.getIdUsuario())
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
  }

  listarHistorialVendedor() {
    this.visitaService
      .listarPorUsuarioVendedorHistorial(this.sesionService.getIdUsuario())
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
  }
}
