import { Component, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, NgClass],
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
            'Eres un asistente útil de Geoviviendas. Solo responde preguntas sobre la aplicación.',
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
            'Authorization': `Bearer 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`,
            'HTTP-Referer': 'https://localhost:4200/',
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
