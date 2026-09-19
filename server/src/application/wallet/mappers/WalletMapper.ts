import { WalletTransaction } from '../../../domain/wallet/WalletTransaction.js';
import { WalletTransactionResponseDTO } from '../dtos/index.js';

export class WalletMapper {
  public static toTransactionDTO(tx: WalletTransaction): WalletTransactionResponseDTO {
    return {
      id: tx.id,
      walletId: tx.walletId,
      userId: tx.userId,
      bookingId: tx.bookingId,
      amount: tx.amount,
      type: tx.type,
      concept: tx.concept,
      status: tx.status,
      createdAt: tx.createdAt.toISOString(),
    };
  }
}
