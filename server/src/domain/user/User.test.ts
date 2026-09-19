import { describe, it } from 'node:test';
import assert from 'node:assert';
import { User, UserRole } from './User.js';
import { UserFactory } from './UserFactory.js';
import { Email } from './value-objects/Email.js';
import { Phone } from './value-objects/Phone.js';
import { ValidationError } from '../shared/errors/DomainError.js';

describe('Módulo User: Entidad y Factory', () => {
  const defaultDate = new Date();

  it('debe crear un usuario mediante constructor con Value Objects', () => {
    const user = new User({
      id: 'usr-1',
      email: Email.create('carlos@educonnect.com'),
      fullName: 'Carlos Mendoza',
      roles: ['student', 'tutor'],
      avatarUrl: 'https://example.com/avatar.jpg',
      phone: Phone.create('+52 55 1234 5678'),
      createdAt: defaultDate,
    });

    assert.strictEqual(user.id, 'usr-1');
    assert.strictEqual(user.email, 'carlos@educonnect.com');
    assert.strictEqual(user.fullName, 'Carlos Mendoza');
    assert.deepStrictEqual(user.roles, ['student', 'tutor']);
    assert.strictEqual(user.isStudent(), true);
    assert.strictEqual(user.isTutor(), true);
    assert.strictEqual(user.phone, '+52 55 1234 5678');
  });

  it('debe crear un usuario fácilmente mediante UserFactory.create', () => {
    const user = UserFactory.create({
      email: 'ana@educonnect.com',
      fullName: 'Ana Gomez',
      roles: ['student'],
    });

    assert.ok(user.id);
    assert.strictEqual(user.email, 'ana@educonnect.com');
    assert.strictEqual(user.fullName, 'Ana Gomez');
    assert.strictEqual(user.avatarUrl, null);
    assert.strictEqual(user.phone, null);
    assert.strictEqual(user.isStudent(), true);
  });

  it('debe permitir añadir y remover roles pero impedir remover el único rol', () => {
    const user = UserFactory.create({
      email: 'pedro@educonnect.com',
      fullName: 'Pedro Diaz',
      roles: ['student'],
    });

    user.addRole('tutor');
    assert.strictEqual(user.hasRole('tutor'), true);

    user.removeRole('student');
    assert.strictEqual(user.hasRole('student'), false);

    assert.throws(
      () => user.removeRole('tutor'),
      (err: any) => err instanceof ValidationError && err.message.includes('No se puede eliminar el único rol')
    );
  });
});
