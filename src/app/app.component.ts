import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsuarioComponent } from "./components/usuario/usuario.component";
import { ChatbotComponent } from './components/chatbot/chatbot.component';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UsuarioComponent, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'geovivienda-app';
}
