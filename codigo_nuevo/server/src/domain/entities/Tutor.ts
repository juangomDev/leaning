import { ValidationError } from '../errors/DomainError.js';

export type TutorModality = 'online' | 'presencial' | 'ambas';

export interface TutorFilterOptions {
  query?: string;
  category?: string;
  modality?: string;
  maxPrice?: number;
  minRating?: number;
}

export interface TutorProps {
  id: string;
  fullName: string;
  avatarUrl: string;
  subjectName: string;
  subjectCategory: string;
  bio: string;
  pricePerHour?: number;
  modality?: TutorModality;
  rating?: number;
  reviewsCount?: number;
  badges?: string[];
  isAvailable?: boolean;
  createdAt?: Date;
}

export class Tutor {
  public id: string;
  public fullName: string;
  public avatarUrl: string;
  public subjectName: string;
  public subjectCategory: string;
  public bio: string;
  public pricePerHour: number;
  public modality: TutorModality;
  public rating: number;
  public reviewsCount: number;
  public badges: string[];
  public isAvailable: boolean;
  public createdAt: Date;

  constructor({
    id,
    fullName,
    avatarUrl,
    subjectName,
    subjectCategory,
    bio,
    pricePerHour = 25,
    modality = 'online',
    rating = 5.0,
    reviewsCount = 0,
    badges = [],
    isAvailable = true,
    createdAt = new Date(),
  }: TutorProps) {
    this.validatePrice(pricePerHour);
    this.validateCategory(subjectCategory);

    this.id = id;
    this.fullName = fullName;
    this.avatarUrl = avatarUrl;
    this.subjectName = subjectName;
    this.subjectCategory = subjectCategory;
    this.bio = bio;
    this.pricePerHour = Number(pricePerHour);
    this.modality = modality;
    this.rating = Number(rating);
    this.reviewsCount = Number(reviewsCount);
    this.badges = badges;
    this.isAvailable = Boolean(isAvailable);
    this.createdAt = createdAt;
  }

  private validatePrice(price?: number): void {
    if (price === undefined || price < 5) {
      throw new ValidationError('La tarifa por hora debe ser de al menos $5 USD');
    }
  }

  private validateCategory(category: string): void {
    const validCategories = ['matematicas', 'programacion', 'ingles', 'ciencias', 'musica', 'otro'];
    if (category && !validCategories.includes(category.toLowerCase())) {
      throw new ValidationError(`Categoría de materia inválida: ${category}`);
    }
  }

  public matchesFilters({ query, category, modality, maxPrice, minRating }: TutorFilterOptions): boolean {
    if (query) {
      const q = query.toLowerCase();
      const inName = this.fullName?.toLowerCase().includes(q);
      const inSubject = this.subjectName?.toLowerCase().includes(q);
      const inBio = this.bio?.toLowerCase().includes(q);
      if (!inName && !inSubject && !inBio) return false;
    }

    if (category && this.subjectCategory?.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    if (modality && modality !== 'todas') {
      if (this.modality !== 'ambas' && this.modality !== modality) {
        return false;
      }
    }

    if (maxPrice && this.pricePerHour > maxPrice) {
      return false;
    }

    if (minRating && this.rating < minRating) {
      return false;
    }

    return true;
  }
}
