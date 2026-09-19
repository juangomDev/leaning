import { WalletTransaction } from './WalletTransaction.js';

export interface WalletRepository {
  getBalance(userId: string): Promise<number>;
  addTransaction(transaction: WalletTransaction): Promise<WalletTransaction>;
  getTransactions(userId: string): Promise<WalletTransaction[]>;
}

export type IWalletRepository = WalletRepository;
