import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  constructor(private userService: UserService) {}

  getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.getUserProfile(req.params.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  };

  updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedUser = await this.userService.updateUserProfile(
        req.params.id,
        req.body
      );
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  };

  deleteUserAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const success = await this.userService.deleteUserAccount(req.params.id);
      if (!success) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  };
}