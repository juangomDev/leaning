import { INotificationService, BookingNotificationPayload } from '../../application/shared/ports/INotificationService.js';
import { config } from '../config/env.js';
import { ConsoleNotificationService } from './ConsoleNotificationService.js';

export class ResendEmailService implements INotificationService {
  private readonly apiKey: string;
  private readonly fromEmail: string;
  private readonly fallbackService: ConsoleNotificationService;

  constructor(apiKey = config.resendApiKey, fromEmail = 'EduConnect <notificaciones@educonnect.com>') {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
    this.fallbackService = new ConsoleNotificationService();
  }

  async sendBookingConfirmation(payload: BookingNotificationPayload): Promise<void> {
    if (!config.isResendConfigured()) {
      return await this.fallbackService.sendBookingConfirmation(payload);
    }

    const emailTo = payload.studentEmail || 'estudiante@educonnect.com';
    const html = `
      <h1>¡Tu reserva ha sido confirmada!</h1>
      <p>Hola <strong>${payload.studentName || 'Estudiante'}</strong>,</p>
      <p>Tu clase de <strong>${payload.subject}</strong> ha sido programada con éxito para el <strong>${payload.scheduledAt.toLocaleString()}</strong>.</p>
      <p>ID de reserva: ${payload.bookingId}</p>
    `;

    await this.sendEmail(emailTo, `Confirmación de Reserva: ${payload.subject}`, html);
  }

  async sendBookingCancellation(payload: BookingNotificationPayload): Promise<void> {
    if (!config.isResendConfigured()) {
      return await this.fallbackService.sendBookingCancellation(payload);
    }

    const emailTo = payload.studentEmail || 'estudiante@educonnect.com';
    const html = `
      <h1>Tu reserva ha sido cancelada</h1>
      <p>Tu clase de <strong>${payload.subject}</strong> ha sido cancelada.</p>
      <p>Motivo: ${payload.reason || 'Sin motivo'}</p>
    `;

    await this.sendEmail(emailTo, `Cancelación de Reserva: ${payload.subject}`, html);
  }

  async sendNotification(recipientEmail: string, title: string, message: string): Promise<void> {
    if (!config.isResendConfigured()) {
      return await this.fallbackService.sendNotification(recipientEmail, title, message);
    }

    const html = `<h2>${title}</h2><p>${message}</p>`;
    await this.sendEmail(recipientEmail, title, html);
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ResendEmailService] Error al enviar email: ${errorText}`);
      }
    } catch (err: any) {
      console.error(`[ResendEmailService] Error de red: ${err.message}`);
    }
  }
}
