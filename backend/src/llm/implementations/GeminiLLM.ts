import { GoogleGenerativeAI } from '@google/generative-ai';
import { ILLM } from '../ILLM';
import { ChatMessage } from '../types';

export class GeminiLLM implements ILLM {
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName: string;

  constructor(
    apiKey: string,
    model: string = 'gemini-1.5-flash'
  ) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = model;
  }

  async getResponse(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async getChatResponse(messages: ChatMessage[]): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });
    
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const result = await model.generateContent({
      contents: formattedMessages,
    });

    return result.response.text();
  }

  getModelName(): string {
    return this.modelName;
  }
}