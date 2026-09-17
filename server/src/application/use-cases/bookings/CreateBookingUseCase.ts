import { Booking, BookingModality } from '../../../domain/entities/Booking.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository.js';
import { ITutorRepository } from '../../../domain/repositories/ITutorRepository.js';
import { IWalletRepository } from '../../../domain/repositories/IWalletRepository.js';
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
    const booking = new Booking({
      id: crypto.randomUUID(),
      studentId,
      tutorId: tutor.id,
      subject: subject || tutor.subjectName,
      scheduledAt,
      durationHours,
      modality,
      status: 'pending',
      totalPrice,
      notes,
      tutor: {
        id: tutor.id,
        name: tutor.fullName,
        avatar: tutor.avatarUrl,
      },
    });

    return await this.bookingRepository.create(booking);
  }
}
