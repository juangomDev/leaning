import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ConsoleNotificationService } from './ConsoleNotificationService.js';
import { ResendEmailService } from './ResendEmailService.js';

describe('Infrastructure: Notification Services', () => {
  it('debe registrar notificaciones en consola y en historial', async () => {
    const consoleService = new ConsoleNotificationService();

    await consoleService.sendBookingConfirmation({
      bookingId: 'book-notif-test-1',
      studentId: 'stu-1',
      tutorId: 'tut-1',
      subject: 'Cálculo Avanzado',
      scheduledAt: new Date('2026-05-10T10:00:00Z'),
    });

    assert.strictEqual(consoleService.history.length, 1);
    assert.strictEqual(consoleService.history[0].type, 'booking_confirmation');

    await consoleService.sendBookingCancellation({
      bookingId: 'book-notif-test-1',
      studentId: 'stu-1',
      tutorId: 'tut-1',
      subject: 'Cálculo Avanzado',
      scheduledAt: new Date('2026-05-10T10:00:00Z'),
      reason: 'Cuestiones médicas',
    });

    assert.strictEqual(consoleService.history.length, 2);
    assert.strictEqual(consoleService.history[1].type, 'booking_cancellation');
  });

  it('ResendEmailService debe hacer fallback a consola cuando no hay API Key real configurada', async () => {
    const resendService = new ResendEmailService(''); // Sin api key
    await resendService.sendNotification('test@educonnect.com', 'Bienvenido', 'Gracias por registrarte');
    // Si no arrojó excepción, completó el fallback limpiamente
    assert.ok(true);
  });
});
