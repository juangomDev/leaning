import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/shared/errors/DomainError.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response | void => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  if (err instanceof DomainError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        type: err.name,
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
