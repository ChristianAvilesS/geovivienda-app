import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotStateService {
  messages: { sender: string, text: string }[] = [];
}
