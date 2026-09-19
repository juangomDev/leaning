import { IWalletRepository } from '../../../domain/wallet/WalletRepository.js';
import { Wallet } from '../../../domain/wallet/Wallet.js';
import { WalletTransaction } from '../../../domain/wallet/WalletTransaction.js';

export class InMemoryWalletRepository implements IWalletRepository {
  private balances: Map<string, number>;
  private wallets: Map<string, Wallet>;
  private transactions: WalletTransaction[];

  constructor() {
    this.balances = new Map([
      ['student-demo-id', 85.0],
      ['tutor-demo-id', 480.0],
    ]);

    this.wallets = new Map([
      [
        'student-demo-id',
        new Wallet({
          id: 'wal-student',
          userId: 'student-demo-id',
          balance: 85.0,
          currency: 'USD',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ],
    ]);

    this.transactions = [
      new WalletTransaction({
        id: 'REC-9021',
        walletId: 'wal-student',
        userId: 'student-demo-id',
        bookingId: 'bk-demo-1',
        amount: 25.0,
        type: 'class_payment',
        concept: 'Clase de Cálculo Integral (Dra. Elena Rostova)',
        status: 'completed',
        createdAt: new Date(),
      }),
      new WalletTransaction({
        id: 'REC-8842',
        walletId: 'wal-student',
        userId: 'student-demo-id',
        bookingId: null,
        amount: 100.0,
        type: 'recharge',
        concept: 'Recarga de Saldo con Tarjeta Visa (•••• 4022)',
        status: 'completed',
        createdAt: new Date(),
      }),
    ];
  }

  async getBalance(userId: string): Promise<number> {
    return this.balances.get(userId) ?? 50.0;
  }

  async updateBalance(userId: string, newBalance: number): Promise<void> {
    this.balances.set(userId, newBalance);
    const w = this.wallets.get(userId);
    if (w) {
      const diff = newBalance - w.balance;
      if (diff > 0) {
        w.credit(diff);
      } else if (diff < 0) {
        w.debit(Math.abs(diff));
      }
    }
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

  async findByUserId(userId: string): Promise<Wallet | null> {
    return this.wallets.get(userId) || null;
  }

  async saveWallet(wallet: Wallet): Promise<void> {
    this.wallets.set(wallet.userId, wallet);
    this.balances.set(wallet.userId, wallet.balance);
  }
}
