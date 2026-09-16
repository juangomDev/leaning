import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './interfaces/http/routes/index.js';
import { errorHandler } from './interfaces/http/middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-user-id', 'x-demo-role'],
}));

app.use(express.json());

// API Prefix
app.use('/api/v1', apiRouter);

// Root fallback
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'EduConnect Backend API',
    language: 'TypeScript',
    architecture: 'Clean Architecture (Domain, Application, Interfaces, Infrastructure)',
    docs: '/api/v1/health',
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

export default app;
