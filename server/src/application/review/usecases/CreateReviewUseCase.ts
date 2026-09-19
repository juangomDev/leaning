import { ReviewFactory } from '../../../domain/review/ReviewFactory.js';
import { IReviewRepository } from '../ports/IReviewRepository.js';
import { IBookingRepository } from '../../booking/ports/IBookingRepository.js';
import { ITutorRepository } from '../../tutor/ports/ITutorRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { ConflictError } from '../../shared/errors/ConflictError.js';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { CreateReviewDTO, ReviewResponseDTO } from '../dtos/index.js';
import { ReviewMapper } from '../mappers/ReviewMapper.js';

export interface CreateReviewDeps {
  reviewRepository: IReviewRepository;
  bookingRepository: IBookingRepository;
  tutorRepository?: ITutorRepository;
}

export class CreateReviewUseCase implements IUseCase<CreateReviewDTO, ReviewResponseDTO> {
  private readonly reviewRepository: IReviewRepository;
  private readonly bookingRepository: IBookingRepository;
  private readonly tutorRepository?: ITutorRepository;

  constructor({ reviewRepository, bookingRepository, tutorRepository }: CreateReviewDeps) {
    this.reviewRepository = reviewRepository;
    this.bookingRepository = bookingRepository;
    this.tutorRepository = tutorRepository;
  }

  async execute(dto: CreateReviewDTO): Promise<ReviewResponseDTO> {
    const booking = await this.bookingRepository.findById(dto.bookingId);
    if (!booking) {
      throw new NotFoundError(`Reserva con ID ${dto.bookingId}`);
    }

    if (!booking.canGenerateReview()) {
      throw new ConflictError(
        `Solo es posible dejar una reseña para clases finalizadas con estado 'completed'. Estado actual: '${booking.status}'`
      );
    }

    if (dto.studentId && dto.studentId.trim() !== booking.studentId.trim()) {
      throw new ForbiddenError('No tienes autorización para calificar una clase que no tomaste');
    }

    const existing = await this.reviewRepository.findByBookingId(dto.bookingId);
    if (existing) {
      throw new ConflictError(`Ya se ha emitido una reseña para la reserva con ID ${dto.bookingId}`);
    }

    const review = ReviewFactory.createFromCompletedBooking(booking, {
      rating: dto.rating,
      comment: dto.comment,
    });

    const saved = await this.reviewRepository.create(review);

    // Opcionalmente recalcular rating promedio del tutor si el repositorio está inyectado
    if (this.tutorRepository) {
      const tutor = await this.tutorRepository.findById(booking.tutorId);
      if (tutor) {
        const tutorReviews = await this.reviewRepository.findByTutorId(booking.tutorId);
        const totalRating = tutorReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = Number((totalRating / tutorReviews.length).toFixed(1));
        tutor.rating = avgRating;
        tutor.reviewsCount = tutorReviews.length;
        await this.tutorRepository.update(tutor.id, tutor);
      }
    }

    return ReviewMapper.toDTO(saved);
  }
}
