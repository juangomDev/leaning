import { ValidationError } from '../shared/errors/DomainError.js';
import { TutorSubject } from './TutorSubject.js';

export type TutorModality = 'online' | 'presencial' | 'ambas';

export const VALID_TUTOR_MODALITIES: readonly TutorModality[] = ['online', 'presencial', 'ambas'] as const;

export interface TutorFilterOptions {
  query?: string;
  category?: string;
  modality?: string;
  maxPrice?: number;
  minRating?: number;
}

export interface TutorProps {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  modality: TutorModality;
  rating: number;
  reviewsCount: number;
  badges: string[];
  isAvailable: boolean;
  subjects: TutorSubject[];
  createdAt: Date;
}

export class Tutor {
  public readonly id: string;
  public readonly userId: string;
  public fullName: string;
  public avatarUrl: string;
  public bio: string;
  public modality: TutorModality;
  public rating: number;
  public reviewsCount: number;
  public badges: string[];
  public isAvailable: boolean;
  public readonly createdAt: Date;
  private _subjects: Map<string, TutorSubject>;

  constructor({
    id,
    userId,
    fullName,
    avatarUrl,
    bio,
    modality,
    rating,
    reviewsCount,
    badges,
    isAvailable,
    subjects,
    createdAt,
  }: TutorProps) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('El id del tutor es requerido');
    }
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new ValidationError('El userId del tutor es requerido');
    }
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      throw new ValidationError('El nombre completo (fullName) del tutor es requerido');
    }
    if (avatarUrl === undefined || avatarUrl === null) {
      throw new ValidationError('El avatarUrl del tutor es requerido');
    }
    if (bio === undefined || bio === null) {
      throw new ValidationError('La biografía (bio) del tutor es requerida');
    }
    if (!VALID_TUTOR_MODALITIES.includes(modality)) {
      throw new ValidationError(`Modalidad inválida: "${modality}". Válidas: ${VALID_TUTOR_MODALITIES.join(', ')}`);
    }
    if (reviewsCount === undefined || isNaN(reviewsCount) || reviewsCount < 0) {
      throw new ValidationError('El número de reseñas (reviewsCount) es requerido y no puede ser negativo');
    }
    if (!badges || !Array.isArray(badges)) {
      throw new ValidationError('Las insignias (badges) son requeridas como arreglo');
    }
    if (typeof isAvailable !== 'boolean') {
      throw new ValidationError('La disponibilidad (isAvailable) es requerida y debe ser booleana');
    }
    if (!subjects || !Array.isArray(subjects)) {
      throw new ValidationError('La lista de materias (subjects) es requerida como arreglo');
    }
    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError('La fecha de creación createdAt es requerida y debe ser válida');
    }

    this.validateRating(rating);

    this.id = id.trim();
    this.userId = userId.trim();
    this.fullName = fullName.trim();
    this.avatarUrl = avatarUrl;
    this.bio = bio.trim();
    this.modality = modality;
    this.rating = Number(rating);
    this.reviewsCount = Number(reviewsCount);
    this.badges = [...badges];
    this.isAvailable = isAvailable;
    this.createdAt = createdAt;

    this._subjects = new Map<string, TutorSubject>();
    for (const subj of subjects) {
      this.addSubject(subj);
    }
  }

  public get subjects(): TutorSubject[] {
    return Array.from(this._subjects.values());
  }

  public get subjectName(): string {
    const primary = this.subjects[0];
    return primary ? primary.subjectName : 'General';
  }

  public get subjectCategory(): string {
    const primary = this.subjects[0];
    return primary ? primary.category : 'otro';
  }

  public get pricePerHour(): number {
    const primary = this.subjects[0];
    return primary ? primary.pricePerHour : 25;
  }

  public addSubject(subject: TutorSubject): void {
    if (!subject || !(subject instanceof TutorSubject)) {
      throw new ValidationError('Se requiere una instancia válida de TutorSubject');
    }
    if (subject.tutorId !== this.id && subject.tutorId !== this.userId) {
      throw new ValidationError('La materia no corresponde a este tutor');
    }
    this._subjects.set(subject.id, subject);
  }

  public removeSubject(subjectId: string): void {
    this._subjects.delete(subjectId);
  }

  public getSubject(subjectId: string): TutorSubject | undefined {
    return this._subjects.get(subjectId);
  }

  public setAvailability(available: boolean): void {
    if (typeof available !== 'boolean') {
      throw new ValidationError('El valor de disponibilidad debe ser booleano');
    }
    this.isAvailable = available;
  }

  public addReviewRating(newRating: number): void {
    this.validateRating(newRating);
    const totalPreviousScore = this.rating * this.reviewsCount;
    this.reviewsCount += 1;
    this.rating = Number(((totalPreviousScore + newRating) / this.reviewsCount).toFixed(2));
  }

  private validateRating(rating: number): void {
    if (isNaN(rating) || rating < 1.0 || rating > 5.0) {
      throw new ValidationError('El rating debe estar comprendido entre 1.0 y 5.0');
    }
  }

  public matchesFilters({ query, category, modality, maxPrice, minRating }: TutorFilterOptions): boolean {
    if (query) {
      const q = query.toLowerCase();
      const inName = this.fullName.toLowerCase().includes(q);
      const inBio = this.bio.toLowerCase().includes(q);
      const inAnySubject = this.subjects.some((s) =>
        s.subjectName.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
      if (!inName && !inBio && !inAnySubject) return false;
    }

    if (category) {
      const cat = category.toLowerCase();
      const hasSubjectCategory = this.subjects.some((s) => s.category.toLowerCase() === cat);
      if (!hasSubjectCategory && this.subjectCategory.toLowerCase() !== cat) return false;
    }

    if (modality && modality !== 'todas') {
      if (this.modality !== 'ambas' && this.modality !== modality) {
        return false;
      }
    }

    if (maxPrice) {
      const minSubjectPrice = this.subjects.length > 0
        ? Math.min(...this.subjects.map((s) => s.pricePerHour))
        : this.pricePerHour;
      if (minSubjectPrice > maxPrice) {
        return false;
      }
    }

    if (minRating && this.rating < minRating) {
      return false;
    }

    return true;
  }
}
