import { ValidationError } from '../../shared/errors/DomainError.js';

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Email {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('El correo electrónico es requerido');
    }

    const trimmed = value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      throw new ValidationError(`El correo electrónico "${value}" no tiene un formato válido`);
    }

    return new Email(trimmed);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return other instanceof Email && this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
