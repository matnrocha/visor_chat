import { ChatSessionRepository } from '../repositories/ChatSessionRepository';
import { LLMProvider } from '../llm/types';

export class ModelService {
    private sessionRepository: ChatSessionRepository;

    constructor() {
        this.sessionRepository = new ChatSessionRepository();
    }

    getAvailableModels() {
        const availableModels = [
            ...(process.env.GEMINI_API_KEY ? [{
                id: 'gemini',
                name: 'Gemini 1.5',
                provider: LLMProvider.GEMINI,
                description: 'Google Gemini 1.5 Flash'
            }] : []),

            // local a incluir novos modelos
        ];

        return availableModels;
    }

    async switchModel(sessionId: string, userId: string, modelType: string) {
        const session = await this.sessionRepository.findById(sessionId);
        if (!session || session.userId !== userId) {
            throw new Error('Session not found or access denied');
        }

        const availableModels = this.getAvailableModels();
        if (!availableModels.some(m => m.id === modelType)) {
            throw new Error(`Model ${modelType} is unavailable or not configured`);
        }

        return this.sessionRepository.updateModel(sessionId, modelType);
    }
}