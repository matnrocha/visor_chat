import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { chatRouter } from './routes/chatRoutes';
import { connectToDatabase } from './config/database';
import { modelRouter } from './routes/modelRoutes';
import { setupSwagger } from './config/swagger';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setupMiddlewares();
    setupSwagger(this.express);
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    this.express.use('/api/auth', authRouter);
    this.express.use('/api/users', userRouter);
    this.express.use('/api/sessions', chatRouter);
    this.express.use('/api/models', modelRouter);
  }

  public async initialize(): Promise<void> {
    await connectToDatabase();
  }
}

export const app = new App();