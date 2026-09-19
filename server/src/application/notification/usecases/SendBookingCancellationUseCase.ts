import { IBookingRepository } from '../../booking/ports/IBookingRepository.js';
import { INotificationService } from '../../shared/ports/INotificationService.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { SendBookingCancellationDTO, NotificationResultDTO } from '../dtos/index.js';

export interface SendBookingCancellationDeps {
  bookingRepository: IBookingRepository;
  notificationService: INotificationService;
}

export class SendBookingCancellationUseCase implements IUseCase<SendBookingCancellationDTO, NotificationResultDTO> {
  private readonly bookingRepository: IBookingRepository;
  private readonly notificationService: INotificationService;

  constructor({ bookingRepository, notificationService }: SendBookingCancellationDeps) {
    this.bookingRepository = bookingRepository;
    this.notificationService = notificationService;
  }

  async execute({ bookingId, reason }: SendBookingCancellationDTO): Promise<NotificationResultDTO> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError(`Reserva con ID '${bookingId}'`);
    }

    await this.notificationService.sendBookingCancellation({
      bookingId: booking.id,
      studentId: booking.studentId,
      tutorId: booking.tutorId,
      subject: booking.subject,
      scheduledAt: booking.scheduledAt,
      reason,
    });

    return {
      success: true,
      bookingId: booking.id,
      message: 'Notificación de cancelación de reserva enviada correctamente',
    };
  }
}
