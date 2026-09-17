import { WalletTransaction } from '../../../domain/entities/WalletTransaction.js';
import { ValidationError } from '../../../domain/errors/DomainError.js';
import { IWalletRepository } from '../../../domain/repositories/IWalletRepository.js';

export interface RechargeWalletDTO {
  userId: string;
  amount: number | string;
  method?: string;
}

export interface RechargeWalletResult {
  newBalance: number;
  transaction: WalletTransaction;
}

export class RechargeWalletUseCase {
  private walletRepository: IWalletRepository;

  constructor({ walletRepository }: { walletRepository: IWalletRepository }) {
    this.walletRepository = walletRepository;
  }

  async execute({ userId, amount, method = 'Tarjeta de Crédito' }: RechargeWalletDTO): Promise<RechargeWalletResult> {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new ValidationError('El monto a recargar debe ser mayor a 0');
    }

    const transaction = new WalletTransaction({
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      amount: numAmount,
      type: 'recharge',
      concept: `Recarga de Saldo con ${method}`,
      status: 'completed',
    });

    await this.walletRepository.addTransaction(transaction);
    const newBalance = await this.walletRepository.getBalance(userId);

    return {
      newBalance,
      transaction,
    };
  }
}
