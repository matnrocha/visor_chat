import express from 'express';
import { app } from './app';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.express.use(cors({
  origin: 'http://localhost:5173', // substitua pela URL do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // se estiver usando cookies/sessões
}));

// Middleware para parsear JSON
app.express.use(express.json());


app.initialize()
  .then(() => {
    app.express.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });