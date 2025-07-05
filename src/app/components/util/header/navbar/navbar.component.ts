import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Router } from '@angular/router';
import { SesionUsuarioService } from '../../../../services/sesion-usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  linkPerfil: string = '/usuarios/perfil';
  estaLogeado: boolean = false;
  esAdmin: boolean = false;
  esVendedor: boolean = false;

  constructor(
    private loginS: SesionUsuarioService,
    private router: Router,
    private sesionS: SesionUsuarioService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.estaLogeado = this.sesionS.estaLogeado();
    this.sesionS.logeado$.subscribe((estado) => {
      this.estaLogeado = estado;
      this.cd.detectChanges();
      this.esAdmin = this.sesionS.decodeToken().role.includes('ADMIN');
      this.esVendedor = this.sesionS.decodeToken().role.includes('VENDEDOR');
    });
  }

  cerrarSesion() {
    this.loginS.cerrarSesion();
    this.router.navigate(['inicio']);
  }
}
