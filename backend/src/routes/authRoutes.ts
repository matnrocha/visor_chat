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

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Registro de novo usuário
   *     description: Cria um novo usuário com nome, email e senha, retorna o usuário criado e um token JWT.
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *                 example: João Silva
   *               email:
   *                 type: string
   *                 example: joao.silva@exemplo.com
   *               password:
   *                 type: string
   *                 example: senha123
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso e token retornado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: 64a7e8f5e4b0b12d3c456789
   *                     name:
   *                       type: string
   *                       example: João Silva
   *                     email:
   *                       type: string
   *                       example: joao.silva@exemplo.com
   *                     password:
   *                       type: string
   *                       example: "$2b$10$H...."  # hash bcrypt
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                 token:
   *                   type: string
   *       400:
   *         description: Erro no registro do usuário
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  router.post('/register', authController.register);


  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login do usuário
   *     description: Autentica usuário com email e senha e retorna um token JWT.
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 example: usuario@exemplo.com
   *               password:
   *                 type: string
   *                 example: senha123
   *     responses:
   *       200:
   *         description: Token JWT gerado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       400:
   *         description: Erro na autenticação
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */

  router.post('/login', authController.login);

  
  /**
   * @swagger
   * /me:
   *   get:
   *     summary: Retorna o usuário autenticado
   *     description: Retorna os dados do usuário autenticado com base no token JWT.
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Usuário encontrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "12345"
   *                 name:
   *                   type: string
   *                   example: "João Silva"
   *                 email:
   *                   type: string
   *                   format: email
   *                   example: "joao.silva@example.com"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-04-26T15:30:00.000Z"
   *       401:
   *         description: Usuário não autenticado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Usuário não autenticado"
   *       404:
   *         description: Usuário não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "User not found"
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Server error"
   */
  router.get('/me', authenticateToken, authController.getCurrentUser);
  router.post('/logout', authenticateToken, authController.logout);

  return router;
};

export default createAuthRoutes();
