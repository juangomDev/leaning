import { IReviewRepository } from '../ports/IReviewRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { ReviewResponseDTO } from '../dtos/index.js';
import { ReviewMapper } from '../mappers/ReviewMapper.js';

export interface GetTutorReviewsDeps {
  reviewRepository: IReviewRepository;
}

export type GetTutorReviewsInput = { tutorId: string } | string;

export class GetTutorReviewsUseCase implements IUseCase<GetTutorReviewsInput, ReviewResponseDTO[]> {
  private readonly reviewRepository: IReviewRepository;

  constructor({ reviewRepository }: GetTutorReviewsDeps) {
    this.reviewRepository = reviewRepository;
  }

  async execute(input: GetTutorReviewsInput): Promise<ReviewResponseDTO[]> {
    const tutorId = typeof input === 'string' ? input : input.tutorId;
    const reviews = await this.reviewRepository.findByTutorId(tutorId);
    return reviews.map((r) => ReviewMapper.toDTO(r));
  }
}
