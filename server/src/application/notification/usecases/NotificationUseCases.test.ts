import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Booking } from '../../../domain/booking/Booking.js';
import { BookingFactory } from '../../../domain/booking/BookingFactory.js';
import { IBookingRepository } from '../../booking/ports/IBookingRepository.js';
import { INotificationService, BookingNotificationPayload } from '../../shared/ports/INotificationService.js';
import { SendBookingConfirmationUseCase } from './SendBookingConfirmationUseCase.js';
import { SendBookingCancellationUseCase } from './SendBookingCancellationUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';

class MockNotificationBookingRepo implements IBookingRepository {
  public bookings: Map<string, Booking> = new Map();
  async findById(id: string): Promise<Booking | null> { return this.bookings.get(id) || null; }
  async findByStudentId(): Promise<Booking[]> { return []; }
  async findByTutorId(): Promise<Booking[]> { return []; }
  async create(b: Booking): Promise<Booking> { this.bookings.set(b.id, b); return b; }
  async updateStatus(): Promise<Booking> { throw new Error('Not needed'); }
}

class MockNotificationService implements INotificationService {
  public sentConfirmations: BookingNotificationPayload[] = [];
  public sentCancellations: BookingNotificationPayload[] = [];
  public notifications: Array<{ email: string; title: string; message: string }> = [];

  async sendBookingConfirmation(payload: BookingNotificationPayload): Promise<void> {
    this.sentConfirmations.push(payload);
  }
  async sendBookingCancellation(payload: BookingNotificationPayload): Promise<void> {
    this.sentCancellations.push(payload);
  }
  async sendNotification(recipientEmail: string, title: string, message: string): Promise<void> {
    this.notifications.push({ email: recipientEmail, title, message });
  }
  async sendPasswordReset(recipientEmail: string, token: string, userName?: string): Promise<void> {
    this.notifications.push({ email: recipientEmail, title: 'Password Reset', message: `Token: ${token}` });
  }
  async sendEmailVerification(recipientEmail: string, token: string, userName?: string): Promise<void> {
    this.notifications.push({ email: recipientEmail, title: 'Email Verification', message: `Token: ${token}` });
  }
}

describe('Notification UseCases', () => {
  it('debe enviar la confirmación de la reserva', async () => {
    const bookRepo = new MockNotificationBookingRepo();
    const notifService = new MockNotificationService();

    const booking = BookingFactory.create({
      id: 'book-notif-1',
      studentId: 'stu-notif',
      tutorId: 'tut-notif',
      tutorSubjectId: 'subj-1',
      subject: 'Química Orgánica',
      scheduledAt: new Date(),
      hourlyRate: 25,
    });
    await bookRepo.create(booking);

    const useCase = new SendBookingConfirmationUseCase({
      bookingRepository: bookRepo,
      notificationService: notifService,
    });

    const result = await useCase.execute({ bookingId: 'book-notif-1' });
    assert.strictEqual(result.success, true);
    assert.strictEqual(notifService.sentConfirmations.length, 1);
    assert.strictEqual(notifService.sentConfirmations[0].bookingId, 'book-notif-1');
    assert.strictEqual(notifService.sentConfirmations[0].subject, 'Química Orgánica');
  });

  it('debe enviar la cancelación de la reserva con motivo', async () => {
    const bookRepo = new MockNotificationBookingRepo();
    const notifService = new MockNotificationService();

    const booking = BookingFactory.create({
      id: 'book-notif-2',
      studentId: 'stu-notif',
      tutorId: 'tut-notif',
      tutorSubjectId: 'subj-1',
      subject: 'Química Orgánica',
      scheduledAt: new Date(),
      hourlyRate: 25,
    });
    await bookRepo.create(booking);

    const useCase = new SendBookingCancellationUseCase({
      bookingRepository: bookRepo,
      notificationService: notifService,
    });

    const result = await useCase.execute({ bookingId: 'book-notif-2', reason: 'Fuerza mayor' });
    assert.strictEqual(result.success, true);
    assert.strictEqual(notifService.sentCancellations.length, 1);
    assert.strictEqual(notifService.sentCancellations[0].reason, 'Fuerza mayor');
  });

  it('debe lanzar NotFoundError si la reserva no existe', async () => {
    const bookRepo = new MockNotificationBookingRepo();
    const notifService = new MockNotificationService();
    const useCase = new SendBookingConfirmationUseCase({
      bookingRepository: bookRepo,
      notificationService: notifService,
    });

    await assert.rejects(async () => {
      await useCase.execute({ bookingId: 'missing-id' });
    }, NotFoundError);
  });
});
