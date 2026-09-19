import { ValidationError } from '../../shared/errors/DomainError.js';

export class Phone {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string | null): Phone | null {
    if (value === null || value === undefined) {
      return null;
    }

    const trimmed = value.trim();
    if (trimmed === '') {
      return null;
    }

    // Permitir dígitos, espacios, guiones y el signo +
    const phoneRegex = /^\+?[\d\s-]{7,20}$/;
    if (!phoneRegex.test(trimmed)) {
      throw new ValidationError(`El número de teléfono "${value}" no es válido. Debe contener entre 7 y 20 dígitos.`);
    }

    return new Phone(trimmed);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Phone | null): boolean {
    return other instanceof Phone && this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
