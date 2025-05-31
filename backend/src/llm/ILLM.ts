import { ChatMessage } from "./types";

export interface ILLM {
  getResponse(prompt: string): Promise<string>;
  getChatResponse(messages: ChatMessage[]): Promise<string>;
  getModelName(): string;
}