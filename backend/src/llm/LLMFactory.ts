import { ILLM } from "./ILLM";
import { LLMProvider } from "./types"
import { GeminiLLM } from "./implementations/GeminiLLM";

export class LLMFactory {
  static create(provider: LLMProvider, apiKey?: string): ILLM {
    const resolvedKey = apiKey || process.env[`${provider.toUpperCase()}_API_KEY`];
    
    if (!resolvedKey) {
      throw new Error(`${provider} API key is required. Set ${provider.toUpperCase()}_API_KEY in .env`);
    }

    switch (provider) {
      case LLMProvider.GEMINI:
        return new GeminiLLM(resolvedKey);
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }
}