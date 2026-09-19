import { ValidationError } from '../../shared/errors/DomainError.js';

export type SubjectCategoryType =
  | 'matematicas'
  | 'programacion'
  | 'ingles'
  | 'ciencias'
  | 'musica'
  | 'otro';

export const VALID_CATEGORIES: readonly SubjectCategoryType[] = [
  'matematicas',
  'programacion',
  'ingles',
  'ciencias',
  'musica',
  'otro',
] as const;

export class SubjectCategory {
  private readonly _value: SubjectCategoryType;

  private constructor(value: SubjectCategoryType) {
    this._value = value;
  }

  public static create(value: string): SubjectCategory {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('La categoría de la materia es requerida');
    }

    const normalized = value.trim().toLowerCase() as SubjectCategoryType;
    if (!VALID_CATEGORIES.includes(normalized)) {
      throw new ValidationError(
        `Categoría de materia inválida: "${value}". Permitidas: ${VALID_CATEGORIES.join(', ')}`
      );
    }

    return new SubjectCategory(normalized);
  }

  public get value(): SubjectCategoryType {
    return this._value;
  }

  public equals(other: SubjectCategory): boolean {
    return other instanceof SubjectCategory && this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
