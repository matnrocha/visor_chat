import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { ChatService } from '../services/ChatService';
import { ChatSessionRepository } from '../repositories/ChatSessionRepository';
import { MessageRepository } from '../repositories/MessageRepository';
import { authenticateToken } from '../middlewares/authMiddleware';

export const createChatRoutes = () => {
  const router = Router();
  const sessionRepository = new ChatSessionRepository();
  const messageRepository = new MessageRepository();
  const chatService = new ChatService(sessionRepository, messageRepository);
  const chatController = new ChatController(chatService);

  router.use(authenticateToken);

  router.post('/', chatController.createSession);
  router.post('/:sessionId/messages', chatController.sendMessage);
  router.get('/:sessionId/messages', chatController.getMessages);

  return router;
};

export const chatRouter = createChatRoutes();