import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Wallet } from './Wallet.js';
import { WalletFactory } from './WalletFactory.js';
import { InsufficientFundsError, ConflictError } from '../shared/errors/DomainError.js';

describe('Módulo Wallet: Entidad y Factory', () => {
  it('debe crear una billetera usando WalletFactory', () => {
    const wallet = WalletFactory.create({
      userId: 'usr-1',
      initialBalance: 50,
    });

    assert.ok(wallet.id);
    assert.strictEqual(wallet.userId, 'usr-1');
    assert.strictEqual(wallet.balance, 50);
    assert.strictEqual(wallet.currency, 'USD');
    assert.strictEqual(wallet.status, 'active');
  });

  it('debe proteger contra saldo insuficiente al debitar', () => {
    const wallet = WalletFactory.create({
      userId: 'usr-2',
      initialBalance: 30,
    });

    wallet.recharge(20);
    assert.strictEqual(wallet.balance, 50);

    wallet.debit(40);
    assert.strictEqual(wallet.balance, 10);

    assert.throws(
      () => wallet.debit(15),
      (err: any) => err instanceof InsufficientFundsError
    );
    assert.strictEqual(wallet.balance, 10);
  });

  it('debe impedir operaciones si la billetera está congelada', () => {
    const wallet = WalletFactory.create({
      userId: 'usr-3',
      initialBalance: 100,
    });

    wallet.freeze();
    assert.strictEqual(wallet.status, 'frozen');
    assert.throws(() => wallet.debit(10), ConflictError);
    assert.throws(() => wallet.recharge(10), ConflictError);

    wallet.unfreeze();
    wallet.debit(10);
    assert.strictEqual(wallet.balance, 90);
  });
});
