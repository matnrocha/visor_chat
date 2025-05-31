import { LLMProvider } from '../llm/types';

export const getDefaultLLMConfig = (): LLMProvider => {
  return (process.env.DEFAULT_LLM_PROVIDER as LLMProvider) || LLMProvider.GEMINI;
};