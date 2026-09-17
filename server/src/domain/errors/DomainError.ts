/**
 * DOMAIN LAYER - ERRORS
 * Pure domain exceptions independent of HTTP or database
 */

export class DomainError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends DomainError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 404);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'Acceso no autorizado') {
    super(message, 401);
  }
}

export class ConflictError extends DomainError {
  constructor(message = 'Conflicto con recurso existente') {
    super(message, 409);
  }
}
