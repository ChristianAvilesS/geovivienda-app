import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Router } from '@angular/router';
import { SesionUsuarioService } from '../../../../services/sesion-usuario.service';
import { CommonModule } from '@angular/common';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { AnuncioService } from '../../../../services/anuncio.service';
import { Anuncio } from '../../../../models/anuncio';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
    CommonModule,
    MatSidenavModule,
    MatDividerModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  linkPerfil: string = '/usuarios/perfil';
  estaLogeado: boolean = false;
  esAdmin: boolean = false;
  esVendedor: boolean = false;

  drawerAbierto: boolean = false;

  @ViewChild('drawer') drawer!: MatDrawer;

  abrirDrawer() {
    this.drawerAbierto = true;

    // Espera al siguiente ciclo de renderizado para abrir el drawer
    setTimeout(() => {
      this.drawer?.open();
    });
  }

  cerrarDrawer() {
    this.drawerAbierto = false;
  }

  anuncios: Anuncio[] = [];

  constructor(
    private loginS: SesionUsuarioService,
    private router: Router,
    private sesionS: SesionUsuarioService,
    private cd: ChangeDetectorRef,
    private anuncioService: AnuncioService
  ) {}

  ngOnInit() {
    this.estaLogeado = this.sesionS.estaLogeado();
    this.sesionS.logeado$.subscribe((estado) => {
      this.estaLogeado = estado;
      this.cd.detectChanges();
      this.esAdmin = this.sesionS.decodeToken().role.includes('ADMIN');
      this.esVendedor = this.sesionS.decodeToken().role.includes('VENDEDOR');
    });

    this.anuncioService.listarAnuncios().subscribe((data) => {
      this.anuncios = data;
      console.log(this.anuncios[0]);
    });

    this.anuncioService.getLista().subscribe((data) => {
      this.anuncios = data;
    });
  }

  cerrarSesion() {
    this.loginS.cerrarSesion();
    this.router.navigate(['inicio']);
  }
}
