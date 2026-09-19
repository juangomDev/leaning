import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Booking } from './Booking.js';
import { BookingFactory } from './BookingFactory.js';
import { InvalidStateTransitionError, ValidationError } from '../shared/errors/DomainError.js';

describe('Módulo Booking: Entidad y Factory', () => {
  const futureDate = new Date(Date.now() + 86400000);

  it('debe crear una reserva mediante BookingFactory calculando totalPrice', () => {
    const booking = BookingFactory.create({
      studentId: 'stu-1',
      tutorId: 'tut-1',
      tutorSubjectId: 'subj-1',
      subject: 'Álgebra Lineal',
      scheduledAt: futureDate,
      durationHours: 2,
      hourlyRate: 25,
      notes: 'Traer ejercicios',
    });

    assert.ok(booking.id);
    assert.strictEqual(booking.totalPrice, 50);
    assert.strictEqual(booking.status, 'pending');
    assert.strictEqual(booking.canGenerateReview(), false);
  });

  it('debe manejar la máquina de estados: pending -> confirmed -> completed', () => {
    const booking = BookingFactory.create({
      studentId: 'stu-2',
      tutorId: 'tut-2',
      tutorSubjectId: 'subj-2',
      subject: 'Programación',
      scheduledAt: futureDate,
      hourlyRate: 30,
    });

    booking.confirm();
    assert.strictEqual(booking.status, 'confirmed');

    booking.complete();
    assert.strictEqual(booking.status, 'completed');
    assert.strictEqual(booking.canGenerateReview(), true);
  });

  it('debe rechazar transiciones ilegales de estado', () => {
    const booking = BookingFactory.create({
      studentId: 'stu-3',
      tutorId: 'tut-3',
      tutorSubjectId: 'subj-3',
      subject: 'Física',
      scheduledAt: futureDate,
      hourlyRate: 20,
    });

    assert.throws(() => booking.complete(), InvalidStateTransitionError);
  });
});
