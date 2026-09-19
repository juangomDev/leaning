import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Review } from './Review.js';
import { ValidationError } from '../shared/errors/DomainError.js';

describe('Módulo Review: Entidad Review', () => {
  it('debe validar que el rating esté entre 1 y 5 estrellas', () => {
    assert.throws(
      () =>
        new Review({
          id: 'rev-0',
          bookingId: 'bk-1',
          studentId: 'stu-1',
          tutorId: 'tut-1',
          rating: 0,
          comment: 'Muy mala',
          createdAt: new Date(),
        }),
      (err: any) => err instanceof ValidationError && err.message.includes('entre 1 y 5 estrellas')
    );

    assert.throws(
      () =>
        new Review({
          id: 'rev-6',
          bookingId: 'bk-1',
          studentId: 'stu-1',
          tutorId: 'tut-1',
          rating: 6,
          comment: 'Increíble',
          createdAt: new Date(),
        }),
      (err: any) => err instanceof ValidationError && err.message.includes('entre 1 y 5 estrellas')
    );
  });

  it('debe validar la longitud del comentario', () => {
    assert.throws(
      () =>
        new Review({
          id: 'rev-short',
          bookingId: 'bk-1',
          studentId: 'stu-1',
          tutorId: 'tut-1',
          rating: 5,
          comment: 'ok',
          createdAt: new Date(),
        }),
      ValidationError
    );
  });
});
