import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-1.5-flash';

async function testGeminiIntegration() {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY não encontrada no .env');
    }

    console.log('Iniciando teste do Gemini...');
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    console.log('\nTeste de geração de texto simples:');
    const prompt = "Explique como funciona o TypeScript em 1 parágrafo";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Pergunta:', prompt);
    console.log('Resposta:', text);

    console.log('\nTeste de conversa com histórico:');
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Você é um assistente especializado em desenvolvimento de software" }],
        },
        {
          role: "model",
          parts: [{ text: "Sim, sou um especialista em desenvolvimento de software. Como posso ajudar?" }],
        },
      ],
    });

    const chatResult = await chat.sendMessage("Quais são as boas práticas para usar TypeScript com React?");
    const chatResponse = await chatResult.response;
    const chatText = chatResponse.text();

    console.log('Resposta com contexto:', chatText);

    console.log('\nTeste do Gemini concluído com sucesso!');

  } catch (error) {
    console.error('Erro no teste do Gemini:');
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

testGeminiIntegration();