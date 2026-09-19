import { Booking, BookingModality } from '../../../domain/booking/Booking.js';
import { NotFoundError } from '../../../domain/shared/errors/DomainError.js';
import { IBookingRepository } from '../../../domain/booking/BookingRepository.js';
import { ITutorRepository } from '../../../domain/tutor/TutorRepository.js';
import { IWalletRepository } from '../../../domain/wallet/WalletRepository.js';
import crypto from 'node:crypto';

export interface CreateBookingDTO {
  studentId: string;
  tutorId: string;
  subject?: string;
  scheduledAt: string | Date;
  durationHours?: number;
  modality?: BookingModality;
  notes?: string | null;
}

export class CreateBookingUseCase {
  private bookingRepository: IBookingRepository;
  private tutorRepository: ITutorRepository;
  private walletRepository?: IWalletRepository;

  constructor({
    bookingRepository,
    tutorRepository,
    walletRepository,
  }: {
    bookingRepository: IBookingRepository;
    tutorRepository: ITutorRepository;
    walletRepository?: IWalletRepository;
  }) {
    this.bookingRepository = bookingRepository;
    this.tutorRepository = tutorRepository;
    this.walletRepository = walletRepository;
  }

  async execute({
    studentId,
    tutorId,
    subject,
    scheduledAt,
    durationHours = 1,
    modality = 'online',
    notes = null,
  }: CreateBookingDTO): Promise<Booking> {
    // 1. Verify tutor exists
    const tutor = await this.tutorRepository.findById(tutorId);
    if (!tutor) {
      throw new NotFoundError(`Tutor con ID '${tutorId}'`);
    }

    // 2. Compute total price
    const totalPrice = Number(tutor.pricePerHour) * Number(durationHours);

    // 3. Create booking entity
    const parsedScheduledAt = scheduledAt instanceof Date ? scheduledAt : new Date(scheduledAt);
    const booking = new Booking({
      id: crypto.randomUUID(),
      studentId,
      tutorId: tutor.id,
      tutorSubjectId: tutor.subjects[0]?.id || `subj-${tutor.id}`,
      subject: subject || tutor.subjectName,
      scheduledAt: parsedScheduledAt,
      durationHours,
      modality,
      status: 'pending',
      hourlyRate: Number(tutor.pricePerHour),
      totalPrice,
      notes: notes || null,
      createdAt: new Date(),
      tutor: {
        id: tutor.id,
        name: tutor.fullName,
        avatar: tutor.avatarUrl,
      },
    });

    return await this.bookingRepository.create(booking);
  }
}
