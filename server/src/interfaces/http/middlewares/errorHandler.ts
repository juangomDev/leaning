import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/shared/errors/DomainError.js';
import { ApplicationError } from '../../../application/shared/errors/ApplicationError.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response | void => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  const statusCode = (err as any).statusCode || (err instanceof DomainError || err instanceof ApplicationError ? err.statusCode : null);

  if (statusCode) {
    return res.status(statusCode).json({
      success: false,
      error: {
        type: err.name || 'ApplicationError',
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      type: 'InternalServerError',
      message: 'Ocurrió un error inesperado en el servidor',
    },
  });
};
