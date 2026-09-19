import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BookingFactory } from '../BookingFactory.js';
import { WalletFactory } from '../../wallet/WalletFactory.js';
import { BookingPaymentDomainService } from './BookingPaymentDomainService.js';
import { InsufficientFundsError, ValidationError, ConflictError } from '../../shared/errors/DomainError.js';

describe('Prueba Multi-Entidad: BookingPaymentDomainService (Booking + Wallet + WalletTransaction)', () => {
  const service = new BookingPaymentDomainService();
  const futureDate = new Date(Date.now() + 86400000);

  it('debe cobrar la reserva exitosamente: debitar de Wallet, confirmar Booking y generar WalletTransaction', () => {
    // 1. Preparar entidades en memoria (sin BD ni Mocks)
    const wallet = WalletFactory.create({
      userId: 'student-100',
      initialBalance: 80,
    });

    const booking = BookingFactory.create({
      studentId: 'student-100',
      tutorId: 'tutor-200',
      tutorSubjectId: 'subj-math',
      subject: 'Cálculo Diferencial',
      scheduledAt: futureDate,
      durationHours: 2,
      hourlyRate: 25, // Total = $50
    });

    assert.strictEqual(wallet.balance, 80);
    assert.strictEqual(booking.status, 'pending');

    // 2. Ejecutar regla multi-entidad del servicio de dominio
    const result = service.payBooking(wallet, booking);

    // 3. Validar resultados orquestados
    assert.strictEqual(result.wallet.balance, 30); // 80 - 50 = 30
    assert.strictEqual(result.booking.status, 'confirmed');
    assert.strictEqual(result.transaction.amount, 50);
    assert.strictEqual(result.transaction.bookingId, booking.id);
    assert.strictEqual(result.transaction.type, 'booking_payment');
  });

  it('debe rechazar el pago con InsufficientFundsError si la billetera no tiene fondos suficientes', () => {
    const wallet = WalletFactory.create({
      userId: 'student-poor',
      initialBalance: 20,
    });

    const booking = BookingFactory.create({
      studentId: 'student-poor',
      tutorId: 'tutor-200',
      tutorSubjectId: 'subj-math',
      subject: 'Cálculo',
      scheduledAt: futureDate,
      durationHours: 1,
      hourlyRate: 50, // Total = $50
    });

    assert.throws(
      () => service.payBooking(wallet, booking),
      (err: any) => err instanceof InsufficientFundsError
    );

    // Los saldos y estados deben permanecer intactos
    assert.strictEqual(wallet.balance, 20);
    assert.strictEqual(booking.status, 'pending');
  });

  it('debe rechazar el pago si la billetera no corresponde al estudiante de la reserva', () => {
    const walletDeOtro = WalletFactory.create({
      userId: 'otro-usuario',
      initialBalance: 100,
    });

    const booking = BookingFactory.create({
      studentId: 'student-legitimo',
      tutorId: 'tutor-200',
      tutorSubjectId: 'subj-math',
      subject: 'Álgebra',
      scheduledAt: futureDate,
      hourlyRate: 30,
    });

    assert.throws(
      () => service.payBooking(walletDeOtro, booking),
      (err: any) => err instanceof ValidationError && err.message.includes('no pertenece al estudiante')
    );
  });
});
