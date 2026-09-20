import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import apiRouter from './interfaces/http/routes/index.js';
import { errorHandler } from './interfaces/http/middlewares/errorHandler.js';
import { config } from './infrastructure/config/env.js';

const app = express();

// 1. Ocultar huella tecnológica del servidor
app.disable('x-powered-by');

// 2. Cabeceras HTTP de seguridad con Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: config.nodeEnv === 'production',
  })
);

// 3. Configuración Segura de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  config.clientUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (como Postman, apps móviles o curl)
      if (!origin) return callback(null, true);

      // En desarrollo permitir cualquier origen local
      if (config.nodeEnv !== 'production') {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Bloqueado por política CORS: origen ${origin} no autorizado`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-user-id', 'x-demo-role'],
    maxAge: 86400, // 24 horas de cache preflight
  })
);

// 4. Procesamiento de Cookies y Límite de tamaño de Payload
app.use(cookieParser());
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));

// 5. Rutas de la API
app.use('/api/v1', apiRouter);

// 6. Endpoint raíz informativo
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'EduConnect Backend API',
    status: 'online',
    environment: config.nodeEnv,
    architecture: 'Clean Architecture (DDD)',
    health: '/api/v1/health',
  });
});

// 7. Manejador 404 para rutas no existentes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      type: 'NotFoundError',
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    },
  });
});

// 8. Manejador centralizado de errores
app.use(errorHandler);

export default app;
