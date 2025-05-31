import { Router } from 'express';
import { ModelController } from '../controllers/ModelController';
import { ModelService } from '../services/ModelService';
import { authenticateToken } from '../middlewares/authMiddleware';

export const createModelRoutes = () => {
    const router = Router();
    const modelService = new ModelService();
    const modelController = new ModelController(modelService);

    router.use(authenticateToken);

    router.get('/', modelController.listModels);
    //router.post('/switch', modelController.switchModel);

    return router;
};

export const modelRouter = createModelRoutes();