import { ApplicationError } from './ApplicationError.js';

export class ConflictError extends ApplicationError {
  constructor(message = 'Conflicto con el estado actual del recurso') {
    super(message, 409);
  }
}
