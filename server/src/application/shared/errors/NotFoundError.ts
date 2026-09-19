import { ApplicationError } from './ApplicationError.js';

export class NotFoundError extends ApplicationError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 404);
  }
}
