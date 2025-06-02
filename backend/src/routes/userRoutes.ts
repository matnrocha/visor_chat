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

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Obtém o perfil público de um usuário pelo ID
   *     description: Retorna informações básicas do usuário, como id, nome, email e data de criação.
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário
   *         schema:
   *           type: string
   *           example: "user123"
   *     responses:
   *       200:
   *         description: Perfil do usuário retornado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "user123"
   *                 name:
   *                   type: string
   *                   example: "João Silva"
   *                 email:
   *                   type: string
   *                   example: "joao.silva@example.com"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-01-15T10:00:00.000Z"
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
   *         description: Erro no servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Server error"
   */
  router.get('/:id', userController.getUserProfile);

  /**
   * @swagger
   * /api/users/{id}:
   *   patch:
   *     summary: Atualiza o perfil do usuário pelo ID
   *     description: Atualiza o nome e/ou email do usuário especificado.
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário a ser atualizado
   *         schema:
   *           type: string
   *           example: "user123"
   *     requestBody:
   *       description: Dados para atualizar o perfil do usuário (nome e/ou email)
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Novo Nome"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "novo.email@example.com"
   *     responses:
   *       200:
   *         description: Perfil atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "user123"
   *                 name:
   *                   type: string
   *                   example: "Novo Nome"
   *                 email:
   *                   type: string
   *                   format: email
   *                   example: "novo.email@example.com"
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
   *         description: Erro no servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Server error"
   */
  router.patch('/:id', userController.updateUserProfile);

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Exclui a conta do usuário pelo ID
   *     description: Remove a conta do usuário especificado. Retorna mensagem de sucesso ou erro se não encontrado.
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário a ser deletado
   *         schema:
   *           type: string
   *           example: "user123"
   *     responses:
   *       200:
   *         description: Usuário deletado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "User deleted successfully"
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
   *         description: Erro no servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Server error"
   */
  router.delete('/:id', userController.deleteUserAccount);

  return router;
};

export const userRouter = createUserRoutes();