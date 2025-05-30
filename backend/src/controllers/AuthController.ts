import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const { user, token } = await this.authService.register(name, email, password);
      res.status(201).json({ user, token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(400).json({ error: 'Unexpected error' });
          }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
      res.json({ token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } 
        else {
            res.status(400).json({ error: 'Unexpected error' });
        }
    }
  }
}