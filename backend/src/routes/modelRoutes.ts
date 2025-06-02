import { Router } from 'express';
import { ModelController } from '../controllers/ModelController';
import { ModelService } from '../services/ModelService';
import { authenticateToken } from '../middlewares/authMiddleware';

export const createModelRoutes = () => {
    const router = Router();
    const modelService = new ModelService();
    const modelController = new ModelController(modelService);

    router.use(authenticateToken);
    
    /**
     * @swagger
     * /api/models/:
     *   get:
     *     summary: Lista os modelos disponíveis
     *     description: Retorna uma lista dos modelos de linguagem disponíveis para uso, dependendo da configuração do servidor.
     *     tags:
     *       - Models
     *     responses:
     *       200:
     *         description: Lista de modelos disponíveis
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     example: "gemini"
     *                   name:
     *                     type: string
     *                     example: "Gemini 1.5"
     *                   provider:
     *                     type: string
     *                     example: "GEMINI"
     *                   description:
     *                     type: string
     *                     example: "Google Gemini 1.5 Flash"
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
    router.get('/', modelController.listModels);

    //router.post('/switch', modelController.switchModel);

    return router;
};

export const modelRouter = createModelRoutes();