import crypto from 'node:crypto';
import { TutorSubject } from '../../../domain/tutor/TutorSubject.js';
import { ITutorRepository } from '../ports/ITutorRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { AddSubjectDTO, TutorResponseDTO } from '../dtos/index.js';
import { TutorMapper } from '../mappers/TutorMapper.js';

export interface AddTutorSubjectDeps {
  tutorRepository: ITutorRepository;
}

export class AddTutorSubjectUseCase implements IUseCase<AddSubjectDTO, TutorResponseDTO> {
  private readonly tutorRepository: ITutorRepository;

  constructor({ tutorRepository }: AddTutorSubjectDeps) {
    this.tutorRepository = tutorRepository;
  }

  async execute(dto: AddSubjectDTO): Promise<TutorResponseDTO> {
    const tutor = await this.tutorRepository.findById(dto.tutorId);
    if (!tutor) {
      throw new NotFoundError(`Tutor con ID ${dto.tutorId}`);
    }

    const newSubject = new TutorSubject({
      id: crypto.randomUUID(),
      tutorId: tutor.id,
      subjectName: dto.subjectName,
      category: dto.category,
      pricePerHour: dto.pricePerHour,
      description: dto.description || `Clases de ${dto.subjectName}`,
      isActive: true,
      createdAt: new Date(),
    });

    tutor.addSubject(newSubject);
    const updated = await this.tutorRepository.update(tutor.id, tutor);
    return TutorMapper.toDTO(updated);
  }
}
