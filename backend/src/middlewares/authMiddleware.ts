import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token missing' });
    return; 
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_secret', (err, decoded) => {
    if (err) {
      res.status(401).json({ error: 'Invalid token' });
      return;  
    }

    const payload = decoded as JwtPayload;
    req.userId = payload.userId;

    next(); 
  });
};
