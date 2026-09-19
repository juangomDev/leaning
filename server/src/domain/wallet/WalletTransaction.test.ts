import { describe, it } from 'node:test';
import assert from 'node:assert';
import { WalletTransaction } from './WalletTransaction.js';
import { WalletFactory } from './WalletFactory.js';
import { ValidationError } from '../shared/errors/DomainError.js';

describe('Módulo Wallet: WalletTransaction', () => {
  it('debe registrar una transacción mediante WalletFactory.createTransaction', () => {
    const tx = WalletFactory.createTransaction({
      walletId: 'wal-10',
      userId: 'usr-10',
      amount: 75,
      type: 'recharge',
      concept: 'Recarga tarjeta',
    });

    assert.ok(tx.id);
    assert.strictEqual(tx.walletId, 'wal-10');
    assert.strictEqual(tx.amount, 75);
    assert.strictEqual(tx.status, 'completed');
  });

  it('debe rechazar montos menores o iguales a cero', () => {
    assert.throws(
      () =>
        new WalletTransaction({
          id: 'tx-err',
          walletId: 'wal-1',
          userId: 'usr-1',
          bookingId: null,
          amount: -5,
          type: 'recharge',
          concept: 'Invalido',
          status: 'completed',
          createdAt: new Date(),
        }),
      ValidationError
    );
  });
});
