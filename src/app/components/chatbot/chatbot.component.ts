import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages: { sender: string, text: string }[] = [];
  userInput = '';
  isLoading = false;

isBrowser = typeof window !== 'undefined';

constructor(private http: HttpClient) {
  if (this.isBrowser) {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }
  }
}

  async sendMessage() {
    const userMessage = this.userInput.trim();
    if (!userMessage) return;

    this.messages.push({ sender: 'user', text: userMessage });
    this.userInput = '';
    this.isLoading = true;
    this.saveMessages(); // 👈 guardar

    const body = {
      messages: [
        { role: 'system', content: 'Eres un asistente útil en Angular.' },
        ...this.messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ]
    };

    this.http.post('http://localhost:8080/api/chat', body, { responseType: 'text' }).subscribe(
      (reply: string) => {
        this.messages.push({ sender: 'bot', text: reply });
        this.saveMessages(); // 👈 guardar
      },
      (err) => {
        console.error('Error:', err);
        this.messages.push({ sender: 'bot', text: 'No se pudo conectar con el bot.' });
        this.saveMessages(); // 👈 guardar
      },
      () => {
        this.isLoading = false;
      }
    );
  }

private saveMessages() {
  if (this.isBrowser) {
    localStorage.setItem('chat_messages', JSON.stringify(this.messages));
  }
}

}
