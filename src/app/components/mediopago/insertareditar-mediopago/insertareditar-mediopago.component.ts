import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MedioPago } from '../../../models/mediopago';
import { MediopagoService } from '../../../services/mediopago.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-insertareditar-mediopago',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './insertareditar-mediopago.component.html',
  styleUrl: './insertareditar-mediopago.component.css'
})
export class InsertareditarMediopagoComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  medioPago: MedioPago = new MedioPago();
  id:number=0
  edicion:boolean=false

  constructor(
    private mS: MediopagoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idMedio: [''],
      medioPago: ['', Validators.required],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = this.id != null;
      this.init();
    });
  }

  aceptar(){
    if(this.form.valid){
      this.medioPago.idMedio = this.form.value.idMedio;
      this.medioPago.medioPago = this.form.value.medioPago;
      if (this.edicion) {
        this.mS.update(this.medioPago).subscribe(() => {
          this.mS.list().subscribe((data) => {
            this.mS.setList(data);
          });
        });
      } else {
        this.mS.insert(this.medioPago).subscribe(() => {
          this.mS.list().subscribe((data) => {
            this.mS.setList(data);
          });
        });
      }
      this.router.navigate(['/medios-pago/listado']);
  }
}

init(){
  if(this.edicion){
    this.mS.findById(this.id).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data); 
        this.form.patchValue({
            idMedio: data.idMedio,
            medioPago: data.medioPago,
        });
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
      }
    });
  }
}

}
