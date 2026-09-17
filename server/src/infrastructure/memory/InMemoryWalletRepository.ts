import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { WalletTransaction } from '../../domain/entities/WalletTransaction.js';

export class InMemoryWalletRepository implements IWalletRepository {
  private balances: Map<string, number>;
  private transactions: WalletTransaction[];

  constructor() {
    this.balances = new Map([
      ['student-demo-id', 85.0],
      ['tutor-demo-id', 480.0],
    ]);

    this.transactions = [
      new WalletTransaction({
        id: 'REC-9021',
        userId: 'student-demo-id',
        amount: -25.0,
        type: 'class_payment',
        concept: 'Clase de Cálculo Integral (Dra. Elena Rostova)',
        status: 'completed',
      }),
      new WalletTransaction({
        id: 'REC-8842',
        userId: 'student-demo-id',
        amount: 100.0,
        type: 'recharge',
        concept: 'Recarga de Saldo con Tarjeta Visa (•••• 4022)',
        status: 'completed',
      }),
    ];
  }

  async getBalance(userId: string): Promise<number> {
    return this.balances.get(userId) || 50.0;
  }

  async addTransaction(transaction: WalletTransaction): Promise<WalletTransaction> {
    this.transactions.unshift(transaction);
    const current = await this.getBalance(transaction.userId);
    this.balances.set(transaction.userId, current + transaction.amount);
    return transaction;
  }

  async getTransactions(userId: string): Promise<WalletTransaction[]> {
    return this.transactions.filter((t) => t.userId === userId);
  }
}
