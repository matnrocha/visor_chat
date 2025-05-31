import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { chatRouter } from './routes/chatRoutes';
// import { errorHandler } from './middlewares/errorHandler';
// import { notFoundHandler } from './middlewares/notFoundHandler';
import { connectToDatabase } from './config/database';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
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
  }

  private setupErrorHandling(): void {
    // this.express.use(notFoundHandler);
    // this.express.use(errorHandler);
  }

  public async initialize(): Promise<void> {
    await connectToDatabase();
  }
}

export const app = new App();