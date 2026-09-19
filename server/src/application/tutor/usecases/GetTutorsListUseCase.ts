import { ITutorRepository } from '../ports/ITutorRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { GetTutorsFilterDTO, TutorResponseDTO } from '../dtos/index.js';
import { TutorMapper } from '../mappers/TutorMapper.js';

export interface GetTutorsListDeps {
  tutorRepository: ITutorRepository;
}

export class GetTutorsListUseCase implements IUseCase<GetTutorsFilterDTO | undefined, TutorResponseDTO[]> {
  private readonly tutorRepository: ITutorRepository;

  constructor({ tutorRepository }: GetTutorsListDeps) {
    this.tutorRepository = tutorRepository;
  }

  async execute(filters: GetTutorsFilterDTO = {}): Promise<TutorResponseDTO[]> {
    const domainFilters = {
      query: filters.query || filters.search,
      category: filters.category,
      modality: filters.modality as any,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
    };
    const tutors = await this.tutorRepository.findAll(domainFilters);
    return tutors.map((t) => TutorMapper.toDTO(t));
  }
}
