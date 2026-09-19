import { ValidationError } from '../shared/errors/DomainError.js';
import { SubjectCategory, type SubjectCategoryType } from './value-objects/SubjectCategory.js';

export type { SubjectCategoryType };

export const MIN_PRICE_PER_HOUR = 5;

export interface TutorSubjectProps {
  id: string;
  tutorId: string;
  subjectName: string;
  category: SubjectCategory | string;
  pricePerHour: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export class TutorSubject {
  public readonly id: string;
  public readonly tutorId: string;
  public subjectName: string;
  private _category: SubjectCategory;
  public pricePerHour: number;
  public description: string;
  public isActive: boolean;
  public readonly createdAt: Date;

  constructor({
    id,
    tutorId,
    subjectName,
    category,
    pricePerHour,
    description,
    isActive,
    createdAt,
  }: TutorSubjectProps) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('El id de la materia del tutor es requerido');
    }
    if (!tutorId || typeof tutorId !== 'string' || tutorId.trim() === '') {
      throw new ValidationError('El tutorId es requerido');
    }
    if (!subjectName || typeof subjectName !== 'string' || subjectName.trim() === '') {
      throw new ValidationError('El nombre de la materia es requerido');
    }
    if (!description || typeof description !== 'string' || description.trim() === '') {
      throw new ValidationError('La descripción de la materia es requerida');
    }
    if (typeof isActive !== 'boolean') {
      throw new ValidationError('El estado isActive debe ser booleano');
    }
    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError('La fecha de creación createdAt es requerida y debe ser válida');
    }

    const catVO = category instanceof SubjectCategory ? category : SubjectCategory.create(category);
    this.validatePrice(pricePerHour);

    this.id = id.trim();
    this.tutorId = tutorId.trim();
    this.subjectName = subjectName.trim();
    this._category = catVO;
    this.pricePerHour = Number(pricePerHour);
    this.description = description.trim();
    this.isActive = isActive;
    this.createdAt = createdAt;
  }

  public get category(): SubjectCategoryType {
    return this._category.value;
  }

  public get categoryVO(): SubjectCategory {
    return this._category;
  }

  public updatePrice(newPrice: number): void {
    this.validatePrice(newPrice);
    this.pricePerHour = Number(newPrice);
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  private validatePrice(price: number): void {
    if (price === undefined || isNaN(price) || price < MIN_PRICE_PER_HOUR) {
      throw new ValidationError(`La tarifa por hora debe ser de al menos $${MIN_PRICE_PER_HOUR} USD`);
    }
  }
}
