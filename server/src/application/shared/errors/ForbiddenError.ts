import { ApplicationError } from './ApplicationError.js';

export class ForbiddenError extends ApplicationError {
  constructor(message = 'No tienes permisos suficientes para realizar esta acción') {
    super(message, 403);
  }
}
