import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';

export class ChatController {
  constructor(private chatService: ChatService) {}

  createSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const session = await this.chatService.createSession(
        req.userId!, // Adicionado pelo authMiddleware
        req.body.modelType
      );
      res.status(201).json({
        id: session.id,
        title: session.title,
        modelType: session.modelType,
        createdAt: session.createdAt
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unexpected error' });
      }
    }
  };

  listSessions = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessions = await this.chatService.listUserSessions(req.userId!);
      res.json(sessions.map(s => ({
        id: s.id,
        title: s.title,
        modelType: s.modelType,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt
      })));
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unexpected error' });
      }
    }
  };


  
  getSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const session = await this.chatService.getSession(
        req.params.id,
        req.userId!
      );
      res.json({
        id: session.id,
        title: session.title,
        modelType: session.modelType,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unexpected error' });
      }
    }
  };


  
  updateSessionTitle = async (req: Request, res: Response): Promise<void> => {
    try {
      const success = await this.chatService.updateSessionTitle(
        req.params.id,
        req.userId!,
        req.body.title
      );
      if (success) {
        res.json({ message: 'Session title updated successfully' });
      } else {
        res.status(404).json({ error: 'Session not found or update failed' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unexpected error' });
      }
    }
  };


  
  deleteSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const success = await this.chatService.deleteSession(
        req.params.id,
        req.userId!
      );
      if (success) {
        res.json({ message: 'Session deleted successfully' });
      } else {
        res.status(404).json({ error: 'Session not found or delete failed' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unexpected error' });
      }
    }
  };


  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const message = await this.chatService.sendMessage(
        req.params.sessionId,
        req.userId!, // Adicionado pelo authMiddleware
        req.body.content
      );
      res.status(201).json({
        id: message.id,
        content: message.content,
        role: message.role,
        timestamp: message.timestamp
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unexpected error' });
      }
    }
  };

  getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const messages = await this.chatService.getSessionMessages(
        req.params.sessionId,
        req.userId! // Adicionado pelo authMiddleware
      );
      res.json(messages.map(m => ({
        id: m.id,
        content: m.content,
        role: m.role,
        timestamp: m.timestamp
      })));
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unexpected error' });
      }
    }
  };
}