import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Email } from './Email.js';
import { ValidationError } from '../../shared/errors/DomainError.js';

describe('Value Object: Email', () => {
  it('debe crear un email válido y normalizarlo a minúsculas y sin espacios', () => {
    const email = Email.create('  Usuario.Prueba@EduConnect.COM  ');
    assert.strictEqual(email.value, 'usuario.prueba@educonnect.com');
  });

  it('debe rechazar formatos de email incorrectos', () => {
    assert.throws(
      () => Email.create('email-sin-arroba'),
      (err: any) => err instanceof ValidationError && err.message.includes('formato válido')
    );

    assert.throws(
      () => Email.create(''),
      (err: any) => err instanceof ValidationError && err.message.includes('es requerido')
    );
  });

  it('debe comparar igualdad entre instancias de Email', () => {
    const email1 = Email.create('test@educonnect.com');
    const email2 = Email.create('TEST@educonnect.com');
    const email3 = Email.create('otro@educonnect.com');

    assert.strictEqual(email1.equals(email2), true);
    assert.strictEqual(email1.equals(email3), false);
  });
});
