import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';

const AuthRouter = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

AuthRouter.post('/register', authController.register.bind(authController));
AuthRouter.post('/login', authController.login.bind(authController));

export default AuthRouter;