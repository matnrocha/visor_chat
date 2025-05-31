import { Request, Response } from 'express';
import { ModelService } from '../services/ModelService';

export class ModelController {
    constructor(private modelService: ModelService) {}

    listModels = async (req: Request, res: Response): Promise<void> => {
        try {
            const models = await this.modelService.getAvailableModels();
            res.json(models);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unexpected error' });
            }
        }
    };

    switchModel = async (req: Request, res: Response): Promise<void> => {
        try {
            const { sessionId, modelType } = req.body;
            const success = await this.modelService.switchModel(
                sessionId,
                req.userId!,
                modelType
            );
            if (success) {
                res.json({ message: 'Model switched successfully' });
            } else {
                res.status(400).json({ error: 'Failed to switch model' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Unexpected error' });
            }
        }
    };
}