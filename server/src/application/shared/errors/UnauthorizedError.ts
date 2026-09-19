import { ApplicationError } from './ApplicationError.js';

export class UnauthorizedError extends ApplicationError {
  constructor(message = 'Acceso no autorizado o credenciales inválidas') {
    super(message, 401);
  }
}
