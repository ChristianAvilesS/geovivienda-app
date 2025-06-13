import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Direccion } from '../../../models/direccion';
import { DireccionService } from '../../../services/direccion.service';

@Component({
  selector: 'app-listado-direcciones',
  imports: [MatTableModule, CommonModule],
  templateUrl: './listado-direcciones.component.html',
  styleUrl: './listado-direcciones.component.css'
})
export class ListadoDireccionesComponent implements OnInit {
  dataSource: MatTableDataSource<Direccion> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'direccion', 'longitud', 'latitud'];

  constructor(private dS: DireccionService) {}

    ngOnInit() {
      this.dS.listar().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      });
    }

}
