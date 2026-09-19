import { Tutor, TutorFilterOptions } from '../../../domain/tutor/Tutor.js';
import { ITutorRepository } from '../../../domain/tutor/TutorRepository.js';

export class GetTutorsListUseCase {
  private tutorRepository: ITutorRepository;

  constructor({ tutorRepository }: { tutorRepository: ITutorRepository }) {
    this.tutorRepository = tutorRepository;
  }

  async execute(filters: TutorFilterOptions = {}): Promise<Tutor[]> {
    return await this.tutorRepository.findAll(filters);
  }
}
