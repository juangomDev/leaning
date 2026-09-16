import { WalletTransaction } from '../entities/WalletTransaction.js';

export interface IWalletRepository {
  getBalance(userId: string): Promise<number>;
  addTransaction(transaction: WalletTransaction): Promise<WalletTransaction>;
  getTransactions(userId: string): Promise<WalletTransaction[]>;
}
