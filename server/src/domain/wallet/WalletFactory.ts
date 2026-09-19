import crypto from 'node:crypto';
import { Wallet } from './Wallet.js';
import { WalletTransaction, TransactionType } from './WalletTransaction.js';

export interface CreateWalletDTO {
  id?: string;
  userId: string;
  initialBalance?: number;
  currency?: string;
}

export class WalletFactory {
  public static create({
    id,
    userId,
    initialBalance = 0,
    currency = 'USD',
  }: CreateWalletDTO): Wallet {
    const now = new Date();
    return new Wallet({
      id: id || crypto.randomUUID(),
      userId,
      balance: initialBalance,
      currency,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  }

  public static createTransaction({
    id,
    walletId,
    userId,
    bookingId = null,
    amount,
    type,
    concept,
    createdAt = new Date(),
  }: {
    id?: string;
    walletId: string;
    userId: string;
    bookingId?: string | null;
    amount: number;
    type: TransactionType;
    concept: string;
    createdAt?: Date;
  }): WalletTransaction {
    return new WalletTransaction({
      id: id || crypto.randomUUID(),
      walletId,
      userId,
      bookingId: bookingId || null,
      amount,
      type,
      concept,
      status: 'completed',
      createdAt,
    });
  }

  public static reconstitute(raw: {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    status: 'active' | 'frozen';
    createdAt: Date | string;
    updatedAt: Date | string;
  }): Wallet {
    return new Wallet({
      id: raw.id,
      userId: raw.userId,
      balance: raw.balance,
      currency: raw.currency,
      status: raw.status,
      createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt),
      updatedAt: raw.updatedAt instanceof Date ? raw.updatedAt : new Date(raw.updatedAt),
    });
  }
}
