import { BookingFactory } from '../../../domain/booking/BookingFactory.js';
import { IBookingRepository } from '../ports/IBookingRepository.js';
import { ITutorRepository } from '../../tutor/ports/ITutorRepository.js';
import { IAvailabilityChecker, DefaultAvailabilityChecker } from '../ports/IAvailabilityChecker.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { IClock, SystemClock } from '../../shared/ports/IClock.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { TutorUnavailableError } from '../errors/index.js';
import { CreateBookingDTO, BookingResponseDTO } from '../dtos/index.js';
import { BookingMapper } from '../mappers/BookingMapper.js';
import { Money } from '../../../domain/shared/value-objects/Money.js';

export interface CreateBookingDeps {
  bookingRepository: IBookingRepository;
  tutorRepository: ITutorRepository;
  availabilityChecker?: IAvailabilityChecker;
  clock?: IClock;
}

export class CreateBookingUseCase implements IUseCase<CreateBookingDTO, BookingResponseDTO> {
  private readonly bookingRepository: IBookingRepository;
  private readonly tutorRepository: ITutorRepository;
  private readonly availabilityChecker: IAvailabilityChecker;
  private readonly clock: IClock;

  constructor({
    bookingRepository,
    tutorRepository,
    availabilityChecker = new DefaultAvailabilityChecker(),
    clock = new SystemClock(),
  }: CreateBookingDeps) {
    this.bookingRepository = bookingRepository;
    this.tutorRepository = tutorRepository;
    this.availabilityChecker = availabilityChecker;
    this.clock = clock;
  }

  async execute({
    studentId,
    tutorId,
    subject,
    scheduledAt,
    durationHours = 1,
    modality = 'online',
    notes = null,
  }: CreateBookingDTO): Promise<BookingResponseDTO> {
    const tutor = await this.tutorRepository.findById(tutorId);
    if (!tutor) {
      throw new NotFoundError(`Tutor con ID '${tutorId}'`);
    }

    const parsedScheduledAt = scheduledAt instanceof Date ? scheduledAt : new Date(scheduledAt);
    const isAvailable = await this.availabilityChecker.isTutorAvailable(tutor.id, parsedScheduledAt, durationHours);
    if (!isAvailable) {
      throw new TutorUnavailableError(tutor.id, parsedScheduledAt);
    }

    const hourlyRate = Number(tutor.pricePerHour);
    const hourlyMoney = Money.create(hourlyRate);
    const totalMoney = Money.create(Number((hourlyMoney.amount * durationHours).toFixed(2)));

    const booking = BookingFactory.create({
      studentId: studentId.trim(),
      tutorId: tutor.id,
      tutorSubjectId: tutor.subjects[0]?.id || `subj-${tutor.id}`,
      subject: subject || tutor.subjectName,
      scheduledAt: parsedScheduledAt,
      durationHours,
      modality,
      hourlyRate: hourlyMoney.amount,
      notes: notes || null,
      createdAt: this.clock.now(),
    });

    const saved = await this.bookingRepository.create(booking);
    return BookingMapper.toDTO(saved, {
      tutorName: tutor.fullName,
      tutorAvatar: tutor.avatarUrl,
    });
  }
}
