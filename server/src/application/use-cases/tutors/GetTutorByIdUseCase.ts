import { Tutor } from '../../../domain/tutor/Tutor.js';
import { NotFoundError } from '../../../domain/shared/errors/DomainError.js';
import { ITutorRepository } from '../../../domain/tutor/TutorRepository.js';

export class GetTutorByIdUseCase {
  private tutorRepository: ITutorRepository;

  constructor({ tutorRepository }: { tutorRepository: ITutorRepository }) {
    this.tutorRepository = tutorRepository;
  }

  async execute(id: string): Promise<Tutor> {
    const tutor = await this.tutorRepository.findById(id);
    if (!tutor) {
      throw new NotFoundError(`Tutor con ID '${id}'`);
    }
    return tutor;
  }
}
