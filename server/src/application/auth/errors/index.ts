import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { ConflictError } from '../../shared/errors/ConflictError.js';

export class InvalidCredentialsError extends UnauthorizedError {
  constructor(message = 'Credenciales inválidas. Correo o contraseña incorrectos.') {
    super(message);
  }
}

export class UserAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`Ya existe un usuario registrado con el correo: ${email}`);
  }
}
