import { ITutorRepository } from '../ports/ITutorRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { TutorResponseDTO } from '../dtos/index.js';
import { TutorMapper } from '../mappers/TutorMapper.js';

export interface GetTutorByIdDeps {
  tutorRepository: ITutorRepository;
}

export type GetTutorByIdInput = { id: string } | string;

export class GetTutorByIdUseCase implements IUseCase<GetTutorByIdInput, TutorResponseDTO> {
  private readonly tutorRepository: ITutorRepository;

  constructor({ tutorRepository }: GetTutorByIdDeps) {
    this.tutorRepository = tutorRepository;
  }

  async execute(input: GetTutorByIdInput): Promise<TutorResponseDTO> {
    const tutorId = typeof input === 'string' ? input : input.id;
    const tutor = await this.tutorRepository.findById(tutorId);

    if (!tutor) {
      throw new NotFoundError(`Tutor con ID ${tutorId}`);
    }

    return TutorMapper.toDTO(tutor);
  }
}
