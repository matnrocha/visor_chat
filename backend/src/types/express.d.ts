declare namespace Express {
  export interface Request {
    userId?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      createdAt: Date;
    };
  }
}