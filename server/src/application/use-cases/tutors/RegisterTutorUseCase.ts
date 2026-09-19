import { Tutor, TutorModality } from '../../../domain/tutor/Tutor.js';
import { TutorSubject } from '../../../domain/tutor/TutorSubject.js';
import { ITutorRepository } from '../../../domain/tutor/TutorRepository.js';
import crypto from 'node:crypto';

export interface RegisterTutorDTO {
  id?: string;
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

export class RegisterTutorUseCase {
  private tutorRepository: ITutorRepository;

  constructor({ tutorRepository }: { tutorRepository: ITutorRepository }) {
    this.tutorRepository = tutorRepository;
  }

  async execute(tutorData: RegisterTutorDTO): Promise<Tutor> {
    const tutorId = tutorData.id || crypto.randomUUID();
    const now = new Date();
    const primarySubject = new TutorSubject({
      id: crypto.randomUUID(),
      tutorId,
      subjectName: tutorData.subjectName || tutorData.subject || 'General',
      category: tutorData.subjectCategory || 'otro',
      pricePerHour: tutorData.pricePerHour || tutorData.rate || 25,
      description: tutorData.bio || 'Clases particulares',
      isActive: true,
      createdAt: now,
    });

    const tutor = new Tutor({
      id: tutorId,
      userId: tutorId,
      fullName: tutorData.fullName || tutorData.name || 'Tutor',
      avatarUrl: tutorData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: tutorData.bio || '',
      modality: tutorData.modality || 'online',
      rating: 5.0,
      reviewsCount: 0,
      badges: ['Nuevo Tutor', 'Verificado'],
      isAvailable: true,
      subjects: [primarySubject],
      createdAt: now,
    });

    return await this.tutorRepository.create(tutor);
  }
}
