import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Wallet } from '../../../domain/wallet/Wallet.js';
import { WalletTransaction } from '../../../domain/wallet/WalletTransaction.js';
import { IWalletRepository } from '../ports/IWalletRepository.js';
import { GetWalletBalanceUseCase } from './GetWalletBalanceUseCase.js';
import { RechargeWalletUseCase } from './RechargeWalletUseCase.js';
import { ValidationError } from '../../../domain/shared/errors/DomainError.js';
import { IClock } from '../../shared/ports/IClock.js';

class MockWalletRepository implements IWalletRepository {
  public balance = 100;
  public transactions: WalletTransaction[] = [];

  async findByUserId(userId: string): Promise<Wallet | null> {
    return null;
  }
  async getBalance(_userId: string): Promise<number> {
    return this.balance;
  }
  async updateBalance(_userId: string, newBalance: number): Promise<void> {
    this.balance = newBalance;
  }
  async getTransactions(_userId: string): Promise<WalletTransaction[]> {
    return this.transactions;
  }
  async addTransaction(transaction: WalletTransaction): Promise<WalletTransaction> {
    this.transactions.push(transaction);
    this.balance += transaction.amount;
    return transaction;
  }
  async saveWallet(_wallet: Wallet): Promise<void> {}
}

class FixedClock implements IClock {
  constructor(private readonly d: Date) {}
  now(): Date {
    return this.d;
  }
}

describe('Wallet UseCases', () => {
  it('debe recargar saldo con éxito y registrar la transacción con IClock', async () => {
    const repo = new MockWalletRepository();
    const fixedDate = new Date('2026-04-01T15:00:00Z');
    const useCase = new RechargeWalletUseCase({ walletRepository: repo, clock: new FixedClock(fixedDate) });

    const result = await useCase.execute({
      userId: 'usr-wallet-1',
      amount: 50,
      method: 'PayPal',
    });

    assert.strictEqual(result.newBalance, 150);
    assert.strictEqual(result.transaction.amount, 50);
    assert.strictEqual(result.transaction.createdAt, fixedDate.toISOString());
    assert.ok(result.transaction.concept.includes('PayPal'));
  });

  it('debe rechazar montos inválidos o negativos al recargar', async () => {
    const repo = new MockWalletRepository();
    const useCase = new RechargeWalletUseCase({ walletRepository: repo });

    await assert.rejects(
      async () => {
        await useCase.execute({
          userId: 'usr-wallet-1',
          amount: -20,
        });
      },
      ValidationError
    );
  });

  it('debe consultar saldo y transacciones formateadas', async () => {
    const repo = new MockWalletRepository();
    const rechargeUseCase = new RechargeWalletUseCase({ walletRepository: repo });
    await rechargeUseCase.execute({ userId: 'usr-wallet-2', amount: 75 });

    const getBalanceUseCase = new GetWalletBalanceUseCase({ walletRepository: repo });
    const result = await getBalanceUseCase.execute('usr-wallet-2');

    assert.strictEqual(result.balance, 175);
    assert.strictEqual(result.transactions.length, 1);
    assert.strictEqual(result.transactions[0].amount, 75);
  });
});
