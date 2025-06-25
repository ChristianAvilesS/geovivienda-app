import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MedioPago } from '../../../models/mediopago';
import { MediopagoService } from '../../../services/mediopago.service';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon'
@Component({
  selector: 'app-listado-mediospago',
  imports: [MatTableModule, CommonModule,RouterModule,MatButtonModule,MatIconModule],
  templateUrl: './listado-mediospago.component.html',
  styleUrl: './listado-mediospago.component.css'
})
export class ListadoMediospagoComponent implements OnInit {
  dataSource:MatTableDataSource<MedioPago> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'medioPago','actualizar', 'eliminar'];
  
  constructor(private mS:MediopagoService) { }

  ngOnInit(): void {
    this.mS.list().subscribe(data=>{
      const ordenado = data.sort((a, b) => a.idMedio - b.idMedio);
      this.dataSource = new MatTableDataSource(ordenado);
    })
    this.mS.getList().subscribe(data=>{
      const ordenado = data.sort((a, b) => a.idMedio - b.idMedio);
      this.dataSource = new MatTableDataSource(ordenado);
    })
  }

  eliminar(id:number){
    console.log('Eliminando medio de pago con ID:', id);
    this.mS.deleteM(id).subscribe((data)=>{
      console.log('Eliminado correctamente');
      this.mS.list().subscribe((data)=>{
        this.mS.setList(data)
      })
    })
  }

}
