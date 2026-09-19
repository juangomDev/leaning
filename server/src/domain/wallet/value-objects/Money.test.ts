import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Money } from './Money.js';
import { ValidationError } from '../../shared/errors/DomainError.js';

describe('Value Object: Money', () => {
  it('debe crear un monto válido y redondear a 2 decimales', () => {
    const money = Money.create(10.555, 'USD');
    assert.strictEqual(money.amount, 10.56);
    assert.strictEqual(money.currency, 'USD');
    assert.strictEqual(money.toString(), '10.56 USD');
  });

  it('debe sumar y restar correctamente', () => {
    const m1 = Money.create(50, 'USD');
    const m2 = Money.create(25.5, 'USD');

    const sum = m1.add(m2);
    assert.strictEqual(sum.amount, 75.5);

    const diff = m1.subtract(m2);
    assert.strictEqual(diff.amount, 24.5);
  });

  it('debe rechazar montos negativos y monedas incompatibles', () => {
    assert.throws(() => Money.create(-10), ValidationError);

    const usd = Money.create(10, 'USD');
    const mxn = Money.create(10, 'MXN');
    assert.throws(() => usd.add(mxn), ValidationError);
  });
});
