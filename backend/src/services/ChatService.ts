import { ChatSessionRepository } from '../repositories/ChatSessionRepository';
import { MessageRepository } from '../repositories/MessageRepository';
import { ChatSession } from '../entities/ChatSession';
import { Message } from '../entities/Message';
import { LLMProvider } from '../llm/types';
import { LLMFactory } from '../llm/LLMFactory';
import { ILLM } from '../llm/ILLM';

export class ChatService {
    private llm: ILLM;
    
    constructor(
        private sessionRepository: ChatSessionRepository,
        private messageRepository: MessageRepository,
        private llmProvider: LLMProvider = LLMProvider.GEMINI
        ) {
        this.llm = LLMFactory.create(llmProvider);
        }

  async createSession(userId: string, modelType: string): Promise<ChatSession> {
    const session = new ChatSession(
      '', // ID gerado pelo MongoDB
      userId,
      modelType,
      `New ${modelType} Chat`
    );
    return this.sessionRepository.create(session);
  }

    async sendMessage(sessionId: string, userId: string, content: string
    ): Promise<Message> {
        const session = await this.sessionRepository.findById(sessionId);
        if (!session || session.userId !== userId) {
            throw new Error('Session not found or access denied');
        }

        // 1. Salva mensagem do usuário
        const userMessage = new Message(
        '',
        sessionId,
        content,
        'user',
        session.modelType
        );
        await this.messageRepository.create(userMessage);

        // 2. Obtém histórico da conversa
        const previousMessages = await this.messageRepository.findBySessionId(sessionId);
        
        // 3. Formata mensagens para o LLM
        const chatHistory = previousMessages.map(msg => ({
        role: msg.role as 'user' | 'model',
        content: msg.content
        }));

        // 4. Obtém resposta do LLM
        const llmResponse = await this.llm.getChatResponse([
        ...chatHistory,
        { role: 'user', content }
        ]);

        // 5. Salva resposta do modelo
        const modelMessage = new Message(
        '',
        sessionId,
        llmResponse,
        'model',
        session.modelType
        );

        return this.messageRepository.create(modelMessage);
    }


    async getSessionMessages(sessionId: string, userId: string): Promise<Message[]> {
        const session = await this.sessionRepository.findById(sessionId);
        if (!session || session.userId !== userId) {
            throw new Error('Session not found or access denied');
        }
        return this.messageRepository.findBySessionId(sessionId);
    }
}