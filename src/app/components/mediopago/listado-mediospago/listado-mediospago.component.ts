import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MedioPago } from '../../../models/mediopago';
import { MediopagoService } from '../../../services/mediopago.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-listado-mediospago',
  imports: [
    MatTableModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './listado-mediospago.component.html',
  styleUrls: [
    './listado-mediospago.component.css',
    './listado-mediospago.component.scss',
  ],
})
export class ListadoMediospagoComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<MedioPago> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'medioPago', 'actualizar', 'eliminar'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private mS: MediopagoService) {}

  ngOnInit(): void {
    this.mS.list().subscribe((data) => {
      const ordenado = data.sort((a, b) => a.idMedio - b.idMedio);
      this.dataSource = new MatTableDataSource(ordenado);
      this.dataSource.paginator = this.paginator;
    });
    this.mS.getList().subscribe((data) => {
      const ordenado = data.sort((a, b) => a.idMedio - b.idMedio);
      this.dataSource.data = ordenado;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  eliminar(id: number) {
    console.log('Eliminando medio de pago con ID:', id);
    this.mS.deleteM(id).subscribe(() => {
      console.log('Eliminado correctamente');
      this.mS.list().subscribe((data) => {
        this.mS.setList(data);
        this.dataSource.data = data;
      });
    });
  }
}
