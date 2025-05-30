import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { authenticateToken } from '../middlewares/authMiddleware';

export const createUserRoutes = () => {
  const router = Router();
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  router.use(authenticateToken);

  router.get('/:id', userController.getUserProfile);
  router.patch('/:id', userController.updateUserProfile);
  router.delete('/:id', userController.deleteUserAccount);

  return router;
};

export const userRouter = createUserRoutes();