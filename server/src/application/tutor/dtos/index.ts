import { TutorModality } from '../../../domain/tutor/Tutor.js';

export interface RegisterTutorDTO {
  id?: string;
  userId?: string;
  fullName?: string;
  name?: string;
  avatarUrl?: string;
  subjectName?: string;
  subject?: string;
  subjectCategory?: string;
  bio?: string;
  pricePerHour?: number;
  rate?: number;
  modality?: TutorModality;
}

export interface GetTutorsFilterDTO {
  search?: string;
  query?: string;
  category?: string;
  modality?: TutorModality | string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export interface AddSubjectDTO {
  tutorId: string;
  subjectName: string;
  category: string;
  pricePerHour: number;
  description?: string;
}

export interface TutorSubjectResponseDTO {
  id: string;
  tutorId: string;
  subjectName: string;
  category: string;
  pricePerHour: number;
  description: string | null;
  isActive: boolean;
}

export interface TutorResponseDTO {
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
  subjects: TutorSubjectResponseDTO[];
  createdAt: string;
}
