import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { authenticateToken } from '../middlewares/authMiddleware';

export const createAuthRoutes = () => {
  const router = Router();
  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/me', authenticateToken, authController.getCurrentUser);
  router.post('/logout', authenticateToken, authController.logout);

  return router;
};

export default createAuthRoutes();