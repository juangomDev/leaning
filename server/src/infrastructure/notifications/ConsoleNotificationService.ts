import { INotificationService, BookingNotificationPayload } from '../../application/shared/ports/INotificationService.js';

export class ConsoleNotificationService implements INotificationService {
  public history: Array<{ type: string; payload: any }> = [];

  async sendBookingConfirmation(payload: BookingNotificationPayload): Promise<void> {
    const record = { type: 'booking_confirmation', payload };
    this.history.push(record);
    console.log(`[NotificationService] 📩 Confirmación de Reserva enviada:`, {
      bookingId: payload.bookingId,
      student: payload.studentEmail || payload.studentId,
      tutor: payload.tutorEmail || payload.tutorId,
      subject: payload.subject,
      date: payload.scheduledAt.toISOString(),
    });
  }

  async sendBookingCancellation(payload: BookingNotificationPayload): Promise<void> {
    const record = { type: 'booking_cancellation', payload };
    this.history.push(record);
    console.log(`[NotificationService] ❌ Cancelación de Reserva enviada:`, {
      bookingId: payload.bookingId,
      student: payload.studentEmail || payload.studentId,
      tutor: payload.tutorEmail || payload.tutorId,
      reason: payload.reason || 'Sin motivo especificado',
    });
  }

  async sendNotification(recipientEmail: string, title: string, message: string): Promise<void> {
    const record = { type: 'custom_notification', payload: { recipientEmail, title, message } };
    this.history.push(record);
    console.log(`[NotificationService] 📢 Notificación enviada a ${recipientEmail} | ${title}: ${message}`);
  }
}
