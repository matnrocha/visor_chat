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

  // Session Routes

  /**
   * @swagger
   * /api/sessions/:
   *   get:
   *     summary: Lista as sessões de chat do usuário autenticado
   *     description: Retorna uma lista das sessões de chat associadas ao usuário autenticado.
   *     tags:
   *       - Chat Sessions
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de sessões retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "abc123"
   *                   title:
   *                     type: string
   *                     example: "Sessão de suporte"
   *                   modelType:
   *                     type: string
   *                     example: "gpt-4"
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                     example: "2025-06-01T10:00:00.000Z"
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *                     example: "2025-06-02T12:00:00.000Z"
   *       400:
   *         description: Erro na requisição
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Unexpected error"
   */
  router.get('/', chatController.listSessions);

  /**
   * @swagger
   * /api/sessions/:
   *   post:
   *     summary: Cria uma nova sessão de chat para o usuário autenticado
   *     description: Cria uma sessão de chat baseada no `modelType` enviado no corpo da requisição.
   *     tags:
   *       - Chat Sessions
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       description: Dados para criação da sessão
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - modelType
   *             properties:
   *               modelType:
   *                 type: string
   *                 example: "gpt-4"
   *     responses:
   *       201:
   *         description: Sessão criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "abc123"
   *                 title:
   *                   type: string
   *                   example: "New gpt-4 Chat"
   *                 modelType:
   *                   type: string
   *                   example: "gpt-4"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2025-06-02T14:00:00.000Z"
   *       400:
   *         description: Erro na requisição
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Unexpected error"
   */
  router.post('/', chatController.createSession);
  /**
   * @swagger
   * /api/sessions/{id}:
   *   get:
   *     summary: Retorna uma sessão específica do usuário autenticado
   *     description: Busca uma sessão pelo ID, garantindo que pertença ao usuário autenticado.
   *     tags:
   *       - Chat Sessions
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da sessão de chat
   *         schema:
   *           type: string
   *           example: "abc123"
   *     responses:
   *       200:
   *         description: Sessão encontrada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "abc123"
   *                 title:
   *                   type: string
   *                   example: "Sessão de Suporte"
   *                 modelType:
   *                   type: string
   *                   example: "gpt-4"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2025-06-01T10:00:00.000Z"
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2025-06-02T12:00:00.000Z"
   *       400:
   *         description: Erro na requisição (sessão não encontrada ou acesso negado)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Session not found or access denied"
   */
  router.get('/:id', chatController.getSession);

  /**
   * @swagger
   * /api/sessions/{id}:
   *   patch:
   *     summary: Atualiza o título de uma sessão de chat do usuário autenticado
   *     description: Atualiza o campo `title` da sessão identificada pelo ID, se pertencer ao usuário.
   *     tags:
   *       - Chat Sessions
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da sessão a ser atualizada
   *         schema:
   *           type: string
   *           example: "abc123"
   *     requestBody:
   *       description: Novo título para a sessão
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *                 example: "Novo título da sessão"
   *     responses:
   *       200:
   *         description: Título da sessão atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Session title updated successfully"
   *       404:
   *         description: Sessão não encontrada ou atualização falhou
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Session not found or update failed"
   *       400:
   *         description: Erro na requisição ou outro erro inesperado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Unexpected error"
   */
  router.patch('/:id', chatController.updateSessionTitle);

  /**
   * @swagger
   * /api/sessions/{id}:
   *   delete:
   *     summary: Exclui uma sessão de chat do usuário autenticado
   *     description: Remove a sessão identificada pelo ID, caso pertença ao usuário.
   *     tags:
   *       - Chat Sessions
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da sessão a ser excluída
   *         schema:
   *           type: string
   *           example: "abc123"
   *     responses:
   *       200:
   *         description: Sessão excluída com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Session deleted successfully"
   *       404:
   *         description: Sessão não encontrada ou exclusão falhou
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Session not found or delete failed"
   *       400:
   *         description: Erro na requisição ou erro inesperado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Unexpected error"
   */
  router.delete('/:id', chatController.deleteSession);

  // Message Routes

  /**
   * @swagger
   * /api/sessions/{sessionId}/messages:
   *   post:
   *     summary: Envia uma mensagem para a sessão de chat e recebe resposta do modelo
   *     description: Envia uma mensagem do usuário para a sessão especificada e retorna a resposta gerada pelo modelo de linguagem.
   *     tags:
   *       - Messages
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sessionId
   *         required: true
   *         description: ID da sessão de chat
   *         schema:
   *           type: string
   *           example: "abc123"
   *     requestBody:
   *       description: Conteúdo da mensagem do usuário
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - content
   *             properties:
   *               content:
   *                 type: string
   *                 example: "Olá, como vai?"
   *     responses:
   *       201:
   *         description: Mensagem do modelo criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "msg789"
   *                 content:
   *                   type: string
   *                   example: "Olá! Estou bem, obrigado por perguntar."
   *                 role:
   *                   type: string
   *                   enum: [user, model]
   *                   example: "model"
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2025-06-02T15:00:00.000Z"
   *       400:
   *         description: Erro na requisição (sessão não encontrada, acesso negado ou outro erro)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Session not found or access denied"
   */
  router.post('/:sessionId/messages', chatController.sendMessage);

  /**
   * @swagger
   * /api/sessions/{sessionId}/messages:
   *   get:
   *     summary: Obtém todas as mensagens de uma sessão de chat do usuário autenticado
   *     description: Retorna todas as mensagens associadas à sessão informada, garantindo que o usuário tenha acesso.
   *     tags:
   *       - Messages
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sessionId
   *         required: true
   *         description: ID da sessão de chat
   *         schema:
   *           type: string
   *           example: "abc123"
   *     responses:
   *       200:
   *         description: Lista de mensagens da sessão
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "msg789"
   *                   content:
   *                     type: string
   *                     example: "Olá! Como posso ajudar?"
   *                   role:
   *                     type: string
   *                     enum: [user, model]
   *                     example: "user"
   *                   timestamp:
   *                     type: string
   *                     format: date-time
   *                     example: "2025-06-02T15:00:00.000Z"
   *       400:
   *         description: Erro na requisição (sessão não encontrada ou acesso negado)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Session not found or access denied"
   */
  router.get('/:sessionId/messages', chatController.getMessages);

  return router;
};

export const chatRouter = createChatRoutes();