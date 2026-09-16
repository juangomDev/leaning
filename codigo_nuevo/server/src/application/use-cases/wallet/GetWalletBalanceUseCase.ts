import { WalletTransaction } from '../../../domain/entities/WalletTransaction.js';
import { IWalletRepository } from '../../../domain/repositories/IWalletRepository.js';

export interface WalletBalanceResult {
  balance: number;
  transactions: WalletTransaction[];
}

export class GetWalletBalanceUseCase {
  private walletRepository: IWalletRepository;

  constructor({ walletRepository }: { walletRepository: IWalletRepository }) {
    this.walletRepository = walletRepository;
  }

  async execute(userId: string): Promise<WalletBalanceResult> {
    const balance = await this.walletRepository.getBalance(userId);
    const transactions = await this.walletRepository.getTransactions(userId);
    return { balance, transactions };
  }
}
