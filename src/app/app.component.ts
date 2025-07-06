import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/util/header/header.component';
import { FooterComponent } from './components/util/footer/footer.component';
import { SesionUsuarioService } from './services/sesion-usuario.service';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ChatbotComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private sesionS: SesionUsuarioService, private router: Router) {}

  ngOnInit(): void {
    const payload = this.sesionS.decodeToken();
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now && this.sesionS.estaLogeado()) {
      this.sesionS.cerrarSesion();
      this.router.navigate(['/inicio']);
    }
  }
}
