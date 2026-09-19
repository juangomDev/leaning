import { IBookingRepository } from '../../booking/ports/IBookingRepository.js';
import { INotificationService } from '../../shared/ports/INotificationService.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { SendBookingConfirmationDTO, NotificationResultDTO } from '../dtos/index.js';

export interface SendBookingConfirmationDeps {
  bookingRepository: IBookingRepository;
  notificationService: INotificationService;
}

export class SendBookingConfirmationUseCase implements IUseCase<SendBookingConfirmationDTO, NotificationResultDTO> {
  private readonly bookingRepository: IBookingRepository;
  private readonly notificationService: INotificationService;

  constructor({ bookingRepository, notificationService }: SendBookingConfirmationDeps) {
    this.bookingRepository = bookingRepository;
    this.notificationService = notificationService;
  }

  async execute({ bookingId }: SendBookingConfirmationDTO): Promise<NotificationResultDTO> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError(`Reserva con ID '${bookingId}'`);
    }

    await this.notificationService.sendBookingConfirmation({
      bookingId: booking.id,
      studentId: booking.studentId,
      tutorId: booking.tutorId,
      subject: booking.subject,
      scheduledAt: booking.scheduledAt,
    });

    return {
      success: true,
      bookingId: booking.id,
      message: 'Notificación de confirmación de reserva enviada correctamente',
    };
  }
}
