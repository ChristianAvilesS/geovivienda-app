import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/util/header/header.component';
import { FooterComponent } from './components/util/footer/footer.component';
import { SesionUsuarioService } from './services/sesion-usuario.service';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from './services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    ChatbotComponent,
    FooterComponent,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  loading = false;

  constructor(
    private sesionS: SesionUsuarioService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const payload = this.sesionS.decodeToken();
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now && this.sesionS.estaLogeado()) {
      this.sesionS.cerrarSesion();
      this.router.navigate(['/inicio']);
    }

    this.loadingService.loading$.subscribe((estado) => {
      setTimeout(() => {
        this.loading = estado;
      });
    });
  }
}
