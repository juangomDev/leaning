import { TutorFactory } from '../../../domain/tutor/TutorFactory.js';
import { ITutorRepository } from '../ports/ITutorRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { IClock, SystemClock } from '../../shared/ports/IClock.js';
import { RegisterTutorDTO, TutorResponseDTO } from '../dtos/index.js';
import { TutorMapper } from '../mappers/TutorMapper.js';

export interface RegisterTutorDeps {
  tutorRepository: ITutorRepository;
  clock?: IClock;
}

export class RegisterTutorUseCase implements IUseCase<RegisterTutorDTO, TutorResponseDTO> {
  private readonly tutorRepository: ITutorRepository;
  private readonly clock: IClock;

  constructor({ tutorRepository, clock = new SystemClock() }: RegisterTutorDeps) {
    this.tutorRepository = tutorRepository;
    this.clock = clock;
  }

  async execute(tutorData: RegisterTutorDTO): Promise<TutorResponseDTO> {
    const tutorId = tutorData.id || tutorData.userId;

    const tutor = TutorFactory.create({
      id: tutorId,
      userId: tutorData.userId || tutorId || 'temp-id',
      fullName: tutorData.fullName || tutorData.name || 'Tutor',
      avatarUrl: tutorData.avatarUrl,
      bio: tutorData.bio,
      modality: tutorData.modality,
      subjectName: tutorData.subjectName || tutorData.subject,
      subjectCategory: tutorData.subjectCategory,
      pricePerHour: tutorData.pricePerHour || tutorData.rate,
      description: tutorData.bio,
      badges: tutorData.badges || ['Nuevo Tutor'],
      createdAt: this.clock.now(),
    });

    const saved = await this.tutorRepository.create(tutor);
    return TutorMapper.toDTO(saved);
  }
}
