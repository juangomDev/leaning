import crypto from 'node:crypto';
import { Tutor, TutorModality } from './Tutor.js';
import { TutorSubject } from './TutorSubject.js';
import { SubjectCategory } from './value-objects/SubjectCategory.js';

export interface CreateTutorDTO {
  id?: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  modality?: TutorModality;
  subjectName?: string;
  subjectCategory?: string;
  pricePerHour?: number;
  description?: string;
  badges?: string[];
  createdAt?: Date;
}

export class TutorFactory {
  public static create({
    id,
    userId,
    fullName,
    avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio = '',
    modality = 'online',
    subjectName = 'General',
    subjectCategory = 'otro',
    pricePerHour = 25,
    description = 'Clases particulares',
    badges = ['Nuevo Tutor'],
    createdAt = new Date(),
  }: CreateTutorDTO): Tutor {
    const tutorId = id || crypto.randomUUID();
    const now = createdAt;

    const primarySubject = new TutorSubject({
      id: crypto.randomUUID(),
      tutorId,
      subjectName,
      category: SubjectCategory.create(subjectCategory),
      pricePerHour,
      description,
      isActive: true,
      createdAt: now,
    });

    return new Tutor({
      id: tutorId,
      userId,
      fullName,
      avatarUrl,
      bio,
      modality,
      rating: 5.0,
      reviewsCount: 0,
      badges,
      isAvailable: true,
      subjects: [primarySubject],
      createdAt: now,
    });
  }

  public static reconstitute(raw: {
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
    createdAt: Date | string;
  }): Tutor {
    return new Tutor({
      id: raw.id,
      userId: raw.userId,
      fullName: raw.fullName,
      avatarUrl: raw.avatarUrl,
      bio: raw.bio,
      modality: raw.modality,
      rating: raw.rating,
      reviewsCount: raw.reviewsCount,
      badges: raw.badges,
      isAvailable: raw.isAvailable,
      subjects: raw.subjects,
      createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt),
    });
  }
}
