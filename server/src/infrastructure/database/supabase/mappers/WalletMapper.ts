import { Wallet } from '../../../../domain/wallet/Wallet.js';
import { WalletTransaction, TransactionType } from '../../../../domain/wallet/WalletTransaction.js';
import { WalletFactory } from '../../../../domain/wallet/WalletFactory.js';
import { WalletRow, WalletTransactionRow } from '../client.js';

export class WalletMapper {
  public static toDomain(row: WalletRow): Wallet {
    return WalletFactory.reconstitute({
      id: row.id,
      userId: row.user_id,
      balance: Number(row.balance),
      currency: row.currency,
      status: row.status as any,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  public static toTransactionDomain(row: WalletTransactionRow): WalletTransaction {
    return new WalletTransaction({
      id: row.id,
      walletId: row.wallet_id,
      userId: row.user_id,
      bookingId: row.booking_id,
      amount: Number(row.amount),
      type: row.type as TransactionType,
      concept: row.concept,
      status: row.status as any,
      createdAt: new Date(row.created_at),
    });
  }

  public static toRow(wallet: Wallet): Partial<WalletRow> {
    return {
      id: wallet.id,
      user_id: wallet.userId,
      balance: wallet.balance,
      currency: wallet.currency,
      status: wallet.status,
      updated_at: wallet.updatedAt.toISOString(),
    };
  }

  public static toTransactionRow(tx: WalletTransaction): Partial<WalletTransactionRow> {
    return {
      id: tx.id,
      wallet_id: tx.walletId,
      user_id: tx.userId,
      booking_id: tx.bookingId,
      amount: tx.amount,
      type: tx.type,
      concept: tx.concept,
      status: tx.status,
      created_at: tx.createdAt.toISOString(),
    };
  }
}
