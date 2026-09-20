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

  async sendPasswordReset(recipientEmail: string, token: string, userName?: string): Promise<void> {
    if (!config.isResendConfigured()) {
      return await this.fallbackService.sendPasswordReset(recipientEmail, token, userName);
    }

    const resetUrl = `http://localhost:5173/reset-password?token=${encodeURIComponent(token)}`;
    const html = `
      <h2>Recuperación de Contraseña - EduConnect</h2>
      <p>Hola <strong>${userName || 'Usuario'}</strong>,</p>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <p><a href="${resetUrl}" style="padding: 10px 18px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Restablecer Contraseña</a></p>
      <p>O copia y pega este enlace en tu navegador:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p><small>Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.</small></p>
    `;

    await this.sendEmail(recipientEmail, 'Restablecer contraseña - EduConnect', html);
  }

  async sendEmailVerification(recipientEmail: string, token: string, userName?: string): Promise<void> {
    if (!config.isResendConfigured()) {
      return await this.fallbackService.sendEmailVerification(recipientEmail, token, userName);
    }

    const verifyUrl = `http://localhost:5173/verify-email?token=${encodeURIComponent(token)}`;
    const html = `
      <h2>Verifica tu Correo Electrónico - EduConnect</h2>
      <p>Hola <strong>${userName || 'Usuario'}</strong>,</p>
      <p>Gracias por unirte a EduConnect. Por favor confirma tu dirección de correo electrónico:</p>
      <p><a href="${verifyUrl}" style="padding: 10px 18px; background-color: #059669; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verificar mi Correo</a></p>
      <p>O copia este enlace en tu navegador:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    `;

    await this.sendEmail(recipientEmail, 'Verifica tu cuenta en EduConnect', html);
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
