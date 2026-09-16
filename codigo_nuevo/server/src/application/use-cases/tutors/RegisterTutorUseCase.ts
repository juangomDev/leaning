import { Tutor, TutorModality } from '../../../domain/entities/Tutor.js';
import { ITutorRepository } from '../../../domain/repositories/ITutorRepository.js';
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
    const tutor = new Tutor({
      id: tutorData.id || crypto.randomUUID(),
      fullName: tutorData.fullName || tutorData.name || 'Tutor',
      avatarUrl: tutorData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      subjectName: tutorData.subjectName || tutorData.subject || 'General',
      subjectCategory: tutorData.subjectCategory || 'otro',
      bio: tutorData.bio || '',
      pricePerHour: tutorData.pricePerHour || tutorData.rate || 25,
      modality: tutorData.modality || 'online',
      rating: 5.0,
      reviewsCount: 0,
      badges: ['Nuevo Tutor', 'Verificado'],
      isAvailable: true,
    });

    return await this.tutorRepository.create(tutor);
  }
}
