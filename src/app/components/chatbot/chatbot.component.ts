import { Component, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent {
  messages: { sender: string; text: string }[] = [];
  userInput = '';
  isLoading = false;
  isOpen = false;
  errorMessage: string | null = null;

  private http = inject(HttpClient);

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    const userMessage = this.userInput.trim();
    if (!userMessage) return;

    this.messages.push({ sender: 'user', text: userMessage });
    this.userInput = '';
    this.isLoading = true;
    this.errorMessage = null;

    const body = {
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: [
        {
          role: 'user',
          content:
            'Eres un asistente útil de Geoviviendas una aplicacion web que sirve para buscar casas o departamentos para alquilarlar o venderlas si eres un ARRENDATARIO o VENDEDOR y como COMPRADOR poder alquilar o comprar, es una app web completa que permite valorar inmuebles, editar el usuario y los inmuebles, login y cuenta con un mapa donde encontrar los inmuebles. Solo responde preguntas sobre la aplicación. No des información adicional. Si no sabes la respuesta, di "Ahora no joven, gracias. Cada que recivas un hola o saludo empiezas desde cero. Respuesta maxima de 100 palabras.".',
        },
        ...this.messages.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
      ],
    };

    try {
      const response: any = await firstValueFrom(
        this.http.post('https://openrouter.ai/api/v1/chat/completions', body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${environment.openRouterApiKey}`,
            'HTTP-Referer': 'https://geovivienda-app.vercel.app/',
            'X-Title': 'geovivienda-app',
          },
        })
      );

      const botReply =
        response?.choices?.[0]?.message?.content || 'Sin respuesta del bot.';
      this.messages.push({ sender: 'bot', text: botReply });
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Error al conectar con OpenRouter.';
    } finally {
      this.isLoading = false;
    }
  }
}
