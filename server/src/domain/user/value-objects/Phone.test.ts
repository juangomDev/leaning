import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Phone } from './Phone.js';
import { ValidationError } from '../../shared/errors/DomainError.js';

describe('Value Object: Phone', () => {
  it('debe crear un teléfono válido o retornar null si es nulo o vacío', () => {
    const phone = Phone.create('+52 55 1234 5678');
    assert.strictEqual(phone?.value, '+52 55 1234 5678');

    assert.strictEqual(Phone.create(null), null);
    assert.strictEqual(Phone.create('   '), null);
  });

  it('debe rechazar números con letras o longitud insuficiente', () => {
    assert.throws(
      () => Phone.create('telefono-123'),
      (err: any) => err instanceof ValidationError && err.message.includes('no es válido')
    );

    assert.throws(
      () => Phone.create('123'),
      (err: any) => err instanceof ValidationError && err.message.includes('no es válido')
    );
  });
});
